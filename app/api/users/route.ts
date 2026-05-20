/**
 * app/api/users/route.ts
 *
 * GET  /api/users          → all users
 * GET  /api/users?ids=a,b  → filter by comma-separated IDs
 * POST /api/users          → create a new user
 */

import { NextRequest, NextResponse } from "next/server";
import { readDb, writeDb, uid } from "@/lib/db";
import type { User } from "@/types";

export async function GET(req: NextRequest) {
  const db = await readDb();
  const idsParam = req.nextUrl.searchParams.get("ids");

  if (idsParam) {
    const ids = idsParam.split(",").map((s) => s.trim());
    const filtered = db.users.filter((u) => ids.includes(u.id));
    return NextResponse.json(filtered);
  }

  return NextResponse.json(db.users);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, name, avatarInitials, avatarBg, avatarFg } = body as Omit<
    User,
    "id"
  >;

  if (!email || !name) {
    return NextResponse.json(
      { error: "email and name are required" },
      { status: 400 }
    );
  }

  const db = await readDb();

  const duplicate = db.users.find((u) => u.email === email);
  if (duplicate) {
    return NextResponse.json(
      { error: "A user with this email already exists" },
      { status: 409 }
    );
  }

  const user: User = {
    id: `user-${uid()}`,
    email,
    name,
    avatarInitials: avatarInitials ?? name.slice(0, 2).toUpperCase(),
    avatarBg: avatarBg ?? "#E5E7EB",
    avatarFg: avatarFg ?? "#111827",
    isSeeded: false,
  };

  db.users.push(user);
  await writeDb(db);

  return NextResponse.json(user, { status: 201 });
}
