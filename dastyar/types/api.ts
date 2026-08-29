export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface CurrentUser {
  sub: string;
  roles: number[];
}

export interface UserInfo {
  id: number;
  email: string;
  name: string;
  role: number;
  token_limit: number;
  token_used: number;
  remaining_tokens: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  query: string;
  conversation_id?: number | null;
  history?: ChatMessage[];
}

export interface ChatResponse {
  response: string;
  conversation_id: number;
  new_conversation: boolean;
}

export interface Conversation {
  conversation_id: number;
  title: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface ConversationDetail extends Conversation {
  messages: MessageDetail[];
  total_messages: number;
}

export interface MessageDetail {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface ConversationsListResponse {
  conversations: Conversation[];
  total_messages: number;
}

export interface DeletedConversationsResponse {
  conversations: Conversation[];
  total: number;
}

export interface DeleteConversationResponse {
  conversation_id: number;
  title: string;
  deleted_at: string;
  message: string;
}

export interface RestoreConversationResponse {
  conversation_id: number;
  title: string;
  message: string;
}

export interface TokenStatus {
  user_id: number;
  token_limit: number;
  token_used: number;
  remaining_tokens: number;
  last_token_reset?: string;
  next_reset?: string;
}

export interface ErrorResponse {
  statusCode: number;
  message: string;
}

export interface ApiResponse<T = any> {
  statusCode: number;
  message?: string;
  data?: T;
}

export interface ChatInfoResponse {
  message: string;
  method: string;
  required_auth: string;
  required_role: number[];
  body: {
    query: string;
    history: string;
  };
  example: {
    query: string;
    history: ChatMessage[];
  };
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface RequestConfig {
  method: HttpMethod;
  headers?: Record<string, string>;
  body?: any;
}

export interface ApiConfig {
  baseUrl: string;
  accessToken?: string;
  refreshToken?: string;
}

export enum HttpStatusCode {
  OK = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  SERVER_ERROR = 500,
}

export enum ApiErrorType {
  UNAUTHORIZED = 'UNAUTHORIZED',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  TOKEN_LIMIT_EXCEEDED = 'TOKEN_LIMIT_EXCEEDED',
  NOT_FOUND = 'NOT_FOUND',
  INVALID_REQUEST = 'INVALID_REQUEST',
  SERVER_ERROR = 'SERVER_ERROR',
}

export const isError = (response: any): response is ErrorResponse => {
  return response.statusCode >= 400;
};

export const getErrorMessage = (error: any): string => {
  if (typeof error === 'string') return error;
  if (error.message) return error.message;
  if (error.statusCode && error.message) return error.message;
  return 'An unknown error occurred';
};

export const getTokenUsagePercentage = (status: TokenStatus): number => {
  if (status.token_limit === 0) return 0;
  return Math.round((status.token_used / status.token_limit) * 100);
};

export const isLowOnTokens = (status: TokenStatus, threshold: number = 20): boolean => {
  return getTokenUsagePercentage(status) >= threshold;
};

export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleString('fa-IR');
  } catch {
    return dateString;
  }
};

export const formatTime = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fa-IR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
};

export const getHoursUntilReset = (nextReset: string): number => {
  try {
    const resetDate = new Date(nextReset);
    const now = new Date();
    const diffMs = resetDate.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60)));
  } catch {
    return 0;
  }
};

export const truncateTitle = (title: string, maxLength: number = 50): string => {
  if (title.length <= maxLength) return title;
  return title.substring(0, maxLength - 3) + '...';
};


export interface PersonalizationSettings {
  tone_id: number | null;
  food_type_ids: number[];
  available_ingredient_ids: number[];
  favorite_dish_ids: number[];
  cooking_time: number | null;
}

export interface UpdatePersonalizationRequest {
  tone_id?: number;
  food_type_ids?: number[];
  available_ingredient_ids?: number[];
  favorite_dish_ids?: number[];
  cooking_time?: number;
}


export interface Ingredient {
  id: number;
  name: string;
}

export interface Dish {
  id: number;
  name: string;
}

export interface FoodType {
  id: number;
  name: string;
}

export interface Tone {
  id: number;
  name: string;
}

export interface IngredientsResponse {
  ingredients: Ingredient[];
}

export interface DishesResponse {
  dishes: Dish[];
}

export interface FoodTypesResponse {
  food_types: FoodType[];
}

export interface TonesResponse {
  tones: Tone[];
}


export interface GuestChatRequest {
  query: string;
  device_id: string;
  session_id?: string;
}

export interface GuestChatRemaining {
  ip: number;
  device: number;
  session: number;
}

export interface GuestChatResponse {
  response: string;
  remaining: GuestChatRemaining;
}

export interface GuestLimitStatus {
  used: number;
  limit: number;
  remaining: number;
}

export interface GuestStatusResponse {
  ip: GuestLimitStatus;
  device: GuestLimitStatus;
  session: GuestLimitStatus;
}

export interface GuestLimitError {
  statusCode: 429;
  message: string;
  error: 'ip_limit' | 'device_limit' | 'session_limit';
  limit: number;
  used: number;
}