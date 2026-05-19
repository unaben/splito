"use client";

import styles from "./register.module.css";

export default function RegisterPage() {
  const isPending = false;
  const error = null;

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>
          spli<span className={styles.logoAccent}>to</span>
        </div>
        <h1 className={styles.title}>Create your account</h1>
        <p className={styles.subtitle}>Set up Splito on this device</p>

        <form onSubmit={() => {}} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="name" className={styles.label}>
              Full name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className={styles.input}
              placeholder="Alice Johnson"
              required
              autoFocus
            />
          </div>

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
              placeholder="At least 8 characters"
              minLength={8}
              required
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" disabled={isPending} className={styles.btn}>
            {isPending ? "Setting up…" : "Create account"}
          </button>
        </form>

        <p className={styles.loginHint}>
          Already registered?{" "}
          <a href="/login" className={styles.loginLink}>
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
