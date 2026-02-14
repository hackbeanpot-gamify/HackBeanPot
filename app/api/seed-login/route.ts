// app/api/seed-login/route.ts
import { registerUser } from '@/lib/supabase/encrypt';

export async function GET() {
  const users = [
    { username: 'sarah_chen', password: 'sarah123', firstName: 'Sarah', lastName: 'Chen' },
    { username: 'mike_dev', password: 'mike123', firstName: 'Mike', lastName: 'Rodriguez' },
    { username: 'alex_codes', password: 'alex123', firstName: 'Alex', lastName: 'Kim' },
    { username: 'emma_tech', password: 'emma123', firstName: 'Emma', lastName: 'Watson' },
    { username: 'jordan_ui', password: 'jordan123', firstName: 'Jordan', lastName: 'Lee' },
  ];

  const results = [];
  for (const u of users) {
    const result = await registerUser(u.username, u.password, u.firstName, u.lastName);
    results.push(result);
  }

  return Response.json(results);
}