import { Star } from "lucide-react";

interface TestimonialCardProps {
  name: string;
  handle: string;
  avatar: string;
  quote: string;
  rating: number;
}

export default function TestimonialCard({
  name,
  handle,
  avatar,
  quote,
  rating,
}: TestimonialCardProps) {
  return (
    <div className="rounded-2xl shadow-sm bg-white border border-gray-100 transition-transform duration-300 hover:-translate-y-2 hover:scale-[1.03]">
      <div className="p-6 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{avatar}</span>
          <div>
            <p
              className="font-bold text-gray-800 text-sm"
              style={{ fontFamily: "var(--font-fredoka)" }}
            >
              {name}
            </p>
            <p className="text-xs text-gray-400">{handle}</p>
          </div>
        </div>
        <p className="text-gray-600 text-sm leading-relaxed italic">
          &ldquo;{quote}&rdquo;
        </p>
        <div className="flex gap-0.5">
          {Array.from({ length: rating }).map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
      </div>
    </div>
  );
}
