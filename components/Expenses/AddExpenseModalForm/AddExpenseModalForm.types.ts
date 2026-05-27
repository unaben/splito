import { Dispatch, SetStateAction } from "react";
import type { ExpenseCategory, User } from "@/types";

export type AddExpenseModalFormProps = {
  handleSubmit(e: React.SyntheticEvent<HTMLFormElement>): Promise<void>;
  amount: string;
  setAmount: Dispatch<SetStateAction<string>>;
  members: User[];
  setCategory: Dispatch<SetStateAction<ExpenseCategory>>;
  setPaidBy: Dispatch<SetStateAction<string>>;
  currentUserId: string;
  error: string | null;
  category: ExpenseCategory;
  paidBy: string;
  isPending: boolean;
  handleClose(): void;
};
