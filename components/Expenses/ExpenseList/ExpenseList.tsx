"use client";

import cn from "classnames";
import { Avatar } from "@/components/Avatar";
import {
  formatPence,
  formatDate,
  CATEGORY_EMOJI,
  CATEGORY_LABELS,
} from "@/utils/balance/balance";
import useExpenseList from "./hooks/useExpenseList";
import { ConfirmModal } from "@/components/ConfirmModal";
import type { ExpenseListProps } from "./ExpenseList.types";
import styles from "./ExpenseList.module.css";

export function ExpenseList(props: ExpenseListProps) {
  const { expenses, currentUserId } = props;
  const {
    handleDelete,
    getMember,
    isPending,
    deletingId,
    handleCancel,
    setDeletingId,
    deleteError,
    deletingExpense,
  } = useExpenseList(props);

  if (expenses.length === 0) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyIcon}>🧾</p>
        <p className={styles.emptyText}>No expenses yet. Add the first one!</p>
      </div>
    );
  }

  if (deletingId && deletingExpense) {
    return (
      <ConfirmModal
        title="Remove expense"
        body={`Remove ${deletingExpense.description} from your expense?`}
        warning={deleteError ?? undefined}
        confirmLabel="Remove"
        isPending={isPending}
        onConfirm={handleDelete}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <ul className={styles.list}>
      {expenses.map((expense) => {
        const payer = getMember(expense.paidBy);
        const myShare = expense.splits.find((s) => s.userId === currentUserId);
        const isPayer = expense.paidBy === currentUserId;

        return (
          <li key={expense.id} className={styles.item}>
            <div className={styles.categoryIcon}>
              {CATEGORY_EMOJI[expense.category]}
            </div>

            <div className={styles.body}>
              <p className={styles.description}>{expense.description}</p>
              <p className={styles.meta}>
                {isPayer ? "You" : payer?.name} paid{" "}
                {formatPence(expense.amountPence)} ·{" "}
                {formatDate(expense.createdAt)}
              </p>
              <p className={styles.category}>
                {CATEGORY_LABELS[expense.category]}
              </p>

              <div className={styles.splits}>
                {expense.splits.map((split) => {
                  const m = getMember(split.userId);
                  if (!m) return null;
                  return (
                    <div
                      key={split.userId}
                      className={cn(styles.splitChip, {
                        [styles.splitChipSettled]: split.isSettled,
                      })}
                    >
                      <Avatar user={m} size="sm" />
                      <span>
                        {m.id === currentUserId ? "you" : m.name.split(" ")[0]}
                      </span>
                      <span>{formatPence(split.amountPence)}</span>
                      {split.isSettled && <span>✓</span>}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className={styles.actions}>
              {isPayer && myShare && (
                <span className={styles.badgePositive}>
                  lent {formatPence(expense.amountPence - myShare.amountPence)}
                </span>
              )}
              {!isPayer && myShare && !myShare.isSettled && (
                <span className={styles.badgeNegative}>
                  {formatPence(myShare.amountPence)}
                </span>
              )}
              {!isPayer && myShare?.isSettled && (
                <span className={styles.badgeNeutral}>settled ✓</span>
              )}
              <button
                onClick={() => setDeletingId(expense.id)}
                disabled={isPending}
                className={styles.deleteBtn}
              >
                {deletingId === expense.id ? "…" : "delete"}
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
