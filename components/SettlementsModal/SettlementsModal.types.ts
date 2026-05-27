import type { Group, User, SimplifiedDebt } from '@/types'

export interface SettleUpModalProps {
  group: Group
  debts: SimplifiedDebt[]
  members: User[]
  currentUserId: string
}
