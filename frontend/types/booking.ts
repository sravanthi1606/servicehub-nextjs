export type BookingStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "COMPLETED" | "CANCELLED";

export interface Booking {
  id: string;
  customerId: string;
  providerId: string;
  serviceId: string;
  /** Date only, ISO format: "2026-10-05" */
  bookingDate: string;
  /** 24h time: "14:30" */
  bookingTime: string;
  address: string;
  price: number;
  status: BookingStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

/** Booking row for tables and lists, with names already joined in. */
export interface BookingListItem extends Booking {
  serviceName: string;
  customerName: string;
  providerName: string;
}
