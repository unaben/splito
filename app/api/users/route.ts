/**
 * app/api/users/route.ts
 *
 * GET  /api/users          → all users
 * GET  /api/users?ids=a,b  → filter by comma-separated IDs
 * POST /api/users          → create a new user
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/requireAuth";
import { getAllUsers, getUsersByIds, createUser } from "@/lib/db";
import type { User } from "@/types";
import { uid } from "@/helper";

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  const { id: userId } = auth;

  const idsParam = req.nextUrl.searchParams.get("ids");

  if (idsParam) {
    const ids = idsParam.split(",").map((s) => s.trim());
    const users = await getUsersByIds(ids, userId);
    return NextResponse.json(users);
  }

  const users = await getAllUsers(userId);
  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  const body = await req.json();
  const { email, name, avatarInitials, avatarBg, avatarFg } = body as Omit<
    User,
    "id" | "ownerId" | "onboardingComplete"
  >;

  if (!email || !name) {
    return NextResponse.json(
      { error: "email and name are required" },
      { status: 400 }
    );
  }

  const user = await createUser({
    id: `user-${uid()}`,
    email,
    name,
    avatarInitials: avatarInitials ?? name.slice(0, 2).toUpperCase(),
    avatarBg: avatarBg ?? "#E5E7EB",
    avatarFg: avatarFg ?? "#111827",
    ownerId: null,
    onboardingComplete: false,
  });

  return NextResponse.json(user, { status: 201 });
}
