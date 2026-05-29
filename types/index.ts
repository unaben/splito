export interface User {
  id: string;
  email: string;
  name: string;
  avatarInitials: string;
  avatarBg: string;
  avatarFg: string;
  ownerId: string | null;
  onboardingComplete: boolean;
  passwordHash?: string;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  emoji: string;
  createdBy: string;
  createdAt: string;
  memberIds: string[];
}

export type SplitType = "equal" | "custom" | "percent";

export type ExpenseCategory =
  | "food"
  | "transport"
  | "accommodation"
  | "activities"
  | "shopping"
  | "utilities"
  | "flight"
  | "other";

export interface ExpenseSplit {
  userId: string;
  amountPence: number;
  isSettled: boolean;
}

export interface Expense {
  id: string;
  groupId: string;
  paidBy: string;
  description: string;
  amountPence: number;
  splitType: SplitType;
  category: ExpenseCategory;
  createdAt: string;
  splits: ExpenseSplit[];
}

export type SettlementStatus = "pending" | "completed" | "failed";

export interface Settlement {
  id: string;
  groupId: string;
  payerId: string;
  payeeId: string;
  amountPence: number;
  status: SettlementStatus;
  mockPaymentId?: string;
  createdAt: string;
  settledAt?: string;
}

export interface Balance {
  userId: string;
  amountPence: number;
}

export interface SimplifiedDebt {
  fromUserId: string;
  toUserId: string;
  amountPence: number;
}

export type Size = "sm" | "md" | "lg";
export type Variant = "primary" | "secondary" | "danger" | "ghost";
export type BadgeVariant = "positive" | "negative" | "neutral";
export type TabId = "balances" | "expenses" | "activity";
export type PaymentType = "card" | "cash";
export type SettleStep = "select" | "paying" | "success" | "failed";

export interface Db {
  users: User[];
  groups: Group[];
  expenses: Expense[];
  settlements: Settlement[];
}

export type Params = { params: Promise<{ id: string }> };

export type RecentActivity =  {
  groupName: string;
  groupEmoji: string;
  id: string;
  groupId: string;
  paidBy: string;
  description: string;
  amountPence: number;
  splitType: SplitType;
  category: ExpenseCategory;
  createdAt: string;
  splits: ExpenseSplit[];
}

// ─── Row shapes ───────────────────────────────────────────────
export interface UserRow {
  id: string;
  email: string;
  name: string;
  avatar_initials: string;
  avatar_bg: string;
  avatar_fg: string;
  owner_id: string | null;
  onboarding_complete: boolean;
  password_hash: string | null;
}
export interface GroupRow {
  id: string;
  name: string;
  description: string | null;
  emoji: string;
  created_by: string;
  created_at: string;
  group_members: { user_id: string }[];
}
export interface ExpenseRow {
  id: string;
  group_id: string;
  paid_by: string;
  description: string;
  amount_pence: number;
  split_type: string;
  category: string;
  created_at: string;
  expense_splits: {
    user_id: string;
    amount_pence: number;
    is_settled: boolean;
  }[];
}
export interface SettlementRow {
  id: string;
  group_id: string;
  payer_id: string;
  payee_id: string;
  amount_pence: number;
  status: string;
  mock_payment_id: string | null;
  created_at: string;
  settled_at: string | null;
}
