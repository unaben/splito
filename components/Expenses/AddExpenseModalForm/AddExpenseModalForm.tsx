import cn from "classnames";
import { Avatar } from "@/components/Avatar";
import {
  formatPence,
  CATEGORY_LABELS,
  CATEGORY_EMOJI,
  penceFromPounds,
} from "@/utils";
import type { ExpenseCategory } from "@/types";
import type { AddExpenseModalFormProps } from "./AddExpenseModalForm.types";
import styles from "./AddExpenseModalForm.module.css";

const AddExpenseModalForm = (props: AddExpenseModalFormProps) => {
  const {
    amount,
    currentUserId,
    error,
    handleSubmit,
    members,
    setAmount,
    setCategory,
    setPaidBy,
    category,
    handleClose,
    isPending,
    paidBy,
  } = props;

  const perPerson =
    amount && members.length ? penceFromPounds(amount) / members.length : 0;

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.field}>
        <label className={styles.label}>Amount (£)</label>
        <input
          name="amount"
          type="number"
          step="0.01"
          min="0.01"
          className={cn(styles.input, styles.inputAmount)}
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        {perPerson > 0 && (
          <p className={styles.inputHint}>
            {formatPence(perPerson)} per person
          </p>
        )}
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Description</label>
        <input
          name="description"
          className={styles.input}
          placeholder="What was this for?"
          required
          maxLength={100}
        />
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Category</label>
        <div className={styles.categoryGrid}>
          {(Object.keys(CATEGORY_LABELS) as ExpenseCategory[]).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={cn(styles.categoryBtn, {
                [styles.categoryBtnActive]: category === cat,
              })}
            >
              <span className={styles.categoryEmoji}>
                {CATEGORY_EMOJI[cat]}
              </span>
              <span>{CATEGORY_LABELS[cat].split(" ")[0]}</span>
            </button>
          ))}
        </div>
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Paid by</label>
        <div className={styles.paidByList}>
          {members.map((member) => (
            <button
              key={member.id}
              type="button"
              onClick={() => setPaidBy(member.id)}
              className={cn(styles.paidByBtn, {
                [styles.paidByBtnActive]: paidBy === member.id,
              })}
            >
              <Avatar user={member} size="sm" />
              {member.id === currentUserId ? "You" : member.name.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.splitInfo}>
        Split equally between <strong>{members.length} members</strong>
        {perPerson > 0 && (
          <>
            {" "}
            · <strong>{formatPence(perPerson)}</strong> each
          </>
        )}
      </div>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.actions}>
        <button
          type="button"
          onClick={handleClose}
          className={styles.btnSecondary}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className={styles.btnPrimary}
        >
          {isPending ? "Adding…" : "Add expense"}
        </button>
      </div>
    </form>
  );
};

export default AddExpenseModalForm;
