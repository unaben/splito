import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteMemberAction } from "@/actions/members";
import { MAX_MOCK_MEMBERS } from "@/constants";
import type { User } from "@/types";

const useMemberList = (members: User[]) => {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const deletingMember = members.find((m) => m.id === deletingId);
  const canAddMore = members.length < MAX_MOCK_MEMBERS;

  function handleDelete() {
    if (!deletingId) return;
    setDeleteError(null);
    startTransition(async () => {
      const result = await deleteMemberAction(deletingId);
      if (result?.error) {
        setDeleteError(result.error);
        return;
      }
      setDeletingId(null);
      router.refresh();
    });
  }

  function handleCancel() {
    setDeletingId(null);
    setDeleteError(null);
  }

  function handleSaved() {
    setEditingId(null);
    setIsAdding(false);
    router.refresh();
  }

  function handleAddClick() {
    setEditingId(null);
    setIsAdding(true);
  }
  return {
    handleAddClick,
    handleCancel,
    handleDelete,
    handleSaved,
    canAddMore,
    deletingMember,
    deletingId,
    isAdding,
    isPending,
    deleteError,
    editingId,
    setIsAdding,
    setEditingId,
    setDeletingId,
  };
};

export default useMemberList;
