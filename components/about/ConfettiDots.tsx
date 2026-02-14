"use client";

import { motion } from "framer-motion";

export default function ConfettiDots({ className = "" }: { className?: string }) {
  const dots = [
    { pos: "top-[5%] left-[6%]", color: "bg-pink-300", size: "w-2.5 h-2.5", delay: 0 },
    { pos: "top-[10%] right-[8%]", color: "bg-yellow-300", size: "w-3 h-3", delay: 0.3 },
    { pos: "bottom-[12%] left-[15%]", color: "bg-sky-300", size: "w-2 h-2", delay: 0.5 },
    { pos: "top-[25%] left-[50%]", color: "bg-emerald-300", size: "w-2 h-2", delay: 0.7 },
    { pos: "bottom-[20%] right-[18%]", color: "bg-pink-200", size: "w-3 h-3", delay: 0.2 },
    { pos: "top-[8%] right-[35%]", color: "bg-orange-200", size: "w-2 h-2", delay: 0.6 },
    { pos: "bottom-[8%] left-[35%]", color: "bg-yellow-200", size: "w-2.5 h-2.5", delay: 0.1 },
    { pos: "top-[40%] left-[8%]", color: "bg-sky-200", size: "w-2 h-2", delay: 0.4 },
    { pos: "bottom-[30%] right-[10%]", color: "bg-emerald-200", size: "w-2 h-2", delay: 0.8 },
  ];

  return (
    <div className={`pointer-events-none select-none ${className}`} aria-hidden>
      {dots.map((dot, i) => (
        <motion.span
          key={i}
          className={`absolute rounded-full opacity-50 ${dot.pos} ${dot.color} ${dot.size}`}
          animate={{ y: [0, -8, 0], opacity: [0.35, 0.6, 0.35] }}
          transition={{ duration: 3.5, repeat: Infinity, delay: dot.delay, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}
