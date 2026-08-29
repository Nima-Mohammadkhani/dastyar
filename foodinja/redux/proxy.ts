import { createApi } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { mockDB } from "@/utils/mockDatabase";
import { generateAIResponse } from "@/utils/mockAI";

const MOCK_TOKEN = "mock_access_token_local";
const MOCK_REFRESH = "mock_refresh_token_local";

// ── Static reference data ──────────────────────────────────────────────────

const MOCK_TONES = [
  { id: 1, name: "رسمی" },
  { id: 2, name: "دوستانه" },
  { id: 3, name: "خلاصه" },
  { id: 4, name: "آموزشی" },
  { id: 5, name: "شوخ‌طبعانه" },
];

const MOCK_FOOD_TYPES = [
  { id: 1, name: "ایرانی" },
  { id: 2, name: "ایتالیایی" },
  { id: 3, name: "آسیایی" },
  { id: 4, name: "فرانسوی" },
  { id: 5, name: "مدیترانه‌ای" },
  { id: 6, name: "آمریکایی" },
  { id: 7, name: "هندی" },
  { id: 8, name: "مکزیکی" },
  { id: 9, name: "ترکی" },
  { id: 10, name: "لبنانی" },
];

const MOCK_INGREDIENTS = [
  { id: 1, name: "برنج" },
  { id: 2, name: "مرغ" },
  { id: 3, name: "گوشت گوساله" },
  { id: 4, name: "گوجه‌فرنگی" },
  { id: 5, name: "پیاز" },
  { id: 6, name: "سیر" },
  { id: 7, name: "فلفل دلمه‌ای" },
  { id: 8, name: "هویج" },
  { id: 9, name: "سیب‌زمینی" },
  { id: 10, name: "تخم‌مرغ" },
  { id: 11, name: "آرد" },
  { id: 12, name: "روغن زیتون" },
  { id: 13, name: "کره" },
  { id: 14, name: "شیر" },
  { id: 15, name: "پنیر" },
  { id: 16, name: "ماکارونی" },
  { id: 17, name: "لوبیا" },
  { id: 18, name: "عدس" },
  { id: 19, name: "اسفناج" },
  { id: 20, name: "قارچ" },
  { id: 21, name: "کدو" },
  { id: 22, name: "بادمجان" },
  { id: 23, name: "لیمو" },
  { id: 24, name: "زعفران" },
  { id: 25, name: "زردچوبه" },
  { id: 26, name: "دارچین" },
  { id: 27, name: "نمک" },
  { id: 28, name: "فلفل سیاه" },
  { id: 29, name: "جعفری" },
  { id: 30, name: "گشنیز" },
];

const MOCK_DISHES = [
  { id: 1, name: "قورمه سبزی" },
  { id: 2, name: "کباب کوبیده" },
  { id: 3, name: "چلو مرغ" },
  { id: 4, name: "فسنجان" },
  { id: 5, name: "آش رشته" },
  { id: 6, name: "پیتزا" },
  { id: 7, name: "ماکارونی" },
  { id: 8, name: "لازانیا" },
  { id: 9, name: "سوشی" },
  { id: 10, name: "برگر" },
  { id: 11, name: "خوراک مرغ" },
  { id: 12, name: "سالاد سزار" },
  { id: 13, name: "سوپ جو" },
  { id: 14, name: "کتلت" },
  { id: 15, name: "دلمه" },
  { id: 16, name: "باقلاپلو" },
  { id: 17, name: "زرشک پلو" },
  { id: 18, name: "کوکو سبزی" },
  { id: 19, name: "میرزاقاسمی" },
  { id: 20, name: "ماهی سرخ‌شده" },
];

// ── Mock base query ────────────────────────────────────────────────────────

async function mockBaseQuery(
  args: string | FetchArgs,
): Promise<{ data: unknown } | { error: FetchBaseQueryError }> {
  const url = typeof args === "string" ? args : args.url;
  const method = typeof args === "string" ? "GET" : (args.method || "GET");
  const body = typeof args === "string" ? undefined : (args.body as any);

  await mockDB.delay(250);

  // ── Auth ──────────────────────────────────────────────────────────────────

  if (url === "users/mobile/adminlogin" && method === "POST") {
    return { data: { access_token: MOCK_TOKEN, refresh_token: MOCK_REFRESH } };
  }

  if (url === "exchange-code" && method === "POST") {
    return { data: { access_token: MOCK_TOKEN, refresh_token: MOCK_REFRESH } };
  }

  if (url === "auth/refresh" && method === "POST") {
    return { data: { access_token: MOCK_TOKEN, refresh_token: MOCK_REFRESH } };
  }

  if (url === "auth/me" && method === "GET") {
    const name = await mockDB.getUserName();
    return { data: { user: { id: 1, email: "user@local.app", name } } };
  }

  if (url === "users/info" && method === "GET") {
    const name = await mockDB.getUserName();
    return {
      data: {
        id: 1,
        email: "user@local.app",
        name,
        role: 1,
        token_limit: 99999,
        token_used: 0,
        remaining_tokens: 99999,
      },
    };
  }

  // ── Chat ──────────────────────────────────────────────────────────────────

  if (url === "chat/chat" && method === "POST") {
    const { query, conversation_id } = body as {
      query: string;
      conversation_id?: number | null;
    };

    const aiResponse = generateAIResponse(query);
    const now = new Date().toISOString();
    let convId = conversation_id;

    if (!convId) {
      const conv = await mockDB.createConversation(query);
      convId = conv.conversation_id;
    } else {
      await mockDB.updateConversationTime(convId);
    }

    const messages = await mockDB.getMessages(convId);
    const nextId = messages.length > 0 ? messages[messages.length - 1].id + 1 : 1;

    await mockDB.saveMessages(convId, [
      ...messages,
      { id: nextId, role: "user", content: query, created_at: now },
      { id: nextId + 1, role: "assistant", content: aiResponse, created_at: now },
    ]);

    return { data: { response: aiResponse, conversation_id: convId } };
  }

  // ── Conversations ─────────────────────────────────────────────────────────

  if (url === "chat/conversations" && method === "GET") {
    const conversations = await mockDB.getConversations();
    return { data: { conversations } };
  }

  if (url === "chat/conversations/deleted/list" && method === "GET") {
    return { data: { conversations: [] } };
  }

  // match chat/conversations/{id} and chat/conversations/{id}/restore
  const convMatch = url.match(/^chat\/conversations\/(\d+)(\/restore)?$/);
  if (convMatch) {
    const convId = parseInt(convMatch[1], 10);
    const isRestore = !!convMatch[2];

    if (isRestore && method === "POST") {
      return { data: { success: true } };
    }
    if (method === "GET") {
      const messages = await mockDB.getMessages(convId);
      return { data: { conversation_id: convId, messages } };
    }
    if (method === "DELETE") {
      await mockDB.deleteConversation(convId);
      return { data: { success: true } };
    }
  }

  // ── Token status ──────────────────────────────────────────────────────────

  if (url === "chat/tokens/status" && method === "GET") {
    return {
      data: {
        user_id: 1,
        token_limit: 99999,
        token_used: 0,
        remaining_tokens: 99999,
      },
    };
  }

  // ── Personalization (persisted) ───────────────────────────────────────────

  if (url === "users/personalization") {
    if (method === "GET") {
      const data = await mockDB.getPersonalization();
      return { data };
    }
    if (method === "PUT") {
      const current = await mockDB.getPersonalization();
      const updated = { ...current, ...body };
      await mockDB.savePersonalization(updated);
      return { data: updated };
    }
  }

  // ── Reference data ────────────────────────────────────────────────────────

  if (url === "reference/ingredients") return { data: { ingredients: MOCK_INGREDIENTS } };
  if (url === "reference/dishes")      return { data: { dishes: MOCK_DISHES } };
  if (url === "reference/food-types")  return { data: { food_types: MOCK_FOOD_TYPES } };
  if (url === "reference/tones")       return { data: { tones: MOCK_TONES } };

  // ── Guest chat ────────────────────────────────────────────────────────────

  if (url === "guest/chat" && method === "POST") {
    const query = body?.query || body?.message || "";
    const aiResponse = generateAIResponse(query);
    return { data: { response: aiResponse } };
  }

  if (url.startsWith("guest/status")) {
    return {
      data: {
        can_send: true,
        messages_sent: 0,
        messages_limit: 5,
        remaining: 5,
      },
    };
  }

  return {
    error: {
      status: 404,
      data: { message: "endpoint not found in mock" },
    } as FetchBaseQueryError,
  };
}

const mockQueryFn: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> =
  async (args, _api, _extraOptions) => {
    return mockBaseQuery(args);
  };

export const customBaseQuery = mockQueryFn;

export const rtkInstance = createApi({
  reducerPath: "rtkInstance",
  baseQuery: mockQueryFn,
  endpoints: () => ({}),
  keepUnusedDataFor: 0,
  refetchOnMountOrArgChange: true,
  refetchOnFocus: true,
  refetchOnReconnect: true,
});
