import Link from "next/link";
import { getCurrentUser } from "@/lib/mockAuth";
import SignoutButton from "@/components/SignoutButton/SignoutButton";
import { Avatar } from "../Avatar";
import { getUser } from "@/services/store";
import styles from "./Navbar.module.css";

export async function Navbar() {
  const user = await getCurrentUser();
  const storedUser = await getUser(user.id);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/dashboard" className={styles.logo}>
          spli<span className={styles.logoAccent}>to</span>
        </Link>
        <div className={styles.nav}>
          <div className={styles.userInfo}>
            <Avatar user={storedUser} size="sm" />
            <span className={styles.userName}>{user.name.split(" ")[0]}</span>
          </div>
          <Link href="/members" className={styles.navLink}>
            Members
          </Link>
          <Link href="/groups/new" className={styles.newGroupBtn}>
            + New group
          </Link>
          <SignoutButton />
        </div>
      </div>
    </header>
  );
}
