"use client";

import { Dispatch, SetStateAction } from "react";
import { goToStep } from "../helper/goToStep";
import type { Step } from "../ForgotPassword.types";
import styles from "../ForgotPassword.module.css";

type StepEmailProps = {
  setError: Dispatch<SetStateAction<string | null>>;
  setStep: Dispatch<SetStateAction<Step>>;
  error: string | null;
  handleEmailSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => void;
};

const StepEmail = (props: StepEmailProps) => {
  const { error, setError, setStep, handleEmailSubmit } = props;

  return (
    <>
      <h1 className={styles.title}>Reset your password</h1>
      <p className={styles.subtitle}>
        Enter the email address registered on this device.
      </p>

      <form onSubmit={handleEmailSubmit} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="email" className={styles.label}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className={styles.input}
            placeholder="alice@example.com"
            required
            autoFocus
          />
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" className={styles.btn}>
          Continue
        </button>
      </form>

      <div className={styles.divider} />
      <p className={styles.forgotEmailHint}>
        Don&apos;t remember your email?{" "}
        <button
          type="button"
          className={styles.linkBtn}
          onClick={() => goToStep("reset", setError, setStep)}
        >
          Reset the app
        </button>
      </p>
    </>
  );
};

export default StepEmail;
