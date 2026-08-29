import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  USER_NAME: 'mock_user_name',
  CONVERSATIONS: 'mock_conversations',
  MESSAGES_PREFIX: 'mock_msgs_',
};

export interface MockConversation {
  conversation_id: number;
  title: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface MockMessage {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const mockDB = {
  async getUserName(): Promise<string> {
    return (await AsyncStorage.getItem(KEYS.USER_NAME)) || 'کاربر';
  },

  async setUserName(name: string): Promise<void> {
    await AsyncStorage.setItem(KEYS.USER_NAME, name);
  },

  async getConversations(): Promise<MockConversation[]> {
    const raw = await AsyncStorage.getItem(KEYS.CONVERSATIONS);
    return raw ? JSON.parse(raw) : [];
  },

  async saveConversations(conversations: MockConversation[]): Promise<void> {
    await AsyncStorage.setItem(KEYS.CONVERSATIONS, JSON.stringify(conversations));
  },

  async getMessages(conversationId: number): Promise<MockMessage[]> {
    const raw = await AsyncStorage.getItem(KEYS.MESSAGES_PREFIX + conversationId);
    return raw ? JSON.parse(raw) : [];
  },

  async saveMessages(conversationId: number, messages: MockMessage[]): Promise<void> {
    await AsyncStorage.setItem(
      KEYS.MESSAGES_PREFIX + conversationId,
      JSON.stringify(messages)
    );
  },

  async createConversation(firstMessage: string): Promise<MockConversation> {
    const conversations = await this.getConversations();
    const newId = Date.now();
    const now = new Date().toISOString();
    const title = firstMessage.slice(0, 50);
    const conversation: MockConversation = {
      conversation_id: newId,
      title,
      user_id: 1,
      created_at: now,
      updated_at: now,
    };
    conversations.unshift(conversation);
    await this.saveConversations(conversations);
    return conversation;
  },

  async updateConversationTime(conversationId: number): Promise<void> {
    const conversations = await this.getConversations();
    const idx = conversations.findIndex((c) => c.conversation_id === conversationId);
    if (idx !== -1) {
      conversations[idx].updated_at = new Date().toISOString();
      const [updated] = conversations.splice(idx, 1);
      conversations.unshift(updated);
      await this.saveConversations(conversations);
    }
  },

  async deleteConversation(conversationId: number): Promise<void> {
    const conversations = await this.getConversations();
    const filtered = conversations.filter((c) => c.conversation_id !== conversationId);
    await this.saveConversations(filtered);
    await AsyncStorage.removeItem(KEYS.MESSAGES_PREFIX + conversationId);
  },

  async getPersonalization(): Promise<Record<string, any>> {
    const raw = await AsyncStorage.getItem('mock_personalization');
    return raw
      ? JSON.parse(raw)
      : {
          tone_id: null,
          food_type_ids: [],
          available_ingredient_ids: [],
          favorite_dish_ids: [],
          cooking_time: null,
        };
  },

  async savePersonalization(data: Record<string, any>): Promise<void> {
    await AsyncStorage.setItem('mock_personalization', JSON.stringify(data));
  },

  async clearConversations(): Promise<void> {
    const conversations = await this.getConversations();
    const msgKeys = conversations.map((c) => KEYS.MESSAGES_PREFIX + c.conversation_id);
    await AsyncStorage.multiRemove([KEYS.CONVERSATIONS, ...msgKeys]);
  },

  async clearAll(): Promise<void> {
    const conversations = await this.getConversations();
    const keys = [
      KEYS.CONVERSATIONS,
      KEYS.USER_NAME,
      'mock_personalization',
      ...conversations.map((c) => KEYS.MESSAGES_PREFIX + c.conversation_id),
    ];
    await AsyncStorage.multiRemove(keys);
  },

  delay,
};
