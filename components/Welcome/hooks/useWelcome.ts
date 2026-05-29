import { completeOnboardingAction } from "@/actions/onBoarding";
import { useRouter } from "next/router";
import { useTransition, useState } from "react";
import { INFO_STEPS } from "../INFO_STEPS";

const useWelcome = (currentUserId: string) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState(0);
  const [choice, setChoice] = useState("example");
  const [customNames, setCustomNames] = useState(["", "", "", ""]);
  const [error, setError] = useState<string | null>(null);

  const totalSteps = INFO_STEPS.length + 1;
  const isMembers = step === INFO_STEPS.length;
  const current = !isMembers ? INFO_STEPS[step] : null;

  function handleFinish() {
    setError(null);
    const formData = new FormData();
    formData.set("addMembers", choice);
    customNames.forEach((n, i) => formData.set(`member${i + 1}`, n));

    startTransition(async () => {
      const result = await completeOnboardingAction(currentUserId, formData);
      if (result?.error) {
        setError(result.error);
        return;
      }
      router.push("/dashboard");
    });
  }
  return {
    isMembers,
    isPending,
    current,
    step,
    totalSteps,
    handleFinish,
    choice,
    setChoice,
    customNames,
    setCustomNames,
    setStep,
    error,
  };
};

export default useWelcome;
