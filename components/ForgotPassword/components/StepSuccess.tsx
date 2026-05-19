'use client'

import { useRouter } from "next/navigation";
import styles from "../ForgotPassword.module.css";

const StepSuccess = () => {
  const router = useRouter();
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>
          spli<span className={styles.logoAccent}>to</span>
        </div>
        <div className={styles.successIcon}>✓</div>
        <h1 className={styles.title}>Password updated</h1>
        <p className={styles.subtitle}>
          Your password has been changed. You can now sign in.
        </p>
        <button className={styles.btn} onClick={() => router.push("/login")}>
          Go to sign in
        </button>
      </div>
    </div>
  );
};

export default StepSuccess;
