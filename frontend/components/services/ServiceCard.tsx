import Link from "next/link";
import { CATEGORY_ICONS, DEFAULT_CATEGORY_ICON } from "@/lib/constants";
import { formatCurrency, formatDuration } from "@/lib/format";
import type { ServiceListItem } from "@/types/service";

interface ServiceCardProps {
  service: ServiceListItem;
  bookHref: string;
}

export default function ServiceCard({ service, bookHref }: ServiceCardProps) {
  const icon = CATEGORY_ICONS[service.category] ?? DEFAULT_CATEGORY_ICON;

  return (
    <article className="card service-card">
      <div className="card-body d-flex flex-column">
        <div className="d-flex align-items-start justify-content-between mb-3">
          <span className="icon-tile bg-primary-subtle text-primary-emphasis" aria-hidden="true">
            <i className={`bi ${icon}`} />
          </span>
          <span className="badge bg-light text-body border">{service.category}</span>
        </div>

        <h3 className="h6 mb-1">{service.name}</h3>
        <p className="small text-muted mb-3">{service.description}</p>

        <ul className="list-unstyled small d-flex flex-wrap gap-3 mb-3">
          <li>
            <i className="bi bi-person me-1 text-muted" aria-hidden="true" />
            {service.providerName}
          </li>
          <li>
            <i className="bi bi-star-fill me-1 text-warning" aria-hidden="true" />
            <span className="visually-hidden">Rating </span>
            {service.rating}
          </li>
          <li>
            <i className="bi bi-clock me-1 text-muted" aria-hidden="true" />
            <span className="visually-hidden">Duration </span>
            {formatDuration(service.duration)}
          </li>
        </ul>

        <div className="mt-auto d-flex align-items-center justify-content-between">
          <span className="fs-5 fw-semibold">{formatCurrency(service.price)}</span>
          <Link href={bookHref} className="btn btn-primary btn-sm" aria-label={`Book ${service.name}`}>
            Book now
          </Link>
        </div>
      </div>
    </article>
  );
}
