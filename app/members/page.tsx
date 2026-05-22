import { MemberList } from "@/components/MemberList";
import { Navbar } from "@/components/Navbar";
import { getCurrentUserId } from "@/lib/mockAuth";
import { getAllUsers } from "@/lib/db";
import styles from "./members.module.css";
import Link from "next/link";

export default async function MembersPage() {
  const [allUsers, currentUserId] = await Promise.all([
    getAllUsers(),
    getCurrentUserId(),
  ]);

  const sortedMembers = [
    ...allUsers.filter((u) => u.id === currentUserId),
    ...allUsers.filter((u) => u.id !== currentUserId),
  ];

  return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.main}>
        <Link href="/dashboard" className={styles.backLink}>
          ← Back to dashboard
        </Link>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Group members</h1>
            <p className={styles.subtitle}>
              Personalize the people who appear in your groups. Your own profile
              is managed separately.
            </p>
          </div>
        </div>

        <MemberList members={sortedMembers} currentUserId={currentUserId} />
      </main>
    </div>
  );
}
