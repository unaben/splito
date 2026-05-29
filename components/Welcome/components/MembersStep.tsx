import { Dispatch, SetStateAction } from "react";
import { options } from "../data";
import styles from "../Welcome.module.css";
import { AddUserForm } from "@/components/AddUserForm";
import useMemberStep from "../hooks/useMemberStep";

type MembersStepProps = {
  choice: string;
  setChoice: (v: string) => void;
  customNames: string[];
  setCustomNames: Dispatch<SetStateAction<string[]>>;
  onFinish: () => void;
};

function MembersStep(props: MembersStepProps) {
  const { choice, setChoice, customNames, setCustomNames, onFinish } = props;

  const { inputCount, handleDecrement, handleIncrement, handleInputChange } =
    useMemberStep(setCustomNames, customNames);

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
