/**
 * app/api/settlements/route.ts
 *
 * GET  /api/settlements?groupId=group-2  → settlements for a group (sorted newest first)
 * POST /api/settlements                  → create a new settlement
 */

import { NextRequest, NextResponse } from "next/server";
import { getSettlements, createSettlement } from "@/lib/db";
import { uid, now } from "@/helper";
import type { Settlement } from "@/types";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const groupId = searchParams.get("groupId");
  if (!groupId)
    return NextResponse.json({ error: "groupId is required" }, { status: 400 });

  const settlements = await getSettlements(groupId);
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
      { error: "All fields are required" },
      { status: 400 }
    );
  }

  const createdAt = now();
  const settlement = await createSettlement({
    id: `settle-${uid()}`,
    groupId,
    payerId,
    payeeId,
    amountPence,
    status,
    mockPaymentId,
    createdAt,
    settledAt: status === "completed" ? createdAt : undefined,
  });

  return NextResponse.json(settlement, { status: 201 });
}
