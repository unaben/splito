import { Navbar } from "@/components/Navbar";
import Groups from "@/components/Groups/Groups";
import styles from "./group.module.css";

export default async function GroupPage() {
  return (
    <div className={styles.page}>
      <Navbar />
      <Groups />
    </div>
  );
}