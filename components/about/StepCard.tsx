import type { LucideIcon } from "lucide-react";

interface StepCardProps {
  num: string;
  title: string;
  desc: string;
  icon: LucideIcon;
  color: string;
  showConnector?: boolean;
}

const numBg: Record<string, string> = {
  "1": "bg-pink-400",
  "2": "bg-yellow-400",
  "3": "bg-sky-400",
  "4": "bg-emerald-400",
};

export default function StepCard({
  num,
  title,
  desc,
  icon: Icon,
  color,
  showConnector = false,
}: StepCardProps) {
  return (
    <div className="relative text-center transition-transform duration-300 hover:-translate-y-2 hover:scale-[1.04]">
      {showConnector && (
        <div
          className="hidden lg:block absolute top-10 left-[60%] w-full h-0.5 z-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, #F9A8D4 0px, #F9A8D4 6px, transparent 6px, transparent 12px)",
          }}
        />
      )}
      <div
        className={`relative z-10 inline-flex items-center justify-center w-14 h-14 rounded-full ${numBg[num] || color} text-white text-xl font-extrabold shadow-md mb-4 ring-4 ring-white`}
        style={{ fontFamily: "var(--font-fredoka)" }}
      >
        {num}
      </div>
      <div className="relative z-10 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <Icon className="w-5 h-5 mx-auto text-gray-400 mb-2" />
        <h3 className="font-bold text-gray-800" style={{ fontFamily: "var(--font-fredoka)" }}>
          {title}
        </h3>
        <p className="text-gray-500 text-sm mt-1.5 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
