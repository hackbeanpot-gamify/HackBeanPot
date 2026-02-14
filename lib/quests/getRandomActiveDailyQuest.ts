/**
 * lib/quests/getRandomActiveDailyQuest.ts
 *
 * Picks one random quest from the active daily quest catalog.
 *
 * WHY THIS EXISTS:
 * When assigning a quest to a user, we select from the pool.
 * This function encapsulates selection so the assignment layer
 * doesn't need to know about table structure or filtering.
 *
 * SELECTION LOGIC:
 * 1. Fetch all quests where is_daily = true AND active = true.
 * 2. Apply weighted random selection (higher weight = more likely).
 *
 * TABLE: public.dailyQuest
 */

import { supabaseAdmin } from "@/lib/supabaseAdmin";
import type { Quest } from "@/lib/quests/types";
/**
 * Weighted random pick. Quests with higher `weight` are more likely.
 *
 * @param quests - Non-empty array of quests.
 * @returns The selected quest.
 */
function weightedRandomPick(quests: Quest[]): Quest {
  const totalWeight = quests.reduce((sum, q) => sum + (q.weight ?? 1), 0);
  let roll = Math.random() * totalWeight;

  for (const q of quests) {
    roll -= q.weight ?? 1;
    if (roll <= 0) return q;
  }

  return quests[quests.length - 1];
}

/**
 * Fetch one random active daily quest from public.dailyQuest.
 *
 * @returns A Quest object, or null if pool is empty / query fails.
 */
export async function getRandomActiveDailyQuest(): Promise<Quest | null> {
  const { data, error } = await supabaseAdmin
    .from("dailyQuest")
    .select("*")
    .eq("is_daily", true)
    .eq("active", true);

  if (error) {
    console.error("[getRandomActiveDailyQuest] Query failed:", error.message);
    return null;
  }

  if (!data || data.length === 0) {
    console.warn("[getRandomActiveDailyQuest] Quest pool is empty.");
    return null;
  }

  return weightedRandomPick(data as Quest[]);
}
