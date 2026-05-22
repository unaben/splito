/**
 * app/api/expenses/route.ts
 *
 * GET  /api/expenses?groupId=group-1  → expenses for a group (sorted newest first)
 * POST /api/expenses                  → create a new expense
 */

import { NextRequest, NextResponse } from "next/server";
import { getExpenses, getGroup, createExpense } from "@/lib/db";
import { uid, now } from "@/helper";
import { LIMITS } from "@/constants";
import type { Expense } from "@/types";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const groupId = searchParams.get("groupId");
  if (!groupId)
    return NextResponse.json({ error: "groupId is required" }, { status: 400 });

  const expenses = await getExpenses(groupId);
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
  } = body as {
    groupId: string;
    paidBy: string;
    description: string;
    amountPence: number;
    splitType: Expense["splitType"];
    category: Expense["category"];
    splits: Expense["splits"];
  };

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
      { error: "All fields are required" },
      { status: 400 }
    );
  }

  const group = await getGroup(groupId);
  if (!group)
    return NextResponse.json({ error: "Group not found" }, { status: 404 });

  // Limit: max expenses per group
  const existing = await getExpenses(groupId);
  if (existing.length >= LIMITS.MAX_EXPENSES_PER_GROUP) {
    return NextResponse.json(
      {
        error: `Maximum of ${LIMITS.MAX_EXPENSES_PER_GROUP} expenses per group.`,
      },
      { status: 422 }
    );
  }

  const expense = await createExpense({
    id: `exp-${uid()}`,
    groupId,
    paidBy,
    description,
    amountPence,
    splitType,
    category,
    splits,
    createdAt: now(),
  });

  return NextResponse.json(expense, { status: 201 });
}
