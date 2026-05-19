"use client";

import styles from "./login.module.css";

export default function LoginPage() {
  const isPending = false;
  const error = null;

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>
          spli<span className={styles.logoAccent}>to</span>
        </div>
        <h1 className={styles.title}>Welcome back</h1>
        <p className={styles.subtitle}>Sign in to your account</p>

        <form onSubmit={() => {}} className={styles.form}>
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

          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className={styles.input}
              placeholder="Your password"
              required
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" disabled={isPending} className={styles.btn}>
            {isPending ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
