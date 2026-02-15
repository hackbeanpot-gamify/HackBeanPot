/**
 * lib/users/getUsersWithEmails.ts
 *
 * Fetches all users who have a valid email address.
 *
 * WHY THIS EXISTS:
 * The email job needs a user list. This function encapsulates the
 * query so the job runner doesn't know about table structure.
 *
 * TABLE: public.profiles
 */

import { getSupabaseAdminClient } from "@/lib/supabase/adminClient";

/** Minimal user shape for the email job. */
export interface EmailableUser {
  id: string;
  email: string;
  display_name: string | null;
}

/**
 * Fetch all users from users_profile who have a non-empty email.
 *
 * @returns Array of { id, email, display_name }. Empty array on error.
 */
export async function getUsersWithEmails(): Promise<EmailableUser[]> {
  const supabase = getSupabaseAdminClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, display_name")
    .not("email", "is", null)
    .neq("email", "");

  if (error) {
    console.error("[getUsersWithEmails] Query failed:", error.message);
    return [];
  }

  return (data ?? []) as EmailableUser[];
}
