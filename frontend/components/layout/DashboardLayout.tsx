"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { APP_NAME, DESKTOP_MEDIA_QUERY } from "@/lib/constants";
import { cx } from "@/lib/cx";
import type { Role, User } from "@/types/user";
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";

interface DashboardLayoutProps {
  role: Role;
  user: User;
  children: ReactNode;
}

const SIDEBAR_ID = "app-sidebar";

/**
 * Shared shell for the admin, provider and customer areas.
 * Desktop: the sidebar collapses to icons. Mobile: it slides in over the page.
 */
export default function DashboardLayout({ role, user, children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const isDesktop = useMediaQuery(DESKTOP_MEDIA_QUERY, true);
  const [collapsed, setCollapsed] = useState(false);
  // The mobile drawer remembers the page it was opened on, so any navigation
  // (link click, back/forward) closes it without an extra effect.
  const [drawerOpenedOn, setDrawerOpenedOn] = useState<string | null>(null);

  // Crossing to desktop closes the drawer so it doesn't reappear on the next resize.
  if (isDesktop && drawerOpenedOn !== null) setDrawerOpenedOn(null);

  const isMobileDrawerOpen = !isDesktop && drawerOpenedOn === pathname;
  const isSidebarExpanded = isDesktop ? !collapsed : isMobileDrawerOpen;

  const sidebarRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const wasDrawerOpen = useRef(false);

  const toggleSidebar = () => {
    if (isDesktop) setCollapsed((value) => !value);
    else setDrawerOpenedOn(isMobileDrawerOpen ? null : pathname);
  };

  const closeMobileSidebar = useCallback(() => setDrawerOpenedOn(null), []);

  // Move focus into the drawer when it opens and back to the toggle when it closes.
  useEffect(() => {
    if (isMobileDrawerOpen) sidebarRef.current?.querySelector<HTMLElement>("a")?.focus();
    else if (wasDrawerOpen.current) toggleRef.current?.focus();
    wasDrawerOpen.current = isMobileDrawerOpen;
  }, [isMobileDrawerOpen]);

  useEffect(() => {
    if (!isMobileDrawerOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDrawerOpenedOn(null);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMobileDrawerOpen]);

  return (
    <div className={cx("app-layout", collapsed && "is-collapsed", isMobileDrawerOpen && "is-mobile-open")}>
      <a href="#main-content" className="visually-hidden-focusable position-absolute top-0 start-0 m-2 btn btn-primary z-3">
        Skip to main content
      </a>

      <Sidebar
        ref={sidebarRef}
        id={SIDEBAR_ID}
        role={role}
        collapsed={isDesktop && collapsed}
        hidden={!isDesktop && !isMobileDrawerOpen}
        onNavigate={closeMobileSidebar}
      />

      {isMobileDrawerOpen && (
        <button type="button" className="app-backdrop" aria-label="Close menu" onClick={closeMobileSidebar} />
      )}

      {/* While the drawer is open, the page behind it is out of the tab order and the accessibility tree. */}
      <div className="app-main" inert={isMobileDrawerOpen}>
        <TopNavbar
          toggleRef={toggleRef}
          role={role}
          user={user}
          sidebarId={SIDEBAR_ID}
          sidebarExpanded={isSidebarExpanded}
          onToggleSidebar={toggleSidebar}
        />
        <main id="main-content" className="app-content" tabIndex={-1}>
          {children}
        </main>
        <footer className="app-footer" suppressHydrationWarning>
          © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
