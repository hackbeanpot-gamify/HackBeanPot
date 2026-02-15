/**
 * lib/supabase/adminClient.ts
 *
 * Returns a server-side Supabase client for background jobs.
 *
 * WHY THIS EXISTS:
 * Background jobs (cron, email sending) run without a user session.
 * This client uses the service role key (bypasses RLS) or falls back
 * to the anon key with permissive RLS policies.
 *
 * IMPORTANT: Never import this on the client side.
 *
 * ENV VARS:
 *   SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL)
 *   SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY as fallback)
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

/**
 * Get a Supabase client suitable for server-side admin/background work.
 * Singleton — only one client is created per process.
 *
 * @returns SupabaseClient with admin-level access.
 * @throws Error if required env vars are missing.
 */
export function getSupabaseAdminClient(): SupabaseClient {
  if (_client) return _client;

  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url) throw new Error("[adminClient] Missing SUPABASE_URL env var.");
  if (!key) throw new Error("[adminClient] Missing Supabase key env var.");

  _client = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  return _client;
}
