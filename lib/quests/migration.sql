-- ═══════════════════════════════════════════════
-- Impact Trail — dailyQuestAssignment Table
-- Run this in Supabase SQL Editor
--
-- PREREQUISITES:
--   ✅ public.users_profile exists (with id uuid PK)
--   ✅ public.dailyQuest exists (with id uuid PK, seeded)
--
-- This migration ONLY creates the assignment table.
-- ═══════════════════════════════════════════════


-- Drop if re-running (safe for dev)
DROP TABLE IF EXISTS "dailyQuestAssignment" CASCADE;


-- ── Create dailyQuestAssignment ──
CREATE TABLE "dailyQuestAssignment" (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users_profile(id) ON DELETE CASCADE,
  quest_id UUID NOT NULL REFERENCES "dailyQuest"(id) ON DELETE CASCADE,
  assigned_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'assigned'
    CHECK (status IN ('assigned', 'completed', 'skipped', 'expired')),
  proof_payload JSONB,
  completed_at TIMESTAMPTZ,
  emailed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- One quest per user per day
  CONSTRAINT unique_user_assigned_date UNIQUE (user_id, assigned_date)
);

-- Indexes for fast lookups
CREATE INDEX idx_assignment_assigned_date ON "dailyQuestAssignment" (assigned_date);
CREATE INDEX idx_assignment_user_id ON "dailyQuestAssignment" (user_id);
CREATE INDEX idx_assignment_emailed_at ON "dailyQuestAssignment" (emailed_at);


-- ── RLS: permissive for MVP (anon key access) ──
ALTER TABLE "dailyQuestAssignment" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all select on dailyQuestAssignment"
  ON "dailyQuestAssignment" FOR SELECT USING (true);

CREATE POLICY "Allow all insert on dailyQuestAssignment"
  ON "dailyQuestAssignment" FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow all update on dailyQuestAssignment"
  ON "dailyQuestAssignment" FOR UPDATE USING (true);
