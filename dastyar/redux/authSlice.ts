import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { UserInfo } from '@/types/api';

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  userData: UserInfo | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  token: null,
  refreshToken: null,
  userData: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = !!action.payload;
      AsyncStorage.setItem('token', action.payload);
    },
    setRefreshToken: (state, action: PayloadAction<string>) => {
      state.refreshToken = action.payload;
      AsyncStorage.setItem('refreshToken', action.payload);
    },
    setUserData: (state, action: PayloadAction<UserInfo>) => {
      state.userData = action.payload;
      AsyncStorage.setItem('userData', JSON.stringify(action.payload));
    },
    setAuthTokens: (state, action: PayloadAction<{ access_token: string; refresh_token: string }>) => {
      state.token = action.payload.access_token;
      state.refreshToken = action.payload.refresh_token;
      state.isAuthenticated = true;
      AsyncStorage.setItem('token', action.payload.access_token);
      AsyncStorage.setItem('refreshToken', action.payload.refresh_token);
    },
    logout: (state) => {
      state.token = null;
      state.refreshToken = null;
      state.userData = null;
      state.isAuthenticated = false;
      AsyncStorage.multiRemove(['token', 'refreshToken', 'userData']);
    },
    rehydrateAuth: (state, action: PayloadAction<Partial<AuthState>>) => {
      if (action.payload.token) {
        state.token = action.payload.token;
        state.isAuthenticated = true;
      }
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
      }
      if (action.payload.userData) {
        state.userData = action.payload.userData;
      }
    },
  },
});

export async function refreshToken(_refreshToken: string | null) {
  if (!_refreshToken) return null;
  return { token: "mock_access_token_local" };
}

export const { setToken, setRefreshToken, setUserData, setAuthTokens, logout, rehydrateAuth } = authSlice.actions;
export default authSlice.reducer;
