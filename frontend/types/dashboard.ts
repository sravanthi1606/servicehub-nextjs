import type { BookingListItem, BookingStatus } from "./booking";
import type { TopProvider } from "./provider";
import type { ServiceListItem } from "./service";

export type Tone = "primary" | "success" | "warning" | "info" | "danger";
export type ValueFormat = "number" | "currency" | "percent";

export interface StatCardData {
  label: string;
  value: number;
  format: ValueFormat;
  icon: string;
  tone: Tone;
  /** Percent change against the previous month */
  change?: number;
}

export interface ChartPoint {
  label: string;
  value: number;
}

export interface StatusCount {
  status: BookingStatus;
  count: number;
}

export interface AdminDashboardData {
  stats: StatCardData[];
  monthlyBookings: ChartPoint[];
  statusBreakdown: StatusCount[];
  recentBookings: BookingListItem[];
  topProviders: TopProvider[];
}

export interface ProviderDashboardData {
  stats: StatCardData[];
  monthlyEarnings: ChartPoint[];
  performance: { rating: number; reviewCount: number; completionRate: number; acceptanceRate: number };
  bookingRequests: BookingListItem[];
  upcomingJobs: BookingListItem[];
}

export interface CustomerDashboardData {
  stats: StatCardData[];
  upcomingBookings: BookingListItem[];
  recentBookings: BookingListItem[];
  popularServices: ServiceListItem[];
}
