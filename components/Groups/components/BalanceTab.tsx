import { formatPence } from "@/utils";
import { Avatar } from "@/components/Avatar";
import type { Balance, SimplifiedDebt, User } from "@/types";
import { getMember } from "../utils/getMember";
import styles from "../Groups.module.css";

type BalanceTabProps = {
  balances: Balance[];
  currentUserId: string;
  debts: SimplifiedDebt[];
  members: User[];
};

const BalanceTab = (props: BalanceTabProps) => {
  const { balances, currentUserId, debts, members } = props;
  return (
    <div className={styles.card}>
      {balances.map((balance) => {
        const member = getMember(balance.userId, members);
        if (!member) return null;
        return (
          <div key={member.id} className={styles.balanceRow}>
            <div className={styles.balanceMember}>
              <Avatar user={member} size="md" />
              <div>
                <p className={styles.balanceName}>
                  {member.id === currentUserId ? "You" : member.name}
                </p>
                <p className={styles.balanceRole}>
                  {balance.amountPence > 0
                    ? "gets back"
                    : balance.amountPence < 0
                    ? "owes"
                    : "settled up"}
                </p>
              </div>
            </div>
            {balance.amountPence > 0 && (
              <span className={styles.badgePositive}>
                {formatPence(balance.amountPence)}
              </span>
            )}
            {balance.amountPence < 0 && (
              <span className={styles.badgeNegative}>
                -{formatPence(Math.abs(balance.amountPence))}
              </span>
            )}
            {balance.amountPence === 0 && (
              <span className={styles.badgeNeutral}>£0.00</span>
            )}
          </div>
        );
      })}

      {debts.length > 0 && (
        <div className={styles.suggestedPayments}>
          <p className={styles.suggestedTitle}>Suggested payments</p>
          {debts.map((debt, i) => {
            const from = getMember(debt.fromUserId, members);
            const to = getMember(debt.toUserId, members);
            return (
              <div key={i} className={styles.debtRow}>
                <span className={styles.debtName}>
                  {from?.id === currentUserId ? "You" : from?.name}
                </span>
                <span className={styles.debtArrow}>owe</span>
                <span className={styles.debtName}>
                  {to?.id === currentUserId ? "you" : to?.name}
                </span>
                <span className={styles.debtAmount}>
                  {formatPence(debt.amountPence)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BalanceTab;
