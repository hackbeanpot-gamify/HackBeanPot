import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  accent: string;
}

export default function StatCard({ icon: Icon, label, value, accent }: StatCardProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className={`p-2.5 rounded-xl ${accent} mb-3`}>
        <Icon className="w-5 h-5" />
      </div>
      <span
        className="text-3xl sm:text-4xl font-extrabold text-gray-800"
        style={{ fontFamily: "var(--font-fredoka)" }}
      >
        {value}
      </span>
      <span className="text-sm text-gray-500 mt-1 font-medium">{label}</span>
    </div>
  );
}
