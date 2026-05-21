"use client";

import { Registration } from "@/components/Registration";
import styles from "./register.module.css";

export default function RegisterPage() {

  return (
    <div className={styles.page}>
     <Registration />
    </div>
  );
}
