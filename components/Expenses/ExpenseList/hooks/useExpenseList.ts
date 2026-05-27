import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteExpenseAction } from "@/actions/expenses";
import type { ExpenseListProps } from "../ExpenseList.types";

const useExpenseList = (props: ExpenseListProps) => {
  const { members, groupId, expenses, } = props;
  const router = useRouter();
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function getMember(id: string) {
    return members.find((m) => m.id === id);
  }

  const deletingExpense = expenses.find((expense) => expense.id === deletingId);

  function handleDelete() {
    if (!deletingId) return;
    setDeleteError(null);
    startTransition(async () => {
      const result = await deleteExpenseAction(deletingId, groupId);
      if (result?.error) {
        setDeleteError(result.error);
        return;
      }
      setDeletingId(null);
      router.refresh();
    });
  }

  const handleCancel = () => {
    setDeletingId(null)
    setDeleteError(null)
  };
  return {
    handleDelete,
    getMember,
    isPending,
    deletingId,
    setDeletingId,
    handleCancel,
    deleteError,
    deletingExpense
  };
};

export default useExpenseList;
