"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { registerAction } from "@/actions/auth";
import styles from "./register.module.css";

export default function RegisterPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await registerAction(formData);

      if (result?.error) {
        setError(result.error);
        return;
      }

      const res = await signIn("credentials", {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        redirect: false,
      });

      if (res?.error) {
        setError("Registration succeeded but sign-in failed. Please log in.");
        router.push("/login");
        return;
      }

      router.push("/dashboard");
    });
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>
          spli<span className={styles.logoAccent}>to</span>
        </div>
        <h1 className={styles.title}>Create your account</h1>
        <p className={styles.subtitle}>Set up Splito on this device</p>

        <form onSubmit={handleSubmit} className={styles.form}>
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
