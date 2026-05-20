/**
 * app/api/groups/route.ts
 *
 * GET  /api/groups?userId=user-1  → groups the user belongs to
 * GET  /api/groups                → all groups
 * POST /api/groups                → create a new group
 */

import { NextRequest, NextResponse } from "next/server";
import { readDb, writeDb, uid, now } from "@/lib/db";
import { LIMITS } from "@/types";
import type { Group } from "@/types";

export async function GET(req: NextRequest) {
  const db = await readDb();
  const userId = req.nextUrl.searchParams.get("userId");

  const groups = userId
    ? db.groups.filter((group) => group.memberIds.includes(userId))
    : db.groups;

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

  const db = await readDb();

  const userGroupCount = db.groups.filter((g) =>
    g.memberIds.includes(createdBy)
  ).length;

  if (userGroupCount >= LIMITS.MAX_GROUPS_PER_USER) {
    return NextResponse.json(
      {
        error: `You can be in a maximum of ${LIMITS.MAX_GROUPS_PER_USER} groups.`,
      },
      { status: 422 }
    );
  }

  const allMembers = memberIds.includes(createdBy)
    ? memberIds
    : [createdBy, ...memberIds];

  if (allMembers.length > LIMITS.MAX_MEMBERS_PER_GROUP) {
    return NextResponse.json(
      {
        error: `A group can have a maximum of ${LIMITS.MAX_MEMBERS_PER_GROUP} members.`,
      },
      { status: 422 }
    );
  }

  const group: Group = {
    id: `group-${uid()}`,
    name,
    description,
    emoji,
    createdBy,
    memberIds: allMembers,
    createdAt: now(),
  };

  db.groups.push(group);
  await writeDb(db);

  return NextResponse.json(group, { status: 201 });
}
