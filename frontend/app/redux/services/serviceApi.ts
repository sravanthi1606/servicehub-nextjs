
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";

interface CustomerService {
id: string;
name: string;
description: string;
category: string;
price: number;
duration: string;
status: string;
}

interface CustomerServicesResponse {
success: boolean;
data: CustomerService[];
message?: string;
}


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

  tagTypes: ["ProviderServices", "CustomerServices"],

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

    // Update Service
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
      invalidatesTags: ["ProviderServices", "CustomerServices"],
    }),

    // Get Active Services for Customers
    getCustomerServices: builder.query<CustomerServicesResponse, void>({
      query: () => ({
        url: "/customer/services",
        method: "GET",
      }),
      providesTags: ["CustomerServices"],
    }),
  }),
});

export const {
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useGetProviderServicesQuery,
  useUpdateServiceStatusMutation,
  useGetCustomerServicesQuery,
} = serviceApi;