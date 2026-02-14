/**
 * useQuests — React hook for fetching active daily quests from the database.
 *
 * ============================================================================
 * WHAT THIS HOOK DOES
 * ============================================================================
 * - Fetches all active daily quests from the "dailyQuest" Supabase table
 * - Quests are ordered by weight (priority) — higher weight = more complaints about that issue
 * - Automatically fetches on component mount
 * - Provides a refetch function to manually reload quests
 *
 * ============================================================================
 * HOW QUESTS ARE CREATED
 * ============================================================================
 * Quests are NOT manually created. They're generated automatically when users
 * submit complaints via the useReports hook:
 *
 * 1. User submits complaint string (e.g., "trash on Beacon St")
 * 2. Complaint goes to POST /api/reports endpoint
 * 3. Gemini AI analyzes the complaint:
 *    - If it matches an existing quest → bumps that quest's weight (priority++)
 *    - If no match → creates a new quest in the dailyQuest table
 * 4. This hook fetches those quests ordered by weight (highest first)
 *
 * Result: The most complained-about issues appear as the top quests.
 *
 * ============================================================================
 * DATA STRUCTURE
 * ============================================================================
 * Each quest object contains:
 *
 * {
 *   id: string;                 // UUID primary key
 *   title: string;              // 5-8 words, verb-first (e.g., "Clean Up Trash on Beacon St")
 *   description: string;        // 15-25 words, actionable task with location
 *   category: string;           // "cleanup" | "volunteer" | "kindness" | "environment" | "community"
 *   xp_reward: number;          // XP earned on completion (easy=75, medium=200, hard=400)
 *   estimated_minutes: number;  // Realistic time estimate (15-120 minutes)
 *   proof_type: string;         // How users prove completion: "photo" | "checkin" | "self_report"
 *   is_daily: boolean;          // true for daily quests
 *   weight: number;             // Priority (1+), increases when more users complain about same issue
 *   active: boolean;            // false if quest is archived/disabled
 *   created_at: string;         // ISO timestamp of when quest was created
 * }
 *
 * ============================================================================
 * USAGE EXAMPLES
 * ============================================================================
 *
 * Basic usage — fetch and display quests:
 * ```tsx
 * import { useQuests } from "@/lib/hooks/useQuests";
 *
 * function QuestsPage() {
 *   const { quests, loading, error, refetch } = useQuests();
 *
 *   if (loading) return <Spinner />;
 *   if (error) return <div>Error: {error}</div>;
 *
 *   return (
 *     <div>
 *       <button onClick={refetch}>Refresh Quests</button>
 *       {quests.map(quest => (
 *         <QuestCard key={quest.id} quest={quest} />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 *
 * Display quest details:
 * ```tsx
 * function QuestCard({ quest }: { quest: DailyQuest }) {
 *   return (
 *     <div>
 *       <h3>{quest.title}</h3>
 *       <p>{quest.description}</p>
 *       <div>
 *         <span>{quest.category}</span> •
 *         <span>{quest.xp_reward} XP</span> •
 *         <span>~{quest.estimated_minutes} min</span>
 *       </div>
 *       <div>Proof required: {quest.proof_type}</div>
 *       <div>Priority: {quest.weight}</div>
 *     </div>
 *   );
 * }
 * ```
 *
 * ============================================================================
 * RETURN VALUES
 * ============================================================================
 *
 * @returns {Object} UseQuestsReturn
 * @property {DailyQuest[]} quests - Array of active quests ordered by weight (highest first)
 * @property {boolean} loading - true while fetching, false otherwise
 * @property {string | null} error - Error message if fetch failed, null if successful
 * @property {() => void} refetch - Function to manually reload quests from the database
 *
 * ============================================================================
 * ERROR HANDLING
 * ============================================================================
 * If the API call fails:
 * - `quests` will be an empty array []
 * - `error` will contain the error message
 * - `loading` will be false
 *
 * You should always check for errors before rendering:
 * ```tsx
 * if (error) return <ErrorMessage message={error} />;
 * ```
 *
 * ============================================================================
 * PERFORMANCE NOTES
 * ============================================================================
 * - Fetches automatically on mount via useEffect
 * - No caching — refetches every time component mounts
 * - Only fetches active quests (active=true)
 * - Limited to top quests by the API (currently 5)
 * - Memoized fetch function prevents unnecessary re-renders
 *
 * ============================================================================
 * RELATED HOOKS
 * ============================================================================
 * - useReports() — Submit complaints that create/prioritize quests
 * - useLeaderboard() — View user rankings based on quest completion
 */
"use client";

import { useState, useEffect, useCallback } from "react";
import { DailyQuest } from "@/types";

interface UseQuestsReturn {
  /** Array of active quests ordered by weight (highest priority first) */
  quests: DailyQuest[];
  /** True while fetching quests from the API, false otherwise */
  loading: boolean;
  /** Error message if fetch failed, null if successful */
  error: string | null;
  /** Manually refetch quests from the database */
  refetch: () => void;
}

export function useQuests(): UseQuestsReturn {
  const [quests, setQuests] = useState<DailyQuest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuests = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/quests/generate");
      if (!res.ok) throw new Error(`Failed to fetch quests (${res.status})`);

      const data = await res.json();
      setQuests(data.quests || []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to fetch quests";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuests();
  }, [fetchQuests]);

  return { quests, loading, error, refetch: fetchQuests };
}
