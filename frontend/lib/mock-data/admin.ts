import type { AdminDashboardData } from "@/types/dashboard";
import { MOCK_BOOKINGS } from "./bookings";

export async function getAdminDashboard(): Promise<AdminDashboardData> {
  return {
    stats: [
      { label: "Total Users", value: 2846, format: "number", icon: "bi-people", tone: "primary", change: 8.2 },
      { label: "Active Providers", value: 184, format: "number", icon: "bi-person-badge", tone: "info", change: 3.4 },
      { label: "Bookings This Month", value: 1263, format: "number", icon: "bi-calendar-check", tone: "warning", change: 12.5 },
      { label: "Revenue This Month", value: 98420, format: "currency", icon: "bi-currency-dollar", tone: "success", change: -2.1 },
    ],
    monthlyBookings: [
      { label: "May", value: 812 },
      { label: "Jun", value: 905 },
      { label: "Jul", value: 1034 },
      { label: "Aug", value: 1121 },
      { label: "Sep", value: 1188 },
      { label: "Oct", value: 1263 },
    ],
    statusBreakdown: [
      { status: "COMPLETED", count: 742 },
      { status: "ACCEPTED", count: 268 },
      { status: "PENDING", count: 151 },
      { status: "CANCELLED", count: 64 },
      { status: "REJECTED", count: 38 },
    ],
    recentBookings: MOCK_BOOKINGS.slice(0, 6),
    topProviders: [
      { id: "usr_provider_01", name: "Ravi Kumar", specialization: "Home Cleaning", rating: 4.9, completedJobs: 312, earnings: 28450 },
      { id: "usr_p_03", name: "Aisha Bello", specialization: "Plumbing", rating: 4.8, completedJobs: 268, earnings: 24110 },
      { id: "usr_p_02", name: "Marcus Lee", specialization: "Appliance Repair", rating: 4.7, completedJobs: 241, earnings: 22980 },
      { id: "usr_p_06", name: "Noah Johnson", specialization: "Pest Control", rating: 4.6, completedJobs: 187, earnings: 19870 },
      { id: "usr_p_04", name: "Lena Fischer", specialization: "Beauty & Salon", rating: 4.9, completedJobs: 219, earnings: 15320 },
    ],
  };
}
