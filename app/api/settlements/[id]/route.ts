/**
 * app/api/settlements/[id]/route.ts
 *
 * GET    /api/settlements/:id  → single settlement
 * PATCH  /api/settlements/:id  → update status (pending → completed)
 * DELETE /api/settlements/:id  → remove settlement
 */

import { NextRequest, NextResponse } from "next/server";
import { updateSettlementStatus, deleteSettlement } from "@/lib/db";
import type { Params, Settlement } from "@/types";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const { status } = (await req.json()) as { status: Settlement["status"] };
  if (!status)
    return NextResponse.json({ error: "status is required" }, { status: 400 });

  const settlement = await updateSettlementStatus(id, status);
  if (!settlement)
    return NextResponse.json(
      { error: "Settlement not found" },
      { status: 404 }
    );
  return NextResponse.json(settlement);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const ok = await deleteSettlement(id);
  if (!ok)
    return NextResponse.json(
      { error: "Settlement not found" },
      { status: 404 }
    );
  return NextResponse.json({ deleted: true });
}
