'use client'

import { useRouter } from "next/navigation";
import styles from "../ForgotPassword.module.css";

const StepResetDone = () => {
    const router = useRouter();
  return (
    <div className={styles.page}>
          <div className={styles.card}>
            <div className={styles.logo}>
              spli<span className={styles.logoAccent}>to</span>
            </div>
            <div className={styles.resetDoneIcon}>↺</div>
            <h1 className={styles.title}>App has been reset</h1>
            <p className={styles.subtitle}>
              All data has been cleared. You can now register a new account.
            </p>
            <button
              className={styles.btn}
              onClick={() => router.push("/register")}
            >
              Register now
            </button>
          </div>
        </div>
  )
}

export default StepResetDone