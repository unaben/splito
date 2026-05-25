"use client";

import StepSuccess from "./components/StepSuccess";
import StepResetDone from "./components/StepResetDone";
import StepEmail from "./components/StepEmail";
import StepPassword from "./components/StepPassword";
import StepReset from "./components/StepReset";
import useHandleSubmit from "./components/hooks/useHandleSubmit";
import styles from "./ForgotPassword.module.css";

const ForgotPassword = () => {
  const {
    handleEmailSubmit,
    handlePasswordSubmit,
    handleResetSubmit,
    resetDone,
    success,
    error,
    setError,
    email,
    step,
    setStep,
  } = useHandleSubmit();

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
          <StepEmail {...{ error, handleEmailSubmit, setError, setStep }} />
        )}

        {step === "password" && (
          <StepPassword
            {...{ email, error, handlePasswordSubmit, setError, setStep }}
          />
        )}

        {step === "reset" && (
          <StepReset {...{ error, setError, handleResetSubmit, setStep, email }} />
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
