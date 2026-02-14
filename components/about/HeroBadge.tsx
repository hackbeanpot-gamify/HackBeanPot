import type { ReactNode } from "react";

/**
 * HeroBadge — dark-themed pill badge with warm gold accent.
 * Used in the hero section only.
 */
export default function HeroBadge({ children }: { children: ReactNode }) {
  return (
    <span
      className="inline-flex items-center mb-5 bg-amber-400/8 text-amber-300 border border-amber-400/20 text-[11px] px-4 py-1.5 rounded-full font-bold tracking-widest uppercase"
      style={{ fontFamily: "var(--font-fredoka)" }}
    >
      {children}
    </span>
  );
}
