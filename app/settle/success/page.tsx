import { redirect } from "next/navigation";
import Link from "next/link";
import { stripe } from "@/lib/stripe";
import styles from "./success.module.css";
import { formatAmount } from "@/utils";

interface SettleSuccessPageProps {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function SettleSuccessPage({
  searchParams,
}: SettleSuccessPageProps) {
  const { session_id: sessionId } = await searchParams;

  if (!sessionId) redirect("/dashboard");

  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent"],
    });
  } catch {
    redirect("/dashboard");
  }

  if (session.payment_status !== "paid") {
    redirect("/dashboard");
  }

  const groupId = session.metadata?.groupId;
  const amountPence = session.amount_total ?? 0;

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.icon}>✓</div>

        <h1 className={styles.title}>Payment successful</h1>
        <p className={styles.amount}>{formatAmount(amountPence)}</p>
        <p className={styles.body}>
          Your payment has been processed. The balance will update shortly once
          the payment is confirmed.
        </p>

        <div className={styles.actions}>
          {groupId && (
            <Link href={`/groups/${groupId}`} className={styles.btnPrimary}>
              Back to group
            </Link>
          )}
          <Link href="/dashboard" className={styles.btnSecondary}>
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
