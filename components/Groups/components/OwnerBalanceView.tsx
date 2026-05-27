import cn from "classnames";
import { SettleUpModal } from "@/components/SettlementsModal";
import type { Balance, Expense, Group, SimplifiedDebt, User } from "@/types";
import { formatPence } from "@/utils";
import { getMember } from "../utils/getMember";
import styles from "../Groups.module.css";

type OwnerBalanceViewProps = {
  balances: Balance[];
  debts: SimplifiedDebt[];
  currentUserId: string;
  members: User[];
  group: Group;
  expenses: Expense[];
};

const OwnerBalanceView = (props: OwnerBalanceViewProps) => {
  const { balances, currentUserId, debts, expenses, group, members } = props;

  const ownerBalance =
    balances.find((b) => b.userId === currentUserId)?.amountPence ?? 0;
  const myDebts = debts.filter((d) => d.fromUserId === currentUserId);

  return (
    <>
      {ownerBalance !== 0 && (
        <div
          className={cn(
            styles.balanceBanner,
            ownerBalance < 0 ? styles.balanceBannerNeg : styles.balanceBannerPos
          )}
        >
          <div>
            <p
              className={cn(
                styles.balanceBannerText,
                ownerBalance < 0
                  ? styles.balanceBannerTextNeg
                  : styles.balanceBannerTextPos
              )}
            >
              {ownerBalance < 0
                ? `You owe ${formatPence(Math.abs(ownerBalance))}`
                : `You are owed ${formatPence(ownerBalance)}`}
            </p>
            {myDebts.length > 0 && (
              <p className={styles.balanceBannerSub}>
                to{" "}
                {myDebts
                  .map((d) => getMember(d.toUserId, members)?.name)
                  .join(", ")}
              </p>
            )}
          </div>
          {ownerBalance < 0 && myDebts.length > 0 && (
            <SettleUpModal
              group={group}
              debts={myDebts}
              members={members}
              currentUserId={currentUserId}
            />
          )}
        </div>
      )}

      {ownerBalance === 0 && expenses.length > 0 && (
        <div className={styles.settledBanner}>🎉 You are all settled up!</div>
      )}
    </>
  );
};

export default OwnerBalanceView;
