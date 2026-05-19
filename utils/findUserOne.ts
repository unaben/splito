import { Db } from '@/types'

export const findUserOne = (db: Db) => {
  return db.users.find((u) => u.id === "user-1")
}
