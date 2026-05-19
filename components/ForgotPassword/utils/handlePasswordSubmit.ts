import { Dispatch, SetStateAction, type TransitionStartFunction } from "react";
import { resetPasswordAction } from "@/actions/resetPassword";
import type { Step } from "..";

type HandlePasswordSubmitArgs = {
  setError: Dispatch<SetStateAction<string | null>>;
  email: string;
  startTransition: TransitionStartFunction;
  setStep: Dispatch<SetStateAction<Step>>;
  setEmail: Dispatch<SetStateAction<string>>;
  setSuccess: Dispatch<SetStateAction<boolean>>;
};

export function handlePasswordSubmit(
  e: React.SyntheticEvent<HTMLFormElement>,
  arg: HandlePasswordSubmitArgs
) {
  const {
    email,
    setEmail,
    setError,
    setStep,
    setSuccess,
    startTransition,
  } = arg;

  e.preventDefault();
  setError(null);

  const formData = new FormData(e.currentTarget);
  formData.set("email", email);

  startTransition(async () => {
    const result = await resetPasswordAction(formData);

    if (result?.error) {
      if (result.error.toLowerCase().includes("email")) {
        setStep("email");
        setEmail("");
      }
      setError(result.error);
      return;
    }

    setSuccess(true);
  });
}
