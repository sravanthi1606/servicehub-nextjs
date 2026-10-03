"use client";

import Link from "next/link";
import Dropdown from "react-bootstrap/Dropdown";
import Avatar from "@/components/common/Avatar";
import { ROLE_BASE_PATH, ROLE_LABELS } from "@/lib/constants";
import { getFirstName } from "@/lib/format";
import type { Role, User } from "@/types/user";

interface UserMenuProps {
  role: Role;
  user: User;
}

export default function UserMenu({ role, user }: UserMenuProps) {
  const basePath = ROLE_BASE_PATH[role];

  return (
    <Dropdown align="end">
      <Dropdown.Toggle as="button" id="user-menu-toggle" bsPrefix="user-menu-toggle">
        <span className="visually-hidden">Account menu: </span>
        <Avatar name={user.name} />
        <span className="user-menu-toggle__text">
          <span className="user-menu-toggle__name">{user.name}</span>
          <span className="user-menu-toggle__role">{ROLE_LABELS[role]}</span>
        </span>
        <i className="bi bi-chevron-down small d-none d-md-inline" aria-hidden="true" />
      </Dropdown.Toggle>

      <Dropdown.Menu className="mt-2">
        <Dropdown.Header>
          <span className="d-block fw-semibold text-body">Welcome, {getFirstName(user.name)}!</span>
          <span className="small">{user.email}</span>
        </Dropdown.Header>
        <Dropdown.Item as={Link} href={`${basePath}/profile`}>
          <i className="bi bi-person me-2" aria-hidden="true" />
          My Profile
        </Dropdown.Item>
        <Dropdown.Item as={Link} href={`${basePath}/dashboard`}>
          <i className="bi bi-speedometer2 me-2" aria-hidden="true" />
          Dashboard
        </Dropdown.Item>
        <Dropdown.Divider />
        {/* Phase 1: no session yet. Phase 5 clears the JWT before redirecting. */}
        <Dropdown.Item as={Link} href="/">
          <i className="bi bi-box-arrow-left me-2" aria-hidden="true" />
          Logout
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}
