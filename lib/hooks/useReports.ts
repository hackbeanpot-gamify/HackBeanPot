/**
 * useReports — React hook for reading and creating community complaints/reports.
 *
 * HOW IT WORKS:
 *   - fetchReports() → GET /api/reports → reads all reports from "communityReports" table.
 *   - createReport() → POST /api/reports → saves the complaint, then Gemini AI automatically:
 *       1. Looks at all existing quests in "dailyQuests" table
 *       2. If the complaint matches an existing quest → bumps its weight (priority)
 *       3. If no quest matches → creates a new quest from the complaint
 *     This means every complaint either boosts an existing quest's priority or spawns a new one.
 *
 * RESPONSE FROM createReport():
 *   - report: the saved complaint object
 *   - questAction: what happened to quests — null if Gemini failed (complaint still saved)
 *     - type: "bumped" — matched existing quest, weight increased
 *     - type: "created" — no match, new quest added to DB
 *     - questId, questTitle, newWeight — details of the affected quest
 *
 * QUEST PRIORITY (weight):
 *   More people complaining about the same issue → higher weight → quest shows first to users.
 *   The quests/generate endpoint serves quests ordered by weight (highest first).
 *
 * USAGE:
 *   const { reports, loading, error, fetchReports, createReport } = useReports();
 *
 *   // Fetch on mount
 *   useEffect(() => { fetchReports(); }, [fetchReports]);
 *
 *   // Submit a complaint — quest matching happens automatically
 *   const result = await createReport({
 *     title: "Dirty streets near downtown",
 *     description: "Lots of trash piling up on the sidewalks",
 *     category: "cleanup",
 *     userId: currentUser.id,
 *   });
 *
 *   // Check what happened to quests
 *   if (result?.questAction?.type === "bumped") {
 *     toast(`Quest "${result.questAction.questTitle}" priority increased!`);
 *   } else if (result?.questAction?.type === "created") {
 *     toast(`New quest created: "${result.questAction.questTitle}"`);
 *   }
 */
"use client";

import { useState, useCallback } from "react";

export interface CommunityReport {
  id: number | string;
  title: string;
  description: string;
  category: string;
  status: "open" | "inProgress" | "resolved";
  userId: number | string;
  createdAt?: string;
}

interface CreateReportInput {
  title: string;
  description: string;
  category: string;
  userId: number | string;
}

interface UseReportsReturn {
  /** All fetched community reports, newest first */
  reports: CommunityReport[];
  /** True while any API call is in flight */
  loading: boolean;
  /** Error message from last failed operation, null if all good */
  error: string | null;
  /** Fetch all reports from the database */
  fetchReports: () => Promise<CommunityReport[]>;
  /** Submit a new community report (returns the created report or null on failure) */
  createReport: (input: CreateReportInput) => Promise<CommunityReport | null>;
}

export function useReports(): UseReportsReturn {
  const [reports, setReports] = useState<CommunityReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Fetch all community reports, newest first. */
  const fetchReports = useCallback(async (): Promise<CommunityReport[]> => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/reports");

      if (!res.ok) {
        throw new Error(`Failed to fetch reports (${res.status})`);
      }

      const data = await res.json();
      setReports(data.reports || []);
      return data.reports || [];
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create a new community report.
   * @param input.title       — Short title of the issue (required)
   * @param input.description — Detailed description (required)
   * @param input.category    — Issue type, e.g. "cleanup", "environment" (required)
   * @param input.userId      — ID of the user filing it, must exist in "profiles" (required)
   */
  const createReport = useCallback(async (input: CreateReportInput): Promise<CommunityReport | null> => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `Failed to create report (${res.status})`);
      }

      const data = await res.json();
      setReports((prev) => [data.report, ...prev]);
      return data.report as CommunityReport;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { reports, loading, error, fetchReports, createReport };
}
