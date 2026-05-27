import type { Expense, User } from '@/types'

export interface ExpenseListProps {
  expenses: Expense[]
  members: User[]
  currentUserId: string
  groupId: string
}
