import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from '@reduxjs/toolkit/query';
import authReducer from './authSlice';
import { rtkInstance } from './proxy';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [rtkInstance.reducerPath]: rtkInstance.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
    .concat(rtkInstance.middleware)
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
