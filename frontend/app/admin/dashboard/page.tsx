import type { Metadata } from "next";
import BookingsTable from "@/components/bookings/BookingsTable";
import SectionCard from "@/components/common/SectionCard";
import BarChart from "@/components/dashboard/BarChart";
import StatGrid from "@/components/dashboard/StatGrid";
import StatusBreakdown from "@/components/dashboard/StatusBreakdown";
import PageHeader from "@/components/layout/PageHeader";
import TopProvidersList from "@/components/providers/TopProvidersList";
import { getAdminDashboard } from "@/lib/mock-data/admin";

export const metadata: Metadata = { title: "Admin Dashboard" };

export default async function AdminDashboardPage() {
  const data = await getAdminDashboard();

  return (
    <>
      <PageHeader title="Dashboard" breadcrumbs={[{ label: "Admin", href: "/admin/dashboard" }, { label: "Dashboard" }]} />

      <StatGrid stats={data.stats} />

      <div className="row g-3 mb-4">
        <div className="col-xl-8">
          <SectionCard title="Bookings Overview" subtitle="Bookings per month, last 6 months" className="h-100">
            <BarChart data={data.monthlyBookings} format="number" caption="Bookings per month, last 6 months" valueLabel="Bookings" />
          </SectionCard>
        </div>
        <div className="col-xl-4">
          <SectionCard title="Booking Status" subtitle="This month" className="h-100">
            <StatusBreakdown items={data.statusBreakdown} />
          </SectionCard>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-xl-8">
          <SectionCard title="Recent Bookings" action={{ label: "View all", href: "/admin/bookings" }} flush className="h-100">
            <BookingsTable bookings={data.recentBookings} perspective="ADMIN" caption="Most recent bookings across the platform" />
          </SectionCard>
        </div>
        <div className="col-xl-4">
          <SectionCard title="Top Providers" action={{ label: "View all", href: "/admin/providers" }} flush className="h-100">
            <TopProvidersList providers={data.topProviders} />
          </SectionCard>
        </div>
      </div>
    </>
  );
}
