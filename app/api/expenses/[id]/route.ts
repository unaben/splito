/**
 * app/api/expenses/[id]/route.ts
 *
 * GET    /api/expenses/:id  → single expense
 * PATCH  /api/expenses/:id  → update expense (including settling individual splits)
 * DELETE /api/expenses/:id  → remove expense
 */

import { NextRequest, NextResponse } from "next/server";
import { readDb, writeDb } from "@/lib/db";
import type { Expense, Params } from "@/types";

export async function GET(_req: NextRequest, { params }: Params) {
  const db = await readDb();
  const { id } = await params;
  const expense = db.expenses.find((e) => e.id === id);

  if (!expense) {
    return NextResponse.json({ error: "Expense not found" }, { status: 404 });
  }

  return NextResponse.json(expense);
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const db = await readDb();
  const { id } = await params;
  const idx = db.expenses.findIndex((e) => e.id === id);

  if (idx === -1) {
    return NextResponse.json({ error: "Expense not found" }, { status: 404 });
  }

  const body = (await req.json()) as Partial<
    Pick<
      Expense,
      "description" | "amountPence" | "splitType" | "category" | "splits"
    >
  >;

  db.expenses[idx] = { ...db.expenses[idx], ...body };
  await writeDb(db);

  return NextResponse.json(db.expenses[idx]);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const db = await readDb();
  const { id } = await params;
  const idx = db.expenses.findIndex((e) => e.id === id);

  if (idx === -1) {
    return NextResponse.json({ error: "Expense not found" }, { status: 404 });
  }

  db.expenses.splice(idx, 1);
  await writeDb(db);

  return NextResponse.json({ deleted: true });
}
