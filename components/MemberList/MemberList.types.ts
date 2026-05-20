import type { User } from "@/types";

export interface MemberListProps {
  members: User[];
  currentUserId: string;
}
