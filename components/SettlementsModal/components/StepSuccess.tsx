import cn from "classnames";
import styles from "../SettlementsModal.module.css";
import { formatPence } from "@/utils";
import { SettleStep, SimplifiedDebt, User } from "@/types";

type StepSuccessProps = {
  step: SettleStep;
  selectedDebt: SimplifiedDebt | null;
  payee: User | null | undefined;
  handleClose: () => void;
};

const StepSuccess = (props: StepSuccessProps) => {
  const { handleClose, payee, selectedDebt, step } = props;
  return (
    <>
      {step === "success" ? (
        <div className={styles.resultState}>
          <div className={cn(styles.resultIcon, styles.resultIconSuccess)}>
            ✓
          </div>
          <p className={styles.resultTitle}>Payment complete!</p>
          {selectedDebt && payee && (
            <p className={styles.resultSubText}>
              {formatPence(selectedDebt.amountPence)} sent to {payee.name}
            </p>
          )}
          <div className={styles.resultActions}>
            <button onClick={handleClose} className={styles.btnPrimaryFull}>
              Done
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default StepSuccess;
