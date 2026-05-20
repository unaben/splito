/**
 * app/api/users/[id]/route.ts
 *
 * GET    /api/users/:id  → single user
 * PATCH  /api/users/:id  → update user fields
 * DELETE /api/users/:id  → remove user
 */

import { NextRequest, NextResponse } from "next/server";
import { readDb, writeDb } from "@/lib/db";
import type { Params, User } from "@/types";

export async function GET(_req: NextRequest, { params }: Params) {
  const db = await readDb();
  const { id } = await params;
  const user = db.users.find((u) => u.id === id);

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const db = await readDb();
  const { id } = await params;
  const idx = db.users.findIndex((u) => u.id === id);

  if (idx === -1) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const body = (await req.json()) as Partial<
    Pick<User, "name" | "email" | "avatarInitials" | "avatarBg" | "avatarFg">
  >;

  db.users[idx] = { ...db.users[idx], ...body };
  await writeDb(db);

  return NextResponse.json(db.users[idx]);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const db = await readDb();
  const { id } = await params;
  const idx = db.users.findIndex((u) => u.id === id);

  if (idx === -1) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  db.users.splice(idx, 1);
  await writeDb(db);

  return NextResponse.json({ deleted: true });
}
