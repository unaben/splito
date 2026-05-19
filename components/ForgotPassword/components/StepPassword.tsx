"use client";

import { Dispatch, SetStateAction, useTransition } from "react";
import { goToStep } from "../helper/goToStep";
import { handlePasswordSubmit } from "../utils/handlePasswordSubmit";
import type { Step } from "../ForgotPassword.types";
import styles from "../ForgotPassword.module.css";

type StepPasswordProps = {
  email: string;
  error: string | null;
  setEmail: Dispatch<SetStateAction<string>>;
  setError: Dispatch<SetStateAction<string | null>>;
  setStep: Dispatch<SetStateAction<Step>>;
  setSuccess: Dispatch<SetStateAction<boolean>>;
};

const StepPassword = (props: StepPasswordProps) => {
  const [isPending, startTransition] = useTransition();
  const { email, error, setEmail, setError, setStep, setSuccess } = props;
  return (
    <>
      <h1 className={styles.title}>Set new password</h1>
      <p className={styles.subtitle}>
        Choose a new password for{" "}
        <span className={styles.emailHighlight}>{email}</span>
      </p>

      <form
        onSubmit={(e) =>
          handlePasswordSubmit(e, {
            email,
            setEmail,
            setError,
            setStep,
            setSuccess,
            startTransition,
          })
        }
        className={styles.form}
      >
        <div className={styles.field}>
          <label htmlFor="password" className={styles.label}>
            New password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className={styles.input}
            placeholder="At least 8 characters"
            minLength={8}
            required
            autoFocus
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="confirmPassword" className={styles.label}>
            Confirm new password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            className={styles.input}
            placeholder="Repeat your new password"
            minLength={8}
            required
          />
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" disabled={isPending} className={styles.btn}>
          {isPending ? "Saving…" : "Update password"}
        </button>

        <button
          type="button"
          className={styles.btnGhost}
          onClick={() => goToStep("email", setError, setStep)}
        >
          ← Use a different email
        </button>
      </form>
    </>
  );
};

export default StepPassword;
