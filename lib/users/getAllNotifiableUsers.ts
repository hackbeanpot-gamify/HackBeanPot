/**
 * lib/users/getAllNotifiableUsers.ts
 *
 * Fetches all users who should receive daily quest assignments and emails.
 *
 * WHY THIS EXISTS:
 * The daily quest job iterates over every user. This function encapsulates
 * the query so the orchestrator doesn't know about table names or filters.
 *
 * DATA SOURCE: public.users_profile
 *   - id (uuid) — primary key, matches auth.users.id
 *   - email (text) — the user's email address
 *   - display_name (text) — for email personalization
 *
 * RETURNS:
 * Array of { id, email, display_name }. Empty array on error (never throws).
 */

import { supabaseAdmin } from "@/lib/supabaseAdmin";
import type { NotifiableUser } from "@/lib/quests/types";

/**
 * Fetch all users with a valid email from users_profile.
 *
 * @returns Array of notifiable users. Returns [] on error.
 */
export async function getAllNotifiableUsers(): Promise<NotifiableUser[]> {
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("id, email, display_name")
    .not("email", "is", null)
    .neq("email", "");

  if (error) {
    console.error("[getAllNotifiableUsers] Query failed:", error.message);
    return [];
  }

  return (data ?? []) as NotifiableUser[];
}
