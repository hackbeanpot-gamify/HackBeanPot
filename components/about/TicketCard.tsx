import type { ReactNode } from "react";

export default function TicketCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      {/* notch left */}
      <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#FFF7ED] z-10" />
      {/* notch right */}
      <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#FFF7ED] z-10" />
      {/* perforated edge */}
      <div className="absolute left-5 right-5 top-0 h-0.5 bg-[repeating-linear-gradient(90deg,#F9A8D4_0px,#F9A8D4_4px,transparent_4px,transparent_8px)]" />
      <div className="absolute left-5 right-5 bottom-0 h-0.5 bg-[repeating-linear-gradient(90deg,#F9A8D4_0px,#F9A8D4_4px,transparent_4px,transparent_8px)]" />
      <div className="overflow-hidden border-2 border-dashed border-pink-200 rounded-2xl shadow-sm bg-white">
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
