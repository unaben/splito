import cn from "classnames";
import { Avatar } from "@/components/Avatar";
import { formatPence } from "@/utils";
import type { PaymentType, SettleStep, SimplifiedDebt, User } from "@/types";
import { Dispatch, SetStateAction } from "react";
import styles from "../SettlementsModal.module.css";

type StepSelectProps = {
  debts: SimplifiedDebt[];
  getMember: (id: string) => User | undefined;
  setSelectedDebt: Dispatch<SetStateAction<SimplifiedDebt | null>>;
  selectedDebt: SimplifiedDebt | null;
  handlePay: () => Promise<void>;
  payee: User | null | undefined;
  setPaymentType: Dispatch<SetStateAction<PaymentType>>;
  step: SettleStep;
  paymentType: PaymentType;
  handleClose: () => void;
};

const StepSelect = (props: StepSelectProps) => {
  const {
    debts,
    getMember,
    selectedDebt,
    setSelectedDebt,
    handlePay,
    payee,
    setPaymentType,
    handleClose,
    paymentType,
    step,
  } = props;

  return (
    <>
      {step === "select" ? (
        <div className={styles.body}>
          {debts.length > 1 && (
            <div>
              <label className={styles.label}>Who are you paying?</label>
              <div className={styles.debtList}>
                {debts.map((debt, i) => {
                  const to = getMember(debt.toUserId);
                  if (!to) return null;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedDebt(debt)}
                      className={cn(styles.debtBtn, {
                        [styles.debtBtnActive]: selectedDebt === debt,
                      })}
                    >
                      <Avatar user={to} size="sm" />
                      <span className={styles.debtName}>{to.name}</span>
                      <span className={styles.debtAmount}>
                        {formatPence(debt.amountPence)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          {selectedDebt && payee && (
            <div className={styles.summary}>
              <p className={styles.summaryLabel}>Paying</p>
              <p className={styles.summaryAmount}>
                {formatPence(selectedDebt.amountPence)}
              </p>
              <div className={styles.summaryTo}>
                <span>to</span>
                <Avatar user={payee} size="sm" />
                <span className={styles.summaryToName}>{payee.name}</span>
              </div>
            </div>
          )}
          <div>
            <label className={styles.label}>Pay with</label>
            <div className={styles.paymentGrid}>
              {(["card", "cash"] as PaymentType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setPaymentType(type)}
                  className={cn(styles.paymentTypeBtn, {
                    [styles.paymentTypeBtnActive]: paymentType === type,
                  })}
                >
                  <span className={styles.paymentTypeEmoji}>
                    {type === "card" ? "💳" : "💵"}
                  </span>
                  <span className={styles.paymentTypeName}>
                    {type === "card" ? "Card" : "Cash"}
                  </span>
                  <span className={styles.paymentTypeSub}>
                    {type === "card" ? "via Stripe" : "mark as paid"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {paymentType === "card" && (
            <p className={styles.demoNote}>
              🔒 Demo mode — no real money charged. Payment is simulated with a
              short delay.
            </p>
          )}

          <div className={styles.actions}>
            <button
              type="button"
              onClick={handleClose}
              className={styles.btnSecondary}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handlePay}
              disabled={!selectedDebt}
              className={styles.btnPrimary}
            >
              {paymentType === "cash"
                ? "Mark as paid"
                : `Pay ${
                    selectedDebt ? formatPence(selectedDebt.amountPence) : ""
                  }`}
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default StepSelect;
