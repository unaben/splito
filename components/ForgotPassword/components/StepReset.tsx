import {
  Dispatch,
  SetStateAction,
  TransitionStartFunction,
  useTransition,
} from "react";
import { goToStep } from "../helper/goToStep";
import { RESET_CONFIRMATION_WORD } from "@/actions/constants";
import type { Step } from "../ForgotPassword.types";
import styles from "../ForgotPassword.module.css";

type StepResetProps = {
  error: string | null;
  setError: Dispatch<SetStateAction<string | null>>;
  setStep: Dispatch<SetStateAction<Step>>;
  handleResetSubmit: (
    e: React.SyntheticEvent<HTMLFormElement>,
    startTransition: TransitionStartFunction
  ) => void;
  email: string
};

const StepReset = (props: StepResetProps) => {
  const [isPending, startTransition] = useTransition();
  const { error, setError, setStep, handleResetSubmit, email } = props;
  return (
    <>
      <h1 className={styles.title}>Reset the app</h1>

      <div className={styles.warningBanner}>
        <p className={styles.warningTitle}>⚠ This cannot be undone</p>
        <p className={styles.warningBody}>
          All your groups, expenses, and settlements will be permanently
          deleted. Your account will be removed. The app will return to its
          initial state.
        </p>
      </div>

      <form
        onSubmit={(e) => handleResetSubmit(e, startTransition)}
        className={styles.form}
      >
        <div className={styles.field}>
          <label htmlFor="confirmation" className={styles.label}>
            Type{" "}
            <span className={styles.confirmWord}>
              {RESET_CONFIRMATION_WORD}
            </span>{" "}
            to confirm
          </label>
          <input
            id="confirmation"
            name="confirmation"
            type="text"
            className={styles.inputDanger}
            placeholder={RESET_CONFIRMATION_WORD}
            autoComplete="off"
            autoFocus
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="resetEmail" className={styles.label}>
            Your email address
          </label>
          <input
            id="resetEmail"
            name="resetEmail"
            type="email"
            className={styles.input}
            placeholder="alice@example.com"
            defaultValue={email}
            required
            autoComplete="email"
          />
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" disabled={isPending} className={styles.btnDanger}>
          {isPending ? "Resetting…" : "Reset app"}
        </button>

        <button
          type="button"
          className={styles.btnGhost}
          onClick={() => goToStep("email", setError, setStep)}
        >
          ← Go back
        </button>
      </form>
    </>
  );
};

export default StepReset;
