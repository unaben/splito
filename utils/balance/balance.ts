/**
 * utils/balance.ts
 * ─────────────────────────────────────────────────────────────
 * Pure financial calculation functions — no side effects,
 * fully unit-testable.
 * ─────────────────────────────────────────────────────────────
 */

// ─── Display helpers ──────────────────────────────────────────────────────────

export function formatPence(pence: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(pence / 100);
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

export function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);

  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDate(iso);
}

export function penceFromPounds(pounds: string | number): number {
  return Math.round(Number(pounds) * 100);
}

export const CATEGORY_LABELS: Record<string, string> = {
  food: "Food & drink",
  transport: "Transport",
  accommodation: "Accommodation",
  activities: "Activities",
  shopping: "Shopping",
  utilities: "Utilities",
  other: "Other",
  flight: 'Flight'
};

export const CATEGORY_EMOJI: Record<string, string> = {
  food: "🍽️",
  transport: "🚗",
  accommodation: "🏨",
  activities: "🎭",
  shopping: "🛍️",
  utilities: "💡",
  flight: '🛩️',
  other: "📦",
};
