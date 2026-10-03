import type { BookingListItem, BookingStatus } from "@/types/booking";

// Mock IDs match the users in lib/auth.ts so each dashboard can filter "its" bookings.
export const MOCK_PROVIDER_ID = "usr_provider_01";
export const MOCK_CUSTOMER_ID = "usr_customer_01";

type Ref = [id: string, name: string];

interface SeedRow {
  id: string;
  service: Ref;
  customer: Ref;
  provider: Ref;
  date: string;
  time: string;
  address: string;
  price: number;
  status: BookingStatus;
  notes?: string;
}

const RAVI: Ref = [MOCK_PROVIDER_ID, "Ravi Kumar"];
const PRIYA: Ref = [MOCK_CUSTOMER_ID, "Priya Nair"];
const PRIYA_ADDRESS = "221 Elm Court, Springfield";

const SEED: SeedRow[] = [
  { id: "bk-1048", service: ["svc_01", "Deep Home Cleaning"], customer: ["usr_c_02", "Daniel Brooks"], provider: RAVI, date: "2026-10-05", time: "10:00", address: "42 Maple Ave, Springfield", price: 120, status: "PENDING", notes: "Two-bedroom apartment, pets at home." },
  { id: "bk-1047", service: ["svc_02", "Kitchen Deep Clean"], customer: ["usr_c_03", "Sofia Martinez"], provider: RAVI, date: "2026-10-06", time: "14:30", address: "18 Oak Street, Springfield", price: 85, status: "PENDING" },
  { id: "bk-1046", service: ["svc_01", "Deep Home Cleaning"], customer: ["usr_c_04", "Chen Wei"], provider: RAVI, date: "2026-10-07", time: "09:00", address: "7 Birch Lane, Riverside", price: 120, status: "PENDING" },
  { id: "bk-1045", service: ["svc_03", "AC Repair & Service"], customer: PRIYA, provider: ["usr_p_02", "Marcus Lee"], date: "2026-10-04", time: "11:30", address: PRIYA_ADDRESS, price: 95, status: "ACCEPTED" },
  { id: "bk-1044", service: ["svc_01", "Deep Home Cleaning"], customer: PRIYA, provider: RAVI, date: "2026-10-08", time: "15:00", address: PRIYA_ADDRESS, price: 120, status: "ACCEPTED" },
  { id: "bk-1043", service: ["svc_02", "Kitchen Deep Clean"], customer: ["usr_c_05", "Emma Wilson"], provider: RAVI, date: "2026-10-04", time: "16:00", address: "90 Cedar Road, Lakeview", price: 85, status: "ACCEPTED" },
  { id: "bk-1042", service: ["svc_04", "Plumbing Repair"], customer: ["usr_c_06", "Omar Haddad"], provider: ["usr_p_03", "Aisha Bello"], date: "2026-10-03", time: "13:00", address: "5 Pine Street, Riverside", price: 70, status: "ACCEPTED" },
  { id: "bk-1041", service: ["svc_05", "Haircut at Home"], customer: PRIYA, provider: ["usr_p_04", "Lena Fischer"], date: "2026-09-28", time: "18:00", address: PRIYA_ADDRESS, price: 40, status: "COMPLETED" },
  { id: "bk-1040", service: ["svc_01", "Deep Home Cleaning"], customer: ["usr_c_07", "Grace Kim"], provider: RAVI, date: "2026-09-27", time: "10:00", address: "63 Willow Way, Lakeview", price: 120, status: "COMPLETED" },
  { id: "bk-1039", service: ["svc_06", "Electrical Wiring Check"], customer: ["usr_c_02", "Daniel Brooks"], provider: ["usr_p_05", "Tomas Silva"], date: "2026-09-26", time: "12:00", address: "42 Maple Ave, Springfield", price: 110, status: "CANCELLED" },
  { id: "bk-1038", service: ["svc_07", "Pest Control"], customer: PRIYA, provider: ["usr_p_06", "Noah Johnson"], date: "2026-09-20", time: "09:30", address: PRIYA_ADDRESS, price: 150, status: "COMPLETED" },
  { id: "bk-1037", service: ["svc_04", "Plumbing Repair"], customer: ["usr_c_03", "Sofia Martinez"], provider: ["usr_p_03", "Aisha Bello"], date: "2026-09-19", time: "17:00", address: "18 Oak Street, Springfield", price: 70, status: "REJECTED" },
  { id: "bk-1036", service: ["svc_02", "Kitchen Deep Clean"], customer: PRIYA, provider: RAVI, date: "2026-09-12", time: "11:00", address: PRIYA_ADDRESS, price: 85, status: "COMPLETED" },
];

export const MOCK_BOOKINGS: BookingListItem[] = SEED.map((row) => ({
  id: row.id,
  serviceId: row.service[0],
  serviceName: row.service[1],
  customerId: row.customer[0],
  customerName: row.customer[1],
  providerId: row.provider[0],
  providerName: row.provider[1],
  bookingDate: row.date,
  bookingTime: row.time,
  address: row.address,
  price: row.price,
  status: row.status,
  notes: row.notes,
  createdAt: `${row.date}T08:00:00Z`,
  updatedAt: `${row.date}T08:00:00Z`,
}));

/** Sort comparator: soonest booking first */
export function byDateAscending(a: BookingListItem, b: BookingListItem): number {
  return `${a.bookingDate}T${a.bookingTime}`.localeCompare(`${b.bookingDate}T${b.bookingTime}`);
}
