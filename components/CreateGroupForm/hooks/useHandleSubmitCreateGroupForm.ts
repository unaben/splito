import { useState, useTransition } from "react";
import { createGroupAction } from "@/actions/groups";
import { useRouter } from "next/navigation";

const useHandleSubmitCreateGroupForm = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [selectedEmoji, setSelectedEmoji] = useState("✈️");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  async function handleSubmitCreateGroupForm(
    e: React.SyntheticEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.set("emoji", selectedEmoji);
    selectedMembers.forEach((id) => formData.append("memberIds", id));

    startTransition(async () => {
      const result = await createGroupAction(formData);
      if (result?.error) setError(result.error);
    });
  }

  return {
    router,
    isPending,
    error,
    setSelectedEmoji,
    setSelectedMembers,
    handleSubmitCreateGroupForm,
    selectedEmoji,
    selectedMembers
  };
};

export default useHandleSubmitCreateGroupForm;
