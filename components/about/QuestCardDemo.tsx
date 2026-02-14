"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, Zap, Camera, CheckCircle } from "lucide-react";

/**
 * QuestCardDemo — Interactive quest card demo.
 * Click to cycle: idle → accepted → completed.
 * Dark carnival theme.
 */
interface QuestCardDemoProps {
  title?: string;
  location?: string;
  xpReward?: number;
  timeEstimate?: string;
  difficulty?: string;
}

const diffColors: Record<string, string> = {
  Easy: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  Medium: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  Hard: "text-pink-400 bg-pink-400/10 border-pink-400/20",
};

export default function QuestCardDemo({
  title = "Clean up Revere Beach boardwalk",
  location = "Revere Beach, MA",
  xpReward = 150,
  timeEstimate = "~30 min",
  difficulty = "Easy",
}: QuestCardDemoProps) {
  const [state, setState] = useState<"idle" | "accepted" | "completed">("idle");

  if (!title) return null;

  function handleClick() {
    if (state === "idle") setState("accepted");
    else if (state === "accepted") setState("completed");
    else setState("idle");
  }

  const btnColors = {
    idle: "bg-amber-400 hover:bg-amber-500 text-slate-900",
    accepted: "bg-orange-400 hover:bg-orange-500 text-slate-900",
    completed: "bg-emerald-400 hover:bg-emerald-500 text-slate-900",
  };

  const bannerColors = {
    idle: "bg-amber-400/80",
    accepted: "bg-orange-400/80",
    completed: "bg-emerald-400/80",
  };

  return (
    <motion.div
      className="bg-slate-800/50 border border-amber-400/15 rounded-xl overflow-hidden"
      whileHover={{ y: -2 }}
      layout
    >
      <div
        className={`px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-slate-900 text-center ${bannerColors[state]}`}
        style={{ fontFamily: "var(--font-fredoka)" }}
      >
        {state === "completed"
          ? "✅ Quest Complete!"
          : state === "accepted"
          ? "📋 Quest Active"
          : "⚔️ Daily Quest Available"}
      </div>

      <div className="p-4">
        <span
          className={`inline-block text-[9px] font-bold uppercase tracking-wide rounded-full px-2 py-0.5 mb-2 border ${
            diffColors[difficulty] || diffColors.Easy
          }`}
        >
          {difficulty}
        </span>

        <h3
          className="font-bold text-slate-200 text-sm leading-snug"
          style={{ fontFamily: "var(--font-fredoka)" }}
        >
          {title}
        </h3>

        <div className="mt-2 flex flex-wrap gap-2 text-[10px] text-slate-400 font-medium">
          <span className="inline-flex items-center gap-0.5">
            <MapPin className="w-2.5 h-2.5 text-red-400/60" /> {location}
          </span>
          <span className="inline-flex items-center gap-0.5">
            <Clock className="w-2.5 h-2.5 text-orange-400/60" /> {timeEstimate}
          </span>
          <span className="inline-flex items-center gap-0.5">
            <Zap className="w-2.5 h-2.5 text-amber-400/60" /> +{xpReward} XP
          </span>
        </div>

        <motion.button
          onClick={handleClick}
          className={`mt-3 w-full py-1.5 rounded-full font-bold text-xs cursor-pointer transition-colors ${btnColors[state]}`}
          style={{ fontFamily: "var(--font-fredoka)" }}
          whileTap={{ scale: 0.95 }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={state}
              className="inline-flex items-center gap-1"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.12 }}
            >
              {state === "idle" && (
                <>
                  Accept Quest <Zap className="w-3 h-3" />
                </>
              )}
              {state === "accepted" && (
                <>
                  Upload Proof <Camera className="w-3 h-3" />
                </>
              )}
              {state === "completed" && (
                <>
                  +{xpReward} XP Earned! <CheckCircle className="w-3 h-3" />
                </>
              )}
            </motion.span>
          </AnimatePresence>
        </motion.button>

        <AnimatePresence>
          {state === "completed" && (
            <motion.div
              className="mt-2 text-center text-amber-400 font-extrabold text-base"
              style={{ fontFamily: "var(--font-fredoka)" }}
              initial={{ opacity: 0, scale: 0.5, y: 6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              🎉 +{xpReward} XP 🎉
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
