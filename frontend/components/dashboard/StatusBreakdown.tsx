import EmptyState from "@/components/common/EmptyState";
import StatusBadge from "@/components/common/StatusBadge";
import { BOOKING_STATUS_META } from "@/lib/constants";
import { formatNumber } from "@/lib/format";
import type { StatusCount } from "@/types/dashboard";

export default function StatusBreakdown({ items }: { items: StatusCount[] }) {
  const total = items.reduce((sum, item) => sum + item.count, 0);

  if (total === 0) {
    return <EmptyState icon="bi-pie-chart" title="No bookings yet" message="Status totals will appear once bookings come in." />;
  }

  return (
    <>
      <ul className="metric-list">
        {items.map(({ status, count }) => {
          const percent = Math.round((count / total) * 100);
          const { label, variant } = BOOKING_STATUS_META[status];
          return (
            <li key={status}>
              <div className="d-flex align-items-center justify-content-between">
                <StatusBadge status={status} />
                <span className="fw-semibold">
                  {formatNumber(count)} <span className="fw-normal text-muted">({percent}%)</span>
                </span>
              </div>
              <div
                className="progress"
                role="progressbar"
                aria-label={`${label} bookings`}
                aria-valuenow={percent}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div className={`progress-bar bg-${variant}`} style={{ width: `${percent}%` }} />
              </div>
            </li>
          );
        })}
      </ul>
      <p className="mt-4 mb-0 pt-3 border-top text-muted small">
        <span className="fw-semibold text-body">{formatNumber(total)}</span> bookings this month
      </p>
    </>
  );
}
