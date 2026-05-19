/**
 * lib/db.ts
 * ─────────────────────────────────────────────────────────────
 * Low-level JSON file I/O.
 * All API routes import `readDb` / `writeDb` from here.
 *
 * On first boot (no db.json) the file is auto-created from
 * SEED_DATA. All seed users have isSeeded: true so middleware
 * immediately routes to /register.
 * ─────────────────────────────────────────────────────────────
 */

import { SEED_DATA } from "@/constants";
import type { Db } from "@/types";
import fs from "fs/promises";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "db.json");

export async function readDb(): Promise<Db> {
  try {
    const raw = await fs.readFile(DB_PATH, "utf-8");
    return JSON.parse(raw) as Db;
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
      await fs.writeFile(DB_PATH, JSON.stringify(SEED_DATA, null, 2), "utf-8");
      return structuredClone(SEED_DATA);
    }
    throw err;
  }
}

export async function writeDb(db: Db): Promise<void> {
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function now(): string {
  return new Date().toISOString();
}
