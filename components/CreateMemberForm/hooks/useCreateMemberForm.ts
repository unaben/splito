import { ChangeEvent,  useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { completeOnboardingAction } from "@/actions/onBoarding";
import { MAX_INPUT_COUNT, STEP_COUNT, MIN_INPUT_COUNT } from "@/constants";

const useCreateMemberForm = (currentUserId: string) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [customNames, setCustomNames] = useState(["", "", "", ""]);
  const [choice, setChoice] = useState("example");
  const [inputCount, setInputCount] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>, i: number) => {
    const next = [...customNames];
    next[i] = e.target.value;
    setCustomNames(next);
  };

  const handleIncrement = () => {
    setInputCount((prev) => Math.min(MAX_INPUT_COUNT, prev + STEP_COUNT));
  };

  const handleDecrement = () => {
    setInputCount((prev) => Math.max(MIN_INPUT_COUNT, prev - STEP_COUNT));
  };

  const handleSubmit = () => {
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
      router.push("/members");
    });
  };

  return {
    handleDecrement,
    handleIncrement,
    handleInputChange,
    handleSubmit,
    inputCount,
    setChoice,
    error,
    customNames,
    isPending
  };
};

export default useCreateMemberForm;
