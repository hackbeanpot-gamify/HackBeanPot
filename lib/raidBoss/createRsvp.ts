/**
 * lib/raidBoss/createRsvp.ts
 *
 * Inserts or updates an RSVP row in raidBossRsvp.
 * Uses UPSERT on the composite PK (event_id, user_id) so
 * calling this twice for the same event+user is safe.
 */

import { getSupabaseAdminClient } from "@/lib/supabase/adminClient";

/**
 * Create or update an RSVP for a raid boss event.
 *
 * @param eventId - The raidBossEvent UUID
 * @param userId  - The user's UUID
 * @param status  - RSVP status, defaults to "going"
 * @returns true on success, false on error
 */
export async function createRsvp(
  eventId: string,
  userId: string,
  status: string = "going"
): Promise<boolean> {
  const supabase = getSupabaseAdminClient();

  const { error } = await supabase
    .from("raidBossRsvp")
    .upsert(
      {
        event_id: eventId,
        user_id: userId,
        status,
        checked_in_at: null,
        created_at: new Date().toISOString(),
      },
      { onConflict: "event_id,user_id" }
    );

  if (error) {
    console.error("[createRsvp] Upsert failed:", error.message);
    return false;
  }

  return true;
}
