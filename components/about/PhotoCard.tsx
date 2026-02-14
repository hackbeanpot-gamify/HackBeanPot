import Image from "next/image";

/**
 * PhotoCard — "Souvenir photo" card with ticket frame.
 * Uses Next.js Image for optimization.
 */
interface PhotoCardProps {
  src: string;
  alt: string;
  caption: string;
}

export default function PhotoCard({ src, alt, caption }: PhotoCardProps) {
  if (!src || !caption) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-amber-400/15 transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/30 group">
      <div className="relative w-full h-48 sm:h-56 bg-slate-800 overflow-hidden">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-85"
          sizes="(max-width: 640px) 100vw, 50vw"
        />
      </div>
      <div className="p-3 bg-slate-800/60">
        <p className="text-xs text-slate-300 leading-relaxed font-medium">{caption}</p>
      </div>
    </div>
  );
}
