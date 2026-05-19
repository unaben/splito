import Link from "next/link";
import styles from "./Groups.module.css";

const Groups = () => {
  return (
    <main className={styles.main}>
      <div>
        <Link href="/dashboard" className={styles.backLink}>
          ← Dashboard
        </Link>
      </div>
    </main>
  );
};

export default Groups;
