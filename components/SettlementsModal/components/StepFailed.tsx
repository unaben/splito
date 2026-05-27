import cn from "classnames";
import { SettleStep } from "@/types";
import { Dispatch, SetStateAction } from "react";
import styles from "../SettlementsModal.module.css";

type StepFailedProps = {
  setStep: Dispatch<SetStateAction<SettleStep>>;
  step: SettleStep;
  handleClose: () => void;
  errorMsg: string | null;
};

const StepFailed = (props: StepFailedProps) => {
  const { setStep, step, handleClose, errorMsg } = props;
  return (
    <>
      {step === "failed" ? (
        <div className={styles.resultState}>
          <div className={cn(styles.resultIcon, styles.resultIconFail)}>✗</div>
          <p className={styles.resultTitle}>Payment failed</p>
          <p className={styles.resultError}>{errorMsg}</p>
          <div className={styles.resultActions}>
            <button onClick={handleClose} className={styles.btnSecondary}>
              Cancel
            </button>
            <button
              onClick={() => setStep("select")}
              className={styles.btnPrimary}
            >
              Try again
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default StepFailed;
