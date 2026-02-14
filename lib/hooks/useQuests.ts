/**
 * useQuests — React hook for fetching and generating AI-powered daily quests.
 *
 * HOW IT WORKS:
 *   This hook provides two capabilities:
 *
 *   1. FETCH existing quests from the "dailyQuests" Supabase table (runs on mount).
 *      You can filter by city, category, or daily-only quests via options.
 *
 *   2. GENERATE new quests via POST /api/quests/generate, which:
 *      - Reads open community reports from "communityReports" table
 *      - Sends them to Gemini 2.0 Flash (temp=0.4, JSON mode) to create 5 quests
 *      - Saves generated quests to "dailyQuests" table
 *      - Falls back to hardcoded sample quests if Gemini is down
 *
 * QUEST SHAPE (returned per quest):
 *   - id: number              — auto-generated DB id
 *   - title: string           — 5-8 words, verb-first (e.g. "Collect Trash on Main Street")
 *   - description: string     — 15-25 words, specific action + location + duration
 *   - category: string        — "cleanup" | "volunteer" | "kindness" | "environment" | "community"
 *   - difficulty: string      — "easy" | "medium" | "hard"
 *   - xpReward: number        — fixed per difficulty: easy=75, medium=200, hard=400
 *   - isDaily: boolean        — true for generated quests
 *   - createdAt: string       — ISO timestamp
 *
 * USAGE:
 *   // Basic — fetch quests on mount, generate new ones on click
 *   const { quests, loading, error, source, refetch, generateQuests } = useQuests();
 *
 *   <button onClick={generateQuests} disabled={loading}>Get Daily Quests</button>
 *
 *   {quests.map(q => (
 *     <div key={q.id}>
 *       <h3>{q.title}</h3>
 *       <p>{q.description}</p>
 *       <span>{q.difficulty} — {q.xpReward} XP</span>
 *     </div>
 *   ))}
 *
 *   // With filters — only show cleanup quests
 *   const { quests } = useQuests({ category: "cleanup" });
 *
 *   // Check generation source
 *   {source === "gemini_ai" && <Badge>AI Generated</Badge>}
 *   {source === "fallback_hardcoded" && <Badge>Sample Quests</Badge>}
 */
"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

export type QuestDifficulty = "easy" | "medium" | "hard";

export interface Quest {
  id: number;
  title: string;
  description: string | null;
  xpReward: number;
  difficulty: QuestDifficulty;
  city: string | null;
  category: string | null;
  isDaily: boolean;
  createdAt: string;
}

interface UseQuestsOptions {
  city?: string;
  category?: string;
  dailyOnly?: boolean;
}

interface UseQuestsReturn {
  /** Current list of quests (fetched from DB or freshly generated) */
  quests: Quest[];
  /** True while any fetch or generate call is in flight */
  loading: boolean;
  /** Error message from the last failed operation, null if all good */
  error: string | null;
  /** "gemini_ai" | "fallback_hardcoded" | null — where the last generated batch came from */
  source: "gemini_ai" | "fallback_hardcoded" | null;
  /** Re-fetch quests from the database */
  refetch: () => void;
  /** Generate a fresh batch of 5 AI quests (saves to DB + updates state) */
  generateQuests: () => Promise<Quest[]>;
}

export function useQuests(options: UseQuestsOptions = {}): UseQuestsReturn {
  const { city, category, dailyOnly } = options;

  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<"gemini_ai" | "fallback_hardcoded" | null>(null);

  /** Fetch existing quests from Supabase "dailyQuests" table */
  const fetchQuests = async () => {
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      let query = supabase
        .from("dailyQuests")
        .select("*")
        .order("createdAt", { ascending: false });

      if (city) query = query.eq("city", city);
      if (category) query = query.eq("category", category);
      if (dailyOnly) query = query.eq("isDaily", true);

      const { data, error: dbError } = await query;

      if (dbError) throw dbError;
      setQuests(data || []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to fetch quests";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Generate 5 new AI-powered quests from community reports.
   * Calls POST /api/quests/generate → Gemini 2.0 Flash → saves to "dailyQuests".
   * Updates the quests state with the fresh batch and returns them.
   */
  const generateQuests = useCallback(async (): Promise<Quest[]> => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/quests/generate", { method: "POST" });

      if (!res.ok) {
        throw new Error(`Quest generation failed (${res.status})`);
      }

      const data = await res.json();

      if (!data.success) {
        throw new Error("Quest generation returned unsuccessful");
      }

      setQuests(data.quests);
      setSource(data.source);
      return data.quests;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuests();
  }, [city, category, dailyOnly]);

  return { quests, loading, error, source, refetch: fetchQuests, generateQuests };
}