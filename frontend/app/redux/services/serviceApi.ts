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

interface CreateBookingRequest {
  serviceId: string;
  bookingDate: string;
  bookingTime: string;
  country: string;
  state: string;
  district: string;
  city: string;
  pincode: string;
  area: string;
  buildingNumber: string;
  buildingName: string;
  flatNumber: string;
  block: string;
  street: string;
  landmark: string;
  latitude: number;
  longitude: number;
  notes: string;
}

interface CustomerBookingResponse {
  id: string;
  customerId: string;
  providerId?: string;
  serviceId: string;
  bookingDate: string;
  bookingTime: string;
  price: number;
  status: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateBookingResponse {
  success: boolean;
  message?: string;
  data?: CustomerBookingResponse;
}

interface CustomerBookingsResponse {
  success: boolean;
  data: CustomerBookingResponse[];
  message?: string;
}

export interface ProviderBookingAddress {
  country: string;
  state: string;
  district: string;
  city: string;
  pincode: string;
  area: string;
  buildingNumber: string;
  buildingName: string;
  flatNumber: string;
  block: string;
  street: string;
  landmark: string;
}

export interface ProviderBooking {
  id: string;
  customerId: string;
  providerId?: string | null;
  serviceId: string;
  bookingDate: string;
  bookingTime: string;
  address: ProviderBookingAddress;
  price: number;
  status: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProviderBookingsResponse {
  success: boolean;
  data: ProviderBooking[];
  message?: string;
}

export interface AcceptBookingResponse {
  success: boolean;
  message: string;
  data: ProviderBooking;
}

export interface CancelBookingResponse {
  success: boolean;
  message: string;
  data: CustomerBookingResponse;
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

  tagTypes: [
    "ProviderServices",
    "CustomerServices",
    "CustomerBookings",
    "ProviderBookings",
  ],

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

    createBooking: builder.mutation<
      CreateBookingResponse,
      CreateBookingRequest
    >({
      query: (bookingData) => ({
        url: "/customer/bookings",
        method: "POST",
        body: bookingData,
      }),
      invalidatesTags: ["CustomerBookings"],
    }),

    // Get Customer Booking History
    getCustomerBookings: builder.query<CustomerBookingsResponse, void>({
      query: () => ({
        url: "/customer/bookings",
        method: "GET",
      }),
      providesTags: ["CustomerBookings"],
    }),

    getProviderBookings: builder.query<ProviderBookingsResponse, void>({
      query: () => ({
        url: "/provider/bookings",
        method: "GET",
      }),
      providesTags: ["ProviderBookings"],
    }),

    acceptProviderBooking: builder.mutation<AcceptBookingResponse, string>({
      query: (bookingId) => ({
        url: `/provider/bookings/${bookingId}/accept`,
        method: "PATCH",
      }),
      invalidatesTags: ["ProviderBookings"],
    }),

    getProviderBookingById: builder.query<
      { success: boolean; data: ProviderBooking; message?: string },
      string
    >({
      query: (bookingId) => ({
        url: `/provider/bookings/${bookingId}`,
        method: "GET",
      }),
    }),

    updateProviderBookingStatus: builder.mutation<
      {
        success: boolean;
        message: string;
        data: ProviderBooking;
      },
      { bookingId: string; status: string }
    >({
      query: ({ bookingId, status }) => ({
        url: `/provider/bookings/${bookingId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["ProviderBookings"],
    }),

    // Cancel Customer Booking
    cancelCustomerBooking: builder.mutation<CancelBookingResponse, string>({
      query: (bookingId) => ({
        url: `/customer/bookings/${bookingId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CustomerBookings", "ProviderBookings"],
    }),
  }),
});

export const {
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useGetProviderServicesQuery,
  useUpdateServiceStatusMutation,
  useGetCustomerServicesQuery,
  useCreateBookingMutation,
  useGetCustomerBookingsQuery,
  useGetProviderBookingsQuery,
  useAcceptProviderBookingMutation,
  useGetProviderBookingByIdQuery,
  useUpdateProviderBookingStatusMutation,
  useCancelCustomerBookingMutation,
} = serviceApi;
