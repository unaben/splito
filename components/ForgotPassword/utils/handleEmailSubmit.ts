import { Dispatch, SetStateAction } from "react";
import type { Step } from "../ForgotPassword.types";

type HandleEmailSubmitArgs = {
  setError: Dispatch<SetStateAction<string | null>>;
  setStep: Dispatch<SetStateAction<Step>>;
  setEmail: Dispatch<SetStateAction<string>>;
};

export function handleEmailSubmit(
  e: React.SyntheticEvent<HTMLFormElement>,
  arg: HandleEmailSubmitArgs
) {
  e.preventDefault();

  const { setEmail, setError, setStep } = arg;

  setError(null);
  const value = (
    e.currentTarget.elements.namedItem("email") as HTMLInputElement
  ).value.trim();
  if (!value) return;
  setEmail(value);
  setStep("password");
}
