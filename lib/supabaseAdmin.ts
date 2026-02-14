/**
 * lib/supabaseAdmin.ts
 *
 * Server-side Supabase client for cron jobs and background tasks.
 *
 * WHY THIS FILE EXISTS:
 * Background jobs (quest assignment, email sending) run outside of
 * a user request context, so we can't use the per-request client
 * from lib/supabase/server.ts. This creates a standalone client.
 *
 * AUTH:
 * Uses NEXT_PUBLIC_SUPABASE_ANON_KEY. The RLS policies on the
 * relevant tables (dailyQuestAssignment, users_profile, dailyQuest)
 * include service-level policies that allow inserts/updates
 * without an authenticated user context.
 *
 * ENV VARS:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error("[supabaseAdmin] Missing SUPABASE_URL env var.");
}
if (!supabaseKey) {
  throw new Error("[supabaseAdmin] Missing Supabase key env var.");
}

/**
 * A Supabase client for server-side background jobs.
 * Falls back to anon key if service role key is not set.
 */
export const supabaseAdmin: SupabaseClient = createClient(
  supabaseUrl,
  supabaseKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
