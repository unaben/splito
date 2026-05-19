"use client";

import styles from "./CreateGroupForm.module.css";

export function CreateGroupForm() {
  return (
    <form className={styles.form}>
      <div className={styles.field}>
        <label className={styles.label}>Group icon</label>
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="name">
          Group name
        </label>
        <input
          id="name"
          name="name"
          className={styles.input}
          placeholder="e.g. Portugal Trip, Flat Expenses"
          required
          maxLength={50}
        />
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="description">
          Description <span className={styles.labelNote}>(optional)</span>
        </label>
        <input
          id="description"
          name="description"
          className={styles.input}
          placeholder="What's this group for?"
          maxLength={200}
        />
      </div>
    </form>
  );
}
