import type { User } from "@/types";

export interface MemberListProps {
  members: User[];
  currentUser: User;
  currentUserId: string;
}
