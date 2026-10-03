import { formatValue } from "@/lib/format";
import type { StatCardData } from "@/types/dashboard";

export default function StatCard({ label, value, format, icon, tone, change }: StatCardData) {
  return (
    <div className="card stat-card">
      <div className="card-body d-flex align-items-start justify-content-between gap-3">
        <div>
          <p className="stat-card__label">{label}</p>
          <p className="stat-card__value">{formatValue(value, format)}</p>
          {change !== undefined && <ChangeIndicator change={change} />}
        </div>
        <span className={`icon-tile bg-${tone}-subtle text-${tone}-emphasis`} aria-hidden="true">
          <i className={`bi ${icon}`} />
        </span>
      </div>
    </div>
  );
}

function ChangeIndicator({ change }: { change: number }) {
  const isUp = change >= 0;
  return (
    <p className="stat-card__change mb-0">
      <span className={isUp ? "text-success" : "text-danger"}>
        <i className={`bi ${isUp ? "bi-arrow-up-right" : "bi-arrow-down-right"} me-1`} aria-hidden="true" />
        {isUp ? "+" : ""}
        {change}%
      </span>{" "}
      <span className="text-muted">vs last month</span>
    </p>
  );
}
