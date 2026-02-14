/**
 * lib/quests/getTodaysQuest.ts
 *
 * Fetches today's assigned quest for a user.
 * If no quest is assigned yet, picks one and assigns it.
 * Handles repeat avoidance (14-day window) and expiry.
 *
 * TABLES USED:
 *   public.dailyQuest            — quest catalog (snake_case columns)
 *   public.dailyQuestAssignment  — per-user daily assignments
 *   public.users_profile         — user data
 *
 * This file uses the per-request Supabase client (RLS-aware).
 * For the cron job, see lib/jobs/runDailyQuestJob.ts instead.
 */

import { createClient } from "@/lib/supabase/server";
import type { Quest, Assignment, NotifiableUser } from "./types";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

// ─── Helpers ────────────────────────────────────────────────

/**
 * Get today's date string in America/New_York timezone.
 * @returns "YYYY-MM-DD" format, e.g. "2025-02-15"
 */
function getTodayDateString(): string {
  return new Date().toLocaleDateString("en-CA", {
    timeZone: "America/New_York",
  });
}

/**
 * Weighted random pick — quests with higher `weight` are more likely.
 */
function weightedPick<T extends { weight?: number }>(items: T[]): T {
  const totalWeight = items.reduce((sum, q) => sum + (q.weight ?? 1), 0);
  let random = Math.random() * totalWeight;

  for (const item of items) {
    random -= item.weight ?? 1;
    if (random <= 0) return item;
  }

  return items[items.length - 1];
}

// ─── Internal Functions ─────────────────────────────────────

/**
 * Mark any past assigned quests as expired.
 * Assignments older than today with status "assigned" become "expired".
 */
async function expirePastAssignments(
  supabase: SupabaseClient,
  userId: string,
  today: string
): Promise<void> {
  await supabase
    .from("dailyQuestAssignment")
    .update({ status: "expired" })
    .eq("user_id", userId)
    .eq("status", "assigned")
    .lt("assigned_date", today);
}

/**
 * Pick a quest from the active pool, avoiding recently assigned quests.
 * Uses a 14-day window, then falls back to 7-day, then any quest.
 */
async function pickQuest(
  supabase: SupabaseClient,
  userId: string
): Promise<Quest | null> {
  // Get quest IDs assigned in the last 14 days
  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
  const cutoff = fourteenDaysAgo.toISOString().split("T")[0];

  const { data: recentAssignments } = await supabase
    .from("dailyQuestAssignment")
    .select("quest_id")
    .eq("user_id", userId)
    .gte("assigned_date", cutoff);

  const recentIds = (recentAssignments ?? []).map((r) => r.quest_id);

  // Get all active daily quests
  const { data: allDaily } = await supabase
    .from("dailyQuest")
    .select("*")
    .eq("is_daily", true)
    .eq("active", true);

  if (!allDaily || allDaily.length === 0) return null;

  // Filter out recently assigned quests
  const eligible = allDaily.filter((q) => !recentIds.includes(q.id));

  if (eligible.length > 0) {
    return weightedPick(eligible) as unknown as Quest;
  }

  // Fallback: widen to 7-day window
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const narrowCutoff = sevenDaysAgo.toISOString().split("T")[0];

  const { data: narrowRecent } = await supabase
    .from("dailyQuestAssignment")
    .select("quest_id")
    .eq("user_id", userId)
    .gte("assigned_date", narrowCutoff);

  const narrowIds = (narrowRecent ?? []).map((r) => r.quest_id);
  const widerEligible = allDaily.filter((q) => !narrowIds.includes(q.id));

  if (widerEligible.length > 0) {
    return weightedPick(widerEligible) as unknown as Quest;
  }

  // Final fallback: any active daily quest
  return weightedPick(allDaily) as unknown as Quest;
}

// ─── Exported Functions ─────────────────────────────────────

/**
 * Get today's quest for a user. Assigns one if none exists yet.
 *
 * Flow:
 *   1. Expire any past pending assignments.
 *   2. Check if user already has an assignment for today.
 *   3. If yes → return it with joined quest data.
 *   4. If no  → pick a random quest → create assignment → return.
 *
 * @param userId - The user's UUID (from users_profile.id).
 * @returns { quest, assignment } or null if no quests available.
 */
export async function getTodaysQuestForUser(
  userId: string
): Promise<{ quest: Quest; assignment: Assignment } | null> {
  const supabase = await createClient();
  const today = getTodayDateString();

  // Step 1: Expire past pending assignments
  await expirePastAssignments(supabase, userId, today);

  // Step 2: Check for existing assignment today (with joined quest)
  const { data: existing } = await supabase
    .from("dailyQuestAssignment")
    .select("*, dailyQuest(*)")
    .eq("user_id", userId)
    .eq("assigned_date", today)
    .limit(1)
    .single();

  if (existing && existing.dailyQuest) {
    return {
      quest: existing.dailyQuest as unknown as Quest,
      assignment: existing as unknown as Assignment,
    };
  }

  // Step 3: No quest today — pick and assign one
  const quest = await pickQuest(supabase, userId);
  if (!quest) return null;

  const { data: newAssignment, error } = await supabase
    .from("dailyQuestAssignment")
    .insert({
      user_id: userId,
      quest_id: quest.id,
      assigned_date: today,
      status: "assigned",
    })
    .select("*")
    .single();

  if (error) {
    console.error("[getTodaysQuest] Insert failed:", error.message);
    return null;
  }

  return {
    quest,
    assignment: newAssignment as unknown as Assignment,
  };
}

/**
 * Get user info by ID for email notifications.
 *
 * @param userId - The user's UUID.
 * @returns User profile data, or null if not found.
 */
export async function getQuestUser(
  userId: string
): Promise<NotifiableUser | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("users_profile")
    .select("id, email, display_name")
    .eq("id", userId)
    .limit(1)
    .single();

  return data ? (data as NotifiableUser) : null;
}

/**
 * Get all user IDs with a pending (un-completed) quest today.
 *
 * @returns Array of user_id strings.
 */
export async function getUsersWithPendingQuests(): Promise<string[]> {
  const supabase = await createClient();
  const today = getTodayDateString();

  const { data } = await supabase
    .from("dailyQuestAssignment")
    .select("user_id")
    .eq("assigned_date", today)
    .eq("status", "assigned");

  return (data ?? []).map((r) => r.user_id);
}

/**
 * Mark a quest assignment as completed with proof.
 *
 * @param userId       - The user's UUID.
 * @param assignmentId - The assignment's UUID.
 * @param proofPayload - JSON proof data (photo URL, reflection text, etc.).
 * @returns { success, xpAwarded }
 */
export async function completeQuest(
  userId: string,
  assignmentId: string,
  proofPayload: Record<string, unknown>
): Promise<{ success: boolean; xpAwarded: number }> {
  const supabase = await createClient();

  const { data: assignment } = await supabase
    .from("dailyQuestAssignment")
    .select("*, dailyQuest(xp_reward)")
    .eq("id", assignmentId)
    .eq("user_id", userId)
    .eq("status", "assigned")
    .single();

  if (!assignment) return { success: false, xpAwarded: 0 };

  const xpReward =
    (assignment.dailyQuest as unknown as Quest)?.xp_reward ?? 0;

  const { error } = await supabase
    .from("dailyQuestAssignment")
    .update({
      status: "completed",
      completed_at: new Date().toISOString(),
      proof_payload: proofPayload,
    })
    .eq("id", assignmentId);

  if (error) {
    console.error("[completeQuest] Update failed:", error.message);
    return { success: false, xpAwarded: 0 };
  }

  return { success: true, xpAwarded: xpReward };
}

/**
 * Skip today's quest assignment.
 *
 * @param userId       - The user's UUID.
 * @param assignmentId - The assignment's UUID.
 * @returns true if successfully skipped, false on error.
 */
export async function skipQuest(
  userId: string,
  assignmentId: string
): Promise<boolean> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("dailyQuestAssignment")
    .update({ status: "skipped" })
    .eq("id", assignmentId)
    .eq("user_id", userId)
    .eq("status", "assigned");

  return !error;
}
