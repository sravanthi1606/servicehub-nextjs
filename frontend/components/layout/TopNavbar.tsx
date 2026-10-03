"use client";

import Link from "next/link";
import type { Ref } from "react";
import { APP_NAME, ROLE_BASE_PATH } from "@/lib/constants";
import type { Role, User } from "@/types/user";
import UserMenu from "./UserMenu";

interface TopNavbarProps {
  toggleRef?: Ref<HTMLButtonElement>;
  role: Role;
  user: User;
  sidebarId: string;
  sidebarExpanded: boolean;
  onToggleSidebar: () => void;
}

export default function TopNavbar({ toggleRef, role, user, sidebarId, sidebarExpanded, onToggleSidebar }: TopNavbarProps) {
  return (
    <header className="app-topbar">
      <button
        type="button"
        ref={toggleRef}
        className="topbar-toggle"
        aria-controls={sidebarId}
        aria-expanded={sidebarExpanded}
        aria-label="Toggle navigation menu"
        onClick={onToggleSidebar}
      >
        <i className="bi bi-list" aria-hidden="true" />
      </button>

      <Link href={`${ROLE_BASE_PATH[role]}/dashboard`} className="topbar-brand">
        {APP_NAME}
      </Link>

      <div className="ms-auto">
        <UserMenu role={role} user={user} />
      </div>
    </header>
  );
}
