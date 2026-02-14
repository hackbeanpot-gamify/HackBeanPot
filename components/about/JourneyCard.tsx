"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { ReactNode } from "react";

/**
 * JourneyCard — Carnival-themed card anchored to the rollercoaster track.
 *
 * VISUAL ANATOMY:
 * ┌─ connector line ← from track node ──────────────┐
 * │ ┌─ station badge pill ─────────────────────────┐ │
 * │ │ [emoji] STATION NAME                         │ │
 * │ └─────────────────────────────────────────────┘ │
 * │ ┌─ dashed "stitch" inner border ──────────────┐ │
 * │ │  Content (children)                          │ │
 * │ └─── ticket notch (L) ────── ticket notch (R) ─┘ │
 * └─────────────────────────────────────────────────┘
 *
 * CONNECTOR LINE:
 *   A horizontal dashed line extends from the card's track-facing
 *   edge toward center, visually "attaching" the card to the
 *   nearest checkpoint node on the rollercoaster track.
 *   - Left cards: connector extends from right edge → right
 *   - Right cards: connector extends from left edge → left
 *
 * TICKET BORDER / PERFORATION:
 *   Thick warm-colored outer border. Circular notches on L+R
 *   edges (bg-colored circles). Inner dashed "stitch" line.
 *
 * SLIDE-IN ANIMATION:
 *   Cards slide in from their side (left cards from -50px,
 *   right cards from +50px) when entering viewport.
 *   Uses once:false so cards re-appear when scrolled back to.
 */
interface JourneyCardProps {
  children: ReactNode;
  side: "left" | "right";
  station: string;
  stationEmoji?: string;
  accentColor?: string;
  accentBorder?: string;
  className?: string;
}

export default function JourneyCard({
  children,
  side,
  station,
  stationEmoji = "🎪",
  accentColor = "text-amber-400",
  accentBorder = "border-amber-400/25",
  className = "",
}: JourneyCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: "-15%" });

  const initial = { opacity: 0, x: side === "left" ? -50 : 50 };
  const animate = inView ? { opacity: 1, x: 0 } : initial;

  /* Which edge faces the track? */
  const perforationSide =
    side === "left"
      ? "border-r-[3px] border-dashed"
      : "border-l-[3px] border-dashed";

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      initial={initial}
      animate={animate}
      transition={{ duration: 0.55, ease: "easeOut" }}
    >
      {/* ── CONNECTOR LINE ──
          A dashed line extending from the track-facing edge of
          the card toward the center track. Visually anchors the
          card to the nearest checkpoint node.
          - pointer-events-none so it never blocks content */}
      <div
        className={`absolute top-8 hidden lg:block pointer-events-none ${
          side === "left"
            ? "right-0 translate-x-full"
            : "left-0 -translate-x-full"
        }`}
        style={{ width: "40px" }}
      >
        <div
          className={`h-px w-full border-t-2 border-dashed ${accentBorder}`}
        />
        {/* small dot at the end of the connector */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full ${
            side === "left" ? "right-0" : "left-0"
          }`}
          style={{ backgroundColor: "currentColor" }}
        >
          <div className={`w-2 h-2 rounded-full ${accentColor.replace("text-", "bg-")} opacity-60`} />
        </div>
      </div>

      {/* ── Station badge ── */}
      <div
        className={`inline-flex items-center gap-1.5 mb-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] ${accentColor} bg-[#0f172a] border ${accentBorder}`}
        style={{ fontFamily: "var(--font-fredoka)" }}
      >
        <span>{stationEmoji}</span>
        {station}
      </div>

      {/* ── Card body ── */}
      <div
        className={`
          relative rounded-xl overflow-hidden
          bg-[#0f172a]/90 backdrop-blur-sm
          border-2 ${accentBorder}
          ${perforationSide} ${accentBorder}
        `}
      >
        {/* Inner stitch line */}
        <div className={`absolute inset-0 m-1.5 rounded-lg border border-dashed ${accentBorder} opacity-25 pointer-events-none`} />

        {/* Warm top-edge highlight (subtle lamp, not neon) */}
        <div
          className="absolute top-0 inset-x-0 h-px pointer-events-none"
          style={{
            background: "linear-gradient(90deg, transparent 10%, rgba(246,196,83,0.12) 50%, transparent 90%)",
          }}
        />

        <div className="p-6">{children}</div>
      </div>
    </motion.div>
  );
}
