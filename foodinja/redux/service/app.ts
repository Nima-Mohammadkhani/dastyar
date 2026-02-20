import { rtkInstance } from "../proxy";
import type { UserInfo, CurrentUser } from "@/types/api";

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
  }),
  overrideExisting: false,
});

export const { useGetCurrentUserQuery, useGetUserInfoQuery } = App;