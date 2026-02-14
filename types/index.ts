// User profile — maps to "users_profile" table
export interface UserProfile {
  id: string; // uuid
  email: string;
  display_name: string;
  timezone: string;
  saves_left: number;
  saves_month: string; // date
  saves_monthly_quota: number;
  created_at: string;
  updated_at: string;
}

// User stats — maps to "user_stats" table
export interface UserStats {
  user_id: string; // uuid, FK → users_profile.id
  xp_total: number;
  level: number;
  streak_current: number;
  streak_best: number;
  last_quest_completed_at: string | null; // date
  quests_completed_total: number;
  raid_boss_events_completed: number;
  updated_at: string;
}

// Daily quest template — maps to "dailyQuest" table
export interface DailyQuest {
  id: string; // uuid
  title: string;
  description: string;
  category: QuestCategory;
  xp_reward: number;
  estimated_minutes: number;
  proof_type: string;
  is_daily: boolean;
  weight: number;
  active: boolean;
  created_at: string;
}

export type QuestCategory =
  | "cleanup"
  | "volunteer"
  | "kindness"
  | "environment"
  | "community";

// Quest assignment — maps to "dailyQuestAssignment" table
export interface DailyQuestAssignment {
  id: string; // uuid
  user_id: string;
  quest_id: string;
  assigned_date: string; // date
  status: "assigned" | "completed" | "expired";
  proof_payload: Record<string, unknown> | null; // jsonb
  completed_at: string | null;
  emailed_at: string | null;
  created_at: string;
}

// Leaderboard entry — derived from user_stats + users_profile
export interface LeaderboardEntry {
  user_id: string;
  display_name: string;
  xp_total: number;
  level: number;
  streak_current: number;
  quests_completed_total: number;
}

// Organization — maps to "organization" table
export interface Organization {
  id: string; // uuid
  name: string;
  contact_email: string | null;
  website: string | null;
  verified: boolean;
  created_at: string;
}

// Raid boss event — maps to "raidBossEvent" table
export interface RaidBossEvent {
  id: string; // uuid
  org_id: string;
  title: string;
  description: string;
  location_text: string | null;
  start_time: string;
  end_time: string;
  capacity: number;
  xp_reward: number;
  status: string;
  created_at: string;
}

// Raid boss RSVP — maps to "raidBossRsvp" table
export interface RaidBossRsvp {
  event_id: string;
  user_id: string;
  status: string;
  checked_in_at: string | null;
  created_at: string;
}
