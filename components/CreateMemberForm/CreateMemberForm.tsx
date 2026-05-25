"use client";

import { useState, useTransition } from "react";
import { addMemberAction } from "@/actions/members";
import { AVATAR_COLORS } from "../EditMemberForm/constants";
import type { CreateMemberFormProps } from "./CreateMemberForm.types";
import styles from "../EditMemberForm/EditMemberForm.module.css";

export function CreateMemberForm({
  currentUserId,
  onCancel,
  onSaved,
}: CreateMemberFormProps) {
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [avatarBg, setAvatarBg] = useState(AVATAR_COLORS[0].bg);
  const [avatarFg, setAvatarFg] = useState(AVATAR_COLORS[0].fg);

  const previewInitials =
    name
      .split(" ")
      .map((w) => w[0] ?? "")
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?";

  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.set("avatarBg", avatarBg);
    formData.set("avatarFg", avatarFg);

    startTransition(async () => {
      const result = await addMemberAction(currentUserId, formData);
      if (result?.error) {
        setError(result.error);
        return;
      }
      onSaved();
    });
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.field}>
        <label htmlFor="add-name" className={styles.label}>
          Name
        </label>
        <input
          id="add-name"
          name="name"
          type="text"
          className={styles.input}
          placeholder="e.g. Sarah Johnson"
          required
          maxLength={50}
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="add-email" className={styles.label}>
          Email{" "}
          <span style={{ fontWeight: 400, color: "var(--text-secondary)" }}>
            (optional)
          </span>
        </label>
        <input
          id="add-email"
          name="email"
          type="email"
          className={styles.input}
          placeholder="sarah@example.com"
        />
      </div>
      <div className={styles.field}>
        <p className={styles.label}>Avatar colour</p>
        <div className={styles.colorGrid}>
          {AVATAR_COLORS.map((color) => {
            const isActive = color.bg === avatarBg;
            return (
              <button
                key={color.bg}
                type="button"
                title={color.label}
                className={styles.colorSwatch}
                style={{
                  background: color.bg,
                  color: color.fg,
                  outline: isActive ? `2px solid ${color.fg}` : "none",
                  outlineOffset: "2px",
                }}
                onClick={() => {
                  setAvatarBg(color.bg);
                  setAvatarFg(color.fg);
                }}
              >
                <span className={styles.swatchInitials}>{previewInitials}</span>
              </button>
            );
          })}
        </div>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.actions}>
        <button type="button" className={styles.btnCancel} onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" disabled={isPending} className={styles.btnSave}>
          {isPending ? "Adding…" : "Add member"}
        </button>
      </div>
    </form>
  );
}

export default CreateMemberForm;
