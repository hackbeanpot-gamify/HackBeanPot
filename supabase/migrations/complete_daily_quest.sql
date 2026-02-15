-- ═══════════════════════════════════════════════════════════
-- Migration: complete_daily_quest RPC function
-- Run this in Supabase SQL Editor
--
-- This function atomically:
--   1. Validates the assignment belongs to the user
--   2. Validates the assignment is not already completed
--   3. Joins dailyQuest to get xp_reward
--   4. Updates dailyQuestAssignment (status, completed_at, proof)
--   5. Updates user_stats (XP, streak, level, totals)
--   6. Returns the updated stats + assignment
--
-- LEVELING: level = floor(xp_total / 500) + 1
-- STREAK:
--   - last_quest = yesterday → streak_current + 1
--   - last_quest = today     → no change (prevent double)
--   - else                   → reset to 1
-- ═══════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.complete_daily_quest(
  p_user_id UUID,
  p_assignment_id UUID,
  p_proof_payload JSONB DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_assignment RECORD;
  v_quest RECORD;
  v_stats RECORD;
  v_today DATE;
  v_yesterday DATE;
  v_new_xp INT;
  v_new_streak INT;
  v_new_best INT;
  v_new_level INT;
  v_new_total INT;
BEGIN
  v_today := (NOW() AT TIME ZONE 'America/New_York')::DATE;
  v_yesterday := v_today - INTERVAL '1 day';

  -- ── 1. Fetch and validate the assignment ──
  SELECT *
  INTO v_assignment
  FROM "dailyQuestAssignment"
  WHERE id = p_assignment_id
    AND user_id = p_user_id
  FOR UPDATE;  -- row lock to prevent race conditions

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Assignment not found or does not belong to this user.'
    );
  END IF;

  IF v_assignment.status = 'completed' THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Quest is already completed.',
      'completed_at', v_assignment.completed_at
    );
  END IF;

  IF v_assignment.status != 'assigned' THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Quest status is ' || v_assignment.status || '. Only assigned quests can be completed.'
    );
  END IF;

  -- ── 2. Fetch quest details for XP ──
  SELECT *
  INTO v_quest
  FROM "dailyQuest"
  WHERE id = v_assignment.quest_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Quest definition not found for quest_id=' || v_assignment.quest_id
    );
  END IF;

  -- ── 3. Update the assignment row ──
  UPDATE "dailyQuestAssignment"
  SET
    status = 'completed',
    completed_at = NOW(),
    proof_payload = COALESCE(p_proof_payload, proof_payload)
  WHERE id = p_assignment_id;

  -- ── 4. Fetch current user_stats (create if missing) ──
  SELECT *
  INTO v_stats
  FROM user_stats
  WHERE user_id = p_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    INSERT INTO user_stats (user_id, xp_total, level, streak_current, streak_best, quests_completed_total, last_quest_completed_date)
    VALUES (p_user_id, 0, 1, 0, 0, 0, NULL);

    SELECT *
    INTO v_stats
    FROM user_stats
    WHERE user_id = p_user_id
    FOR UPDATE;
  END IF;

  -- ── 5. Calculate new XP ──
  v_new_xp := v_stats.xp_total + v_quest.xp_reward;

  -- ── 6. Calculate streak ──
  IF v_stats.last_quest_completed_date = v_today THEN
    -- Already completed a quest today → don't double-count streak
    v_new_streak := v_stats.streak_current;
  ELSIF v_stats.last_quest_completed_date = v_yesterday THEN
    -- Consecutive day → increment streak
    v_new_streak := v_stats.streak_current + 1;
  ELSE
    -- Streak broken → reset to 1
    v_new_streak := 1;
  END IF;

  v_new_best := GREATEST(v_stats.streak_best, v_new_streak);
  v_new_total := v_stats.quests_completed_total + 1;

  -- ── 7. Calculate level: floor(xp / 500) + 1 ──
  v_new_level := FLOOR(v_new_xp / 500) + 1;

  -- ── 8. Update user_stats ──
  UPDATE user_stats
  SET
    xp_total = v_new_xp,
    level = v_new_level,
    streak_current = v_new_streak,
    streak_best = v_new_best,
    quests_completed_total = v_new_total,
    last_quest_completed_date = v_today,
    updated_at = NOW()
  WHERE user_id = p_user_id;

  -- ── 9. Return result ──
  RETURN jsonb_build_object(
    'success', true,
    'assignment_id', p_assignment_id,
    'quest_title', v_quest.title,
    'xp_awarded', v_quest.xp_reward,
    'xp_total', v_new_xp,
    'level', v_new_level,
    'streak_current', v_new_streak,
    'streak_best', v_new_best,
    'quests_completed_total', v_new_total,
    'completed_at', NOW()
  );
END;
$$;
