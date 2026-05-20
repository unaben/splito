/**
 * app/api/groups/[id]/route.ts
 *
 * GET    /api/groups/:id  → single group
 * PATCH  /api/groups/:id  → update group fields
 * DELETE /api/groups/:id  → delete group + cascade expenses + settlements
 */

import { NextRequest, NextResponse } from "next/server";
import { readDb, writeDb } from "@/lib/db";
import type { Group, Params } from "@/types";

export async function GET(_req: NextRequest, { params }: Params) {
  const db = await readDb();
  const { id } = await params;
  const group = db.groups.find((g) => g.id === id);

  if (!group) {
    return NextResponse.json({ error: "Group not found" }, { status: 404 });
  }

  return NextResponse.json(group);
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const db = await readDb();
  const { id } = await params;
  const idx = db.groups.findIndex((g) => g.id === id);

  if (idx === -1) {
    return NextResponse.json({ error: "Group not found" }, { status: 404 });
  }

  const body = (await req.json()) as Partial<
    Pick<Group, "name" | "description" | "emoji" | "memberIds">
  >;

  db.groups[idx] = { ...db.groups[idx], ...body };
  await writeDb(db);

  return NextResponse.json(db.groups[idx]);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const db = await readDb();
  const { id } = await params;
  const idx = db.groups.findIndex((g) => g.id === id);
  if (idx === -1) {
    return NextResponse.json({ error: "Group not found" }, { status: 404 });
  }

  db.groups.splice(idx, 1);
  db.expenses = db.expenses.filter((e) => e.groupId !== id);
  db.settlements = db.settlements.filter((s) => s.groupId !== id);

  await writeDb(db);

  return NextResponse.json({ deleted: true });
}
