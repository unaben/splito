import { Dispatch, SetStateAction, TransitionStartFunction } from "react";
import { updateMemberAction } from "@/actions/members";
import type { User } from "@/types";

type HandleSubmitEditMemberFormArg = {
  setError: Dispatch<SetStateAction<string | null>>;
  avatarBg: string;
  avatarFg: string;
  startTransition: TransitionStartFunction;
  onSaved: () => void;
  user: User;
};

export function handleSubmitEditMemberForm(
  e: React.SyntheticEvent<HTMLFormElement>,
  arg: HandleSubmitEditMemberFormArg
) {
  e.preventDefault();

  const { avatarBg, avatarFg, onSaved, user, setError, startTransition } = arg;

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
