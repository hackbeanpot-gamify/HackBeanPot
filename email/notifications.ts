/**
 * notifications.ts
 * All email notification workflows for Impact Trail.
 * Each function composes a subject + body and calls sendEmail.
 */

import { sendEmail } from "@/lib/email/sendEmail";

type User = {
  email: string;
  name?: string;
};

/** Daily micro-task reminder */
export async function sendDailyQuestReminder(user: User) {
  return sendEmail(
    user.email,
    "🎯 Your daily quest is waiting!",
    `Hey ${user.name ?? "Quester"}!\n\nYou have a new daily quest ready. Complete it to keep your streak alive and earn XP!\n\nOpen Impact Trail to get started 🎢`
  );
}

/** Streak warning — about to lose streak */
export async function sendStreakWarning(user: User, streakDays: number) {
  return sendEmail(
    user.email,
    `🔥 Don't lose your ${streakDays}-day streak!`,
    `Hey ${user.name ?? "Quester"}!\n\nYou're about to lose your ${streakDays}-day streak! Complete a quest before midnight to keep it going.\n\nEvery day counts 💪`
  );
}

/** Streak reset notification */
export async function sendStreakReset(user: User, previousStreak: number) {
  return sendEmail(
    user.email,
    "😔 Your streak was reset",
    `Hey ${user.name ?? "Quester"},\n\nYour ${previousStreak}-day streak has been reset. But don't worry — start a new one today!\n\nComplete a quest to begin again 🎪`
  );
}

/** XP milestone reached */
export async function sendXpMilestone(user: User, level: number, totalXp: number) {
  return sendEmail(
    user.email,
    `🏆 You reached Level ${level}!`,
    `Congrats ${user.name ?? "Quester"}!\n\nYou've hit Level ${level} with ${totalXp.toLocaleString()} XP. Keep questing to unlock new achievements!\n\n🎢 See you on the leaderboard!`
  );
}

/** Leaderboard rank change */
export async function sendLeaderboardUpdate(user: User, newRank: number) {
  return sendEmail(
    user.email,
    `📊 You're now #${newRank} on the leaderboard!`,
    `Hey ${user.name ?? "Quester"}!\n\nYou've moved to rank #${newRank} on the city-wide leaderboard. Keep completing quests to climb higher!\n\n🎪 Your community thanks you!`
  );
}

/** Raid boss event announcement */
export async function sendRaidBossAnnouncement(user: User, eventName: string, date: string, location: string) {
  return sendEmail(
    user.email,
    `⚔️ Raid Boss Event: ${eventName}`,
    `Hey ${user.name ?? "Quester"}!\n\nA new Raid Boss event is happening:\n\n📌 ${eventName}\n📅 ${date}\n📍 ${location}\n\nTeam up with your community to take it on! Sign up in the app 🎢`
  );
}

/** Nonprofit organizer broadcast */
export async function sendOrganizerBroadcast(user: User, orgName: string, message: string) {
  return sendEmail(
    user.email,
    `📢 Message from ${orgName}`,
    `Hey ${user.name ?? "Quester"},\n\n${orgName} has an update for you:\n\n${message}\n\n— The Impact Trail Team 🎪`
  );
}
