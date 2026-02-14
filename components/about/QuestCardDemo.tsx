"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, Zap, Camera, CheckCircle } from "lucide-react";

interface QuestCardDemoProps {
  title?: string;
  location?: string;
  xpReward?: number;
  timeEstimate?: string;
  difficulty?: string;
}

const diffColors: Record<string, string> = {
  Easy: "text-emerald-500 bg-emerald-50 border-emerald-200",
  Medium: "text-yellow-600 bg-yellow-50 border-yellow-200",
  Hard: "text-pink-500 bg-pink-50 border-pink-200",
};

export default function QuestCardDemo({
  title = "Clean up Revere Beach boardwalk",
  location = "Revere Beach, MA",
  xpReward = 150,
  timeEstimate = "~30 min",
  difficulty = "Easy",
}: QuestCardDemoProps) {
  const [state, setState] = useState<"idle" | "accepted" | "completed">("idle");

  function handleClick() {
    if (state === "idle") setState("accepted");
    else if (state === "accepted") setState("completed");
    else setState("idle");
  }

  const btnColors = {
    idle: "bg-pink-400 hover:bg-pink-500",
    accepted: "bg-sky-400 hover:bg-sky-500",
    completed: "bg-emerald-400 hover:bg-emerald-500",
  };

  return (
    <motion.div
      className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden"
      whileHover={{ y: -4 }}
      layout
    >
      {/* banner */}
      <div
        className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white text-center ${
          state === "completed" ? "bg-emerald-400" : state === "accepted" ? "bg-sky-400" : "bg-pink-400"
        }`}
        style={{ fontFamily: "var(--font-fredoka)" }}
      >
        {state === "completed"
          ? "✅ Quest Complete!"
          : state === "accepted"
          ? "📋 Quest Active"
          : "⚔️ Daily Quest Available"}
      </div>

      <div className="p-5">
        <span
          className={`inline-block text-xs font-bold uppercase tracking-wide rounded-full px-3 py-0.5 mb-3 border ${
            diffColors[difficulty] || diffColors.Easy
          }`}
        >
          {difficulty}
        </span>

        <h3
          className="font-bold text-gray-800 text-lg leading-snug"
          style={{ fontFamily: "var(--font-fredoka)" }}
        >
          {title}
        </h3>

        <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-500 font-medium">
          <span className="inline-flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-pink-400" /> {location}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-sky-400" /> {timeEstimate}
          </span>
          <span className="inline-flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-yellow-400" /> +{xpReward} XP
          </span>
        </div>

        <motion.button
          onClick={handleClick}
          className={`mt-5 w-full py-2.5 rounded-full font-bold text-sm cursor-pointer text-white transition-colors ${btnColors[state]}`}
          style={{ fontFamily: "var(--font-fredoka)" }}
          whileTap={{ scale: 0.95 }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={state}
              className="inline-flex items-center gap-2"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {state === "idle" && (
                <>Accept Quest <Zap className="w-4 h-4" /></>
              )}
              {state === "accepted" && (
                <>Upload Proof <Camera className="w-4 h-4" /></>
              )}
              {state === "completed" && (
                <>+{xpReward} XP Earned! <CheckCircle className="w-4 h-4" /></>
              )}
            </motion.span>
          </AnimatePresence>
        </motion.button>

        <AnimatePresence>
          {state === "completed" && (
            <motion.div
              className="mt-3 text-center text-emerald-500 font-extrabold text-xl"
              style={{ fontFamily: "var(--font-fredoka)" }}
              initial={{ opacity: 0, scale: 0.5, y: 10 }}
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
