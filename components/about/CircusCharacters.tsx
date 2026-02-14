"use client";

import { motion } from "framer-motion";

interface CircusCharactersProps {
  className?: string;
  characters?: string[];
}

const defaultCharacters = ["🎈", "🎪", "🍭", "🎡", "🎠", "🍿", "🎟️", "🎀"];

export default function CircusCharacters({
  className = "",
  characters = defaultCharacters,
}: CircusCharactersProps) {
  return (
    <div className={`pointer-events-none select-none ${className}`} aria-hidden>
      {characters.map((char, i) => {
        const isLeft = i % 2 === 0;
        const topPercent = 8 + (i * 80) / characters.length;
        return (
          <motion.span
            key={i}
            className="absolute text-xl sm:text-2xl opacity-15"
            style={{
              top: `${topPercent}%`,
              [isLeft ? "left" : "right"]: `${3 + (i % 3) * 3}%`,
            }}
            animate={{ y: [0, -6, 0], rotate: [0, isLeft ? 4 : -4, 0] }}
            transition={{
              duration: 5 + (i % 3),
              repeat: Infinity,
              delay: i * 0.5,
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
