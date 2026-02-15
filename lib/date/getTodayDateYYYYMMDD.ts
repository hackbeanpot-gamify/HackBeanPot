/**
 * lib/date/getTodayDateYYYYMMDD.ts
 *
 * Returns today's date as "YYYY-MM-DD" in America/New_York timezone.
 *
 * WHY THIS EXISTS:
 * The entire daily quest system uses a single consistent date.
 * Hardcoded to Eastern Time since Impact Trail is Boston-based.
 *
 * TIMEZONE ASSUMPTION:
 * America/New_York. If expanding to other timezones, accept a
 * timezone parameter or read from users_profile.timezone.
 *
 * @returns "YYYY-MM-DD" string, e.g. "2025-02-15"
 */
export function getTodayDateYYYYMMDD(): string {
  // "en-CA" locale returns YYYY-MM-DD format natively
  return new Date().toLocaleDateString("en-CA", {
    timeZone: "America/New_York",
  });
}
