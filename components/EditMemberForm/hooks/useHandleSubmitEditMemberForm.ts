import React, { useState, useTransition } from "react";
import { updateMemberAction } from "@/actions/members";
import type { EditMemberFormProps } from "../EditMemberForm.types";

type UseHandleSubmitEditMemberForm = Omit<EditMemberFormProps, "onCancel">;

const useHandleSubmitEditMemberForm = (
  props: UseHandleSubmitEditMemberForm
) => {
  const { user, onSaved } = props;
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [avatarBg, setAvatarBg] = useState(user.avatarBg);
  const [avatarFg, setAvatarFg] = useState(user.avatarFg);

  function handleSubmitEditMemberForm(
    e: React.SyntheticEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.set("avatarBg", avatarBg);
    formData.set("avatarFg", avatarFg);

    startTransition(async () => {
      const result = await updateMemberAction(user.id, formData);
      if (result?.error) {
        setError(result.error);
        return;
      }
      onSaved();
    });
  }
  return {
    handleSubmitEditMemberForm,
    isPending,
    error,
    setAvatarBg,
    setAvatarFg,
    avatarBg
  };
};

export default useHandleSubmitEditMemberForm;
