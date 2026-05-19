import { Navbar } from "@/components/Navbar";
import { Dashboard } from "@/components/Dashboard";
import styles from "./dashboard.module.css";

export default async function DashboardPage() {
  return (
    <div className={styles.page}>
      <Navbar />
      <Dashboard />
    </div>
  );
}
