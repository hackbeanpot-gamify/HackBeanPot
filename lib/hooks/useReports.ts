/**
 * useReports — React hook for submitting community complaints that generate quests.
 *
 * ============================================================================
 * WHAT THIS HOOK DOES
 * ============================================================================
 * - Provides a function to submit user complaints about community issues
 * - Complaints are NOT stored in the database (privacy-focused)
 * - Instead, Gemini AI processes complaints in real-time to manage quests
 * - Returns information about what happened to quests as a result
 *
 * ============================================================================
 * HOW THE COMPLAINT → QUEST PIPELINE WORKS
 * ============================================================================
 * When you call submitComplaint("your complaint string"):
 *
 * 1. Complaint is sent to POST /api/reports endpoint
 * 2. API fetches all existing quests from the dailyQuest table
 * 3. Gemini AI (gemini-2.0-flash, temp=0.4, JSON mode) analyzes:
 *    - Complaint content
 *    - List of existing quests (id, title, category, xp_reward, weight)
 * 4. Gemini decides one of two actions:
 *
 *    ACTION A: MATCH FOUND (complaint matches an existing quest)
 *    --------------------------------------------------------
 *    - Returns: {"match": true, "questId": "<uuid>"}
 *    - Backend bumps that quest's weight by 1 (priority++)
 *    - Higher weight = quest appears first in useQuests()
 *    - Result: More complaints about the same issue = higher priority
 *
 *    ACTION B: NO MATCH (complaint describes a new issue)
 *    -----------------------------------------------------
 *    - Returns: {"match": false, "quest": {...}}
 *    - Backend creates a new quest in dailyQuest table with:
 *      • title: 5-8 words, verb-first, Boston-specific
 *      • description: 15-25 words, actionable task
 *      • category: cleanup | volunteer | kindness | environment | community
 *      • xp_reward: 75 (easy) | 200 (medium) | 400 (hard)
 *      • estimated_minutes: realistic estimate (15-120)
 *      • proof_type: photo | checkin | self_report
 *      • weight: 1 (initial priority)
 *      • active: true
 *    - Result: New quest appears in useQuests() feed
 *
 * 5. Complaint string is discarded (NOT saved to DB)
 * 6. Only the quest outcome is returned to the frontend
 *
 * ============================================================================
 * WHY COMPLAINTS AREN'T STORED
 * ============================================================================
 * - Privacy: Users can vent freely without permanent record
 * - Focus: The app is about ACTION (quests), not complaints
 * - Efficiency: No need to manage a complaints table
 * - AI-driven: Gemini extracts the actionable task, discards the rest
 *
 * ============================================================================
 * RESPONSE DATA STRUCTURE
 * ============================================================================
 * When submitComplaint() succeeds, you get back:
 *
 * {
 *   success: true,
 *   complaint: "the original complaint string you submitted",
 *   questAction: {
 *     type: "bumped" | "created",     // What happened to quests
 *     questId: "uuid",                 // Which quest was affected
 *     questTitle: "Quest Title Here",  // Human-readable quest name
 *     newWeight: number                // Current priority (for "bumped": old+1, for "created": 1)
 *   } | null  // null if Gemini failed (complaint still accepted, just no quest action)
 * }
 *
 * ============================================================================
 * USAGE EXAMPLES
 * ============================================================================
 *
 * Basic complaint submission:
 * ```tsx
 * import { useReports } from "@/lib/hooks/useReports";
 *
 * function ComplaintForm() {
 *   const { submitComplaint, loading, error, lastResult } = useReports();
 *   const [input, setInput] = useState("");
 *
 *   const handleSubmit = async (e: React.FormEvent) => {
 *     e.preventDefault();
 *     const result = await submitComplaint(input);
 *     if (result) {
 *       setInput(""); // Clear form
 *     }
 *   };
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <textarea
 *         value={input}
 *         onChange={e => setInput(e.target.value)}
 *         placeholder="What issue do you see in your community?"
 *         minLength={5}
 *       />
 *       <button disabled={loading || input.length < 5}>
 *         {loading ? "Submitting..." : "Submit Complaint"}
 *       </button>
 *       {error && <div className="error">{error}</div>}
 *     </form>
 *   );
 * }
 * ```
 *
 * Show feedback based on quest action:
 * ```tsx
 * function ComplaintFormWithFeedback() {
 *   const { submitComplaint, loading, lastResult } = useReports();
 *   const [input, setInput] = useState("");
 *
 *   const handleSubmit = async (e: React.FormEvent) => {
 *     e.preventDefault();
 *     const result = await submitComplaint(input);
 *
 *     if (result?.questAction?.type === "bumped") {
 *       toast.success(
 *         `Priority increased for: "${result.questAction.questTitle}" (now ${result.questAction.newWeight})`
 *       );
 *     } else if (result?.questAction?.type === "created") {
 *       toast.success(
 *         `New quest created: "${result.questAction.questTitle}"`
 *       );
 *     } else if (result?.questAction === null) {
 *       toast.info("Complaint received, but no quest action taken");
 *     }
 *
 *     setInput("");
 *   };
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <textarea
 *         value={input}
 *         onChange={e => setInput(e.target.value)}
 *         placeholder="Describe a community issue..."
 *       />
 *       <button disabled={loading}>Submit</button>
 *
 *       {lastResult && (
 *         <div className="feedback">
 *           <p>Your complaint: "{lastResult.complaint}"</p>
 *           {lastResult.questAction && (
 *             <p>
 *               Quest {lastResult.questAction.type}:
 *               {lastResult.questAction.questTitle}
 *             </p>
 *           )}
 *         </div>
 *       )}
 *     </form>
 *   );
 * }
 * ```
 *
 * Track what happened to all submitted complaints:
 * ```tsx
 * function ComplaintTracker() {
 *   const { submitComplaint, loading, lastResult } = useReports();
 *   const [history, setHistory] = useState<ComplaintResult[]>([]);
 *
 *   const handleSubmit = async (complaint: string) => {
 *     const result = await submitComplaint(complaint);
 *     if (result) {
 *       setHistory(prev => [result, ...prev]);
 *     }
 *   };
 *
 *   return (
 *     <div>
 *       <ComplaintForm onSubmit={handleSubmit} loading={loading} />
 *
 *       <h3>Your Impact</h3>
 *       {history.map((item, i) => (
 *         <div key={i}>
 *           <p>"{item.complaint}"</p>
 *           {item.questAction && (
 *             <span className={item.questAction.type}>
 *               {item.questAction.type === "bumped"
 *                 ? `Bumped quest to priority ${item.questAction.newWeight}`
 *                 : `Created new quest`}
 *             </span>
 *           )}
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 *
 * ============================================================================
 * RETURN VALUES
 * ============================================================================
 *
 * @returns {Object} UseReportsReturn
 * @property {(complaint: string) => Promise<ComplaintResult | null>} submitComplaint
 *           - Async function to submit a complaint string
 *           - Returns the result object on success, null on failure
 *           - Minimum 5 characters required
 * @property {boolean} loading
 *           - true while API request is in flight, false otherwise
 * @property {string | null} error
 *           - Error message if submission failed, null if successful
 * @property {ComplaintResult | null} lastResult
 *           - The most recent successful submission result
 *           - Persists between submissions
 *           - Contains complaint text + questAction details
 *
 * ============================================================================
 * ERROR HANDLING
 * ============================================================================
 *
 * The hook handles errors gracefully:
 * - If API call fails → returns null, sets error state
 * - If complaint < 5 chars → API returns 400 error
 * - If Gemini fails → questAction will be null (but complaint is still accepted)
 *
 * Always check the result:
 * ```tsx
 * const result = await submitComplaint(input);
 * if (!result) {
 *   console.log("Submission failed:", error);
 *   return;
 * }
 *
 * if (!result.questAction) {
 *   console.log("Complaint accepted but no quest action taken");
 * }
 * ```
 *
 * ============================================================================
 * VALIDATION RULES
 * ============================================================================
 *
 * Complaint requirements:
 * - Type: string
 * - Min length: 5 characters (enforced by API)
 * - Max length: No hard limit, but keep it reasonable (< 500 chars recommended)
 * - Content: Any community issue description
 *
 * Example valid complaints:
 * ✅ "Trash overflowing on Beacon St"
 * ✅ "Elderly neighbors need help with groceries in winter"
 * ✅ "Broken benches in Central Park"
 * ✅ "Food bank needs volunteers this weekend"
 *
 * Example invalid complaints:
 * ❌ "" (empty)
 * ❌ "help" (< 5 chars)
 * ❌ "    " (whitespace only)
 *
 * ============================================================================
 * GEMINI AI CONFIGURATION
 * ============================================================================
 *
 * The backend uses Gemini 2.0 Flash with:
 * - Temperature: 0.4 (consistent but not robotic)
 * - Response format: JSON only (via responseMimeType)
 * - Model: gemini-2.0-flash (fast, cost-effective)
 *
 * Prompt structure ensures:
 * - Quests are Boston-specific
 * - Titles are action-oriented (verb-first)
 * - Categories match the enum: cleanup | volunteer | kindness | environment | community
 * - XP rewards follow difficulty tiers: 75 | 200 | 400
 *
 * ============================================================================
 * PERFORMANCE NOTES
 * ============================================================================
 *
 * - Each submission makes 1 API call (POST /api/reports)
 * - API makes 1 Gemini call (~1-3 seconds)
 * - No debouncing built in (add if needed for high-frequency submissions)
 * - lastResult persists until next successful submission
 * - No automatic retry on failure
 *
 * ============================================================================
 * RELATED HOOKS
 * ============================================================================
 *
 * - useQuests() — Fetch the quests that this hook creates/prioritizes
 * - useLeaderboard() — See top contributors based on quest completion
 *
 * ============================================================================
 * TYPESCRIPT TYPES
 * ============================================================================
 *
 * ComplaintResult:
 * ```ts
 * interface ComplaintResult {
 *   success: boolean;
 *   complaint: string;
 *   questAction: {
 *     type: "bumped" | "created";
 *     questId: string;
 *     questTitle: string;
 *     newWeight: number;
 *   } | null;
 * }
 * ```
 */
"use client";

import { useState, useCallback } from "react";

/**
 * Result object returned when a complaint is successfully submitted.
 */
interface ComplaintResult {
  /** Always true if the API call succeeded */
  success: boolean;
  /** The original complaint text that was submitted */
  complaint: string;
  /** Details about what happened to quests, or null if Gemini failed */
  questAction: {
    /** Whether an existing quest was bumped or a new one was created */
    type: "bumped" | "created";
    /** UUID of the affected quest */
    questId: string;
    /** Human-readable title of the affected quest */
    questTitle: string;
    /** Current priority weight (bumped: increased by 1, created: starts at 1) */
    newWeight: number;
  } | null;
}

interface UseReportsReturn {
  /**
   * Submit a community complaint string.
   * @param complaint - The issue description (min 5 characters)
   * @returns Promise resolving to the result object, or null if failed
   */
  submitComplaint: (complaint: string) => Promise<ComplaintResult | null>;
  /** True while the API request is in flight */
  loading: boolean;
  /** Error message if the last submission failed, null otherwise */
  error: string | null;
  /** The most recent successful submission result */
  lastResult: ComplaintResult | null;
}

export function useReports(): UseReportsReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<ComplaintResult | null>(null);

  const submitComplaint = useCallback(async (complaint: string): Promise<ComplaintResult | null> => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ complaint }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `Failed to submit complaint (${res.status})`);
      }

      const data: ComplaintResult = await res.json();
      setLastResult(data);
      return data;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { submitComplaint, loading, error, lastResult };
}
