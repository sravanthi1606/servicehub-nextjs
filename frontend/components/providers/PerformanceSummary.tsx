import { formatNumber } from "@/lib/format";
import type { ProviderDashboardData } from "@/types/dashboard";

type Performance = ProviderDashboardData["performance"];

export default function PerformanceSummary({ rating, reviewCount, completionRate, acceptanceRate }: Performance) {
  const rates = [
    { label: "Completion rate", value: completionRate },
    { label: "Acceptance rate", value: acceptanceRate },
  ];

  return (
    <>
      <div className="d-flex align-items-center gap-3 mb-4">
        <span className="icon-tile bg-warning-subtle text-warning-emphasis" aria-hidden="true">
          <i className="bi bi-star-fill" />
        </span>
        <div>
          <p className="h3 mb-0">
            {rating}
            <span className="fs-6 fw-normal text-muted"> / 5</span>
          </p>
          <p className="small text-muted mb-0">Average rating from {formatNumber(reviewCount)} reviews</p>
        </div>
      </div>

      <ul className="metric-list">
        {rates.map((rate) => (
          <li key={rate.label}>
            <div className="d-flex justify-content-between">
              <span>{rate.label}</span>
              <span className="fw-semibold">{rate.value}%</span>
            </div>
            <div className="progress" role="progressbar" aria-label={rate.label} aria-valuenow={rate.value} aria-valuemin={0} aria-valuemax={100}>
              <div className="progress-bar" style={{ width: `${rate.value}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
