import { CURRENCY, LOCALE } from "./constants";
import type { ValueFormat } from "@/types/dashboard";

const currencyFormatter = new Intl.NumberFormat(LOCALE, {
  style: "currency",
  currency: CURRENCY,
  maximumFractionDigits: 0,
});

const compactCurrencyFormatter = new Intl.NumberFormat(LOCALE, {
  style: "currency",
  currency: CURRENCY,
  notation: "compact",
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
});

const numberFormatter = new Intl.NumberFormat(LOCALE);

// Booking dates are date-only values ("2026-10-05"). Format them in UTC so the
// day never shifts with the viewer's or server's timezone.
const dateFormatter = new Intl.DateTimeFormat(LOCALE, {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

export function formatCurrency(amount: number, options?: { compact?: boolean }): string {
  return (options?.compact ? compactCurrencyFormatter : currencyFormatter).format(amount);
}

export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

export function formatValue(value: number, format: ValueFormat): string {
  if (format === "currency") return formatCurrency(value);
  if (format === "percent") return `${value}%`;
  return formatNumber(value);
}

export function formatDate(isoDate: string): string {
  return dateFormatter.format(new Date(isoDate));
}

/** Splits a date-only value into calendar-tile parts: { day: "5", month: "Oct" } */
export function getDateParts(isoDate: string): { day: string; month: string } {
  const date = new Date(isoDate);
  return {
    day: String(date.getUTCDate()),
    month: date.toLocaleString(LOCALE, { month: "short", timeZone: "UTC" }),
  };
}

/** "14:30" → "2:30 PM" */
export function formatTime(time: string): string {
  const [hours, minutes] = time.split(":").map(Number);
  const suffix = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${String(minutes).padStart(2, "0")} ${suffix}`;
}

/** "bk-1024" → "#BK-1024" */
export function formatBookingRef(id: string): string {
  return `#${id.toUpperCase()}`;
}

export function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

export function getFirstName(name: string): string {
  return name.split(/\s+/)[0] ?? name;
}

/** 90 → "1 hr 30 min", 45 → "45 min" */
export function formatDuration(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes} min`;
  return minutes === 0 ? `${hours} hr` : `${hours} hr ${minutes} min`;
}
