import Link from "next/link";
import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

interface SectionCardProps {
  title: string;
  subtitle?: string;
  /** Optional "View all"-style link in the header */
  action?: { label: string; href: string };
  /** Removes body padding — use for tables and list groups that run edge to edge */
  flush?: boolean;
  className?: string;
  children: ReactNode;
}

export default function SectionCard({ title, subtitle, action, flush = false, className, children }: SectionCardProps) {
  return (
    <section className={cx("card", className)}>
      <div className="card-header">
        <div>
          <h2 className="card-title">{title}</h2>
          {subtitle && <p className="small text-muted mb-0">{subtitle}</p>}
        </div>
        {action && (
          <Link href={action.href} className="btn btn-sm btn-light flex-shrink-0">
            {action.label}
            <i className="bi bi-arrow-right ms-1" aria-hidden="true" />
          </Link>
        )}
      </div>
      <div className={cx("card-body", flush && "p-0")}>{children}</div>
    </section>
  );
}
