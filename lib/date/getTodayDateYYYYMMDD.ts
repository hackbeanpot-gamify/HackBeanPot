/**
 * lib/date/getTodayDateYYYYMMDD.ts
 *
 * Returns today's date as a "YYYY-MM-DD" string.
 *
 * WHY THIS EXISTS:
 * Daily quest assignment is date-based. We need a single, consistent
 * definition of "today" used across assignment, streak, and expiry logic.
 *
 * TIMEZONE:
 * Defaults to America/New_York (Eastern Time) since Impact Trail
 * launched in Boston. The users_profile table has a timezone column —
 * a future version could accept it as a parameter.
 *
 * @returns Date string in "YYYY-MM-DD" format, e.g. "2025-02-15"
 */
export function getTodayDateYYYYMMDD(): string {
  return new Date().toLocaleDateString("en-CA", {
    timeZone: "America/New_York",
  });
}
