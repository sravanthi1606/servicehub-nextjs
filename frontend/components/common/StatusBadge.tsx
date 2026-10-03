import { BOOKING_STATUS_META } from "@/lib/constants";
import type { BookingStatus } from "@/types/booking";

// Status is never shown by colour alone: every badge has an icon and a label.
export default function StatusBadge({ status }: { status: BookingStatus }) {
  const { label, variant, icon } = BOOKING_STATUS_META[status];

  return (
    <span className={`badge status-badge bg-${variant}-subtle text-${variant}-emphasis`}>
      <i className={`bi ${icon}`} aria-hidden="true" />
      {label}
    </span>
  );
}
