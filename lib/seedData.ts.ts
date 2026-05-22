/**
 * ─────────────────────────────────────────────────────────────
 * Single source of truth for all seed inserts.
 * Called by:
 *   - registerAction  (when groups table is empty on first registration)
 *   - resetAppAction  (after wiping all data)
 *
 * Adding or changing seed data? Edit only this file.
 * ─────────────────────────────────────────────────────────────
 */

import { supabase } from "@/lib/supabase"

export async function insertSeedData(): Promise<void> {
  // Groups
  await supabase.from("groups").insert([
    { id: "group-1", name: "Portugal Trip", description: "Lisbon & Porto, May 2025", emoji: "✈️", created_by: "user-2", created_at: "2025-04-01T10:00:00Z" },
    { id: "group-2", name: "Flat Expenses", description: "Monthly shared costs",     emoji: "🏠", created_by: "user-2", created_at: "2025-03-01T10:00:00Z" },
    { id: "group-3", name: "Work Lunches",  description: "Team lunch rotation",      emoji: "🍜", created_by: "user-2", created_at: "2025-02-01T10:00:00Z" },
  ])

  // Group members
  await supabase.from("group_members").insert([
    { group_id: "group-1", user_id: "user-1" }, { group_id: "group-1", user_id: "user-2" },
    { group_id: "group-1", user_id: "user-3" }, { group_id: "group-1", user_id: "user-4" },
    { group_id: "group-1", user_id: "user-5" },
    { group_id: "group-2", user_id: "user-1" }, { group_id: "group-2", user_id: "user-2" },
    { group_id: "group-2", user_id: "user-3" },
    { group_id: "group-3", user_id: "user-1" }, { group_id: "group-3", user_id: "user-2" },
    { group_id: "group-3", user_id: "user-4" },
  ])

  // Expenses
  await supabase.from("expenses").insert([
    { id: "exp-1", group_id: "group-1", paid_by: "user-2", description: "Airbnb deposit",           amount_pence: 24000, split_type: "equal", category: "accommodation", created_at: "2025-04-10T12:00:00Z" },
    { id: "exp-2", group_id: "group-1", paid_by: "user-2", description: "Dinner at Zé da Mouraria", amount_pence:  9600, split_type: "equal", category: "food",          created_at: "2025-04-20T19:30:00Z" },
    { id: "exp-3", group_id: "group-1", paid_by: "user-3", description: "Fado night tickets",       amount_pence:  7500, split_type: "equal", category: "activities",    created_at: "2025-04-21T20:00:00Z" },
    { id: "exp-4", group_id: "group-2", paid_by: "user-1", description: "Internet bill",            amount_pence:  4500, split_type: "equal", category: "utilities",     created_at: "2025-04-01T09:00:00Z" },
    { id: "exp-5", group_id: "group-2", paid_by: "user-2", description: "Grocery shop",             amount_pence:  9300, split_type: "equal", category: "food",          created_at: "2025-04-15T14:00:00Z" },
  ])

  // Expense splits
  await supabase.from("expense_splits").insert([
    // exp-1: Airbnb deposit (£240 ÷ 5 = £48 each)
    { expense_id: "exp-1", user_id: "user-1", amount_pence: 4800, is_settled: false },
    { expense_id: "exp-1", user_id: "user-2", amount_pence: 4800, is_settled: true  },
    { expense_id: "exp-1", user_id: "user-3", amount_pence: 4800, is_settled: false },
    { expense_id: "exp-1", user_id: "user-4", amount_pence: 4800, is_settled: false },
    { expense_id: "exp-1", user_id: "user-5", amount_pence: 4800, is_settled: true  },
    // exp-2: Dinner (£96 ÷ 5 = £19.20 each)
    { expense_id: "exp-2", user_id: "user-1", amount_pence: 1920, is_settled: false },
    { expense_id: "exp-2", user_id: "user-2", amount_pence: 1920, is_settled: true  },
    { expense_id: "exp-2", user_id: "user-3", amount_pence: 1920, is_settled: false },
    { expense_id: "exp-2", user_id: "user-4", amount_pence: 1920, is_settled: false },
    { expense_id: "exp-2", user_id: "user-5", amount_pence: 1920, is_settled: true  },
    // exp-3: Fado tickets (£75 ÷ 5 = £15 each)
    { expense_id: "exp-3", user_id: "user-1", amount_pence: 1500, is_settled: false },
    { expense_id: "exp-3", user_id: "user-2", amount_pence: 1500, is_settled: false },
    { expense_id: "exp-3", user_id: "user-3", amount_pence: 1500, is_settled: true  },
    { expense_id: "exp-3", user_id: "user-4", amount_pence: 1500, is_settled: false },
    { expense_id: "exp-3", user_id: "user-5", amount_pence: 1500, is_settled: false },
    // exp-4: Internet bill (£45 ÷ 3 = £15 each)
    { expense_id: "exp-4", user_id: "user-1", amount_pence: 1500, is_settled: true  },
    { expense_id: "exp-4", user_id: "user-2", amount_pence: 1500, is_settled: true  },
    { expense_id: "exp-4", user_id: "user-3", amount_pence: 1500, is_settled: false },
    // exp-5: Grocery shop (£93 ÷ 3 = £31 each)
    { expense_id: "exp-5", user_id: "user-1", amount_pence: 3100, is_settled: false },
    { expense_id: "exp-5", user_id: "user-2", amount_pence: 3100, is_settled: true  },
    { expense_id: "exp-5", user_id: "user-3", amount_pence: 3100, is_settled: false },
  ])
}

/**
 * Check whether the groups table is empty.
 * Used by registerAction to decide if seed data needs inserting.
 */
export async function groupsTableIsEmpty(): Promise<boolean> {
  const { count } = await supabase
    .from("groups")
    .select("*", { count: "exact", head: true })
  return (count ?? 0) === 0
}