import { Navbar } from "@/components/Navbar";
import Groups from "@/components/Groups/Groups";
import type { GroupPageProps } from "./group.types";
import styles from "./group.module.css";

export default async function GroupPage({
  params,
  searchParams,
}: GroupPageProps) {
  const { id } = await params;
  const { tab } = await searchParams;

  return (
    <div className={styles.page}>
      <Navbar />
      <Groups id={id} searchParams={tab} />
    </div>
  );
}
