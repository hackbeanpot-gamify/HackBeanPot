import { Star } from "lucide-react";

/**
 * TestimonialCard — dark carnival quote card.
 */
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
  if (!name || !quote) return null;

  return (
    <div className="rounded-xl bg-slate-800/50 border border-amber-400/10 transition-transform duration-300 hover:-translate-y-1">
      <div className="p-4 flex flex-col gap-2.5">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">{avatar}</span>
          <div>
            <p
              className="font-bold text-slate-200 text-sm"
              style={{ fontFamily: "var(--font-fredoka)" }}
            >
              {name}
            </p>
            <p className="text-[10px] text-slate-500">{handle}</p>
          </div>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed italic">
          &ldquo;{quote}&rdquo;
        </p>
        {rating > 0 && (
          <div className="flex gap-0.5">
            {Array.from({ length: rating }).map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
