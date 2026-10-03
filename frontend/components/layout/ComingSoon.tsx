import Link from "next/link";
import { notFound } from "next/navigation";
import EmptyState from "@/components/common/EmptyState";
import { ROLE_BASE_PATH, ROLE_LABELS } from "@/lib/constants";
import { findMenuItem, isPlannedRoute } from "@/lib/navigation";
import type { Role } from "@/types/user";
import PageHeader from "./PageHeader";

interface ComingSoonProps {
  role: Role;
  slug: string[];
}

function toTitle(segment: string): string {
  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Placeholder for pages planned in later phases, rendered by each role's
 * catch-all route. Real pages take precedence automatically as they are added;
 * URLs that are not part of the plan get a 404.
 */
export default function ComingSoon({ role, slug }: ComingSoonProps) {
  const basePath = ROLE_BASE_PATH[role];
  const pathname = `${basePath}/${slug.join("/")}`;
  if (!isPlannedRoute(role, pathname)) notFound();

  const title = findMenuItem(role, pathname)?.label ?? toTitle(slug[0]);

  return (
    <>
      <PageHeader title={title} breadcrumbs={[{ label: ROLE_LABELS[role], href: `${basePath}/dashboard` }, { label: title }]} />
      <div className="card">
        <div className="card-body">
          <EmptyState
            icon="bi-cone-striped"
            title={`${title} is coming soon`}
            message="This page is planned for a later build phase. Navigation and layout are already in place."
            action={
              <Link href={`${basePath}/dashboard`} className="btn btn-primary btn-sm">
                Back to dashboard
              </Link>
            }
          />
        </div>
      </div>
    </>
  );
}
