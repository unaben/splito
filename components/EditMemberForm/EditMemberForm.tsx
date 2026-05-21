"use client";

import type { EditMemberFormProps } from "./EditMemberForm.types";
import { AVATAR_COLORS } from "./constants";
import useHandleSubmitEditMemberForm from "./hooks/useHandleSubmitEditMemberForm";
import styles from "./EditMemberForm.module.css";

function EditMemberForm(props: EditMemberFormProps) {
  const { user, onCancel } = props;

  const {
    handleSubmitEditMemberForm,
    isPending,
    error,
    setAvatarBg,
    setAvatarFg,
    avatarBg,
  } = useHandleSubmitEditMemberForm(props);

  return (
    <form onSubmit={handleSubmitEditMemberForm} className={styles.form}>
      <div className={styles.field}>
        <label htmlFor={`name-${user.id}`} className={styles.label}>
          Name
        </label>
        <input
          id={`name-${user.id}`}
          name="name"
          type="text"
          className={styles.input}
          defaultValue={user.name}
          placeholder="Full name"
          required
          maxLength={50}
          autoFocus
        />
      </div>
      <div className={styles.field}>
        <label htmlFor={`email-${user.id}`} className={styles.label}>
          Email
        </label>
        <input
          id={`email-${user.id}`}
          name="email"
          type="email"
          className={styles.input}
          defaultValue={user.email}
          placeholder="email@example.com"
          required
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
                <span className={styles.swatchInitials}>
                  {user.avatarInitials}
                </span>
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
          {isPending ? "Saving…" : "Save"}
        </button>
      </div>
    </form>
  );
}
export default EditMemberForm;
