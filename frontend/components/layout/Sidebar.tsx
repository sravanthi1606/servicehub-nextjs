"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Ref } from "react";
import { APP_NAME, ROLE_BASE_PATH, ROLE_LABELS } from "@/lib/constants";
import { cx } from "@/lib/cx";
import { SIDEBAR_MENUS, isMenuItemActive } from "@/lib/navigation";
import type { Role } from "@/types/user";

interface SidebarProps {
  ref?: Ref<HTMLDivElement>;
  id: string;
  role: Role;
  /** Desktop icon-only mode */
  collapsed: boolean;
  /** Off-screen on mobile — removed from tab order and the accessibility tree */
  hidden: boolean;
  /** Called after a link is clicked, so the mobile drawer can close */
  onNavigate: () => void;
}

export default function Sidebar({ ref, id, role, collapsed, hidden, onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const menuItems = SIDEBAR_MENUS[role];

  return (
    <div ref={ref} id={id} className="app-sidebar" inert={hidden}>
      <Link href={`${ROLE_BASE_PATH[role]}/dashboard`} className="sidebar-brand" onClick={onNavigate}>
        <span className="sidebar-brand__icon" aria-hidden="true">
          <i className="bi bi-tools" />
        </span>
        <span className="sidebar-brand__text">{APP_NAME}</span>
      </Link>

      <nav className="sidebar-nav" aria-label={`${ROLE_LABELS[role]} navigation`}>
        <p className="sidebar-section-title">Menu</p>
        <ul className="sidebar-menu">
          {menuItems.map((item) => {
            const isActive = isMenuItemActive(pathname, item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cx("sidebar-link", isActive && "active")}
                  aria-current={isActive ? "page" : undefined}
                  title={collapsed ? item.label : undefined}
                  onClick={onNavigate}
                >
                  <i className={`bi ${item.icon}`} aria-hidden="true" />
                  <span className="sidebar-link__label">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <ul className="sidebar-menu">
          <li>
            {/* Phase 1: no session yet, so logout just leaves the dashboard. Phase 5 clears the JWT. */}
            <Link href="/" className="sidebar-link" title={collapsed ? "Logout" : undefined} onClick={onNavigate}>
              <i className="bi bi-box-arrow-left" aria-hidden="true" />
              <span className="sidebar-link__label">Logout</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
