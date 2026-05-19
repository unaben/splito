import { Dispatch, SetStateAction, type TransitionStartFunction } from "react";
import { resetAppAction } from "@/actions/resetApp";

type HandleResetSubmitArgs = {
  setError: Dispatch<SetStateAction<string | null>>;
  startTransition: TransitionStartFunction;
  setResetDone: Dispatch<SetStateAction<boolean>>;
};

export function handleResetSubmit(
  e: React.SyntheticEvent<HTMLFormElement>,
  arg: HandleResetSubmitArgs
) {
  e.preventDefault();

  const { setError, setResetDone, startTransition } = arg;

  setError(null);

  const formData = new FormData(e.currentTarget);

  startTransition(async () => {
    const result = await resetAppAction(formData);

    if (result?.error) {
      setError(result.error);
      return;
    }

    setResetDone(true);
  });
}
