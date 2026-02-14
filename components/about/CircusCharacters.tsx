"use client";

import { motion } from "framer-motion";

/**
 * CircusCharacters — very faint carnival emojis floating along
 * edges. On dark bg they act like distant fairground lights.
 */
interface CircusCharactersProps {
  className?: string;
  characters?: string[];
}

const defaultCharacters = ["🎡", "🎪", "🎠", "🍿", "🎈", "🎟️"];

export default function CircusCharacters({
  className = "",
  characters = defaultCharacters,
}: CircusCharactersProps) {
  return (
    <div className={`pointer-events-none select-none ${className}`} aria-hidden>
      {characters.map((char, i) => {
        const isLeft = i % 2 === 0;
        const topPercent = 10 + (i * 75) / characters.length;
        return (
          <motion.span
            key={i}
            className="absolute text-lg"
            style={{
              top: `${topPercent}%`,
              [isLeft ? "left" : "right"]: `${4 + (i % 3) * 4}%`,
              opacity: 0.06,
            }}
            animate={{ y: [0, -4, 0] }}
            transition={{
              duration: 6 + (i % 3),
              repeat: Infinity,
              delay: i * 0.7,
              ease: "easeInOut",
            }}
          >
            {char}
          </motion.span>
        );
      })}
    </div>
  );
}
