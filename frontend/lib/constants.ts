import type { BookingStatus } from "@/types/booking";
import type { Role } from "@/types/user";

export const APP_NAME = "ServiceHub";
export const LOCALE = "en-US";
export const CURRENCY = "USD";

export const ROLES: readonly Role[] = ["ADMIN", "PROVIDER", "CUSTOMER"];

export const ROLE_LABELS: Record<Role, string> = {
  ADMIN: "Admin",
  PROVIDER: "Provider",
  CUSTOMER: "Customer",
};

/** URL segment for each role's area, e.g. /admin/dashboard */
export const ROLE_BASE_PATH: Record<Role, string> = {
  ADMIN: "/admin",
  PROVIDER: "/provider",
  CUSTOMER: "/customer",
};

type StatusVariant = "warning" | "primary" | "danger" | "success" | "secondary";

export const BOOKING_STATUS_META: Record<BookingStatus, { label: string; variant: StatusVariant; icon: string }> = {
  PENDING: { label: "Pending", variant: "warning", icon: "bi-hourglass-split" },
  ACCEPTED: { label: "Accepted", variant: "primary", icon: "bi-check2-circle" },
  REJECTED: { label: "Rejected", variant: "danger", icon: "bi-x-circle" },
  COMPLETED: { label: "Completed", variant: "success", icon: "bi-patch-check" },
  CANCELLED: { label: "Cancelled", variant: "secondary", icon: "bi-slash-circle" },
};

export const CATEGORY_ICONS: Record<string, string> = {
  Cleaning: "bi-stars",
  Plumbing: "bi-droplet",
  Electrical: "bi-lightning-charge",
  Appliances: "bi-snow",
  Beauty: "bi-scissors",
  "Pest Control": "bi-bug",
};

export const DEFAULT_CATEGORY_ICON = "bi-tools";

/** Must match $sidebar-breakpoint (Bootstrap lg) in styles/variables.scss */
export const DESKTOP_MEDIA_QUERY = "(min-width: 992px)";
