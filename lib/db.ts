/**
 * ─────────────────────────────────────────────────────────────
 * SERVER-SIDE ONLY data access layer.
 * Talks directly to Supabase using the service role key.
 *
 * ✅ Import this in:
 *   - Server Components
 *   - Server Actions  (actions/)
 *   - API route handlers (app/api/)
 *   - lib/auth.ts
 *
 * ⛔ Never import this in:
 *   - Client Components  ('use client')
 *   - Browser-side hooks
 *
 * For client-side data fetching, use services/store.ts instead,
 * which calls your API routes over HTTP.
 * ─────────────────────────────────────────────────────────────
 */

import { supabase } from "@/lib/supabase";
import { now, assert } from "@/helper";
import type {
  User,
  Group,
  Expense,
  Settlement,
  ExpenseRow,
  GroupRow,
  SettlementRow,
  UserRow,
} from "@/types";

// ─── Row → App type mappers ────────────────────────────────────

function toUser(row: UserRow): User {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    avatarInitials: row.avatar_initials,
    avatarBg: row.avatar_bg,
    avatarFg: row.avatar_fg,
    isSeeded: row.is_seeded,
    passwordHash: row.password_hash ?? undefined,
  };
}

function toGroup(row: GroupRow): Group {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? undefined,
    emoji: row.emoji,
    createdBy: row.created_by,
    createdAt: row.created_at,
    memberIds: row.group_members.map((m) => m.user_id),
  };
}

function toExpense(row: ExpenseRow): Expense {
  return {
    id: row.id,
    groupId: row.group_id,
    paidBy: row.paid_by,
    description: row.description,
    amountPence: row.amount_pence,
    splitType: row.split_type as Expense["splitType"],
    category: row.category as Expense["category"],
    createdAt: row.created_at,
    splits: row.expense_splits.map((s) => ({
      userId: s.user_id,
      amountPence: s.amount_pence,
      isSettled: s.is_settled,
    })),
  };
}

function toSettlement(row: SettlementRow): Settlement {
  return {
    id: row.id,
    groupId: row.group_id,
    payerId: row.payer_id,
    payeeId: row.payee_id,
    amountPence: row.amount_pence,
    status: row.status as Settlement["status"],
    mockPaymentId: row.mock_payment_id ?? undefined,
    createdAt: row.created_at,
    settledAt: row.settled_at ?? undefined,
  };
}

// ─── User queries ──────────────────────────────────────────────

export async function getUser(id: string): Promise<User | undefined> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return undefined;
  return toUser(data);
}

export async function findOneUserByEmail(
  email: string
): Promise<
  Pick<User, "id" | "name" | "email" | "isSeeded" | "passwordHash"> | undefined
> {
  const { data, error } = await supabase
    .from("users")
    .select("id, name, email, password_hash, is_seeded")
    .ilike("email", email)
    .single();

  if (error || !data) return undefined;

  return {
    id: data.id,
    name: data.name,
    email: data.email,
    isSeeded: data.is_seeded,
    passwordHash: data.password_hash ?? undefined,
  };
}

export async function getUsersByIds(ids: string[]): Promise<User[]> {
  if (ids.length === 0) return [];
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .in("id", ids);

  return assert(data, error, "getUsersByIds").map((r) => toUser(r as UserRow));
}

export async function getAllUsers(): Promise<User[]> {
  const { data, error } = await supabase.from("users").select("*").order("id");

  return assert(data, error, "getAllUsers").map((r) => toUser(r as UserRow));
}

export async function createUser(
  data: Omit<User, "id"> & { id: string }
): Promise<User> {
  const { data: row, error } = await supabase
    .from("users")
    .insert({
      id: data.id,
      email: data.email,
      name: data.name,
      avatar_initials: data.avatarInitials,
      avatar_bg: data.avatarBg,
      avatar_fg: data.avatarFg,
      is_seeded: data.isSeeded,
      password_hash: data.passwordHash ?? null,
    })
    .select("*")
    .single();

  return toUser(assert(row, error, "createUser") as UserRow);
}

export async function updateUser(
  id: string,
  data: Partial<
    Pick<
      User,
      | "name"
      | "email"
      | "avatarInitials"
      | "avatarBg"
      | "avatarFg"
      | "isSeeded"
      | "passwordHash"
    >
  >
): Promise<User | undefined> {
  const { data: row, error } = await supabase
    .from("users")
    .update({
      ...(data.name !== undefined && { name: data.name }),
      ...(data.email !== undefined && { email: data.email }),
      ...(data.avatarInitials !== undefined && {
        avatar_initials: data.avatarInitials,
      }),
      ...(data.avatarBg !== undefined && { avatar_bg: data.avatarBg }),
      ...(data.avatarFg !== undefined && { avatar_fg: data.avatarFg }),
      ...(data.isSeeded !== undefined && { is_seeded: data.isSeeded }),
      ...(data.passwordHash !== undefined && {
        password_hash: data.passwordHash,
      }),
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error || !row) return undefined;
  return toUser(row);
}

// ─── Group queries ─────────────────────────────────────────────

export async function getGroups(userId: string): Promise<Group[]> {
  // Step 1: get group IDs this user belongs to
  const { data: memberships, error: memberError } = await supabase
    .from("group_members")
    .select("group_id")
    .eq("user_id", userId);

  if (memberError || !memberships || memberships.length === 0) return [];

  const groupIds = memberships.map((m) => m.group_id);

  // Step 2: fetch those groups with ALL their members
  const { data, error } = await supabase
    .from("groups")
    .select("*, group_members(user_id)")
    .in("id", groupIds)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    name: row.name,
    description: row.description ?? undefined,
    emoji: row.emoji,
    createdBy: row.created_by,
    createdAt: row.created_at,
    memberIds: row.group_members.map((m: { user_id: string }) => m.user_id),
  }));
}

export async function getGroup(id: string): Promise<Group | undefined> {
  const { data, error } = await supabase
    .from("groups")
    .select("*, group_members(user_id)")
    .eq("id", id)
    .single();

  if (error || !data) return undefined;
  return toGroup(data as GroupRow);
}

export async function createGroup(data: {
  id: string;
  name: string;
  description?: string;
  emoji: string;
  createdBy: string;
  memberIds: string[];
  createdAt: string;
}): Promise<Group> {
  // Insert group row
  const { error: groupError } = await supabase.from("groups").insert({
    id: data.id,
    name: data.name,
    description: data.description ?? null,
    emoji: data.emoji,
    created_by: data.createdBy,
    created_at: data.createdAt,
  });

  if (groupError) throw new Error(`[db/createGroup] ${groupError.message}`);

  // Insert one row per member into group_members
  const memberRows = data.memberIds.map((userId) => ({
    group_id: data.id,
    user_id: userId,
  }));

  const { error: membersError } = await supabase
    .from("group_members")
    .insert(memberRows);

  if (membersError)
    throw new Error(`[db/createGroup members] ${membersError.message}`);

  return {
    id: data.id,
    name: data.name,
    description: data.description,
    emoji: data.emoji,
    createdBy: data.createdBy,
    createdAt: data.createdAt,
    memberIds: data.memberIds,
  };
}

export async function updateGroup(
  id: string,
  data: Partial<Pick<Group, "name" | "description" | "emoji" | "memberIds">>
): Promise<Group | undefined> {
  const hasScalarChanges =
    data.name !== undefined ||
    data.description !== undefined ||
    data.emoji !== undefined;

  if (hasScalarChanges) {
    const { error } = await supabase
      .from("groups")
      .update({
        ...(data.name !== undefined && { name: data.name }),
        ...(data.description !== undefined && {
          description: data.description,
        }),
        ...(data.emoji !== undefined && { emoji: data.emoji }),
      })
      .eq("id", id);
    if (error) return undefined;
  }

  if (data.memberIds !== undefined) {
    await supabase.from("group_members").delete().eq("group_id", id);
    await supabase
      .from("group_members")
      .insert(
        data.memberIds.map((userId) => ({ group_id: id, user_id: userId }))
      );
  }

  return getGroup(id);
}

export async function deleteGroup(id: string): Promise<boolean> {
  // Cascade deletes handle group_members, expenses, expense_splits, settlements
  const { error } = await supabase.from("groups").delete().eq("id", id);

  return !error;
}

// ─── Expense queries ───────────────────────────────────────────

export async function getExpenses(groupId: string): Promise<Expense[]> {
  const { data, error } = await supabase
    .from("expenses")
    .select("*, expense_splits(user_id, amount_pence, is_settled)")
    .eq("group_id", groupId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data.map((r) => toExpense(r as ExpenseRow));
}

export async function getExpense(id: string): Promise<Expense | undefined> {
  const { data, error } = await supabase
    .from("expenses")
    .select("*, expense_splits(user_id, amount_pence, is_settled)")
    .eq("id", id)
    .single();

  if (error || !data) return undefined;
  return toExpense(data as ExpenseRow);
}

export async function createExpense(data: {
  id: string;
  groupId: string;
  paidBy: string;
  description: string;
  amountPence: number;
  splitType: Expense["splitType"];
  category: Expense["category"];
  splits: Expense["splits"];
  createdAt: string;
}): Promise<Expense> {
  const { error: expError } = await supabase.from("expenses").insert({
    id: data.id,
    group_id: data.groupId,
    paid_by: data.paidBy,
    description: data.description,
    amount_pence: data.amountPence,
    split_type: data.splitType,
    category: data.category,
    created_at: data.createdAt,
  });

  if (expError) throw new Error(`[db/createExpense] ${expError.message}`);

  const splitRows = data.splits.map((s) => ({
    expense_id: data.id,
    user_id: s.userId,
    amount_pence: s.amountPence,
    is_settled: s.isSettled,
  }));

  const { error: splitError } = await supabase
    .from("expense_splits")
    .insert(splitRows);

  if (splitError)
    throw new Error(`[db/createExpense splits] ${splitError.message}`);

  return {
    id: data.id,
    groupId: data.groupId,
    paidBy: data.paidBy,
    description: data.description,
    amountPence: data.amountPence,
    splitType: data.splitType,
    category: data.category,
    createdAt: data.createdAt,
    splits: data.splits,
  };
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
  const hasScalarChanges =
    data.description !== undefined ||
    data.amountPence !== undefined ||
    data.splitType !== undefined ||
    data.category !== undefined;

  if (hasScalarChanges) {
    const { error } = await supabase
      .from("expenses")
      .update({
        ...(data.description !== undefined && {
          description: data.description,
        }),
        ...(data.amountPence !== undefined && {
          amount_pence: data.amountPence,
        }),
        ...(data.splitType !== undefined && { split_type: data.splitType }),
        ...(data.category !== undefined && { category: data.category }),
      })
      .eq("id", id);
    if (error) return undefined;
  }

  if (data.splits !== undefined) {
    await supabase.from("expense_splits").delete().eq("expense_id", id);
    await supabase.from("expense_splits").insert(
      data.splits.map((s) => ({
        expense_id: id,
        user_id: s.userId,
        amount_pence: s.amountPence,
        is_settled: s.isSettled,
      }))
    );
  }

  return getExpense(id);
}

export async function deleteExpense(id: string): Promise<boolean> {
  const { error } = await supabase.from("expenses").delete().eq("id", id);
  return !error;
}

// ─── Settlement queries ────────────────────────────────────────

export async function getSettlements(groupId: string): Promise<Settlement[]> {
  const { data, error } = await supabase
    .from("settlements")
    .select("*")
    .eq("group_id", groupId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data.map((r) => toSettlement(r as SettlementRow));
}

export async function createSettlement(data: {
  id: string;
  groupId: string;
  payerId: string;
  payeeId: string;
  amountPence: number;
  status: Settlement["status"];
  mockPaymentId?: string;
  createdAt: string;
  settledAt?: string;
}): Promise<Settlement> {
  const { data: row, error } = await supabase
    .from("settlements")
    .insert({
      id: data.id,
      group_id: data.groupId,
      payer_id: data.payerId,
      payee_id: data.payeeId,
      amount_pence: data.amountPence,
      status: data.status,
      mock_payment_id: data.mockPaymentId ?? null,
      created_at: data.createdAt,
      settled_at: data.settledAt ?? null,
    })
    .select("*")
    .single();

  return toSettlement(assert(row, error, "createSettlement") as SettlementRow);
}

export async function updateSettlementStatus(
  id: string,
  status: Settlement["status"]
): Promise<Settlement | undefined> {
  const { data: row, error } = await supabase
    .from("settlements")
    .update({
      status,
      settled_at: status === "completed" ? now() : null,
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error || !row) return undefined;
  return toSettlement(row as SettlementRow);
}

export async function deleteSettlement(id: string): Promise<boolean> {
  const { error } = await supabase.from("settlements").delete().eq("id", id);
  return !error;
}

// ─── Seed status ───────────────────────────────────────────────
// Used by middleware to decide whether to route to /register or /login

export async function getSeedStatus(): Promise<boolean> {
  const { data } = await supabase
    .from("users")
    .select("is_seeded")
    .eq("id", "user-1")
    .single();

  return data?.is_seeded ?? true;
}
