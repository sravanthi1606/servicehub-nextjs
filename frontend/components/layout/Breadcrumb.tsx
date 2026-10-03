import Link from "next/link";
import { cx } from "@/lib/cx";

export interface BreadcrumbItem {
  label: string;
  /** Omit for the current page */
  href?: string;
}

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="breadcrumb">
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1;
          return (
            <li
              key={`${item.label}-${index}`}
              className={cx("breadcrumb-item", isCurrent && "active")}
              aria-current={isCurrent ? "page" : undefined}
            >
              {item.href && !isCurrent ? <Link href={item.href}>{item.label}</Link> : item.label}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
