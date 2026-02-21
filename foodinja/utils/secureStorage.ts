import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';
const USER_DATA_KEY = 'auth_user_data';

export const secureStorage = {
  async setToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    } catch (error) {
      console.error('Failed to store token:', error);
      throw error;
    }
  },

  async getToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch (error) {
      console.error('Failed to get token:', error);
      return null;
    }
  },

  async setRefreshToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
    } catch (error) {
      console.error('Failed to store refresh token:', error);
      throw error;
    }
  },

  async getRefreshToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Failed to get refresh token:', error);
      return null;
    }
  },

  async setUserData(data: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(USER_DATA_KEY, data);
    } catch (error) {
      console.error('Failed to store user data:', error);
      throw error;
    }
  },

  async getUserData(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(USER_DATA_KEY);
    } catch (error) {
      console.error('Failed to get user data:', error);
      return null;
    }
  },

  async clearAll(): Promise<void> {
    try {
      await Promise.all([
        SecureStore.deleteItemAsync(TOKEN_KEY),
        SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
        SecureStore.deleteItemAsync(USER_DATA_KEY),
      ]);
    } catch (error) {
      console.error('Failed to clear secure storage:', error);
      throw error;
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error(`Failed to remove ${key}:`, error);
      throw error;
    }
  },
};
