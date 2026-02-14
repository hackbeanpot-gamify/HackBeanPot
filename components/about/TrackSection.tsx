"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import type { ReactNode } from "react";

/**
 * TrackSection — positions content left or right of the bold center
 * track. Features a large glowing "checkpoint node" on the rail and
 * a station signboard label. Content slides in from its side on scroll.
 */
interface TrackSectionProps {
  children: ReactNode;
  side: "left" | "right";
  station: string;
  dotColor?: string;
  glowColor?: string;
  className?: string;
}

export default function TrackSection({
  children,
  side,
  station,
  dotColor = "bg-amber-400",
  glowColor = "rgba(251,191,36,0.3)",
  className = "",
}: TrackSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.4], [0, 1]);
  const translateX = useTransform(
    scrollYProgress,
    [0, 0.5],
    [side === "left" ? -50 : 50, 0]
  );

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* ── checkpoint node on the rail (desktop) ── */}
      <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 top-12 flex-col items-center z-20">
        {/* outer glow ring */}
        <div
          className="absolute w-12 h-12 rounded-full -top-2.5"
          style={{
            background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
          }}
        />
        {/* solid dot */}
        <div className={`relative w-7 h-7 rounded-full ${dotColor} ring-4 ring-slate-800 shadow-lg z-10`} />
        {/* connecting arm to content side */}
        <div
          className={`absolute top-3 w-16 h-0.5 bg-slate-600/50 ${
            side === "left" ? "right-full mr-1" : "left-full ml-1"
          }`}
          style={{ top: "10px" }}
        />
        {/* station signboard */}
        <div
          className={`absolute top-0 whitespace-nowrap ${
            side === "left" ? "right-full mr-20" : "left-full ml-20"
          }`}
        >
          <div className="bg-slate-800/80 border border-slate-600/50 rounded-lg px-3 py-1.5 backdrop-blur-sm">
            <span
              className="text-[10px] font-bold uppercase tracking-[0.15em] text-amber-300/80"
              style={{ fontFamily: "var(--font-fredoka)" }}
            >
              {station}
            </span>
          </div>
        </div>
      </div>

      {/* ── mobile station label ── */}
      <div className="lg:hidden flex justify-center mb-6">
        <div className="inline-flex items-center gap-2 bg-slate-800/60 border border-slate-700/50 rounded-lg px-3 py-1.5">
          <div className={`w-2.5 h-2.5 rounded-full ${dotColor}`} />
          <span
            className="text-[10px] font-bold uppercase tracking-[0.15em] text-amber-300/70"
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            {station}
          </span>
        </div>
      </div>

      {/* ── content block ── */}
      <motion.div
        className={`lg:w-[44%] ${side === "left" ? "lg:mr-auto lg:pr-12" : "lg:ml-auto lg:pl-12"}`}
        style={{ opacity, x: translateX }}
      >
        {children}
      </motion.div>
    </div>
  );
}
