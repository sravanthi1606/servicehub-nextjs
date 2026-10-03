import Avatar from "@/components/common/Avatar";
import EmptyState from "@/components/common/EmptyState";
import StatusBadge from "@/components/common/StatusBadge";
import { formatBookingRef, formatCurrency, formatDate, formatTime } from "@/lib/format";
import type { BookingListItem } from "@/types/booking";
import type { Role } from "@/types/user";

interface BookingsTableProps {
  bookings: BookingListItem[];
  /** Whose view this is: hides the column that would just show the viewer themself. */
  perspective: Role;
  /** Screen-reader caption */
  caption: string;
  emptyTitle?: string;
  emptyMessage?: string;
}

function PersonCell({ name }: { name: string }) {
  return (
    <div className="d-flex align-items-center gap-2">
      <Avatar name={name} size="sm" />
      {name}
    </div>
  );
}

export default function BookingsTable({
  bookings,
  perspective,
  caption,
  emptyTitle = "No bookings yet",
  emptyMessage,
}: BookingsTableProps) {
  if (bookings.length === 0) {
    return <EmptyState icon="bi-calendar-x" title={emptyTitle} message={emptyMessage} />;
  }

  const showCustomer = perspective !== "CUSTOMER";
  const showProvider = perspective !== "PROVIDER";

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle mb-0">
        <caption className="visually-hidden">{caption}</caption>
        <thead>
          <tr>
            <th scope="col">Service</th>
            {showCustomer && <th scope="col">Customer</th>}
            {showProvider && <th scope="col">Provider</th>}
            <th scope="col">Date &amp; time</th>
            <th scope="col" className="text-end">
              Amount
            </th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td>
                <span className="fw-medium">{booking.serviceName}</span>
                <div className="small text-muted">{formatBookingRef(booking.id)}</div>
              </td>
              {showCustomer && (
                <td>
                  <PersonCell name={booking.customerName} />
                </td>
              )}
              {showProvider && (
                <td>
                  <PersonCell name={booking.providerName} />
                </td>
              )}
              <td className="text-nowrap">
                {formatDate(booking.bookingDate)}
                <div className="small text-muted">{formatTime(booking.bookingTime)}</div>
              </td>
              <td className="text-end fw-medium">{formatCurrency(booking.price)}</td>
              <td className="text-nowrap">
                <StatusBadge status={booking.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
