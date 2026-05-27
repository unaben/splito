"use client";

import type { AddExpenseModalProps } from "./AddExpenseModal.types";
import { AddExpenseForm } from "../AddExpenseModalForm";
import useExpenseModal from "../hooks/useExpenseModal";
import CloseSvg from "@/components/Icon/CloseSvg";
import styles from "./AddExpenseModal.module.css";

export function AddExpenseModal(props: AddExpenseModalProps) {
  const { members, currentUserId } = props;

  const {
    handleClose,
    handleSubmit,
    open,
    isPending,
    error,
    success,
    amount,
    setAmount,
    paidBy,
    category,
    setCategory,
    setOpen,
    setPaidBy,
  } = useExpenseModal(props);

  return (
    <>
      <button onClick={() => setOpen(true)} className={styles.trigger}>
        + Add expense
      </button>
      {open && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <div className={styles.header}>
              <h2 className={styles.headerTitle}>Add expense</h2>
              <button onClick={handleClose} className={styles.closeBtn}>
                <CloseSvg />
              </button>
            </div>

            {success ? (
              <div className={styles.successState}>
                <span className={styles.successIcon}>✓</span>
                <p className={styles.successText}>Expense added!</p>
              </div>
            ) : (
              <AddExpenseForm
                {...{
                  amount,
                  currentUserId,
                  error,
                  handleSubmit,
                  members,
                  setAmount,
                  setCategory,
                  setPaidBy,
                  category,
                  handleClose,
                  isPending,
                  paidBy,
                }}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
