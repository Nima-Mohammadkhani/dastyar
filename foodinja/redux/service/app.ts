import { rtkInstance } from "../proxy";

export const App = rtkInstance.injectEndpoints({
  endpoints: (builder) => ({
    getTerms: builder.query<any, void>({
      query: () => ({
        url: "",
        method: "GET",
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetTermsQuery } = App;