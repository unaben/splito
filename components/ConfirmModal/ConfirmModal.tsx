import type { ConfirmModalProps } from "./ConfirmModal.types";
import styles from "./ConfirmModal.module.css";

function ConfirmModal(props: ConfirmModalProps) {
  const {
    title,
    body,
    warning,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    isPending = false,
    onConfirm,
    onCancel,
  } = props;
  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.body}>{body}</p>
        {warning && (
          <div className={styles.warning}>
            <p className={styles.warningText}>⚠ {warning}</p>
          </div>
        )}
        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            className={styles.confirmBtn}
            disabled={isPending}
            onClick={onConfirm}
          >
            {isPending ? "Removing…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
