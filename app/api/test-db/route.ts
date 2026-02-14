import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/test-db
 *
 * Tests the Supabase connection by:
 * 1. Verifying the client can connect
 * 2. Querying the profiles table schema
 * 3. Attempting a test signup (dry-run info)
 * 4. Checking auth configuration
 */
export async function GET() {
  const results: Record<string, unknown> = {};

  try {
    const supabase = await createClient();

    // Test 1: Basic connection — query profiles table
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("*")
      .limit(1);

    results.connection = profilesError
      ? { status: "FAIL", error: profilesError.message }
      : { status: "OK", rowCount: profiles?.length ?? 0 };

    // Test 2: Check profiles table columns
    const { data: cols, error: colsError } = await supabase.rpc("test_profiles_columns");
    if (colsError) {
      // Fallback: just try to describe via a dummy query
      results.tableSchema = { status: "SKIPPED", note: "RPC not available, but table query above confirms access" };
    } else {
      results.tableSchema = { status: "OK", columns: cols };
    }

    // Test 3: Check auth — get current session (should be null for anonymous)
    const { data: authData, error: authError } = await supabase.auth.getUser();
    results.auth = authError
      ? { status: "NO_SESSION", message: authError.message }
      : { status: "OK", user: authData.user?.email ?? "anonymous" };

    // Test 4: Try signing up a dummy user to see the exact error
    const testEmail = `test_${Date.now()}@test-connection.local`;
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: "testpassword123",
    });

    if (signUpError) {
      results.signUpTest = {
        status: "FAIL",
        error: signUpError.message,
        code: signUpError.status,
      };
    } else {
      results.signUpTest = {
        status: "OK",
        userId: signUpData.user?.id,
        email: testEmail,
        note: "Test user created — delete it from Supabase dashboard when done",
      };

      // Test 5: Check if the trigger or application created a profile row
      if (signUpData.user?.id) {
        const { data: profileRow, error: profileRowError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", signUpData.user.id)
          .single();

        results.triggerTest = profileRowError
          ? { status: "FAIL", error: profileRowError.message }
          : { status: "OK", profile: profileRow };
      }
    }

    return NextResponse.json({ overall: "TESTS_COMPLETE", results }, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { overall: "CONNECTION_FAILED", error: message, results },
      { status: 500 }
    );
  }
}
