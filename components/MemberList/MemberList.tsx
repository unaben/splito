"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/Avatar";
import { EditMemberForm } from "../EditMemberForm";
import type { MemberListProps } from "./MemberList.types";
import styles from "./MemberList.module.css";

 function MemberList({ members, currentUserId }: MemberListProps) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);

  function handleSaved() {
    setEditingId(null);
    router.refresh();
  }

  return (
    <div className={styles.list}>
      {members.map((member) => {
        const isCurrentUser = member.id === currentUserId;
        const isEditing = editingId === member.id;

        return (
          <div key={member.id} className={styles.row}>
            <div className={styles.rowTop}>
              <div className={styles.memberInfo}>
                <Avatar user={member} size="md" />
                <div>
                  <p className={styles.memberName}>
                    {isCurrentUser ? `${member.name} (you)` : member.name}
                  </p>
                  <p className={styles.memberEmail}>{member.email}</p>
                </div>
              </div>
              {!isCurrentUser && (
                <button
                  className={styles.editBtn}
                  onClick={() => setEditingId(isEditing ? null : member.id)}
                >
                  {isEditing ? "Close" : "Edit"}
                </button>
              )}

              {isCurrentUser && (
                <span className={styles.youBadge}>Account holder</span>
              )}
            </div>
            {isEditing && (
              <EditMemberForm
                user={member}
                onCancel={() => setEditingId(null)}
                onSaved={handleSaved}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default MemberList