import type { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  desc: string;
  color: string;
  bg: string;
}

export default function FeatureCard({ icon: Icon, title, desc, color, bg }: FeatureCardProps) {
  return (
    <div className={`${bg} border rounded-2xl transition-transform duration-300 hover:-translate-y-2 hover:scale-[1.03]`}>
      <div className="p-6 flex gap-4 items-start">
        <div className="p-2.5 rounded-xl bg-white shadow-sm shrink-0">
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <div>
          <h3
            className="font-bold text-gray-800 text-lg"
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            {title}
          </h3>
          <p className="text-gray-500 text-sm mt-1 leading-relaxed">{desc}</p>
        </div>
      </div>
    </div>
  );
}
