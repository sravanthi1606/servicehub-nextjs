import type { Metadata } from "next";
import Link from "next/link";
import BookingsTable from "@/components/bookings/BookingsTable";
import UpcomingBookingsList from "@/components/bookings/UpcomingBookingsList";
import SectionCard from "@/components/common/SectionCard";
import StatGrid from "@/components/dashboard/StatGrid";
import PageHeader from "@/components/layout/PageHeader";
import ServiceCard from "@/components/services/ServiceCard";
import { getCurrentUser } from "@/lib/auth";
import { getFirstName } from "@/lib/format";
import { getCustomerDashboard } from "@/lib/mock-data/customer";

export const metadata: Metadata = { title: "My Dashboard" };

export default async function CustomerDashboardPage() {
  const [user, data] = await Promise.all([getCurrentUser("CUSTOMER"), getCustomerDashboard()]);
  const upcomingCount = data.upcomingBookings.length;

  return (
    <>
      <PageHeader title="Dashboard" breadcrumbs={[{ label: "Customer", href: "/customer/dashboard" }, { label: "Dashboard" }]} />

      <section className="card welcome-banner mb-4">
        <div className="card-body d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 p-4">
          <div>
            <h2 className="h4 mb-1">Welcome back, {getFirstName(user.name)}!</h2>
            <p className="mb-0">
              {upcomingCount > 0
                ? `You have ${upcomingCount} upcoming ${upcomingCount === 1 ? "booking" : "bookings"}. Need anything else done?`
                : "Need something cleaned, fixed or styled? Find a trusted pro in minutes."}
            </p>
          </div>
          <Link href="/customer/services" className="btn btn-light fw-medium flex-shrink-0">
            <i className="bi bi-search me-2" aria-hidden="true" />
            Browse services
          </Link>
        </div>
      </section>

      <StatGrid stats={data.stats} />

      <div className="row g-3 mb-4">
        <div className="col-xl-5">
          <SectionCard title="Upcoming Bookings" flush className="h-100">
            <UpcomingBookingsList
              bookings={data.upcomingBookings}
              perspective="CUSTOMER"
              emptyTitle="No upcoming bookings"
              emptyMessage="When you book a service it will appear here."
              emptyAction={
                <Link href="/customer/services" className="btn btn-primary btn-sm">
                  Browse services
                </Link>
              }
            />
          </SectionCard>
        </div>
        <div className="col-xl-7">
          <SectionCard title="Recent Bookings" action={{ label: "View all", href: "/customer/bookings" }} flush className="h-100">
            <BookingsTable bookings={data.recentBookings} perspective="CUSTOMER" caption="Your most recent bookings" />
          </SectionCard>
        </div>
      </div>

      <section aria-labelledby="popular-services-heading">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h2 id="popular-services-heading" className="h5 mb-0">
            Popular Services
          </h2>
          <Link href="/customer/services" className="btn btn-sm btn-light">
            View all
            <i className="bi bi-arrow-right ms-1" aria-hidden="true" />
          </Link>
        </div>
        <div className="row g-3">
          {data.popularServices.map((service) => (
            <div key={service.id} className="col-sm-6 col-xl-3">
              <ServiceCard service={service} bookHref={`/customer/book-service/${service.id}`} />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
