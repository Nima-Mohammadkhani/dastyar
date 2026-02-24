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
  PersonalizationSettings,
  UpdatePersonalizationRequest,
  IngredientsResponse,
  DishesResponse,
  FoodTypesResponse,
  TonesResponse,
  GuestChatRequest,
  GuestChatResponse,
  GuestStatusResponse,
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
    adminLogin: builder.mutation<
      { access_token: string; refresh_token: string },
      { email: string; password: string }
    >({
      query: (body) => ({
        url: "users/mobile/adminlogin",
        method: "POST",
        body,
      }),
    }),
    getPersonalization: builder.query<PersonalizationSettings, void>({
      query: () => ({
        url: "users/personalization",
        method: "GET",
      }),
    }),
    updatePersonalization: builder.mutation<
      PersonalizationSettings,
      UpdatePersonalizationRequest
    >({
      query: (body) => ({
        url: "users/personalization",
        method: "PUT",
        body,
      }),
    }),
    getIngredients: builder.query<IngredientsResponse, void>({
      query: () => ({
        url: "reference/ingredients",
        method: "GET",
      }),
    }),
    getDishes: builder.query<DishesResponse, void>({
      query: () => ({
        url: "reference/dishes",
        method: "GET",
      }),
    }),
    getFoodTypes: builder.query<FoodTypesResponse, void>({
      query: () => ({
        url: "reference/food-types",
        method: "GET",
      }),
    }),
    getTones: builder.query<TonesResponse, void>({
      query: () => ({
        url: "reference/tones",
        method: "GET",
      }),
    }),
    sendGuestChat: builder.mutation<GuestChatResponse, GuestChatRequest>({
      query: (body) => ({
        url: "guest/chat",
        method: "POST",
        body,
      }),
    }),
    getGuestStatus: builder.query<
      GuestStatusResponse,
      { device_id: string; session_id?: string }
    >({
      query: (params) => {
        const queryParams = new URLSearchParams({
          device_id: params.device_id,
        });
        if (params.session_id) {
          queryParams.append("session_id", params.session_id);
        }
        return {
          url: `guest/status?${queryParams.toString()}`,
          method: "GET",
        };
      },
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
  useAdminLoginMutation,
  // Personalization
  useGetPersonalizationQuery,
  useUpdatePersonalizationMutation,
  // Reference Data
  useGetIngredientsQuery,
  useGetDishesQuery,
  useGetFoodTypesQuery,
  useGetTonesQuery,
  // Guest Chat
  useSendGuestChatMutation,
  useGetGuestStatusQuery,
} = App;