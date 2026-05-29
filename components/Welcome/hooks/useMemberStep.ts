import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { MAX_INPUT_COUNT, STEP_COUNT, MIN_INPUT_COUNT } from "@/constants";

const useMemberStep = (
  setCustomNames: Dispatch<SetStateAction<string[]>>,
  customNames: string[]
) => {
  const [inputCount, setInputCount] = useState<number>(1);

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
  return {
    inputCount,
    handleDecrement,
    handleIncrement,
    handleInputChange,
  };
};

export default useMemberStep;
