import type { LucideIcon } from "lucide-react";

/**
 * FeatureCard — Dark carnival card. Warm border accent,
 * icon in a tinted circle, readable text on midnight bg.
 */
interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  desc: string;
  color: string;
  bg: string;
}

export default function FeatureCard({ icon: Icon, title, desc, color, bg }: FeatureCardProps) {
  /* EMPTY DATA GUARD */
  if (!title || !desc) return null;

  return (
    <div className={`${bg} border rounded-xl transition-transform duration-300 hover:-translate-y-1`}>
      <div className="p-4 flex gap-3 items-start">
        <div className="p-2 rounded-lg bg-slate-800/80 shrink-0">
          <Icon className={`w-4 h-4 ${color}`} />
        </div>
        <div>
          <h3 className="font-bold text-slate-100 text-sm" style={{ fontFamily: "var(--font-fredoka)" }}>
            {title}
          </h3>
          <p className="text-slate-400 text-xs mt-1 leading-relaxed">{desc}</p>
        </div>
      </div>
    </div>
  );
}
