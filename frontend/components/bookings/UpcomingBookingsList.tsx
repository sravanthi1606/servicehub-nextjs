import type { ReactNode } from "react";
import EmptyState from "@/components/common/EmptyState";
import StatusBadge from "@/components/common/StatusBadge";
import { formatDate, formatTime, getDateParts } from "@/lib/format";
import type { BookingListItem } from "@/types/booking";

interface UpcomingBookingsListProps {
  bookings: BookingListItem[];
  /** Providers see the customer's name, customers see the provider's. */
  perspective: "PROVIDER" | "CUSTOMER";
  emptyTitle: string;
  emptyMessage?: string;
  emptyAction?: ReactNode;
}

export default function UpcomingBookingsList({
  bookings,
  perspective,
  emptyTitle,
  emptyMessage,
  emptyAction,
}: UpcomingBookingsListProps) {
  if (bookings.length === 0) {
    return <EmptyState icon="bi-calendar-event" title={emptyTitle} message={emptyMessage} action={emptyAction} />;
  }

  const counterpartLabel = perspective === "PROVIDER" ? "Customer" : "Provider";

  return (
    <ul className="list-group list-group-flush">
      {bookings.map((booking) => {
        const { day, month } = getDateParts(booking.bookingDate);
        const counterpart = perspective === "PROVIDER" ? booking.customerName : booking.providerName;

        return (
          <li key={booking.id} className="list-group-item d-flex align-items-start gap-3 px-3 py-3">
            <div className="date-tile" aria-hidden="true">
              <span className="date-tile__day">{day}</span>
              <span className="date-tile__month">{month}</span>
            </div>

            <div className="flex-grow-1 overflow-hidden">
              <div className="d-flex flex-wrap align-items-start justify-content-between gap-2 mb-1">
                <h3 className="h6 mb-0">{booking.serviceName}</h3>
                <StatusBadge status={booking.status} />
              </div>
              <p className="small text-muted mb-1">
                <i className="bi bi-clock me-1" aria-hidden="true" />
                {formatDate(booking.bookingDate)} at {formatTime(booking.bookingTime)}
              </p>
              <p className="small text-muted text-truncate mb-1">
                <i className="bi bi-geo-alt me-1" aria-hidden="true" />
                {booking.address}
              </p>
              <p className="small mb-0">
                <i className="bi bi-person me-1 text-muted" aria-hidden="true" />
                {counterpartLabel}: <span className="fw-medium">{counterpart}</span>
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
