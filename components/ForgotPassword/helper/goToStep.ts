import { Dispatch, SetStateAction } from "react";
import type { Step } from "../ForgotPassword.types";

export function goToStep(
  s: Step,
  setError: Dispatch<SetStateAction<string | null>>,
  setStep: Dispatch<SetStateAction<Step>>
) {
  setError(null);
  setStep(s);
}
