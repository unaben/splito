import type { User } from "@/types";

export interface EditMemberFormProps {
  user: User;
  onCancel: () => void;
  onSaved: () => void;
  currentUserId: string
}