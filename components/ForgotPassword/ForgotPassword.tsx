"use client";

import { useState } from "react";
import StepSuccess from "./components/StepSuccess";
import StepResetDone from "./components/StepResetDone";
import StepEmail from "./components/StepEmail";
import StepPassword from "./components/StepPassword";
import StepReset from "./components/StepReset";
import type { Step } from "./ForgotPassword.types";
import styles from "./ForgotPassword.module.css";

const ForgotPassword = () => {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [resetDone, setResetDone] = useState(false);  

  if (success) {
    return <StepSuccess />;
  }

  if (resetDone) {
    return <StepResetDone />;
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>
          spli<span className={styles.logoAccent}>to</span>
        </div>

        {step === "email" && (
          <StepEmail {...{ error, setEmail, setError, setStep }} />
        )}

        {step === "password" && (
          <StepPassword
            {...{ email, error, setEmail, setError, setStep, setSuccess }}
          />
        )}

        {step === "reset" && (
          <StepReset {...{ error, setError, setResetDone, setStep }} />
        )}

        {step !== "reset" && (
          <p className={styles.backHint}>
            Remembered it?{" "}
            <a href="/login" className={styles.backLink}>
              Sign in
            </a>
          </p>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
