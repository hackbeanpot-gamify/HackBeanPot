import { createClient } from "@/lib/supabase/client";

/** Shape of the sign-up form data. */
export interface SignUpFormData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

/** Result returned by all auth actions — either success or an error message. */
export type AuthResult =
  | { success: true }
  | { success: false; error: string };

/**
 * Registers a new user via Supabase Auth and creates a profile.
 *
 * 1. Creates the auth user
 * 2. Inserts a profile row into users_profile table with default values
 * 3. Handles errors if either step fails
 */
export async function signUpNewUser(form: SignUpFormData): Promise<AuthResult> {
  const supabase = createClient();

  // Step 1: Create auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: form.email,
    password: form.password,
  });

  if (authError) return { success: false, error: authError.message };
  if (!authData.user?.id) return { success: false, error: "Failed to get user ID" };

  // Step 2: Create profile row with defaults
  try {
    const { error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: authData.user.id,
        email: form.email,
        display_name: form.username,
        first_name: form.firstName,
        last_name: form.lastName,
        timezone: "America/New_York",
        saves_left: 3,
        saves_monthly_quota: 30,
      });

    if (profileError) {
      throw new Error(`Profile creation failed: ${profileError.message}`);
    }

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Profile creation failed";
    return { success: false, error: message };
  }
}

/**
 * Signs in an existing user with their email and password.
 */
export async function loginWithEmail(
  email: string,
  password: string
): Promise<AuthResult> {
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return { success: false, error: error.message };
  return { success: true };
}

/**
 * Calls the server-side API to resolve a username into an email address.
 * Returns the email string, or throws if the username is not found.
 */
export async function resolveUsername(username: string): Promise<string> {
  const res = await fetch("/api/auth/resolve-username", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username }),
  });

  if (!res.ok) {
    const body = await res.json();
    throw new Error(body.error || "Username not found");
  }

  const { email } = await res.json();
  return email;
}

/**
 * Logs in a user by either email or username.
 *
 * Detection: if the input contains "@" it's treated as an email.
 * Otherwise it's treated as a username and resolved to an email first.
 */
export async function loginWithUsernameOrEmail(
  input: string,
  password: string
): Promise<AuthResult> {
  const isEmail = input.includes("@");

  let email: string;
  if (isEmail) {
    email = input;
  } else {
    try {
      email = await resolveUsername(input);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Username not found";
      return { success: false, error: message };
    }
  }

  return loginWithEmail(email, password);
}
