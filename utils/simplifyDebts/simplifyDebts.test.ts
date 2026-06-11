import { Balance } from "@/types";
import { calculateBalances } from "../calculateBalances/calculateBalances";
import { simplifyDebts } from "./simplifyDebts";
import { makeExpense } from "../calculateBalances/calculateBalances.test";

describe("simplifyDebts", () => {
  it("all-zero balances returns empty array", () => {
    const result = simplifyDebts([
      { userId: "alice", amountPence: 0 },
      { userId: "bob", amountPence: 0 },
    ]);
    expect(result).toHaveLength(0);
  });

  it("2-person: one payment", () => {
    const result = simplifyDebts([
      { userId: "alice", amountPence: 3000 },
      { userId: "bob", amountPence: -3000 },
    ]);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      fromUserId: "bob",
      toUserId: "alice",
      amountPence: 3000,
    });
  });

  it("3 people: at most 2 payments", () => {
    const result = simplifyDebts([
      { userId: "alice", amountPence: 6000 },
      { userId: "bob", amountPence: -3000 },
      { userId: "carol", amountPence: -3000 },
    ]);
    expect(result.length).toBeLessThanOrEqual(2);
    expect(result.every((d) => d.toUserId === "alice")).toBe(true);
    expect(result.reduce((s, d) => s + d.amountPence, 0)).toBe(6000);
  });

  it("one debtor, two creditors: debt split correctly", () => {
    const result = simplifyDebts([
      { userId: "alice", amountPence: 3000 },
      { userId: "bob", amountPence: 2000 },
      { userId: "carol", amountPence: -5000 },
    ]);
    expect(result).toHaveLength(2);
    expect(result.find((d) => d.toUserId === "alice")?.amountPence).toBe(3000);
    expect(result.find((d) => d.toUserId === "bob")?.amountPence).toBe(2000);
    expect(result.every((d) => d.fromUserId === "carol")).toBe(true);
  });

  it("applying debts nets everyone to zero", () => {
    const balances: Balance[] = [
      { userId: "alice", amountPence: 10000 },
      { userId: "bob", amountPence: 5000 },
      { userId: "carol", amountPence: -8000 },
      { userId: "dave", amountPence: -7000 },
    ];
    const debts = simplifyDebts(balances);
    const net: Record<string, number> = Object.fromEntries(
      balances.map((b) => [b.userId, b.amountPence])
    );
    debts.forEach((d) => {
      net[d.fromUserId] += d.amountPence;
      net[d.toUserId] -= d.amountPence;
    });
    Object.values(net).forEach((v) => expect(v).toBe(0));
  });

  it("does not mutate input balances", () => {
    const balances: Balance[] = [
      { userId: "alice", amountPence: 3000 },
      { userId: "bob", amountPence: -3000 },
    ];
    const snapshot = balances.map((b) => ({ ...b }));
    simplifyDebts(balances);
    expect(balances).toEqual(snapshot);
  });

  it("integration: calculateBalances → simplifyDebts", () => {
    const expense = makeExpense({
      id: "e1",
      groupId: "g1",
      paidBy: "alice",
      amount: 9000,
      memberIds: ["alice", "bob", "carol"],
      settledIds: ["alice"],
    });
    const balances = calculateBalances(
      [expense],
      [],
      ["alice", "bob", "carol"]
    );
    const debts = simplifyDebts(balances);

    expect(debts).toHaveLength(2);
    expect(debts.every((d) => d.toUserId === "alice")).toBe(true);
    expect(debts.every((d) => d.amountPence === 3000)).toBe(true);
  });
});
