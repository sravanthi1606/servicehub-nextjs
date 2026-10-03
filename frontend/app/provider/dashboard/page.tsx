import type { Metadata } from "next";
import BookingsTable from "@/components/bookings/BookingsTable";
import UpcomingBookingsList from "@/components/bookings/UpcomingBookingsList";
import SectionCard from "@/components/common/SectionCard";
import BarChart from "@/components/dashboard/BarChart";
import StatGrid from "@/components/dashboard/StatGrid";
import PageHeader from "@/components/layout/PageHeader";
import PerformanceSummary from "@/components/providers/PerformanceSummary";
import { getProviderDashboard } from "@/lib/mock-data/provider";

export const metadata: Metadata = { title: "Provider Dashboard" };

export default async function ProviderDashboardPage() {
  const data = await getProviderDashboard();

  return (
    <>
      <PageHeader title="Dashboard" breadcrumbs={[{ label: "Provider", href: "/provider/dashboard" }, { label: "Dashboard" }]} />

      <StatGrid stats={data.stats} />

      <div className="row g-3 mb-4">
        <div className="col-xl-8">
          <SectionCard title="Earnings Overview" subtitle="Earnings per month, last 6 months" className="h-100">
            <BarChart data={data.monthlyEarnings} format="currency" caption="Earnings per month, last 6 months" valueLabel="Earnings" />
          </SectionCard>
        </div>
        <div className="col-xl-4">
          <SectionCard title="Performance" className="h-100">
            <PerformanceSummary {...data.performance} />
          </SectionCard>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-xl-7">
          <SectionCard title="Booking Requests" action={{ label: "View all", href: "/provider/bookings" }} flush className="h-100">
            <BookingsTable
              bookings={data.bookingRequests}
              perspective="PROVIDER"
              caption="Booking requests waiting for your response"
              emptyTitle="No new requests"
              emptyMessage="New booking requests from customers will show up here."
            />
          </SectionCard>
        </div>
        <div className="col-xl-5">
          <SectionCard title="Upcoming Jobs" flush className="h-100">
            <UpcomingBookingsList
              bookings={data.upcomingJobs}
              perspective="PROVIDER"
              emptyTitle="No upcoming jobs"
              emptyMessage="Jobs you accept will be listed here."
            />
          </SectionCard>
        </div>
      </div>
    </>
  );
}
