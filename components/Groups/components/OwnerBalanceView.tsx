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

  const userBalance =
    balances.find((b) => b.userId === currentUserId)?.amountPence ?? 0;
  const userDebts = debts.filter((d) => d.fromUserId === currentUserId);
  const userTotalDebt = userDebts.reduce(
    (acc, debt) => acc + debt.amountPence,
    0
  );

  return (
    <>
      {userBalance !== 0 && (
        <div
          className={cn(
            styles.balanceBanner,
            userBalance < 0 ? styles.balanceBannerNeg : styles.balanceBannerPos
          )}
        >
          <div>
            <p
              className={cn(
                styles.balanceBannerText,
                userBalance < 0
                  ? styles.balanceBannerTextNeg
                  : styles.balanceBannerTextPos
              )}
            >
              {userBalance < 0
                ? `You owe ${formatPence(Math.abs(userTotalDebt))}`
                : `You are owed ${formatPence(userBalance)}`}
            </p>
            {userDebts.length > 0 && (
              <p className={styles.balanceBannerSub}>
                to{" "}
                {userDebts
                  .map((d) => getMember(d.toUserId, members)?.name)
                  .join(", ")}
              </p>
            )}
          </div>
          {userBalance < 0 && userDebts.length > 0 && (
            <SettleUpModal
              group={group}
              debts={userDebts}
              members={members}
              currentUserId={currentUserId}
            />
          )}
        </div>
      )}

      {userBalance === 0 && expenses.length > 0 && (
        <div className={styles.settledBanner}>🎉 You are all settled up!</div>
      )}
    </>
  );
};

export default OwnerBalanceView;
