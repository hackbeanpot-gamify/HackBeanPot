/**
 * seed-data.ts
 * The 23 canonical micro-quests for Impact Trail.
 * Column names match the actual public.dailyQuest table (snake_case).
 */

import type { QuestCategory, ProofType } from "./types";

export interface SeedQuest {
  title: string;
  description: string;
  category: QuestCategory;
  xp_reward: number;
  estimated_minutes: number;
  proof_type: ProofType;
  is_daily: boolean;
  weight: number;
}

export const QUEST_SEED_DATA: SeedQuest[] = [
  // ── Clean-Up / Environment (6) ──
  { title: "Pick up 5 pieces of trash", description: "Grab a bag and pick up 5 pieces of litter on your walk — sidewalk, park, or campus.", category: "cleanup", xp_reward: 40, estimated_minutes: 5, proof_type: "photo", is_daily: true, weight: 1 },
  { title: "Recycle a plastic bottle or can", description: "Find one plastic bottle or aluminum can headed for the trash and recycle it instead.", category: "environment", xp_reward: 15, estimated_minutes: 2, proof_type: "checkbox", is_daily: true, weight: 1 },
  { title: "Wipe down a public table or bench", description: "Grab a napkin or wipe and clean a shared table or bench in a library, dorm lounge, or park.", category: "cleanup", xp_reward: 30, estimated_minutes: 3, proof_type: "photo", is_daily: true, weight: 1 },
  { title: "Clean up your building entrance", description: "Spend 2 minutes picking up trash or tidying the entrance to your apartment or dorm.", category: "cleanup", xp_reward: 25, estimated_minutes: 2, proof_type: "photo", is_daily: true, weight: 1 },
  { title: "Pick up litter near a bus stop or crosswalk", description: "Grab any litter you see near a crosswalk, bus stop, or transit shelter.", category: "cleanup", xp_reward: 30, estimated_minutes: 3, proof_type: "photo", is_daily: true, weight: 1 },
  { title: "Tidy a shared space", description: "Refill a shared water station, straighten chairs, or fix a messy common area for 2 minutes.", category: "cleanup", xp_reward: 25, estimated_minutes: 2, proof_type: "checkbox", is_daily: true, weight: 1 },

  // ── Social / Connection (6) ──
  { title: "Say good morning to 3 people", description: "Greet three people you pass today with a smile and a \"good morning\" or \"hey!\"", category: "social", xp_reward: 15, estimated_minutes: 2, proof_type: "checkbox", is_daily: true, weight: 1 },
  { title: "Compliment a stranger", description: "Give a genuine compliment to someone you don't know — their shoes, outfit, backpack, anything!", category: "social", xp_reward: 20, estimated_minutes: 2, proof_type: "checkbox", is_daily: true, weight: 1 },
  { title: "Hold the door for 5 people", description: "Hold the door open for the next 5 people behind you throughout the day.", category: "social", xp_reward: 20, estimated_minutes: 5, proof_type: "checkbox", is_daily: true, weight: 1 },
  { title: "Introduce yourself to someone new", description: "Introduce yourself to someone new in class, at work, or in your building.", category: "social", xp_reward: 35, estimated_minutes: 3, proof_type: "reflection", is_daily: true, weight: 2 },
  { title: "Ask someone how their day is going", description: "Ask someone \"How's your day going?\" and actually listen to their answer.", category: "social", xp_reward: 25, estimated_minutes: 3, proof_type: "checkbox", is_daily: true, weight: 2 },
  { title: "Thank a campus or building worker", description: "Find a janitor, dining staff, security guard, or maintenance worker and sincerely thank them.", category: "kindness", xp_reward: 30, estimated_minutes: 2, proof_type: "checkbox", is_daily: true, weight: 2 },

  // ── Campus / Local Community (6) ──
  { title: "Leave a positive sticky note", description: "Write an encouraging note (\"You got this!\" / \"Keep going!\") and leave it in a study space or common area.", category: "community", xp_reward: 30, estimated_minutes: 3, proof_type: "photo", is_daily: true, weight: 2 },
  { title: "Return a stray shopping cart", description: "Find a shopping cart left in a parking lot and return it to the store.", category: "community", xp_reward: 20, estimated_minutes: 3, proof_type: "checkbox", is_daily: true, weight: 1 },
  { title: "Help someone carry something", description: "Offer to help someone carrying heavy bags, boxes, or groceries.", category: "kindness", xp_reward: 30, estimated_minutes: 5, proof_type: "checkbox", is_daily: true, weight: 1 },
  { title: "Share a campus resource", description: "Tell someone about a useful resource they might not know — tutoring center, food pantry, free printing, etc.", category: "community", xp_reward: 35, estimated_minutes: 3, proof_type: "reflection", is_daily: true, weight: 2 },
  { title: "Post a helpful tip in your group chat", description: "Share something useful in your dorm, class, or team group chat — a reminder, lost & found item, or helpful link.", category: "community", xp_reward: 20, estimated_minutes: 3, proof_type: "checkbox", is_daily: true, weight: 1 },
  { title: "Donate one item you don't need", description: "Find one item to donate — old clothes, a notebook, school supplies — and drop it off or set it aside.", category: "kindness", xp_reward: 40, estimated_minutes: 5, proof_type: "photo", is_daily: true, weight: 1 },

  // ── Kindness / Support (5) ──
  { title: "Text someone you haven't talked to", description: "Send a quick message to someone you haven't talked to in a while: \"Hey, hope you're doing well!\"", category: "kindness", xp_reward: 20, estimated_minutes: 2, proof_type: "checkbox", is_daily: true, weight: 1 },
  { title: "Check in on a stressed friend", description: "Reach out to a friend who seems stressed or overwhelmed — ask how they're doing and if they need anything.", category: "kindness", xp_reward: 35, estimated_minutes: 5, proof_type: "reflection", is_daily: true, weight: 2 },
  { title: "Offer to help someone study", description: "Offer to help a classmate or friend study for 10 minutes — quiz them, explain a concept, or just sit with them.", category: "kindness", xp_reward: 50, estimated_minutes: 10, proof_type: "reflection", is_daily: true, weight: 2 },
  { title: "Leave a thank-you note", description: "Write a short thank-you note for a roommate, teammate, coworker, or friend and leave it where they'll find it.", category: "kindness", xp_reward: 30, estimated_minutes: 3, proof_type: "photo", is_daily: true, weight: 2 },
  { title: "Give up your seat", description: "On the bus, train, or in a crowded room — offer your seat to someone who needs it more.", category: "kindness", xp_reward: 20, estimated_minutes: 2, proof_type: "checkbox", is_daily: true, weight: 1 },
];
