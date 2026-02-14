/**
 * lib/quests/types.ts
 *
 * Shared TypeScript types for the daily quest system.
 *
 * These types mirror the actual Supabase Postgres tables:
 *   - public.dailyQuest            (quest catalog)
 *   - public.dailyQuestAssignment  (per-user daily assignments)
 *   - public.users_profile         (user data)
 */

// ── Quest Catalog (public.dailyQuest) ──

export type QuestCategory =
  | "cleanup"
  | "environment"
  | "social"
  | "kindness"
  | "community"
  | "civic"
  | "volunteer";

export type ProofType = "checkbox" | "photo" | "reflection";

export interface Quest {
  id: string;               // uuid
  title: string;
  description: string;
  category: string;
  xp_reward: number;
  estimated_minutes: number;
  proof_type: ProofType;
  is_daily: boolean;
  weight: number;
  active: boolean;
  created_at: string;
}

// ── Assignment (public.dailyQuestAssignment) ──

export type AssignmentStatus = "assigned" | "completed" | "skipped" | "expired";

export interface Assignment {
  id: string;               // uuid
  user_id: string;           // uuid → users_profile.id
  quest_id: string;          // uuid → dailyQuest.id
  assigned_date: string;     // date "YYYY-MM-DD"
  status: AssignmentStatus;
  proof_payload: Record<string, unknown> | null;
  completed_at: string | null;
  emailed_at: string | null;
  created_at: string;
  // Joined quest data (when using .select("*, dailyQuest(*)"))
  dailyQuest?: Quest;
}

// ── User Profile (public.users_profile) ──

export interface UserProfile {
  id: string;               // uuid (matches auth.users.id)
  email: string;
  display_name: string | null;
  timezone: string;
  created_at: string;
  updated_at: string;
  saves_left: number;
  saves_month: string;
  saves_monthly_quota: number;
}

/** Minimal user shape needed for the daily quest job + emails. */
export interface NotifiableUser {
  id: string;
  email: string;
  display_name: string | null;
}
