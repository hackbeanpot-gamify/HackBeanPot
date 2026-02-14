import type { LucideIcon } from "lucide-react";

/**
 * StatCard — impact number display, dark theme.
 */
interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  accent: string;
}

export default function StatCard({ icon: Icon, label, value, accent }: StatCardProps) {
  if (!label || !value) return null;

  return (
    <div className="flex flex-col items-center text-center">
      <div className={`p-1.5 rounded-lg ${accent} mb-2`}>
        <Icon className="w-3.5 h-3.5" />
      </div>
      <span
        className="text-xl sm:text-2xl font-extrabold text-slate-100"
        style={{ fontFamily: "var(--font-fredoka)" }}
      >
        {value}
      </span>
      <span className="text-[10px] text-slate-400 mt-0.5 font-medium">{label}</span>
    </div>
  );
}
