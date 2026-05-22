/**
 * ─────────────────────────────────────────────────────────────
 * CLIENT-SIDE ONLY data layer.
 * Uses fetch() to call your API routes — safe to import in
 * Client Components and browser-side hooks.
 *
 * ⛔ Never import this in:
 *   - Server Components
 *   - Server Actions
 *   - API route handlers
 *   - lib/auth.ts or lib/middleware
 *
 * For server-side code, import lib/db.ts directly.
 * ─────────────────────────────────────────────────────────────
 */

import type { User, Group, Expense, Settlement } from "@/types";
import { fetchApi } from "./fetchApi";

export async function getUser(id: string): Promise<User | undefined> {
  try {
    return await fetchApi<User>(`/api/users/${id}`);
  } catch {
    return undefined;
  }
}

export async function getUsersByIds(ids: string[]): Promise<User[]> {
  if (ids.length === 0) return [];
  return fetchApi<User[]>(`/api/users?ids=${ids.join(",")}`);
}

export async function getAllUsers(): Promise<User[]> {
  return fetchApi<User[]>("/api/users");
}

export async function createUser(data: Omit<User, "id">): Promise<User> {
  return fetchApi<User>("/api/users", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateUser(
  id: string,
  data: Partial<
    Pick<User, "name" | "email" | "avatarInitials" | "avatarBg" | "avatarFg">
  >
): Promise<User | undefined> {
  try {
    return await fetchApi<User>(`/api/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  } catch {
    return undefined;
  }
}

export async function deleteUser(id: string): Promise<boolean> {
  try {
    await fetchApi<{ deleted: boolean }>(`/api/users/${id}`, {
      method: "DELETE",
    });
    return true;
  } catch {
    return false;
  }
}

// ─── Group queries ────────────────────────────────────────────────────────────

export async function getGroups(userId: string): Promise<Group[]> {
  return fetchApi<Group[]>(`/api/groups?userId=${userId}`);
}

export async function getGroup(id: string): Promise<Group | undefined> {
  try {
    return await fetchApi<Group>(`/api/groups/${id}`);
  } catch {
    return undefined;
  }
}

export async function createGroup(data: {
  name: string;
  description?: string;
  emoji: string;
  createdBy: string;
  memberIds: string[];
}): Promise<Group> {
  return fetchApi<Group>("/api/groups", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateGroup(
  id: string,
  data: Partial<Pick<Group, "name" | "description" | "emoji" | "memberIds">>
): Promise<Group | undefined> {
  try {
    return await fetchApi<Group>(`/api/groups/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  } catch {
    return undefined;
  }
}

export async function deleteGroup(id: string): Promise<boolean> {
  try {
    await fetchApi<{ deleted: boolean }>(`/api/groups/${id}`, {
      method: "DELETE",
    });
    return true;
  } catch {
    return false;
  }
}

// ─── Expense queries ──────────────────────────────────────────────────────────

export async function getExpenses(groupId: string): Promise<Expense[]> {
  return fetchApi<Expense[]>(`/api/expenses?groupId=${groupId}`);
}

export async function getExpense(id: string): Promise<Expense | undefined> {
  try {
    return await fetchApi<Expense>(`/api/expenses/${id}`);
  } catch {
    return undefined;
  }
}

export async function createExpense(data: {
  groupId: string;
  paidBy: string;
  description: string;
  amountPence: number;
  splitType: Expense["splitType"];
  category: Expense["category"];
  splits: Expense["splits"];
}): Promise<Expense> {
  return fetchApi<Expense>("/api/expenses", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateExpense(
  id: string,
  data: Partial<
    Pick<
      Expense,
      "description" | "amountPence" | "splitType" | "category" | "splits"
    >
  >
): Promise<Expense | undefined> {
  try {
    return await fetchApi<Expense>(`/api/expenses/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  } catch {
    return undefined;
  }
}

export async function deleteExpense(id: string): Promise<boolean> {
  try {
    await fetchApi<{ deleted: boolean }>(`/api/expenses/${id}`, {
      method: "DELETE",
    });
    return true;
  } catch {
    return false;
  }
}

// ─── Settlement queries ───────────────────────────────────────────────────────

export async function getSettlements(groupId: string): Promise<Settlement[]> {
  return fetchApi<Settlement[]>(`/api/settlements?groupId=${groupId}`);
}

export async function getSettlement(
  id: string
): Promise<Settlement | undefined> {
  try {
    return await fetchApi<Settlement>(`/api/settlements/${id}`);
  } catch {
    return undefined;
  }
}

export async function createSettlement(data: {
  groupId: string;
  payerId: string;
  payeeId: string;
  amountPence: number;
  status: Settlement["status"];
  mockPaymentId?: string;
}): Promise<Settlement> {
  return fetchApi<Settlement>("/api/settlements", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateSettlementStatus(
  id: string,
  status: Settlement["status"]
): Promise<Settlement | undefined> {
  try {
    return await fetchApi<Settlement>(`/api/settlements/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  } catch {
    return undefined;
  }
}

export async function deleteSettlement(id: string): Promise<boolean> {
  try {
    await fetchApi<{ deleted: boolean }>(`/api/settlements/${id}`, {
      method: "DELETE",
    });
    return true;
  } catch {
    return false;
  }
}


