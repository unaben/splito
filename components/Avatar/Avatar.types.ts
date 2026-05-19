import type { User } from '@/types'
import type { Size } from '@/types'

export interface AvatarProps {
  user: User
  size?: Size
  className?: string
}

export interface AvatarStackProps {
  users: User[]
  max?: number
}
