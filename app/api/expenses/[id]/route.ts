/**
 * app/api/expenses/[id]/route.ts
 *
 * GET    /api/expenses/:id  → single expense
 * PATCH  /api/expenses/:id  → update expense (including settling individual splits)
 * DELETE /api/expenses/:id  → remove expense
 */

import { NextRequest, NextResponse } from "next/server";
import { getExpense, updateExpense, deleteExpense } from "@/lib/db";
import type { Expense, Params } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const expense = await getExpense(id);
  if (!expense)
    return NextResponse.json({ error: "Expense not found" }, { status: 404 });
  return NextResponse.json(expense);
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = (await req.json()) as Partial<
    Pick<
      Expense,
      "description" | "amountPence" | "splitType" | "category" | "splits"
    >
  >;
  const expense = await updateExpense(id, body);
  if (!expense)
    return NextResponse.json({ error: "Expense not found" }, { status: 404 });
  return NextResponse.json(expense);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const ok = await deleteExpense(id);
  if (!ok)
    return NextResponse.json({ error: "Expense not found" }, { status: 404 });
  return NextResponse.json({ deleted: true });
}
