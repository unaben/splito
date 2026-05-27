import Link from "next/link";
import cn from "classnames";
import { getGroup, getUsersByIds, getExpenses, getSettlements } from "@/lib/db";
import { getCurrentUserId } from "@/lib/mockAuth";
import { calculateBalances, simplifyDebts, formatPence } from "@/utils";
import { notFound } from "next/navigation";
import { AvatarStack } from "../Avatar";
import { AddExpenseModal } from "../Expenses/AddExpenseModal";
import { ExpenseList } from "../Expenses/ExpenseList";
import BalanceTab from "./components/BalanceTab";
import ActivityTab from "./components/ActivityTab";
import OwnerBalanceView from "./components/OwnerBalanceView";
import type { GroupsProps } from "./Groups.types";
import styles from "./Groups.module.css";

const tabOptions = ["balances", "expenses", "activity"] as const;

const Groups = async ({ id, searchParamsTab }: GroupsProps) => {
  const group = await getGroup(id);

  if (!group) notFound();

  const currentUserId = await getCurrentUserId();
  const tab = searchParamsTab ?? "balances";

  const [members, expenses, settlements] = await Promise.all([
    getUsersByIds(group.memberIds),
    getExpenses(group.id),
    getSettlements(group.id),
  ]);

  const balances = calculateBalances(expenses, settlements, group.memberIds);
  const debts = simplifyDebts(balances);

  const totalSpent = expenses.reduce((sum, e) => sum + e.amountPence, 0);

  return (
    <main className={styles.main}>
      <div>
        <Link href="/dashboard" className={styles.backLink}>
          ← Dashboard
        </Link>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.groupEmoji}>{group.emoji}</span>
            <div>
              <h1 className={styles.groupName}>{group.name}</h1>
              {group.description && (
                <p className={styles.groupDesc}>{group.description}</p>
              )}
            </div>
          </div>
          <AddExpenseModal
            group={group}
            members={members}
            currentUserId={currentUserId}
          />
        </div>
      </div>

      <div className={styles.statsRow}>
        <AvatarStack users={members} max={6} />
        <span className={styles.statText}>{members.length} members</span>
        <span className={styles.statDivider}>|</span>
        <span className={styles.statText}>{expenses.length} expenses</span>
        <span className={styles.statDivider}>|</span>
        <span className={styles.statTextBold}>
          {formatPence(totalSpent)} total spent
        </span>
      </div>

      <OwnerBalanceView
        balances={balances}
        currentUserId={currentUserId}
        debts={debts}
        expenses={expenses}
        group={group}
        members={members}
      />

      <div className={styles.tabs}>
        {tabOptions.map((option) => (
          <Link
            key={option}
            href={`/groups/${group.id}?tab=${option}`}
            className={cn(styles.tab, { [styles.tabActive]: tab === option })}
          >
            {option}
          </Link>
        ))}
      </div>

      {tab === "balances" && (
        <BalanceTab
          balances={balances}
          currentUserId={currentUserId}
          debts={debts}
          members={members}
        />
      )}

      {tab === "expenses" && (
        <ExpenseList
          expenses={expenses}
          members={members}
          currentUserId={currentUserId}
          groupId={group.id}
        />
      )}

      {tab === "activity" && (
        <ActivityTab
          currentUserId={currentUserId}
          members={members}
          expenses={expenses}
          settlements={settlements}
        />
      )}
    </main>
  );
};

export default Groups;
