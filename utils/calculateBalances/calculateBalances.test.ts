import type { Expense, Settlement, Balance } from "@/types";
import { calculateBalances } from "./calculateBalances";

export function makeExpense(opts: {
  id: string;
  groupId: string;
  paidBy: string;
  amount: number;
  memberIds: string[];
  settledIds?: string[];
  category?: Expense["category"];
}): Expense {
  const {
    id,
    groupId,
    paidBy,
    amount,
    memberIds,
    settledIds = [],
    category = "other",
  } = opts;
  const share = Math.round(amount / memberIds.length);
  return {
    id,
    groupId,
    paidBy,
    description: "test expense",
    amountPence: amount,
    splitType: "equal",
    category,
    createdAt: "2025-01-01T00:00:00Z",
    splits: memberIds.map((userId, idx) => ({
      userId,
      amountPence:
        idx === memberIds.length - 1
          ? amount - share * (memberIds.length - 1)
          : share,
      isSettled: settledIds.includes(userId),
    })),
  };
}

export function makeSettlement(opts: {
  id: string;
  groupId: string;
  payerId: string;
  payeeId: string;
  amount: number;
  status?: Settlement["status"];
}): Settlement {
  const { id, groupId, payerId, payeeId, amount, status = "completed" } = opts;
  return {
    id,
    groupId,
    payerId,
    payeeId,
    amountPence: amount,
    status,
    createdAt: "2025-01-02T00:00:00Z",
    settledAt: status === "completed" ? "2025-01-02T00:00:05Z" : undefined,
  };
}

function bal(balances: Balance[], userId: string): number {
  return balances.find((b) => b.userId === userId)?.amountPence ?? NaN;
}

describe("calculateBalances", () => {
  it("empty group returns zero for all members", () => {
    const result = calculateBalances([], [], ["alice", "bob"]);
    expect(bal(result, "alice")).toBe(0);
    expect(bal(result, "bob")).toBe(0);
  });

  it("2-person split: payer owed, other owes", () => {
    const expense = makeExpense({
      id: "e1",
      groupId: "g1",
      paidBy: "alice",
      amount: 6000,
      memberIds: ["alice", "bob"],
      settledIds: ["alice"],
    });
    const result = calculateBalances([expense], [], ["alice", "bob"]);
    expect(bal(result, "alice")).toBe(3000);
    expect(bal(result, "bob")).toBe(-3000);
  });

  it("balances always sum to zero", () => {
    const expense = makeExpense({
      id: "e1",
      groupId: "g1",
      paidBy: "alice",
      amount: 9000,
      memberIds: ["alice", "bob", "carol"],
      settledIds: ["alice"],
    });
    const result = calculateBalances([expense], [], ["alice", "bob", "carol"]);
    const total = result.reduce((sum, b) => sum + b.amountPence, 0);
    expect(total).toBe(0);
  });

  it("payer credited even when their own split is isSettled:true", () => {
    const expense = makeExpense({
      id: "e1",
      groupId: "g1",
      paidBy: "sarah",
      amount: 24000,
      memberIds: ["sarah", "frank", "bob", "carol", "dave"],
      settledIds: ["sarah"],
    });
    const result = calculateBalances(
      [expense],
      [],
      ["sarah", "frank", "bob", "carol", "dave"]
    );
    expect(bal(result, "sarah")).toBe(19200);
    expect(bal(result, "frank")).toBe(-4800);
    expect(bal(result, "bob")).toBe(-4800);
  });

  it("settled splits excluded from calculation", () => {
    const expense = makeExpense({
      id: "e1",
      groupId: "g1",
      paidBy: "alice",
      amount: 9000,
      memberIds: ["alice", "bob", "carol"],
      settledIds: ["alice", "bob"],
    });
    const result = calculateBalances([expense], [], ["alice", "bob", "carol"]);
    expect(bal(result, "alice")).toBe(3000);
    expect(bal(result, "bob")).toBe(0);
    expect(bal(result, "carol")).toBe(-3000);
  });

  it("multiple expenses accumulate", () => {
    const e1 = makeExpense({
      id: "e1",
      groupId: "g1",
      paidBy: "alice",
      amount: 9000,
      memberIds: ["alice", "bob", "carol"],
      settledIds: ["alice"],
    });
    const e2 = makeExpense({
      id: "e2",
      groupId: "g1",
      paidBy: "bob",
      amount: 6000,
      memberIds: ["alice", "bob", "carol"],
      settledIds: ["bob"],
    });
    const result = calculateBalances([e1, e2], [], ["alice", "bob", "carol"]);
    expect(bal(result, "alice")).toBe(4000);
    expect(bal(result, "bob")).toBe(1000);
    expect(bal(result, "carol")).toBe(-5000);
  });

  it("completed settlement clears both sides", () => {
    const expense = makeExpense({
      id: "e1",
      groupId: "g1",
      paidBy: "alice",
      amount: 6000,
      memberIds: ["alice", "bob"],
      settledIds: ["alice"],
    });
    const settlement = makeSettlement({
      id: "s1",
      groupId: "g1",
      payerId: "bob",
      payeeId: "alice",
      amount: 3000,
    });
    const result = calculateBalances([expense], [settlement], ["alice", "bob"]);
    expect(bal(result, "alice")).toBe(0);
    expect(bal(result, "bob")).toBe(0);
  });

  it("pending settlement has no effect", () => {
    const expense = makeExpense({
      id: "e1",
      groupId: "g1",
      paidBy: "alice",
      amount: 6000,
      memberIds: ["alice", "bob"],
      settledIds: ["alice"],
    });
    const settlement = makeSettlement({
      id: "s1",
      groupId: "g1",
      payerId: "bob",
      payeeId: "alice",
      amount: 3000,
      status: "pending",
    });
    const result = calculateBalances([expense], [settlement], ["alice", "bob"]);
    expect(bal(result, "alice")).toBe(3000);
    expect(bal(result, "bob")).toBe(-3000);
  });

  it("users outside memberIds are ignored", () => {
    const expense: Expense = {
      id: "e1",
      groupId: "g1",
      paidBy: "alice",
      description: "test",
      amountPence: 6000,
      splitType: "equal",
      category: "other",
      createdAt: "2025-01-01T00:00:00Z",
      splits: [
        { userId: "alice", amountPence: 3000, isSettled: true },
        { userId: "outsider", amountPence: 3000, isSettled: false },
      ],
    };
    const result = calculateBalances([expense], [], ["alice", "bob"]);
    expect(result.find((b) => b.userId === "outsider")).toBeUndefined();
  });
});
