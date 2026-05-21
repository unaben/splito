"use client";

import cn from "classnames";
import { Avatar } from "../Avatar";
import { EMOJIS } from "./constants";
import { toggleMember } from "./utils";
import useHandleSubmitCreateGroupForm from "./hooks/useHandleSubmitCreateGroupForm";
import type { CreateGroupFormProps } from "./CreateGroupForm.types";
import styles from "./CreateGroupForm.module.css";

export function CreateGroupForm({ users }: CreateGroupFormProps) {
  const {
    router,
    isPending,
    error,
    setSelectedEmoji,
    setSelectedMembers,
    handleSubmitCreateGroupForm,
    selectedEmoji,
    selectedMembers
  } = useHandleSubmitCreateGroupForm();

  return (
    <form onSubmit={handleSubmitCreateGroupForm} className={styles.form}>
      <div className={styles.field}>
        <label className={styles.label}>Group icon</label>
        <div className={styles.emojiGrid}>
          {EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => setSelectedEmoji(emoji)}
              className={cn(styles.emojiBtn, {
                [styles.emojiBtnActive]: selectedEmoji === emoji,
              })}
            >
              {emoji}
            </button>
          ))}
        </div>
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
      <div className={styles.field}>
        <label className={styles.label}>Add members</label>
        <p className={styles.memberHint}>You&apos;ll be added automatically</p>
        <div className={styles.memberList}>
          {users.map((user) => {
            const isSelected = selectedMembers.includes(user.id);
            return (
              <button
                key={user.id}
                type="button"
                onClick={() => toggleMember(user.id, setSelectedMembers)}
                className={cn(styles.memberBtn, {
                  [styles.memberBtnActive]: isSelected,
                })}
              >
                <Avatar user={user} size="sm" />
                <div className={styles.memberInfo}>
                  <p className={styles.memberName}>{user.name}</p>
                  <p className={styles.memberEmail}>{user.email}</p>
                </div>
                <div
                  className={cn(styles.checkCircle, {
                    [styles.checkCircleActive]: isSelected,
                  })}
                >
                  {isSelected && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path
                        d="M1 4l3 3 5-6"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.actions}>
        <button
          type="button"
          onClick={() => router.back()}
          className={styles.btnSecondary}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className={styles.btnPrimary}
        >
          {isPending ? "Creating…" : "Create group"}
        </button>
      </div>
    </form>
  );
}
