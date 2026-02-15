/**
 * lib/hooks/useDailyQuestPage.ts
 *
 * React hook for the Quests tab (tent index 2).
 * Fetches today's daily quest and any RSVP'd raid boss events
 * from the /api/dailyQuest/page endpoint.
 *
 * @example
 * ```tsx
 * const { dailyQuest, rsvpEvents, loading, error, refetch } = useDailyQuestPage();
 * ```
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import type { DailyQuest, RaidBossEvent } from "@/types";

/** A daily quest enriched with its assignment metadata */
export interface AssignedDailyQuest extends DailyQuest {
  assignmentId: string;
  assignmentStatus: string;
}

/** Return shape of useDailyQuestPage */
export interface UseDailyQuestPageReturn {
  /** Today's assigned quest (null if none) */
  dailyQuest: AssignedDailyQuest | null;
  /** Raid boss events the user has RSVP'd to */
  rsvpEvents: RaidBossEvent[];
  /** True while the initial fetch is in progress */
  loading: boolean;
  /** Error message if the fetch failed */
  error: string | null;
  /** Manually re-fetch all data */
  refetch: () => void;
}

/**
 * Fetch daily quest + RSVP events for the Quests tab.
 *
 * @returns Object with dailyQuest, rsvpEvents, loading, error, refetch
 */
export function useDailyQuestPage(): UseDailyQuestPageReturn {
  const [dailyQuest, setDailyQuest] = useState<AssignedDailyQuest | null>(null);
  const [rsvpEvents, setRsvpEvents] = useState<RaidBossEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/dailyQuest/page");

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Request failed (${res.status})`);
      }

      const data = await res.json();
      setDailyQuest(data.dailyQuest || null);
      setRsvpEvents(data.rsvpEvents || []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to fetch daily quest page";
      setError(message);
      console.error("[useDailyQuestPage]", message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { dailyQuest, rsvpEvents, loading, error, refetch: fetchData };
}
