import { ChangeEvent, useState } from "react";
import { options } from "../data";
import styles from "../Welcome.module.css";
import { MAX_INPUT_COUNT, STEP_COUNT, MIN_INPUT_COUNT } from "@/constants";
import { AddUserForm } from "@/components/AddUserForm";

type MembersStepProps = {
  choice: string;
  setChoice: (v: string) => void;
  customNames: string[];
  setCustomNames: (n: string[]) => void;
  onFinish: () => void;
};

function MembersStep(props: MembersStepProps) {
  const { choice, setChoice, customNames, setCustomNames, onFinish } = props;
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

  return (
    <div className={styles.infoStep}>
      <div className={styles.stepEmoji}>👥</div>
      <h2 className={styles.stepHeadline}>Add people to split with</h2>
      <div className={styles.stepBody}>
        <p>
          Groups need members. Add some placeholder people now so you can
          explore the app straight away — you can rename them any time from the{" "}
          <strong>Members</strong> page.
        </p>
        <p>Or skip and add real people when you create your first group.</p>
      </div>

      <div className={styles.choices}>
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setChoice(opt.value)}
            className={`${styles.choiceBtn} ${
              choice === opt.value ? styles.choiceBtnActive : ""
            }`}
          >
            <span className={styles.choiceEmoji}>{opt.emoji}</span>
            <div className={styles.choiceText}>
              <span className={styles.choiceLabel}>{opt.label}</span>
              <span className={styles.choiceDesc}>{opt.desc}</span>
            </div>
            <span
              className={`${styles.choiceCheck} ${
                choice === opt.value ? styles.choiceCheckActive : ""
              }`}
            >
              ✓
            </span>
          </button>
        ))}
      </div>
      {choice === "custom" && (
        <AddUserForm
          {...{
            handleDecrement,
            handleIncrement,
            handleInputChange,
            onFinish,
            customNames,
            inputCount,
          }}
        />
      )}
    </div>
  );
}

export default MembersStep;
