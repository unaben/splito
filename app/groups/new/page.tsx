import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { CreateGroupForm } from "@/components/CreateGroupForm";
import { getCurrentUserId } from "@/lib/mockAuth";
import { getAllUsers } from "@/lib/db";
import styles from "./newGroup.module.css";

export default async function NewGroupPage() {
  const currentUserId = await getCurrentUserId();
  const allUsers = await getAllUsers(currentUserId);

  const otherGroupMembers = allUsers.filter(
    (user) => user.id !== currentUserId
  );

  return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.main}>
        <Link href="/dashboard" className={styles.backLink}>
          ← Back to dashboard
        </Link>
        <h1 className={styles.heading}>Create a group</h1>
        <p className={styles.subheading}>
          Add friends and start splitting expenses
        </p>
        <CreateGroupForm users={otherGroupMembers} />
      </main>
    </div>
  );
}
