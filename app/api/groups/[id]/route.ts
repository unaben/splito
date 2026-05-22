/**
 * app/api/groups/[id]/route.ts
 *
 * GET    /api/groups/:id  → single group
 * PATCH  /api/groups/:id  → update group fields
 * DELETE /api/groups/:id  → delete group + cascade expenses + settlements
 */

import { NextRequest, NextResponse } from "next/server";
import { getGroup, updateGroup, deleteGroup } from "@/lib/db";
import type { Group, Params } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const group = await getGroup(id);
  if (!group)
    return NextResponse.json({ error: "Group not found" }, { status: 404 });
  return NextResponse.json(group);
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = (await req.json()) as Partial<
    Pick<Group, "name" | "description" | "emoji" | "memberIds">
  >;
  const group = await updateGroup(id, body);
  if (!group)
    return NextResponse.json({ error: "Group not found" }, { status: 404 });
  return NextResponse.json(group);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const ok = await deleteGroup(id);
  if (!ok)
    return NextResponse.json({ error: "Group not found" }, { status: 404 });
  return NextResponse.json({ deleted: true });
}
