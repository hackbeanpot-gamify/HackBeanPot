/**
 * lib/raidBoss/getUserByEmail.ts
 *
 * Resolves a user's ID from the profiles table by email address.
 * Used as the first step in all server-side flows that need
 * to identify the current user (hardcoded to Jackson for demo).
 */

import { getSupabaseAdminClient } from "@/lib/supabase/adminClient";

/**
 * Look up a user's UUID by their email address.
 *
 * @param email - The email to search for in profiles.email
 * @returns The user's UUID string, or null if not found / on error
 */
export async function getUserByEmail(email: string): Promise<string | null> {
  const supabase = getSupabaseAdminClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", email)
    .single();

  if (error || !data) {
    console.error("[getUserByEmail] Could not resolve user:", email, error?.message);
    return null;
  }

  return data.id;
}
