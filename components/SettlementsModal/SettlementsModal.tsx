"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { formatPence } from "@/utils";
import { settleUpAction } from "@/actions/settlements";
import type { Group, SimplifiedDebt, User } from "@/types";
import styles from "./SettlementsModal.module.css";
import Link from "next/link";

interface Props {
  group: Group;
  debts: SimplifiedDebt[];
  members: User[];
  currentUserId: string;
}

function SettleUpModal({ group, debts, members, currentUserId }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentType, setPaymentType] = useState<"card" | "cash">("card");

  const myDebts = debts.filter((d) => d.fromUserId === currentUserId);
  if (myDebts.length === 0) return null;

  const getMember = (id: string) => members.find((m) => m.id === id);

  async function handleSettle(debt: SimplifiedDebt) {
    setError(null);

    const formData = new FormData();
    formData.set("groupId", group.id);
    formData.set("payeeId", debt.toUserId);
    formData.set("amount", (debt.amountPence / 100).toFixed(2));
    formData.set("paymentType", paymentType);

    startTransition(async () => {
      const result = await settleUpAction(formData);

      if (result?.error) {
        setError(result.error);
        return;
      }

      if (result?.type === "cash") {
        setIsOpen(false);
        router.refresh();
        return;
      }

      if (result?.type === "card" && result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
        return;
      }
    });
  }

  return (
    <>
      <button className={styles.trigger} onClick={() => setIsOpen(true)}>
        Settle up
      </button>

      {isOpen && (
        <div className={styles.overlay} onClick={() => setIsOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.header}>
              <h2 className={styles.title}>Settle up</h2>
              <button
                className={styles.close}
                onClick={() => setIsOpen(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className={styles.typeRow}>
              {(["card", "cash"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  className={`${styles.typeBtn} ${
                    paymentType === type ? styles.typeBtnActive : ""
                  }`}
                  onClick={() => setPaymentType(type)}
                >
                  {type === "card" ? "💳 Card" : "💵 Cash"}
                </button>
              ))}
            </div>

            {paymentType === "card" && (
              <div className={styles.cardNote}>
                <span className={styles.cardNoteIcon}>ℹ️</span>
                <div className={styles.cardNoteContent}>
                  <p className={styles.cardNoteText}>
                    You&apos;ll be redirected to Stripe to complete the payment
                    securely.
                  </p>
                  <p className={styles.cardNoteTest}>
                    Test card: <strong>4242 4242 4242 4242</strong> · Any future
                    date · Any 3-digit CVC
                  </p>
                  <Link
                    href="https://docs.stripe.com/testing#cards"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.cardNoteLink}
                  >
                    More test cards →
                  </Link>
                </div>
              </div>
            )}

            <div className={styles.debtList}>
              {myDebts.map((debt) => {
                const payee = getMember(debt.toUserId);
                return (
                  <div key={debt.toUserId} className={styles.debtRow}>
                    <div className={styles.debtInfo}>
                      <span className={styles.debtTo}>
                        Pay {payee?.name ?? "someone"}
                      </span>
                      <span className={styles.debtAmount}>
                        {formatPence(debt.amountPence)}
                      </span>
                    </div>
                    <button
                      className={styles.payBtn}
                      disabled={isPending}
                      onClick={() => handleSettle(debt)}
                    >
                      {isPending
                        ? "Processing…"
                        : paymentType === "card"
                        ? "Pay with card →"
                        : "Mark as paid"}
                    </button>
                  </div>
                );
              })}
            </div>

            {error && <p className={styles.error}>{error}</p>}
          </div>
        </div>
      )}
    </>
  );
}
export default SettleUpModal;
