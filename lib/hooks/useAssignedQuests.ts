/**
 * useAssignedQuests — React hook for fetching a user's assigned daily quests.
 *
 * Fetches quests from the dailyQuestAssignment table for the specified user,
 * joining with the dailyQuest table to get full quest details.
 */
"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { DailyQuest } from "@/types";

interface AssignedQuestWithStatus {
  quest: DailyQuest;
  status: "assigned" | "completed" | "expired";
  assignmentId: string;
}

interface UseAssignedQuestsReturn {
  /** Array of assigned quests with their status */
  quests: AssignedQuestWithStatus[];
  /** True while fetching quests from the database, false otherwise */
  loading: boolean;
  /** Error message if fetch failed, null if successful */
  error: string | null;
  /** Manually refetch quests from the database */
  refetch: () => void;
}

/**
 * Get today's date in YYYY-MM-DD format (America/New_York timezone)
 */
function getTodayDateString(): string {
  return new Date().toLocaleDateString("en-CA", {
    timeZone: "America/New_York",
  });
}

export function useAssignedQuests(userId: string): UseAssignedQuestsReturn {
  const [quests, setQuests] = useState<DailyQuest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuests = useCallback(async () => {
    if (!userId) {
      setError("No user ID provided");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const today = getTodayDateString();

      console.log("[useAssignedQuests] Fetching for userId:", userId, "date:", today);

      // First, check all assignments for this user (debug)
      const { data: allAssignments } = await supabase
        .from("dailyQuestAssignment")
        .select("*")
        .eq("user_id", userId);

      console.log("[useAssignedQuests] All assignments for user:", allAssignments);
      if (allAssignments && allAssignments.length > 0) {
        console.log("[useAssignedQuests] First assignment details:", JSON.stringify(allAssignments[0], null, 2));
      }

      // Fetch assignments for today with joined quest data
      // Include both assigned and completed quests (not expired)
      const { data, error: queryError } = await supabase
        .from("dailyQuestAssignment")
        .select("*, dailyQuest!inner(*)")
        .eq("user_id", userId)
        .eq("assigned_date", today)
        .in("status", ["assigned", "completed"]);

      console.log("[useAssignedQuests] Query result:", { data, error: queryError });

      if (queryError) throw queryError;

      // Extract the quest data with assignment status from the joined results
      const assignedQuests = (data || [])
        .filter((assignment: any) => assignment.dailyQuest !== null)
        .map((assignment: any) => ({
          quest: assignment.dailyQuest as DailyQuest,
          status: assignment.status as "assigned" | "completed" | "expired",
          assignmentId: assignment.id
        }));

      console.log("[useAssignedQuests] Extracted quests:", assignedQuests);
      setQuests(assignedQuests);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to fetch assigned quests";
      setError(message);
      console.error("[useAssignedQuests] Error:", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchQuests();
  }, [fetchQuests]);

  return { quests, loading, error, refetch: fetchQuests };
}
