import React, { useState, useTransition } from "react";
import { addExpenseAction } from "@/actions/expenses";
import { ExpenseCategory } from "@/types";
import type { AddExpenseModalProps } from "../AddExpenseModal";

const useExpenseModal = (props: AddExpenseModalProps) => {
  const { group, currentUserId } = props;

  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState(currentUserId);
  const [category, setCategory] = useState<ExpenseCategory>("food");

  function handleClose() {
    setOpen(false);
    setError(null);
    setSuccess(false);
    setAmount("");
    setPaidBy(currentUserId);
    setCategory("food");
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.set("groupId", group.id);
    formData.set("paidBy", paidBy);
    formData.set("splitType", "equal");
    formData.set("category", category);
    startTransition(async () => {
      const result = await addExpenseAction(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        setTimeout(handleClose, 1200);
      }
    });
  }

  return {
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
  };
};

export default useExpenseModal;
