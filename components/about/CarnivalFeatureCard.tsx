
"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { LucideIcon } from "lucide-react";

/**
 * CarnivalFeatureCard — a "ticket booth / carnival signage" styled card.
 *
 * VISUAL ANATOMY:
 * ┌─ marquee bulbs (tiny gold dots along top) ─────────┐
 * │ ┌─ dashed "stitch" inner border ─────────────────┐ │
 * │ │  [LABEL PILL]                                   │ │
 * │ │  [ICON BADGE]  Title                            │ │
 * │ │                Description text                 │ │
 * │ └────────────────────────────────────────────────┘ │
 * └─── perforated notch (left) ──── notch (right) ────┘
 *
 * TICKET BORDER / PERFORATION:
 *   The outer wrapper has a thick warm-colored border.
 *   Circular notch cutouts on left+right edges (via pseudo
 *   circles matching the page bg) create a "tear-off" ticket feel.
 *   An inner dashed border ("stitch line") reinforces the ticket motif.
 *
 * MARQUEE BULB DOTS:
 *   A row of tiny circles along the top edge of the card,
 *   rendered as flex'd <span>s with warm yellow/orange bg.
 *   They are purely decorative (not animated/blinking — tasteful).
 *
 * ICON BADGE:
 *   The icon sits inside a rounded "carnival badge" — thick ring
 *   in the card's accent color with a warm-tinted fill, like a
 *   prize ribbon or stamped medallion.
 *
 * COLORS PER VARIANT (passed as props):
 *   - Daily Quests:   orange/gold  (#F6C453 / #FF8A3D)
 *   - Report Board:   red/pink     (#E84B5C / #F2558A)
 *   - Streaks & XP:   yellow/gold  (#F2B84B / #F6C453)
 *   - Raid Boss:      orange/red   (#FF7A1A / #E84B5C)
 *
 * Props:
 *   icon        — Lucide icon component
 *   title       — card heading
 *   desc        — body text
 *   label       — tiny carnival pill text (e.g., "PRIZE BOOTH")
 *   accentColor — Tailwind text-color for accent elements
 *   accentBg    — Tailwind bg-color for badge fill
 *   accentRing  — Tailwind ring/border color for badge outline
 *   borderColor — Tailwind border-color for the outer ticket border
 *   bulbColor   — Tailwind bg-color for marquee dots
 *   labelBg     — Tailwind bg for label pill
 *   labelText   — Tailwind text for label pill
 */

interface CarnivalFeatureCardProps {
  icon: LucideIcon;
  title: string;
  desc: string;
  label?: string;
  accentColor?: string;
  accentBg?: string;
  accentRing?: string;
  borderColor?: string;
  bulbColor?: string;
  labelBg?: string;
  labelText?: string;
}

export default function CarnivalFeatureCard({
  icon: Icon,
  title,
  desc,
  label,
  accentColor = "text-amber-400",
  accentBg = "bg-amber-400/15",
  accentRing = "ring-amber-400/50",
  borderColor = "border-amber-400/40",
  bulbColor = "bg-amber-300",
  labelBg = "bg-amber-400",
  labelText = "text-slate-900",
}: CarnivalFeatureCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  /* EMPTY DATA GUARD */
  if (!title || !desc) return null;

  return (
    <motion.div
      ref={ref}
      className="relative group"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      {/* ── OUTER TICKET WRAPPER ──
          Thick warm border + rounded corners.
          The border color is the card's accent. */}
      <div
        className={`
          relative overflow-visible rounded-xl
          border-2 ${borderColor}
          bg-[#111827]/90 backdrop-blur-sm
          transition-all duration-300
          hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-900/10
          hover:border-opacity-70
        `}
      >

        {/* ── MARQUEE BULB DOTS ──
            A row of tiny warm circles along the top edge.
            7 evenly-spaced "bulbs" that sit on the border line.
            Purely decorative — warm and festive, not blinking. */}
        <div className="absolute -top-0.75 left-4 right-4 flex justify-between pointer-events-none z-20">
          {Array.from({ length: 7 }).map((_, i) => (
            <span
              key={i}
              className={`w-1.5 h-1.5 rounded-full ${bulbColor} opacity-60 group-hover:opacity-90 transition-opacity duration-300`}
            />
          ))}
        </div>

        {/* ── INNER STITCH BORDER ──
            A dashed border inset ~6px from the outer edge,
            mimicking the "stitch line" on a real carnival ticket. */}
        <div className={`m-1.5 rounded-lg border border-dashed ${borderColor} opacity-30 pointer-events-none absolute inset-0`} />

        {/* ── CARD CONTENT ── */}
        <div className="relative p-4 flex gap-3.5 items-start">

          {/* ── ICON BADGE ──
              A rounded "carnival medallion" — thick colored ring
              with a warm-tinted fill. Looks like a prize ribbon
              or stamped badge from a carnival booth. */}
          <div
            className={`
              shrink-0 w-11 h-11 rounded-full
              ${accentBg} ring-[2.5px] ${accentRing}
              flex items-center justify-center
              transition-transform duration-300
              group-hover:scale-110 group-hover:rotate-3
            `}
          >
            <Icon className={`w-5 h-5 ${accentColor}`} />
          </div>

          <div className="min-w-0">
            {/* ── CARNIVAL LABEL PILL ──
                A tiny bright pill above the title — "PRIZE BOOTH",
                "NOTICE BOARD", etc. Bright warm bg with dark text
                for maximum pop against the dark card. */}
            {label && (
              <span
                className={`
                  inline-block mb-1.5 px-2 py-0.5 rounded-full
                  text-[8px] font-extrabold uppercase tracking-[0.15em]
                  ${labelBg} ${labelText}
                `}
                style={{ fontFamily: "var(--font-fredoka)" }}
              >
                {label}
              </span>
            )}

            <h3
              className="font-bold text-slate-100 text-sm leading-snug"
              style={{ fontFamily: "var(--font-fredoka)" }}
            >
              {title}
            </h3>
            <p className="text-slate-400 text-xs mt-1 leading-relaxed">
              {desc}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
