import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserData {
  _id?: string;
  name: string;
  avatar: any;
  birthDate: string;
  height: string;
  preWeight: string;
  dueDate: string;
  [key: string]: any;
}

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  userData: UserData | null;
}

const initialState: AuthState = {
  token: null,
  refreshToken: null,
  userData: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      AsyncStorage.setItem('token', action.payload);
    },
    setRefreshToken: (state, action: PayloadAction<string>) => {
      state.refreshToken = action.payload;
      AsyncStorage.setItem('refreshToken', action.payload);
    },
    setUserData: (state, action: PayloadAction<UserData>) => {
      state.userData = action.payload;
      AsyncStorage.setItem('userData', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.token = null;
      state.refreshToken = null;
      state.userData = null;
      AsyncStorage.multiRemove(['token', 'refreshToken']);
    },
    rehydrateAuth: (state, action: PayloadAction<AuthState>) => {
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.userData = action.payload.userData;
    },
  },
});

export async function refreshToken(refreshToken: string | null) {
  if (!refreshToken) return null;
  try {
    const response = await fetch('https://foodinja.ir/api/auth/refresh-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });
    if (!response.ok) return null;
    const data = await response.json();
    return { token: data.token };
  } catch {
    return null;
  }
}

export const { setToken, setRefreshToken, setUserData,logout, rehydrateAuth } = authSlice.actions;
export default authSlice.reducer;
