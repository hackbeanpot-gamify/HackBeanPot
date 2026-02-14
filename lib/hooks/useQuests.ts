"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export type QuestDifficulty = "easy" | "medium" | "hard";

export interface Quest {
  id: number;
  title: string;
  description: string | null;
  xpReward: number;
  difficulty: QuestDifficulty;
  city: string | null;
  category: string | null;
  isDaily: boolean;
  createdAt: string;
}

interface UseQuestsOptions {
  city?: string;
  category?: string;
  dailyOnly?: boolean;
}

interface UseQuestsReturn {
  quests: Quest[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useQuests(options: UseQuestsOptions = {}): UseQuestsReturn {
  const { city, category, dailyOnly } = options;

  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuests = async () => {
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      let query = supabase
        .from("quests")
        .select("*")
        .order("createdAt", { ascending: false });

      if (city) query = query.eq("city", city);
      if (category) query = query.eq("category", category);
      if (dailyOnly) query = query.eq("isDaily", true);

      const { data, error: dbError } = await query;

      if (dbError) throw dbError;
      setQuests(data || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch quests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuests();
  }, [city, category, dailyOnly]);

  return { quests, loading, error, refetch: fetchQuests };
}