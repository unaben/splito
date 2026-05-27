import type { Group, User } from '@/types'

export interface AddExpenseModalProps {
  group: Group
  members: User[]
  currentUserId: string
}
