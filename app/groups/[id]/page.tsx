import { Navbar } from "@/components/Navbar";
import Groups from "@/components/Groups/Groups";
import styles from "./group.module.css";

interface GroupsProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function GroupPage({ params, searchParams }: GroupsProps) {
  const { id } = await params;
  const { tab } = await searchParams;

  return (
    <div className={styles.page}>
      <Navbar />
      <Groups id={id} searchParams={tab} />
    </div>
  );
}
