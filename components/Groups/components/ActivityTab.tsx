import cn from "classnames";
import { CATEGORY_EMOJI, formatDate, formatPence } from "@/utils";
import { getMember } from "../utils/getMember";
import type { Expense, Settlement, User } from "@/types";
import type { ActivityItem } from "../Groups.types";
import styles from "../Groups.module.css";

type ActivityTabProps = {
  members: User[];
  currentUserId: string;
  expenses: Expense[];
  settlements: Settlement[];
};

const ActivityTab = (props: ActivityTabProps) => {
  const { currentUserId, members,expenses,settlements } = props;

  const activityFeed: ActivityItem[] = [
    ...expenses.map((e) => ({ ...e, kind: "expense" as const })),
    ...settlements.map((s) => ({ ...s, kind: "settlement" as const })),
  ].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  
  return (
    <div className={styles.card}>
      {activityFeed.length === 0 && (
        <p className={styles.emptyActivity}>No activity yet</p>
      )}

      {activityFeed.map((item) =>
        item.kind === "expense" ? (
          <div key={item.id} className={styles.activityItem}>
            <span className={styles.activityEmoji}>
              {CATEGORY_EMOJI[item.category]}
            </span>
            <div className={styles.activityBody}>
              <p className={styles.activityTitle}>{item.description}</p>
              <p className={styles.activityMeta}>
                {getMember(item.paidBy, members)?.id === currentUserId
                  ? "You"
                  : getMember(item.paidBy, members)?.name}{" "}
                paid · {formatDate(item.createdAt)}
              </p>
            </div>
            <span className={styles.activityAmount}>
              {formatPence(item.amountPence)}
            </span>
          </div>
        ) : (
          <div key={item.id} className={styles.activityItem}>
            <span className={styles.activityEmoji}>💸</span>
            <div className={styles.activityBody}>
              <p className={styles.activityTitle}>
                {getMember(item.payerId, members)?.id === currentUserId
                  ? "You"
                  : getMember(item.payerId, members)?.name}{" "}
                paid{" "}
                {getMember(item.payeeId, members)?.id === currentUserId
                  ? "you"
                  : getMember(item.payeeId, members)?.name}
              </p>
              <p className={styles.activityMeta}>
                {formatDate(item.createdAt)}
              </p>
            </div>
            <div className={styles.activityRight}>
              <span
                className={cn(styles.activityAmount, styles.activityAmountPos)}
              >
                {formatPence(item.amountPence)}
              </span>
              <span
                className={cn(
                  styles.activityStatus,
                  item.status === "completed"
                    ? styles.activityStatusCompleted
                    : styles.activityStatusPending
                )}
              >
                {item.status}
              </span>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default ActivityTab;
