/**
 * useLeaderboard — React hook for fetching the city-wide user leaderboard.
 *
 * ============================================================================
 * WHAT THIS HOOK DOES
 * ============================================================================
 * - Fetches the top 50 users ranked by total XP
 * - Combines data from user_stats (XP/level/streaks) and users_profile (display names)
 * - Automatically fetches on component mount
 * - Provides loading and error states for UI feedback
 *
 * ============================================================================
 * HOW THE LEADERBOARD WORKS
 * ============================================================================
 *
 * Data sources (2 Supabase tables joined in the API):
 *
 * 1. user_stats table:
 *    - user_id (uuid, FK → users_profile.id)
 *    - xp_total: Total XP earned (PRIMARY SORT KEY)
 *    - level: Calculated from XP
 *    - streak_current: Current consecutive days of quest completion
 *    - streak_best: All-time best streak
 *    - quests_completed_total: Total quests completed
 *    - raid_boss_events_completed: Total raid boss events completed
 *    - last_quest_completed_at: Most recent quest completion timestamp
 *
 * 2. users_profile table:
 *    - id (uuid, primary key)
 *    - display_name: User's public display name
 *    - email: User's email (not included in leaderboard for privacy)
 *    - timezone: User's timezone
 *    - saves_left: Remaining streak saves this month
 *
 * The API:
 * - Fetches top 50 users ordered by xp_total (descending)
 * - Joins with users_profile to get display_name
 * - Returns combined leaderboard entries
 *
 * ============================================================================
 * DATA STRUCTURE
 * ============================================================================
 * Each leaderboard entry contains:
 *
 * {
 *   user_id: string;                 // UUID of the user
 *   display_name: string;            // User's public name (or "Anonymous" if not found)
 *   xp_total: number;                // Total XP earned (sorting key)
 *   level: number;                   // Current level (derived from XP)
 *   streak_current: number;          // Current consecutive days of quest completion
 *   quests_completed_total: number;  // Total quests completed all-time
 * }
 *
 * ============================================================================
 * RANKING LOGIC
 * ============================================================================
 *
 * Users are ranked ONLY by xp_total:
 * - Higher XP = higher rank
 * - Ties are broken by database order (consistent but arbitrary)
 * - Level, streaks, and quest count are displayed but don't affect ranking
 *
 * Example ranking:
 * 1. Casey Lee      — 620 XP, Level 7, 15 streak, 22 quests
 * 2. Maya Patel     — 580 XP, Level 6, 12 streak, 20 quests
 * 3. Jackson Zheng  — 450 XP, Level 5,  7 streak, 15 quests
 *
 * ============================================================================
 * USAGE EXAMPLES
 * ============================================================================
 *
 * Basic leaderboard display:
 * ```tsx
 * import { useLeaderboard } from "@/lib/hooks/useLeaderboard";
 *
 * function LeaderboardPage() {
 *   const { data, loading, error } = useLeaderboard();
 *
 *   if (loading) return <Spinner />;
 *   if (error) return <ErrorMessage message={error} />;
 *
 *   return (
 *     <div>
 *       <h1>City Leaderboard</h1>
 *       <ol>
 *         {data.map((entry, index) => (
 *           <li key={entry.user_id}>
 *             <span className="rank">#{index + 1}</span>
 *             <span className="name">{entry.display_name}</span>
 *             <span className="xp">{entry.xp_total} XP</span>
 *             <span className="level">Level {entry.level}</span>
 *           </li>
 *         ))}
 *       </ol>
 *     </div>
 *   );
 * }
 * ```
 *
 * Detailed leaderboard with all stats:
 * ```tsx
 * function DetailedLeaderboard() {
 *   const { data, loading, error } = useLeaderboard();
 *
 *   if (loading) return <LoadingState />;
 *   if (error) return <ErrorBanner message={error} />;
 *
 *   return (
 *     <table>
 *       <thead>
 *         <tr>
 *           <th>Rank</th>
 *           <th>Name</th>
 *           <th>XP</th>
 *           <th>Level</th>
 *           <th>Streak</th>
 *           <th>Quests</th>
 *         </tr>
 *       </thead>
 *       <tbody>
 *         {data.map((entry, index) => (
 *           <tr key={entry.user_id}>
 *             <td>{index + 1}</td>
 *             <td>{entry.display_name}</td>
 *             <td>{entry.xp_total.toLocaleString()}</td>
 *             <td>{entry.level}</td>
 *             <td>
 *               {entry.streak_current > 0
 *                 ? `${entry.streak_current} 🔥`
 *                 : "-"}
 *             </td>
 *             <td>{entry.quests_completed_total}</td>
 *           </tr>
 *         ))}
 *       </tbody>
 *     </table>
 *   );
 * }
 * ```
 *
 * Highlight top 3 with medals:
 * ```tsx
 * function LeaderboardWithMedals() {
 *   const { data, loading, error } = useLeaderboard();
 *
 *   const medals = ["🥇", "🥈", "🥉"];
 *
 *   if (loading) return <Spinner />;
 *   if (error) return <div>Error: {error}</div>;
 *
 *   return (
 *     <div>
 *       {data.map((entry, index) => (
 *         <div
 *           key={entry.user_id}
 *           className={index < 3 ? "podium" : ""}
 *         >
 *           <span className="medal">{medals[index] || `#${index + 1}`}</span>
 *           <span className="name">{entry.display_name}</span>
 *           <span className="xp">{entry.xp_total} XP</span>
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 *
 * Show user's rank if they're in the leaderboard:
 * ```tsx
 * function MyRank({ currentUserId }: { currentUserId: string }) {
 *   const { data, loading } = useLeaderboard();
 *
 *   if (loading) return <Skeleton />;
 *
 *   const myIndex = data.findIndex(entry => entry.user_id === currentUserId);
 *
 *   if (myIndex === -1) {
 *     return <div>You're not in the top 50 yet. Keep completing quests!</div>;
 *   }
 *
 *   const myEntry = data[myIndex];
 *
 *   return (
 *     <div className="my-rank">
 *       <h3>Your Rank: #{myIndex + 1}</h3>
 *       <p>{myEntry.xp_total} XP • Level {myEntry.level}</p>
 *       <p>{myEntry.streak_current} day streak</p>
 *       <p>{myEntry.quests_completed_total} quests completed</p>
 *     </div>
 *   );
 * }
 * ```
 *
 * ============================================================================
 * RETURN VALUES
 * ============================================================================
 *
 * @returns {Object}
 * @property {LeaderboardEntry[]} data
 *           - Array of top 50 users ordered by XP (highest first)
 *           - Empty array [] if no users exist or if still loading
 * @property {boolean} loading
 *           - true while fetching from API, false otherwise
 * @property {string | null} error
 *           - Error message if fetch failed, null if successful
 *
 * ============================================================================
 * ERROR HANDLING
 * ============================================================================
 *
 * If the API call fails:
 * - data will be an empty array []
 * - error will contain the error message
 * - loading will be false
 *
 * Always check for errors before rendering:
 * ```tsx
 * if (error) {
 *   return (
 *     <div>
 *       <p>Failed to load leaderboard: {error}</p>
 *       <button onClick={() => window.location.reload()}>Retry</button>
 *     </div>
 *   );
 * }
 * ```
 *
 * ============================================================================
 * EMPTY STATE HANDLING
 * ============================================================================
 *
 * If there are no users in the database:
 * - data will be an empty array []
 * - error will be null
 * - loading will be false
 *
 * Handle this in your UI:
 * ```tsx
 * if (!loading && data.length === 0) {
 *   return <EmptyState message="No users on the leaderboard yet. Be the first!" />;
 * }
 * ```
 *
 * ============================================================================
 * PERFORMANCE NOTES
 * ============================================================================
 *
 * - Fetches automatically on component mount
 * - No caching — refetches every time component mounts
 * - Limited to top 50 users (hardcoded in API)
 * - Single API call joins 2 tables (user_stats + users_profile)
 * - No pagination (all 50 users returned at once)
 * - No refetch function (remount component to reload)
 *
 * ============================================================================
 * PRIVACY CONSIDERATIONS
 * ============================================================================
 *
 * What's public:
 * ✅ display_name
 * ✅ xp_total
 * ✅ level
 * ✅ streak_current
 * ✅ quests_completed_total
 *
 * What's private (NOT included):
 * ❌ email
 * ❌ timezone
 * ❌ saves_left
 * ❌ saves_monthly_quota
 * ❌ raid_boss_events_completed
 * ❌ streak_best
 * ❌ last_quest_completed_at
 *
 * ============================================================================
 * REFRESH BEHAVIOR
 * ============================================================================
 *
 * The leaderboard does NOT auto-refresh. To reload:
 *
 * 1. Remount the component:
 * ```tsx
 * const [key, setKey] = useState(0);
 * <LeaderboardComponent key={key} />
 * <button onClick={() => setKey(k => k + 1)}>Refresh</button>
 * ```
 *
 * 2. Or reload the page:
 * ```tsx
 * <button onClick={() => window.location.reload()}>Refresh</button>
 * ```
 *
 * If you need auto-refresh, wrap in a polling interval:
 * ```tsx
 * useEffect(() => {
 *   const interval = setInterval(() => {
 *     setRefreshKey(k => k + 1); // Force remount
 *   }, 60000); // Refresh every 60 seconds
 *   return () => clearInterval(interval);
 * }, []);
 * ```
 *
 * ============================================================================
 * RELATED HOOKS
 * ============================================================================
 *
 * - useQuests() — Fetch daily quests that users complete to earn XP
 * - useReports() — Submit complaints that create/prioritize quests
 *
 * ============================================================================
 * TYPESCRIPT TYPES
 * ============================================================================
 *
 * LeaderboardEntry (imported from @/types):
 * ```ts
 * interface LeaderboardEntry {
 *   user_id: string;
 *   display_name: string;
 *   xp_total: number;
 *   level: number;
 *   streak_current: number;
 *   quests_completed_total: number;
 * }
 * ```
 */
"use client";

import { useState, useEffect } from "react";
import { LeaderboardEntry } from "@/types";

interface UseLeaderboardReturn {
  /** Top 50 users ordered by XP (highest first) */
  data: LeaderboardEntry[];
  /** True while fetching from API, false otherwise */
  loading: boolean;
  /** Error message if fetch failed, null if successful */
  error: string | null;
}

export function useLeaderboard(): UseLeaderboardReturn {
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const response = await fetch("/api/leaderboard");
        if (!response.ok) throw new Error("Failed to fetch leaderboard");
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, []);

  return { data, loading, error };
}
