import Link from "next/link";
import styles from "./Dashboard.module.css";

export default async function Dashboard() {
  return (
    <main className={styles.main}>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>You are owed</p>
          <p className={`${styles.statValue} ${styles.statValuePositive}`}>
            20.00
          </p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>You owe</p>
          <p className={`${styles.statValue} ${styles.statValueNegative}`}>
            10.00
          </p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Groups</p>
          <p className={styles.statValue}>1</p>
        </div>
      </div>
      <section>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Your groups</h2>
          <Link href="/groups/new" className={styles.sectionLink}>
            + New group
          </Link>
        </div>

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
      </section>
    </main>
  );
}
