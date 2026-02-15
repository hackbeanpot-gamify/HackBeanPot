/**
 * lib/raidBoss/getUserRsvps.ts
 *
 * Fetches all active RSVPs for a user, joined with raidBossEvent
 * to return full event details. Only includes RSVPs where
 * status is 'going' or 'interested'.
 */

import { getSupabaseAdminClient } from "@/lib/supabase/adminClient";
import type { RaidBossEvent } from "@/types";

/**
 * Get all raid boss events a user has actively RSVP'd to.
 *
 * @param userId - The user's UUID
 * @returns Array of RaidBossEvent objects, ordered by start_time ascending
 */
export async function getUserRsvps(userId: string): Promise<RaidBossEvent[]> {
  const supabase = getSupabaseAdminClient();

  // Join raidBossRsvp → raidBossEvent, keep only active statuses
  const { data, error } = await supabase
    .from("raidBossRsvp")
    .select("status, raidBossEvent!inner(*)")
    .eq("user_id", userId)
    .in("status", ["going", "interested"]);

  if (error) {
    console.error("[getUserRsvps] Query failed:", error.message);
    return [];
  }

  // Extract the nested event objects and sort by start_time
  const events = (data || [])
    .map((row: Record<string, unknown>) => row.raidBossEvent as RaidBossEvent)
    .filter(Boolean)
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());

  return events;
}
