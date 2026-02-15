/**
 * lib/raidBoss/getAllRaidBossEvents.ts
 *
 * Fetches all raid boss events from the raidBossEvent table,
 * regardless of status. Used to populate the Boss Quests tent.
 */

import { getSupabaseAdminClient } from "@/lib/supabase/adminClient";
import type { RaidBossEvent } from "@/types";

/**
 * Get all raid boss events, ordered by start time.
 *
 * @returns Array of all RaidBossEvent objects
 */
export async function getAllRaidBossEvents(): Promise<RaidBossEvent[]> {
  const supabase = getSupabaseAdminClient();

  const { data, error } = await supabase
    .from("raidBossEvent")
    .select("*")
    .order("start_time", { ascending: true });

  if (error) {
    console.error("[getAllRaidBossEvents] Query failed:", error.message);
    return [];
  }

  return (data as RaidBossEvent[]) || [];
}
