import Link from "next/link";
import SignoutButton from "@/components/SignoutButton/SignoutButton";
import styles from "./Navbar.module.css";

export async function Navbar() {

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/dashboard" className={styles.logo}>
          spli<span className={styles.logoAccent}>to</span>
        </Link>

        <div className={styles.right}>
          <Link href="/groups/new" className={styles.newGroupBtn}>
            + New group
          </Link>
          <SignoutButton />
        </div>
      </div>
    </header>
  );
}
