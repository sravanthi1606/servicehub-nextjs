import Avatar from "@/components/common/Avatar";
import EmptyState from "@/components/common/EmptyState";
import { formatCurrency, formatNumber } from "@/lib/format";
import type { TopProvider } from "@/types/provider";

export default function TopProvidersList({ providers }: { providers: TopProvider[] }) {
  if (providers.length === 0) {
    return <EmptyState icon="bi-person-badge" title="No providers yet" message="Providers will be ranked here once they complete jobs." />;
  }

  return (
    <ul className="list-group list-group-flush">
      {providers.map((provider) => (
        <li key={provider.id} className="list-group-item d-flex align-items-center gap-3 px-3 py-3">
          <Avatar name={provider.name} />
          <div className="flex-grow-1 overflow-hidden">
            <p className="fw-semibold text-truncate mb-0">{provider.name}</p>
            <p className="small text-muted text-truncate mb-0">{provider.specialization}</p>
          </div>
          <div className="text-end flex-shrink-0">
            <p className="fw-semibold mb-0">{formatCurrency(provider.earnings)}</p>
            <p className="small text-muted mb-0">
              <i className="bi bi-star-fill text-warning me-1" aria-hidden="true" />
              <span className="visually-hidden">Rating </span>
              {provider.rating} · {formatNumber(provider.completedJobs)} jobs
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
