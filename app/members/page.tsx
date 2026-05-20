import { MemberList } from "@/components/MemberList";
import { Navbar } from "@/components/Navbar";
import { getCurrentUserId } from "@/lib/mockAuth";
import { getAllUsers } from "@/services/store";
import styles from "./members.module.css";

export default async function MembersPage() {
  const [allUsers, currentUserId] = await Promise.all([
    getAllUsers(),
    getCurrentUserId(),
  ]);

  const sorted = [
    ...allUsers.filter((u) => u.id === currentUserId),
    ...allUsers.filter((u) => u.id !== currentUserId),
  ];

  return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Group members</h1>
            <p className={styles.subtitle}>
              Personalize the people who appear in your groups. Your own profile
              is managed separately.
            </p>
          </div>
        </div>

        <MemberList members={sorted} currentUserId={currentUserId} />
      </main>
    </div>
  );
}
