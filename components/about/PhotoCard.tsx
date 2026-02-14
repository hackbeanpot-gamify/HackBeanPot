import Image from "next/image";

interface PhotoCardProps {
  src: string;
  alt: string;
  caption: string;
}

export default function PhotoCard({ src, alt, caption }: PhotoCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl shadow-md border border-gray-100 transition-transform duration-300 hover:-translate-y-2 hover:scale-[1.03] group">
      <div className="relative w-full h-64 sm:h-72 bg-pink-50 overflow-hidden">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, 50vw"
        />
      </div>
      <div className="p-4 bg-white">
        <p className="text-sm text-gray-600 leading-relaxed font-medium">{caption}</p>
      </div>
    </div>
  );
}
