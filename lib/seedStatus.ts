/**
 * lib/seed-status.ts
 * ─────────────────────────────────────────────────────────────
 * Reusable utility to check whether the app has been seeded.
 * Works in both middleware (edge) and server components/actions.
 * ─────────────────────────────────────────────────────────────
 */

function getSeedStatusUrl(base?: string): URL {
  const origin =
    base ?? process.env.NEXTAUTH_URL ?? `http://localhost:${process.env.PORT}`;
  const url = new URL("/api/auth/seed-status", origin);
  return url;
}

export async function checkIsSeeded(base?: string): Promise<boolean> {
  const res = await fetch(getSeedStatusUrl(base));
  const { isSeeded } = (await res.json()) as { isSeeded: boolean };
  return isSeeded;
}
