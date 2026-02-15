/**
 * lib/hooks/useRaidBossEvents.ts
 *
 * React hook to fetch all raid boss events.
 * Used in the Boss Quests tent.
 *
 * @example
 * ```tsx
 * const { events, loading, error, refetch } = useRaidBossEvents();
 * ```
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import type { RaidBossEvent } from "@/types";

export interface UseRaidBossEventsReturn {
  /** All raid boss events */
  events: RaidBossEvent[];
  /** True while the initial fetch is in progress */
  loading: boolean;
  /** Error message if the fetch failed */
  error: string | null;
  /** Manually re-fetch all data */
  refetch: () => void;
}

/**
 * Fetch all raid boss events.
 *
 * @returns Object with events, loading, error, refetch
 */
export function useRaidBossEvents(): UseRaidBossEventsReturn {
  const [events, setEvents] = useState<RaidBossEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/raidBoss/all");

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Request failed (${res.status})`);
      }

      const data = await res.json();
      setEvents(data.events || []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to fetch raid boss events";
      setError(message);
      console.error("[useRaidBossEvents]", message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { events, loading, error, refetch: fetchData };
}
