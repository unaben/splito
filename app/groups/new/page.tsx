import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { CreateGroupForm } from "@/components/CreateGroupForm";
import styles from "./newGroup.module.css";

export default async function NewGroupPage() {
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
        <CreateGroupForm />
      </main>
    </div>
  );
}
