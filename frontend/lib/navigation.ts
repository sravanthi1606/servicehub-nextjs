import type { Role } from "@/types/user";

export interface MenuItem {
  label: string;
  href: string;
  /** Bootstrap Icons class, e.g. "bi-speedometer2" */
  icon: string;
}

/**
 * Sidebar menu per role. This only controls what the UI shows —
 * access control is enforced by the Go API (Phase 5).
 * Logout is rendered by the sidebar itself because it is the same for every role.
 */
export const SIDEBAR_MENUS: Record<Role, MenuItem[]> = {
  CUSTOMER: [
    { label: "Dashboard", href: "/customer/dashboard", icon: "bi-speedometer2" },
    { label: "Services", href: "/customer/services", icon: "bi-grid" },
    { label: "My Bookings", href: "/customer/bookings", icon: "bi-calendar-check" },
    { label: "Profile", href: "/customer/profile", icon: "bi-person" },
  ],
  PROVIDER: [
    { label: "Dashboard", href: "/provider/dashboard", icon: "bi-speedometer2" },
    { label: "Booking Requests", href: "/provider/bookings", icon: "bi-inbox" },
    { label: "My Services", href: "/provider/services", icon: "bi-tools" },
    { label: "Completed Jobs", href: "/provider/completed-jobs", icon: "bi-check2-square" },
    { label: "Earnings", href: "/provider/earnings", icon: "bi-wallet2" },
    { label: "Profile", href: "/provider/profile", icon: "bi-person" },
  ],
  ADMIN: [
    { label: "Dashboard", href: "/admin/dashboard", icon: "bi-speedometer2" },
    { label: "Users", href: "/admin/users", icon: "bi-people" },
    { label: "Providers", href: "/admin/providers", icon: "bi-person-badge" },
    { label: "Services", href: "/admin/services", icon: "bi-grid" },
    { label: "Bookings", href: "/admin/bookings", icon: "bi-calendar-check" },
    { label: "Reports", href: "/admin/reports", icon: "bi-bar-chart-line" },
  ],
};

/** True when `pathname` is the menu item's page or one of its child pages. */
export function isMenuItemActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function findMenuItem(role: Role, pathname: string): MenuItem | undefined {
  return SIDEBAR_MENUS[role].find((item) => isMenuItemActive(pathname, item.href));
}

/** Planned pages that have no sidebar entry of their own (e.g. /customer/book-service/[serviceId]). */
const UNLISTED_ROUTES: Partial<Record<Role, string[]>> = {
  CUSTOMER: ["/customer/book-service"],
};

/** True for any page in the spec for this role — used to tell "not built yet" apart from a 404. */
export function isPlannedRoute(role: Role, pathname: string): boolean {
  const unlisted = UNLISTED_ROUTES[role] ?? [];
  return Boolean(findMenuItem(role, pathname)) || unlisted.some((href) => isMenuItemActive(pathname, href));
}
