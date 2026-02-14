// lib/auth.ts
import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Hash password before storing
export async function registerUser(username: string, password: string, firstName: string, lastName: string) {
  const hashedPassword = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from('login')
    .insert({
      username,
      password: hashedPassword,
      firstName,
      lastName
    })
    .select()
    .single();

  return { data, error };
}

// Verify password on login
export async function loginUser(username: string, password: string) {
  const { data, error } = await supabase
    .from('login')
    .select('*')
    .eq('username', username)
    .single();

  if (error || !data) return { success: false, error: 'User not found' };

  const match = await bcrypt.compare(password, data.password);

  if (!match) return { success: false, error: 'Wrong password' };

  return { success: true, user: data };
}