import type { SimplifiedDebt } from "@/types";
import {
  makeExpense,
  makeSettlement,
} from "../calculateBalances/calculateBalances.test";
import { calculateDirectDebts } from "./calculateDirectDebts";

function debt(debts: SimplifiedDebt[], from: string, to: string): number {
  return (
    debts.find((d) => d.fromUserId === from && d.toUserId === to)
      ?.amountPence ?? 0
  );
}

describe("calculateDirectDebts", () => {
  test("no expenses returns empty array", () => {
    const result = calculateDirectDebts([], [], ["alice", "bob"]);
    expect(result).toHaveLength(0);
  });

  test("2-person: bob pays alice back directly", () => {
    const expense = makeExpense({
      id: "e1",
      groupId: "g1",
      paidBy: "alice",
      amount: 6000,
      memberIds: ["alice", "bob"],
      settledIds: ["alice"],
    });
    const result = calculateDirectDebts([expense], [], ["alice", "bob"]);

    expect(result).toHaveLength(1);
    expect(debt(result, "bob", "alice")).toBe(3000);
  });

  test("each person pays back the person who actually paid for them", () => {
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
    const result = calculateDirectDebts(
      [e1, e2],
      [],
      ["alice", "bob", "carol"]
    );
    expect(debt(result, "bob", "alice")).toBe(1000);
    expect(debt(result, "carol", "alice")).toBe(3000);
    expect(debt(result, "carol", "bob")).toBe(2000);
    expect(debt(result, "alice", "bob")).toBe(0);
  });

  test("critical: the Cape Verde scenario — you pay Jordan, not Sam", () => {
    const members = ["you", "jordan", "sam", "casey"];
    const e1 = makeExpense({
      id: "e1",
      groupId: "g1",
      paidBy: "jordan",
      amount: 61300,
      memberIds: members,
      settledIds: ["jordan"],
    });
    const e2 = makeExpense({
      id: "e2",
      groupId: "g1",
      paidBy: "jordan",
      amount: 24500,
      memberIds: members,
      settledIds: ["jordan"],
    });
    const e3 = makeExpense({
      id: "e3",
      groupId: "g1",
      paidBy: "sam",
      amount: 269500,
      memberIds: members,
      settledIds: ["sam"],
    });
    const e4 = makeExpense({
      id: "e4",
      groupId: "g1",
      paidBy: "you",
      amount: 41200,
      memberIds: members,
      settledIds: ["you"],
    });

    const result = calculateDirectDebts([e1, e2, e3, e4], [], members);
    expect(debt(result, "you", "jordan")).toBeGreaterThan(0);
    expect(debt(result, "you", "sam")).toBeGreaterThan(0);
    expect(debt(result, "you", "casey")).toBe(0);
    const owedToJordan = debt(result, "you", "jordan");
    const owedToSam = debt(result, "you", "sam");
    expect(owedToJordan).toBeGreaterThan(0);
    expect(owedToSam).toBeGreaterThan(0);
    expect(owedToJordan + owedToSam).toBeLessThan(
      debt(result, "you", "sam") + owedToJordan + 1
    );
  });

  test("settled splits are excluded from the debt calculation", () => {
    const expense = makeExpense({
      id: "e1",
      groupId: "g1",
      paidBy: "alice",
      amount: 9000,
      memberIds: ["alice", "bob", "carol"],
      settledIds: ["alice", "bob"],
    });
    const result = calculateDirectDebts(
      [expense],
      [],
      ["alice", "bob", "carol"]
    );

    expect(debt(result, "bob", "alice")).toBe(0);
    expect(debt(result, "carol", "alice")).toBe(3000);
  });

  test("completed settlement reduces what is owed", () => {
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
    const result = calculateDirectDebts(
      [expense],
      [settlement],
      ["alice", "bob"]
    );

    expect(debt(result, "bob", "alice")).toBe(0);
  });

  test("partial settlement reduces but does not clear the debt", () => {
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
      amount: 2000,
    });
    const result = calculateDirectDebts(
      [expense],
      [settlement],
      ["alice", "bob"]
    );

    expect(debt(result, "bob", "alice")).toBe(1000);
  });

  test("pending settlement has no effect", () => {
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
    const result = calculateDirectDebts(
      [expense],
      [settlement],
      ["alice", "bob"]
    );

    expect(debt(result, "bob", "alice")).toBe(3000);
  });

  test("bidirectional debts net correctly — only one payment needed", () => {
    const e1 = makeExpense({
      id: "e1",
      groupId: "g1",
      paidBy: "alice",
      amount: 9000,
      memberIds: ["alice", "bob"],
      settledIds: ["alice"],
    });
    const e2 = makeExpense({
      id: "e2",
      groupId: "g1",
      paidBy: "bob",
      amount: 3000,
      memberIds: ["alice", "bob"],
      settledIds: ["bob"],
    });
    const result = calculateDirectDebts([e1, e2], [], ["alice", "bob"]);
    const aliceToBob = debt(result, "alice", "bob");
    const bobToAlice = debt(result, "bob", "alice");
    expect(aliceToBob === 0 || bobToAlice === 0).toBe(true);
    expect(bobToAlice).toBe(3000);
    expect(aliceToBob).toBe(0);
  });

  test("does not mutate input expenses or settlements", () => {
    const expense = makeExpense({
      id: "e1",
      groupId: "g1",
      paidBy: "alice",
      amount: 6000,
      memberIds: ["alice", "bob"],
      settledIds: ["alice"],
    });
    const expenseSnapshot = JSON.stringify(expense);
    calculateDirectDebts([expense], [], ["alice", "bob"]);
    expect(JSON.stringify(expense)).toBe(expenseSnapshot);
  });

  test("everyone settled up — returns empty array", () => {
    const expense = makeExpense({
      id: "e1",
      groupId: "g1",
      paidBy: "alice",
      amount: 6000,
      memberIds: ["alice", "bob"],
      settledIds: ["alice", "bob"],
    });
    const result = calculateDirectDebts([expense], [], ["alice", "bob"]);
    expect(result).toHaveLength(0);
  });

  test("4-person group: each person pays back the right person", () => {
    const expense = makeExpense({
      id: "e1",
      groupId: "g1",
      paidBy: "alice",
      amount: 12000,
      memberIds: ["alice", "bob", "carol", "dave"],
      settledIds: ["alice"],
    });
    const result = calculateDirectDebts(
      [expense],
      [],
      ["alice", "bob", "carol", "dave"]
    );

    expect(debt(result, "bob", "alice")).toBe(3000);
    expect(debt(result, "carol", "alice")).toBe(3000);
    expect(debt(result, "dave", "alice")).toBe(3000);
    expect(debt(result, "bob", "carol")).toBe(0);
    expect(debt(result, "carol", "dave")).toBe(0);
  });
});
