import { Dispatch, SetStateAction, TransitionStartFunction } from "react";
import { createGroupAction } from "@/actions/groups";

type HandleSubmitCreateGroupForm = {
  setError: Dispatch<SetStateAction<string | null>>;
  selectedEmoji: string;
  selectedMembers: string[];
  startTransition: TransitionStartFunction;
};

export async function handleSubmitCreateGroupForm(
  e: React.SyntheticEvent<HTMLFormElement>,
  arg: HandleSubmitCreateGroupForm
) {
  e.preventDefault();

  const { selectedEmoji, selectedMembers, setError, startTransition } = arg;

  setError(null);

  const formData = new FormData(e.currentTarget);
  formData.set("emoji", selectedEmoji);
  selectedMembers.forEach((id) => formData.append("memberIds", id));

  startTransition(async () => {
    const result = await createGroupAction(formData);
    if (result?.error) setError(result.error);
  });
}
