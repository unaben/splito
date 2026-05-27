import type { Expense, Settlement } from "@/types";

export type GroupsProps = {
  id: string;
  searchParamsTab: string | string[] | undefined;
};

export type ActivityItem =
  | (Expense & { kind: "expense" })
  | (Settlement & { kind: "settlement" });
