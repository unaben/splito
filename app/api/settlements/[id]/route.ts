/**
 * app/api/settlements/[id]/route.ts
 *
 * GET    /api/settlements/:id  → single settlement
 * PATCH  /api/settlements/:id  → update status (pending → completed)
 * DELETE /api/settlements/:id  → remove settlement
 */

import { NextRequest, NextResponse } from "next/server";
import { readDb, writeDb, now } from "@/lib/db";
import type { Params, Settlement } from "@/types";



export async function GET(_req: NextRequest, { params }: Params) {
  const db = await readDb();
  const { id } = await params;
  const settlement = db.settlements.find((s) => s.id === id);

  if (!settlement) {
    return NextResponse.json(
      { error: "Settlement not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(settlement);
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const db = await readDb();
  const { id } = await params;
  const idx = db.settlements.findIndex((s) => s.id === id);

  if (idx === -1) {
    return NextResponse.json(
      { error: "Settlement not found" },
      { status: 404 }
    );
  }

  const body = (await req.json()) as { status: Settlement["status"] };

  if (!body.status) {
    return NextResponse.json({ error: "status is required" }, { status: 400 });
  }

  db.settlements[idx] = {
    ...db.settlements[idx],
    status: body.status,
    settledAt: body.status === "completed" ? now() : undefined,
  };

  await writeDb(db);

  return NextResponse.json(db.settlements[idx]);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const db = await readDb();
  const { id } = await params;
  const idx = db.settlements.findIndex((s) => s.id === id);

  if (idx === -1) {
    return NextResponse.json(
      { error: "Settlement not found" },
      { status: 404 }
    );
  }

  db.settlements.splice(idx, 1);
  await writeDb(db);

  return NextResponse.json({ deleted: true });
}
