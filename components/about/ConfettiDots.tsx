"use client";

/**
 * ConfettiDots — very subtle decorative background dots.
 * Purely cosmetic, no interactive elements.
 */
export default function ConfettiDots({ className = "" }: { className?: string }) {
  return (
    <div className={`${className} pointer-events-none overflow-hidden`} aria-hidden="true">
      {/* Subtle ambient glow dots — CSS only, no SVG circles */}
      <div className="absolute top-[10%] left-[15%] w-1 h-1 rounded-full bg-amber-400/10" />
      <div className="absolute top-[25%] right-[20%] w-1 h-1 rounded-full bg-orange-400/10" />
      <div className="absolute top-[60%] left-[30%] w-0.5 h-0.5 rounded-full bg-red-400/8" />
      <div className="absolute top-[75%] right-[35%] w-1 h-1 rounded-full bg-yellow-400/10" />
      <div className="absolute top-[40%] left-[70%] w-0.5 h-0.5 rounded-full bg-amber-400/8" />
    </div>
  );
}
