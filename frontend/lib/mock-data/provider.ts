import type { ProviderDashboardData } from "@/types/dashboard";
import { MOCK_BOOKINGS, MOCK_PROVIDER_ID, byDateAscending } from "./bookings";

export async function getProviderDashboard(): Promise<ProviderDashboardData> {
  const myBookings = MOCK_BOOKINGS.filter((booking) => booking.providerId === MOCK_PROVIDER_ID);
  const bookingRequests = myBookings.filter((booking) => booking.status === "PENDING").sort(byDateAscending);
  const upcomingJobs = myBookings.filter((booking) => booking.status === "ACCEPTED").sort(byDateAscending);

  return {
    stats: [
      { label: "New Requests", value: bookingRequests.length, format: "number", icon: "bi-inbox", tone: "warning" },
      { label: "Upcoming Jobs", value: upcomingJobs.length, format: "number", icon: "bi-calendar-event", tone: "primary" },
      { label: "Completed Jobs", value: 312, format: "number", icon: "bi-check2-square", tone: "success", change: 6.8 },
      { label: "Earnings This Month", value: 2340, format: "currency", icon: "bi-wallet2", tone: "info", change: 14.2 },
    ],
    monthlyEarnings: [
      { label: "May", value: 1680 },
      { label: "Jun", value: 1920 },
      { label: "Jul", value: 2210 },
      { label: "Aug", value: 1980 },
      { label: "Sep", value: 2050 },
      { label: "Oct", value: 2340 },
    ],
    performance: { rating: 4.9, reviewCount: 284, completionRate: 97, acceptanceRate: 92 },
    bookingRequests,
    upcomingJobs,
  };
}
