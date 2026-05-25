"use client";

import ConfirmModal from "../ConfirmModal/ConfirmModal";
import { MAX_MOCK_MEMBERS } from "@/constants";
import { CreateMemberForm } from "../CreateMemberForm";
import { Avatar } from "@/components/Avatar";
import { EditMemberForm } from "../EditMemberForm";
import useMemberList from "./hooks/useMemberList";
import type { MemberListProps } from "./MemberList.types";
import styles from "./MemberList.module.css";

function MemberList(props: MemberListProps) {
  const { members, currentUser, currentUserId } = props;
  const {
    handleAddClick,
    handleCancel,
    handleDelete,
    handleSaved,
    canAddMore,
    deletingMember,
    deletingId,
    isAdding,
    isPending,
    deleteError,
    editingId,
    setIsAdding,
    setEditingId,
    setDeletingId,
  } = useMemberList(members);

  return (
    <>
      {deletingId && deletingMember && (
        <ConfirmModal
          title="Remove member"
          body={`Remove ${deletingMember.name} from your members?`}
          warning={deleteError ?? undefined}
          confirmLabel="Remove"
          isPending={isPending}
          onConfirm={handleDelete}
          onCancel={handleCancel}
        />
      )}
      <div className={styles.listHeader}>
        <span className={styles.memberCount}>
          {members.length} / {MAX_MOCK_MEMBERS} members
        </span>
        {canAddMore && !isAdding && (
          <button className={styles.addBtn} onClick={handleAddClick}>
            + Add member
          </button>
        )}
      </div>
      {isAdding && (
        <div className={styles.addFormWrap}>
          <p className={styles.addFormTitle}>New member</p>
          <CreateMemberForm
            currentUserId={currentUserId}
            onCancel={() => setIsAdding(false)}
            onSaved={handleSaved}
          />
        </div>
      )}
      {members.length === 0 && !isAdding && (
        <div className={styles.empty}>
          <p className={styles.emptyEmoji}>👥</p>
          <p className={styles.emptyTitle}>No members yet</p>
          <p className={styles.emptyText}>
            Add the people you split expenses with. They&apos;ll appear in the
            member picker when you create a group.
          </p>
          <button className={styles.emptyAddBtn} onClick={handleAddClick}>
            + Add your first member
          </button>
        </div>
      )}
      {members.length > 0 && (
        <div className={styles.list}>
          <div className={styles.row}>
            <div className={styles.rowTop}>
              <div className={styles.memberInfo}>
                <Avatar user={currentUser} size="md" />
                <div>
                  <p className={styles.memberName}>{currentUser?.name} (you)</p>
                  <p className={styles.memberEmail}>{currentUser?.email}</p>
                </div>
              </div>
              <span className={styles.youBadge}>Account holder</span>
            </div>
          </div>
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
                    <div className={styles.actions}>
                      <button
                        className={styles.editBtn}
                        onClick={() =>
                          setEditingId(isEditing ? null : member.id)
                        }
                      >
                        {isEditing ? "Close" : "Edit"}
                      </button>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => {
                          setEditingId(null);
                          setDeletingId(member.id);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  )}

                  {isCurrentUser && (
                    <span className={styles.youBadge}>Account holder</span>
                  )}
                </div>

                {isEditing && (
                  <EditMemberForm
                    user={member}
                    currentUserId={currentUserId}
                    onCancel={() => setEditingId(null)}
                    onSaved={handleSaved}
                  />
                )}
              </div>
            );
          })}
          {!canAddMore && (
            <p className={styles.limitNote}>
              Maximum of {MAX_MOCK_MEMBERS} members reached. Edit existing
              members to update their details.
            </p>
          )}
        </div>
      )}
    </>
  );
}

export default MemberList;
