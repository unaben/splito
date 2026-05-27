"use client";

import type { SettleUpModalProps } from "./SettlementsModal.types";
import useSettlements from "./hooks/useSettlements";
import StepFailed from "./components/StepFailed";
import StepPaying from "./components/StepPaying";
import StepSuccess from "./components/StepSuccess";
import StepSelect from "./components/StepSelect";
import styles from "./SettlementsModal.module.css";
import CloseSvg from "../Icon/CloseSvg";

 function SettleUpModal(props: SettleUpModalProps) {
  const { debts } = props;
  const {
    payee,
    handleClose,
    handlePay,
    setOpen,
    getMember,
    errorMsg,
    selectedDebt,
    step,
    open,
    setSelectedDebt,
    setPaymentType,
    paymentType,
    setStep,
  } = useSettlements(props);

  return (
    <>
      <button onClick={() => setOpen(true)} className={styles.trigger}>
        Settle up
      </button>
      {open && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <div className={styles.header}>
              <h2 className={styles.headerTitle}>Settle up</h2>
              <button onClick={handleClose} className={styles.closeBtn}>
                <CloseSvg />
              </button>
            </div>
            <StepSelect
              debts={debts}
              getMember={getMember}
              handleClose={handleClose}
              handlePay={handlePay}
              payee={payee}
              paymentType={paymentType}
              selectedDebt={selectedDebt}
              setPaymentType={setPaymentType}
              setSelectedDebt={setSelectedDebt}
              step={step}
            />
            <StepPaying {...{ paymentType, step }} />
            <StepSuccess
              handleClose={handleClose}
              payee={payee}
              selectedDebt={selectedDebt}
              step={step}
            />
            <StepFailed {...{ setStep, step, handleClose, errorMsg }} />
          </div>
        </div>
      )}
    </>
  );
}
export default SettleUpModal