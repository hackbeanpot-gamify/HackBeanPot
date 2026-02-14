import type { ReactNode } from "react";

export default function HeroBadge({ children }: { children: ReactNode }) {
  return (
    <span
      className="inline-flex items-center mb-4 bg-pink-100 text-pink-600 border-2 border-dashed border-pink-300 text-xs px-4 py-1.5 rounded-full font-bold tracking-widest uppercase"
      style={{ fontFamily: "var(--font-fredoka)" }}
    >
      {children}
    </span>
  );
}
