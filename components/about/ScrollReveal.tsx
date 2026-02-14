"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { ReactNode } from "react";

/**
 * ScrollReveal — scroll-triggered entrance animation.
 *
 * TEXT VISIBILITY FIX:
 *   Previous version used once:true with a tight margin, causing
 *   text to stay hidden if the user scrolled past quickly, or to
 *   never re-appear if they scrolled back up.
 *
 *   Now uses:
 *   - once: false — element can re-enter the viewport
 *   - margin: "-15%" — only triggers exit when ~15% off screen
 *     (NOT when it's still mostly visible)
 *   - Animate OPACITY ONLY on exit (no layout shift, no display:none)
 *   - Entry: fade + slide up. Exit: just fade out.
 *
 *   This means content stays visible as long as it's in/near the
 *   viewport, and only fades when it's truly scrolled away.
 */
interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right";
}

export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: ScrollRevealProps) {
  const ref = useRef(null);

  /* margin: "-15%" means the element must be 15% off-screen edge
     before inView flips to false. This prevents premature fade. */
  const inView = useInView(ref, { once: false, margin: "-15%" });

  const offsets: Record<string, { y: number; x: number }> = {
    up: { y: 24, x: 0 },
    left: { y: 0, x: -24 },
    right: { y: 0, x: 24 },
  };

  const { x: offX, y: offY } = offsets[direction];

  return (
    <motion.div
      ref={ref}
      className={className}
      /* Entry: fade in + slide from direction */
      animate={
        inView
          ? { opacity: 1, y: 0, x: 0 }
          : { opacity: 0, y: offY, x: offX }
      }
      transition={{
        duration: 0.5,
        delay: inView ? delay : 0, /* only delay on entry, not exit */
        ease: "easeOut",
      }}
    >
      {children}
    </motion.div>
  );
}
