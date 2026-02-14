// User profile stored in Supabase
export interface User {
  id: string;
  email: string;
  username: string;
  avatar_url?: string;
  city: string;
  xp: number;
  level: number;
  streak: number;
  created_at: string;
  updated_at: string;
}

// Daily quest / micro-task
export interface Quest {
  id: string;
  user_id: string;
  title: string;
  description: string;
  xp_reward: number;
  category: QuestCategory;
  difficulty: "easy" | "medium" | "hard";
  is_completed: boolean;
  created_at: string;
  expires_at: string;
}

export type QuestCategory =
  | "cleanup"
  | "volunteer"
  | "kindness"
  | "environment"
  | "community";

// Community report / concern
export interface Report {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: string;
  location?: string;
  upvotes: number;
  status: "open" | "in_progress" | "resolved";
  created_at: string;
}

// Leaderboard entry
export interface LeaderboardEntry {
  rank: number;
  user_id: string;
  username: string;
  avatar_url?: string;
  xp: number;
  level: number;
  streak: number;
}

// Raid Boss community event
export interface RaidEvent {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  xp_reward: number;
  max_participants: number;
  current_participants: number;
  organizer_id: string;
  created_at: string;
}
