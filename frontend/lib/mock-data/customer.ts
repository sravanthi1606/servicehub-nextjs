import type { CustomerDashboardData } from "@/types/dashboard";
import type { ServiceListItem } from "@/types/service";
import { MOCK_BOOKINGS, MOCK_CUSTOMER_ID, byDateAscending } from "./bookings";

const POPULAR_SERVICES: ServiceListItem[] = [
  { id: "svc_01", name: "Deep Home Cleaning", description: "Top-to-bottom cleaning of every room, including kitchen and bathrooms.", category: "Cleaning", price: 120, duration: 240, providerId: "usr_provider_01", providerName: "Ravi Kumar", rating: 4.9, status: "ACTIVE", createdAt: "2025-03-05T09:00:00Z", updatedAt: "2026-09-01T09:00:00Z" },
  { id: "svc_03", name: "AC Repair & Service", description: "Gas check, filter cleaning and a cooling performance tune-up.", category: "Appliances", price: 95, duration: 90, providerId: "usr_p_02", providerName: "Marcus Lee", rating: 4.7, status: "ACTIVE", createdAt: "2025-04-11T09:00:00Z", updatedAt: "2026-08-20T09:00:00Z" },
  { id: "svc_04", name: "Plumbing Repair", description: "Leaks, blocked drains, taps and fittings fixed by a licensed plumber.", category: "Plumbing", price: 70, duration: 60, providerId: "usr_p_03", providerName: "Aisha Bello", rating: 4.8, status: "ACTIVE", createdAt: "2025-02-21T09:00:00Z", updatedAt: "2026-09-12T09:00:00Z" },
  { id: "svc_05", name: "Haircut at Home", description: "Salon-quality haircut and styling in the comfort of your home.", category: "Beauty", price: 40, duration: 45, providerId: "usr_p_04", providerName: "Lena Fischer", rating: 4.9, status: "ACTIVE", createdAt: "2025-05-30T09:00:00Z", updatedAt: "2026-09-18T09:00:00Z" },
];

export async function getCustomerDashboard(): Promise<CustomerDashboardData> {
  const myBookings = MOCK_BOOKINGS.filter((booking) => booking.customerId === MOCK_CUSTOMER_ID);
  const upcomingBookings = myBookings
    .filter((booking) => booking.status === "PENDING" || booking.status === "ACCEPTED")
    .sort(byDateAscending);
  const completed = myBookings.filter((booking) => booking.status === "COMPLETED");
  const totalSpent = completed.reduce((sum, booking) => sum + booking.price, 0);

  return {
    stats: [
      { label: "Total Bookings", value: myBookings.length, format: "number", icon: "bi-calendar-check", tone: "primary" },
      { label: "Upcoming", value: upcomingBookings.length, format: "number", icon: "bi-calendar-event", tone: "warning" },
      { label: "Completed", value: completed.length, format: "number", icon: "bi-patch-check", tone: "success" },
      { label: "Total Spent", value: totalSpent, format: "currency", icon: "bi-wallet2", tone: "info" },
    ],
    upcomingBookings,
    recentBookings: myBookings.slice(0, 5),
    popularServices: POPULAR_SERVICES,
  };
}
