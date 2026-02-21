import { rtkInstance } from "../proxy";
import type {
  UserInfo,
  CurrentUser,
  ChatRequest,
  ChatResponse,
  ConversationsListResponse,
  ConversationDetail,
  DeleteConversationResponse,
  RestoreConversationResponse,
  DeletedConversationsResponse,
  TokenStatus,
} from "@/types/api";

export const App = rtkInstance.injectEndpoints({
  endpoints: (builder) => ({
    getCurrentUser: builder.query<{ user: CurrentUser }, void>({
      query: () => ({
        url: "auth/me",
        method: "GET",
      }),
    }),
    getUserInfo: builder.query<UserInfo, void>({
      query: () => ({
        url: "users/info",
        method: "GET",
      }),
    }),
    sendChatMessage: builder.mutation<ChatResponse, ChatRequest>({
      query: (body) => ({
        url: "chat/chat",
        method: "POST",
        body,
      }),
    }),
    getConversations: builder.query<ConversationsListResponse, void>({
      query: () => ({
        url: "chat/conversations",
        method: "GET",
      }),
    }),
    getConversationById: builder.query<ConversationDetail, number>({
      query: (conversationId) => ({
        url: `chat/conversations/${conversationId}`,
        method: "GET",
      }),
    }),
    deleteConversation: builder.mutation<DeleteConversationResponse, number>({
      query: (conversationId) => ({
        url: `chat/conversations/${conversationId}`,
        method: "DELETE",
      }),
    }),
    restoreConversation: builder.mutation<RestoreConversationResponse, number>({
      query: (conversationId) => ({
        url: `chat/conversations/${conversationId}/restore`,
        method: "POST",
      }),
    }),
    getDeletedConversations: builder.query<DeletedConversationsResponse, void>({
      query: () => ({
        url: "chat/conversations/deleted/list",
        method: "GET",
      }),
    }),
    getTokenStatus: builder.query<TokenStatus, void>({
      query: () => ({
        url: "chat/tokens/status",
        method: "GET",
      }),
    }),
    exchangeCode: builder.mutation<
      { access_token: string; refresh_token: string },
      { code: string }
    >({
      query: (body) => ({
        url: "exchange-code",
        method: "POST",
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCurrentUserQuery,
  useGetUserInfoQuery,
  useSendChatMessageMutation,
  useGetConversationsQuery,
  useGetConversationByIdQuery,
  useDeleteConversationMutation,
  useRestoreConversationMutation,
  useGetDeletedConversationsQuery,
  useGetTokenStatusQuery,
  useExchangeCodeMutation,
} = App;