/**
 * app/api/groups/route.ts
 *
 * GET  /api/groups?userId=user-1  → groups the user belongs to
 * GET  /api/groups                → all groups
 * POST /api/groups                → create a new group
 */

import { NextRequest, NextResponse } from "next/server";
import { getGroups, createGroup } from "@/lib/db";
import { uid, now } from "@/helper";
import { LIMITS } from "@/constants";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId")
  if (!userId)
    return NextResponse.json({ error: "userId is required" }, { status: 400 });

  const groups = await getGroups(userId);  
  return NextResponse.json(groups);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, description, emoji, createdBy, memberIds } = body as {
    name: string;
    description?: string;
    emoji: string;
    createdBy: string;
    memberIds: string[];
  };

  if (!name || !emoji || !createdBy || !Array.isArray(memberIds)) {
    return NextResponse.json(
      { error: "name, emoji, createdBy, and memberIds are required" },
      { status: 400 }
    );
  }

  const allMembers = memberIds.includes(createdBy)
    ? memberIds
    : [createdBy, ...memberIds];

  // Limit: max groups per user
  const userGroups = await getGroups(createdBy);
  if (userGroups.length >= LIMITS.MAX_GROUPS_PER_USER) {
    return NextResponse.json(
      { error: `Maximum of ${LIMITS.MAX_GROUPS_PER_USER} groups allowed.` },
      { status: 422 }
    );
  }

  // Limit: max members per group
  if (allMembers.length > LIMITS.MAX_MEMBERS_PER_GROUP) {
    return NextResponse.json(
      {
        error: `Maximum of ${LIMITS.MAX_MEMBERS_PER_GROUP} members per group.`,
      },
      { status: 422 }
    );
  }

  const group = await createGroup({
    id: `group-${uid()}`,
    name,
    description,
    emoji,
    createdBy,
    memberIds: allMembers,
    createdAt: now(),
  });

  return NextResponse.json(group, { status: 201 });
}
