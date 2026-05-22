/**
 * ─────────────────────────────────────────────────────────────
 * Supabase client singleton.
 *
 * Uses the service role key so API routes can read and write
 * without being blocked by Row Level Security policies.
 *
 * NEVER expose the service role key to the browser —
 * it is only imported in server-side files (API routes,
 * server actions, server components).
 * ─────────────────────────────────────────────────────────────
 */
 
import { Database } from "@/types/database.types"
import { createClient } from "@supabase/supabase-js"
 
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
 
if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables."
  )
}
 
export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    // We manage auth ourselves via NextAuth — disable Supabase Auth
    persistSession: false,
    autoRefreshToken: false,
  },
})