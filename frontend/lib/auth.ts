import type { Role, User } from "@/types/user";

// Phase 1: every role area shows a fixed mock user.
// Phase 5 replaces this with the user decoded from the JWT issued by the Go API.
const MOCK_USERS: Record<Role, User> = {
  ADMIN: {
    id: "usr_admin_01",
    name: "Alex Morgan",
    email: "alex.morgan@servicehub.dev",
    role: "ADMIN",
    createdAt: "2025-01-10T09:00:00Z",
    updatedAt: "2026-09-28T09:00:00Z",
  },
  PROVIDER: {
    id: "usr_provider_01",
    name: "Ravi Kumar",
    email: "ravi.kumar@servicehub.dev",
    role: "PROVIDER",
    phone: "+1 555 0142",
    createdAt: "2025-03-02T09:00:00Z",
    updatedAt: "2026-09-30T09:00:00Z",
  },
  CUSTOMER: {
    id: "usr_customer_01",
    name: "Priya Nair",
    email: "priya.nair@servicehub.dev",
    role: "CUSTOMER",
    phone: "+1 555 0178",
    createdAt: "2025-06-18T09:00:00Z",
    updatedAt: "2026-10-01T09:00:00Z",
  },
};

export async function getCurrentUser(role: Role): Promise<User> {
  return MOCK_USERS[role];
}
