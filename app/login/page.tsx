"use client";

import Login from "@/components/Login/Login";
import styles from "./login.module.css";

export default function LoginPage() {
  return (
    <div className={styles.page}>
      <Login />
    </div>
  );
}
