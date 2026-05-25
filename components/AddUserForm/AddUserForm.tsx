import { MAX_INPUT_COUNT, MIN_INPUT_COUNT } from "@/constants";
import type { AddUserFormProps } from "./AddUserForm.types";
import styles from "./AddUserForm.module.css";

const AddUserForm = (props: AddUserFormProps) => {
  const {
    handleDecrement,
    handleIncrement,
    handleInputChange,
    onFinish,
    customNames,
    inputCount,
  } = props;

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    onFinish();
  };

  return (
    <form onSubmit={handleSubmit} className={styles.customNames}>
      <p className={styles.customHint}>
        Enter up to {MAX_INPUT_COUNT} names (leave blank to skip)
      </p>
      {Array.from({ length: inputCount }, (_, i) => i).map((i) => (
        <input
          key={i}
          className={styles.nameInput}
          placeholder={`Person ${i + 1} — e.g. Sarah Butler`}
          value={customNames[i] ?? ""}
          onChange={(e) => handleInputChange(e, i)}
          maxLength={50}
        />
      ))}
      <div className={styles.counterRow}>
        <button
          type="button"
          onClick={handleIncrement}
          disabled={inputCount >= MAX_INPUT_COUNT}
          className={styles.counterBtn}
        >
          Add
        </button>
        <span className={styles.counterValue}>
          {inputCount} {inputCount === 1 ? "person" : "persons"}
        </span>
        <button
          type="button"
          onClick={handleDecrement}
          disabled={inputCount <= MIN_INPUT_COUNT}
          className={styles.counterBtn}
        >
          Remove
        </button>
      </div>
    </form>
  );
};

export default AddUserForm;
