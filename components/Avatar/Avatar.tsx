import cn from 'classnames'
import styles from './Avatar.module.css'
import type { AvatarProps, AvatarStackProps } from './Avatar.types'

export function Avatar({ user, size = 'md', className }: AvatarProps) {  
  return (
    <div
      className={cn(styles.avatar, styles[size], className)}
      style={{ background: user?.avatarBg, color: user?.avatarFg }}
      title={user?.name}
    >
      {user?.avatarInitials}
    </div>
  )
}

export function AvatarStack({ users, max = 4 }: AvatarStackProps) {
  const visible   = users?.slice(0, max)
  const remaining = users?.length - max

  return (
    <div className={styles.stack}>
      {visible.map(user => (
        <div key={user.id} className={styles.stackItem}>
          <Avatar user={user} size="sm" className={styles.stackAvatar} />
        </div>
      ))}
      {remaining > 0 && (
        <div className={styles.overflow}>+{remaining}</div>
      )}
    </div>
  )
}
