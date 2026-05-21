/**
 * app/api/settlements/route.ts
 *
 * GET  /api/settlements?groupId=group-2  → settlements for a group (sorted newest first)
 * POST /api/settlements                  → create a new settlement
 */

import { NextRequest, NextResponse } from "next/server";
import { readDb, writeDb, uid, now } from "@/lib/db";
import type { Settlement } from "@/types";

export async function GET(req: NextRequest) {
  const db = await readDb();
  const groupId = req.nextUrl.searchParams.get("groupId");

  if (!groupId) {
    return NextResponse.json(
      { error: "groupId query param is required" },
      { status: 400 }
    );
  }

  const settlements = db.settlements
    .filter((s) => s.groupId === groupId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return NextResponse.json(settlements);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { groupId, payerId, payeeId, amountPence, status, mockPaymentId } =
    body as {
      groupId: string;
      payerId: string;
      payeeId: string;
      amountPence: number;
      status: Settlement["status"];
      mockPaymentId?: string;
    };

  if (!groupId || !payerId || !payeeId || amountPence == null || !status) {
    return NextResponse.json(
      {
        error:
          "groupId, payerId, payeeId, amountPence, and status are required",
      },
      { status: 400 }
    );
  }

  const db = await readDb();

  // Validate group exists
  const group = db.groups.find((g) => g.id === groupId);
  if (!group) {
    return NextResponse.json({ error: "Group not found" }, { status: 404 });
  }

  const settlement: Settlement = {
    id: `settle-${uid()}`,
    groupId,
    payerId,
    payeeId,
    amountPence,
    status,
    mockPaymentId,
    createdAt: now(),
    settledAt: status === "completed" ? now() : undefined,
  };

  db.settlements.push(settlement);
  await writeDb(db);

  return NextResponse.json(settlement, { status: 201 });
}