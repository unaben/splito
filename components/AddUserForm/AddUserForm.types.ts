import { ChangeEvent } from "react";

export type AddUserFormProps = {
  handleIncrement: () => void;
  handleDecrement: () => void;
  inputCount: number;
  customNames: string[];
  handleInputChange: (
    e: ChangeEvent<HTMLInputElement>,
    i: number,
  ) => void;
  onFinish: () => void
};
