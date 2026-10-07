import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,

  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

export const serviceApi = createApi({
  reducerPath: "serviceApi",

  baseQuery,

  tagTypes: ["ProviderServices"],

  endpoints: (builder) => ({
    // Create Service
    createService: builder.mutation({
      query: (serviceData) => ({
        url: "/provider/services",
        method: "POST",
        body: serviceData,
      }),
      invalidatesTags: ["ProviderServices"],
    }),

    updateService: builder.mutation({
      query: ({ id, ...serviceData }) => ({
        url: `/provider/services/${id}`,
        method: "PUT",
        body: serviceData,
      }),
      invalidatesTags: ["ProviderServices"],
    }),

    // Get Provider Services
    getProviderServices: builder.query({
      query: () => ({
        url: "/provider/services",
        method: "GET",
      }),
      providesTags: ["ProviderServices"],
    }),

    // Toggle Service Status (ACTIVE / INACTIVE)
    updateServiceStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/provider/services/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["ProviderServices"],
    }),
  }),
});

export const {
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useGetProviderServicesQuery,
  useUpdateServiceStatusMutation,
} = serviceApi;
