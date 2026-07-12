import Link from "next/link";
import { updateSettlementStatus } from "@/lib/db";
import styles from "./cancel.module.css";

interface SettleCancelPageProps {
  searchParams: Promise<{
    group_id?: string;
    settlement_id?: string;
  }>;
}

export default async function SettleCancelPage({
  searchParams,
}: SettleCancelPageProps) {
  const { group_id: groupId, settlement_id: settlementId } = await searchParams;
  if (settlementId) {
    try {
      await updateSettlementStatus(settlementId, "failed");
    } catch (err) {
      console.warn(
        "[settle/cancel] Could not mark settlement failed — webhook expiry will handle it:",
        err
      );
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.icon}>✕</div>

        <h1 className={styles.title}>Payment cancelled</h1>
        <p className={styles.body}>
          No payment was taken. You can try again from the group page whenever
          you&apos;re ready.
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
