"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * CenterTrack — BOLD vertical rollercoaster rail running down the
 * center of the page. Features:
 *  - Thick dual rails (left + right) with a gap between them
 *  - Structural crossties every ~40px
 *  - Vertical support beams at intervals
 *  - Scroll-driven glow that "lights up" as you ride down
 *  - Hidden on mobile (< lg)
 */
export default function CenterTrack() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const glowHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div
      ref={ref}
      className="hidden lg:block fixed left-1/2 -translate-x-1/2 top-0 w-10 pointer-events-none z-10"
      style={{ height: "100vh" }}
      aria-hidden
    >
      {/* ── left rail ── */}
      <div className="absolute left-1.5 top-0 bottom-0 w-1 rounded-full bg-slate-700/60" />
      {/* ── right rail ── */}
      <div className="absolute right-1.5 top-0 bottom-0 w-1 rounded-full bg-slate-700/60" />

      {/* ── crossties (horizontal bars between rails) ── */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(180deg, transparent 0px, transparent 34px, rgba(100,116,139,0.35) 34px, rgba(100,116,139,0.35) 38px)",
        }}
      />

      {/* ── structural support triangles at intervals ── */}
      {[15, 35, 55, 75].map((pct) => (
        <div
          key={pct}
          className="absolute left-1/2 -translate-x-1/2"
          style={{ top: `${pct}%` }}
        >
          <svg width="28" height="18" viewBox="0 0 28 18" fill="none" className="opacity-25">
            <path d="M2 16 L14 2 L26 16" stroke="#94a3b8" strokeWidth="1.5" fill="none" />
            <line x1="8" y1="10" x2="20" y2="10" stroke="#94a3b8" strokeWidth="1" />
          </svg>
        </div>
      ))}

      {/* ── scroll-driven warm glow that fills the track ── */}
      <motion.div
        className="absolute left-2.5 right-2.5 top-0 rounded-full origin-top"
        style={{
          height: glowHeight,
          background: "linear-gradient(180deg, #fbbf24 0%, #f472b6 40%, #818cf8 70%, #2dd4bf 100%)",
          opacity: 0.35,
          filter: "blur(6px)",
        }}
      />

      {/* ── sharp progress line on top of glow ── */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 w-0.5 top-0 rounded-full origin-top"
        style={{
          height: glowHeight,
          background: "linear-gradient(180deg, #fbbf24, #f472b6, #818cf8, #2dd4bf)",
          opacity: 0.7,
        }}
      />
    </div>
  );
}
