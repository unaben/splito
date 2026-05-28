import { useState, useTransition } from "react";
import { createGroupAction } from "@/actions/groups";
import { useRouter } from "next/navigation";
import useSessionStorage from "@/hooks/useSessionStorage";

const useHandleSubmitCreateGroupForm = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [selectedEmoji, setSelectedEmoji] = useState("✈️");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [groupName, setGroupName] = useSessionStorage("create-group:name", "");
  const [groupDescription, setGroupDescription] = useSessionStorage(
    "create-group:description",
    ""
  );

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
      if (result?.error) {
        setError(result.error);
      } else {
        setGroupName("");
        setGroupDescription("");
      }
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
    selectedMembers,
    groupName,
    setGroupName,
    groupDescription,
    setGroupDescription,
  };
};

export default useHandleSubmitCreateGroupForm;
