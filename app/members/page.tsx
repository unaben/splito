import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUser, getMockMembers } from "@/lib/db";
import { MemberList } from "@/components/MemberList";
import { Navbar } from "@/components/Navbar";
import styles from "./members.module.css";

export default async function MembersPage() {
  const session = await getServerSession(authOptions);
  const currentUserId = (session?.user as { id?: string } | undefined)?.id;
  if (!currentUserId) redirect("/login");

  const [currentUser, mockMembers] = await Promise.all([
    getUser(currentUserId),
    getMockMembers(currentUserId),
  ]);

  if (!currentUser) redirect("/login");

  return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Members</h1>
            <p className={styles.subtitle}>
              People you split expenses with. Add or edit them here —
              they&apos;ll appear in the member picker when creating a group.
            </p>
          </div>
        </div>

        <MemberList
          members={mockMembers}
          currentUser={currentUser}
          currentUserId={currentUserId}
        />
      </main>
    </div>
  );
}
