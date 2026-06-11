import Link from "next/link";
import { redirect } from "next/navigation";
import { AvatarStack } from "@/components/Avatar";
import { formatPence, formatRelative } from "@/utils/balance/balance";
import {
  fetchDashboardData,
  getGroupBalances,
  getGroupsWithBalance,
  getMembersById,
  getPayersById,
} from "./utils";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import styles from "./Dashboard.module.css";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const currentUserId = (session?.user as { id?: string } | undefined)?.id;

  if (!currentUserId) {
    redirect("/login");
  }

  const { groupBalances, recentActivity, groups } = await fetchDashboardData(
    currentUserId
  );
  const groupsWithBalance = getGroupsWithBalance(groupBalances, groups);
  const { totalOwed, totalOwing } = getGroupBalances(groupBalances);
  const membersById = await getMembersById(groups, currentUserId);
  const payersById = await getPayersById(currentUserId, recentActivity);

  return (
    <main className={styles.main}>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>You are owed</p>
          <p className={`${styles.statValue} ${styles.statValuePositive}`}>
            {formatPence(totalOwed)}
          </p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>You owe</p>
          <p className={`${styles.statValue} ${styles.statValueNegative}`}>
            {formatPence(totalOwing)}
          </p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Groups</p>
          <p className={styles.statValue}>{groups.length}</p>
        </div>
      </div>
      <section>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Your groups</h2>
          <Link href="/groups/new" className={styles.sectionLink}>
            + New group
          </Link>
        </div>

        {groups.length === 0 ? (
          <div className={styles.empty}>
            <p className={styles.emptyIcon}>🧾</p>
            <p className={styles.emptyTitle}>No groups yet</p>
            <p className={styles.emptyText}>
              Create your first group to start splitting expenses
            </p>
            <Link href="/groups/new" className={styles.emptyBtn}>
              Create group
            </Link>
          </div>
        ) : (
          <div className={styles.groupList}>
            {groupsWithBalance.map(({ group, balance }) => {
              const members = group.memberIds
                .map((id) => membersById[id])
                .filter(Boolean);
              return (
                <Link
                  key={group.id}
                  href={`/groups/${group.id}`}
                  className={styles.groupCard}
                >
                  <div className={styles.groupLeft}>
                    <div className={styles.groupEmoji}>{group.emoji}</div>
                    <div>
                      <p className={styles.groupName}>{group.name}</p>
                      <div className={styles.groupMeta}>
                        <AvatarStack users={members} max={4} />
                        <span className={styles.groupMemberCount}>
                          {members.length} members
                        </span>
                      </div>
                    </div>
                  </div>

                  {balance > 0 && (
                    <span className={styles.badgePositive}>
                      owed {formatPence(balance)}
                    </span>
                  )}
                  {balance < 0 && (
                    <span className={styles.badgeNegative}>
                      you owe {formatPence(Math.abs(balance))}
                    </span>
                  )}
                  {balance === 0 && (
                    <span className={styles.badgeNeutral}>settled up</span>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </section>
      {recentActivity.length > 0 && (
        <section>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Recent activity</h2>
          </div>
          <div className={styles.activityList}>
            {recentActivity.map((expense) => {
              const payer = payersById[expense.paidBy];
              const myShare = expense.splits.find(
                (s) => s.userId === currentUserId
              );
              const isMyPayment = expense.paidBy === currentUserId;
              const netEarned =
                expense.amountPence -
                (expense.splits.find((s) => s.userId === currentUserId)
                  ?.amountPence ?? 0);

              return (
                <Link
                  key={expense.id}
                  href={`/groups/${expense.groupId}`}
                  className={styles.activityItem}
                >
                  <span className={styles.activityEmoji}>
                    {expense.groupEmoji}
                  </span>

                  <div className={styles.activityBody}>
                    <p className={styles.activityDesc}>{expense.description}</p>
                    <p className={styles.activityMeta}>
                      {isMyPayment ? "You" : payer?.name} paid ·{" "}
                      {expense.groupName} · {formatRelative(expense.createdAt)}
                    </p>
                  </div>

                  {myShare && !isMyPayment && (
                    <span className={styles.activityAmountNeg}>
                      -{formatPence(myShare.amountPence)}
                    </span>
                  )}
                  {isMyPayment && netEarned > 0 && (
                    <span className={styles.activityAmountPos}>
                      +{formatPence(netEarned)}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}
