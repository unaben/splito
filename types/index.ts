export interface User {
  id: string;
  email: string;
  name: string;
  avatarInitials: string;
  avatarBg: string;
  avatarFg: string;
  isSeeded: boolean;
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

export const LIMITS = {
  MAX_GROUPS_PER_USER: 10,
  MAX_MEMBERS_PER_GROUP: 10,
  MAX_EXPENSES_PER_GROUP: 50,
} as const;

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
