import Link from "next/link";
import { ROLE_BASE_PATH, ROLE_LABELS } from "@/lib/constants";
import type { Role } from "@/types/user";

// Temporary Phase 1 entry point. Phase 2 replaces this with the real Home page.
const ROLE_CARDS: { role: Role; icon: string; description: string }[] = [
  { role: "CUSTOMER", icon: "bi-person", description: "Browse services, book appointments and track your bookings." },
  { role: "PROVIDER", icon: "bi-tools", description: "Respond to booking requests, manage jobs and follow your earnings." },
  { role: "ADMIN", icon: "bi-shield-lock", description: "Oversee users, providers, services and every booking on the platform." },
];

export default function HomePage() {
  return (
    <main className="container py-5">
      <div className="text-center mx-auto mb-5" style={{ maxWidth: "40rem" }}>
        <span className="icon-tile bg-primary text-white mb-3" aria-hidden="true">
          <i className="bi bi-tools" />
        </span>
        <h1 className="display-6 fw-bold">ServiceHub</h1>
        <p className="lead text-muted">Book trusted local professionals for cleaning, repairs, beauty and more.</p>
        <p className="badge bg-primary-subtle text-primary-emphasis fw-medium">Phase 1 preview: pick a role to explore its dashboard</p>
      </div>

      <div className="row g-4 justify-content-center">
        {ROLE_CARDS.map(({ role, icon, description }) => (
          <div key={role} className="col-md-6 col-lg-4">
            <div className="card service-card position-relative">
              <div className="card-body p-4">
                <span className="icon-tile bg-primary-subtle text-primary-emphasis mb-3" aria-hidden="true">
                  <i className={`bi ${icon}`} />
                </span>
                <h2 className="h5">{ROLE_LABELS[role]}</h2>
                <p className="text-muted">{description}</p>
                <Link href={`${ROLE_BASE_PATH[role]}/dashboard`} className="stretched-link fw-medium text-decoration-none">
                  Open {ROLE_LABELS[role].toLowerCase()} dashboard
                  <i className="bi bi-arrow-right ms-1" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
