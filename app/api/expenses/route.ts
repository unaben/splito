/**
 * app/api/expenses/route.ts
 *
 * GET  /api/expenses?groupId=group-1  → expenses for a group (sorted newest first)
 * POST /api/expenses                  → create a new expense
 */

type Body = {
  groupId: string;
  paidBy: string;
  description: string;
  amountPence: number;
  splitType: Expense["splitType"];
  category: Expense["category"];
  splits: Expense["splits"];
};

import { NextRequest, NextResponse } from "next/server";
import { readDb, writeDb, uid, now } from "@/lib/db";
import { LIMITS } from "@/types";
import type { Expense } from "@/types";

export async function GET(req: NextRequest) {
  const db = await readDb();
  const groupId = req.nextUrl.searchParams.get("groupId");

  if (!groupId) {
    return NextResponse.json(
      { error: "groupId query param is required" },
      { status: 400 }
    );
  }

  const expenses = db.expenses
    .filter((e) => e.groupId === groupId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return NextResponse.json(expenses);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    groupId,
    paidBy,
    description,
    amountPence,
    splitType,
    category,
    splits,
  } = body as Body;

  if (
    !groupId ||
    !paidBy ||
    !description ||
    amountPence == null ||
    !splitType ||
    !category ||
    !Array.isArray(splits)
  ) {
    return NextResponse.json(
      {
        error:
          "groupId, paidBy, description, amountPence, splitType, category, and splits are required",
      },
      { status: 400 }
    );
  }

  const db = await readDb();

  const group = db.groups.find((g) => g.id === groupId);
  if (!group) {
    return NextResponse.json({ error: "Group not found" }, { status: 404 });
  }

  // ── Limit: max expenses per group ─────────────────────────────

  const groupExpenseCount = db.expenses.filter(
    (e) => e.groupId === groupId
  ).length;

  if (groupExpenseCount >= LIMITS.MAX_EXPENSES_PER_GROUP) {
    return NextResponse.json(
      {
        error: `This group has reached the maximum of ${LIMITS.MAX_EXPENSES_PER_GROUP} expenses.`,
      },
      { status: 422 }
    );
  }

  const expense: Expense = {
    id: `exp-${uid()}`,
    groupId,
    paidBy,
    description,
    amountPence,
    splitType,
    category,
    splits,
    createdAt: now(),
  };

  db.expenses.push(expense);
  await writeDb(db);

  return NextResponse.json(expense, { status: 201 });
}
