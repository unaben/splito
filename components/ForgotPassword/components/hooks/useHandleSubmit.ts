import { TransitionStartFunction, useState } from "react";
import { resetPasswordAction } from "@/actions/resetPassword";
import { resetAppAction } from "@/actions/resetApp";
import type { Step } from "../../ForgotPassword.types";

const useHandleSubmit = () => {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  function handleEmailSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const value = (
      e.currentTarget.elements.namedItem("email") as HTMLInputElement
    ).value.trim();
    if (!value) return;
    setEmail(value);
    setStep("password");
  }

  function handlePasswordSubmit(
    e: React.SyntheticEvent<HTMLFormElement>,
    startTransition: TransitionStartFunction
  ) {
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

  function handleResetSubmit(
    e: React.SyntheticEvent<HTMLFormElement>,
    startTransition: TransitionStartFunction
  ) {
    e.preventDefault();

    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.set("email", email);    

    startTransition(async () => {
      const result = await resetAppAction(formData);

      if (result?.error) {
        setError(result.error);
        return;
      }

      setResetDone(true);
    });
  }
  return {
    handleEmailSubmit,
    handlePasswordSubmit,
    handleResetSubmit,
    resetDone,
    setResetDone,
    success,
    setSuccess,
    error,
    setError,
    email,
    setEmail,
    step,
    setStep,
  };
};

export default useHandleSubmit;
