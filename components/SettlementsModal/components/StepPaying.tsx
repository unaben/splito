import type { PaymentType, SettleStep } from "@/types";
import styles from "../SettlementsModal.module.css";

const StepPaying = ({
  paymentType,
  step,
}: {
  paymentType: PaymentType;
  step: SettleStep;
}) => {
  return (
    <>
      {step === "paying" ? (
        <div className={styles.payingState}>
          <div className={styles.spinner} />
          <p className={styles.payingText}>
            {paymentType === "card"
              ? "Processing payment…"
              : "Recording payment…"}
          </p>
          <p className={styles.payingSubText}>Please wait</p>
        </div>
      ) : null}
    </>
  );
};

export default StepPaying;
