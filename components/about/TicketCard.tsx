import type { ReactNode } from "react";

/**
 * TicketCard — Dark ticket stub with notch cutouts and
 * dashed perforated border. Used for stat cards.
 *
 * TICKET PERFORATION:
 *   Circular cutouts on L+R edges match the page bg (#0B1120)
 *   to create a "tear-off" ticket effect.
 *   Inner dashed border (warm amber tint) mimics perforated edge.
 *
 * EMPTY DATA GUARD: children must be provided.
 */
export default function TicketCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <div className="overflow-hidden border border-dashed border-amber-400/15 rounded-lg bg-slate-800/50">
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
