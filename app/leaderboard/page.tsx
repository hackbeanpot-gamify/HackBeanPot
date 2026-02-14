'use client';

import { useEffect, useState } from 'react';

export default function LeaderboardPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/leaderboard')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">City Leaderboard</h1>
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">Rank</th>
            <th className="text-left p-2">Username</th>
            <th className="text-left p-2">Level</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, i) => (
            <tr key={entry.user_id} className="border-b">
              <td className="p-2">{i + 1}</td>
              <td className="p-2">{entry.username}</td>
              <td className="p-2">{entry.level}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
