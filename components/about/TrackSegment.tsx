
"use client";

/**
 * Continuous SVG "rollercoaster track" that sits between two sections.
 * Renders a curved rail with crossties.
 * `direction` controls whether the curve goes left or right.
 */
interface TrackSegmentProps {
  direction?: "left" | "right";
  color?: string;
}

export default function TrackSegment({
  direction = "right",
  color = "#F9A8D4", // pink-300
}: TrackSegmentProps) {
  const flip = direction === "left";

  return (
    <div className="relative w-full h-24 overflow-hidden -my-1 pointer-events-none select-none" aria-hidden>
      <svg
        viewBox="0 0 1200 100"
        fill="none"
        preserveAspectRatio="none"
        className="w-full h-full"
        style={{ transform: flip ? "scaleX(-1)" : undefined }}
      >
        {/* crossties */}
        {Array.from({ length: 20 }).map((_, i) => {
          const x = 30 + i * 60;
          const t = x / 1200;
          /* approximate y along the curve */
          const y = 80 - 60 * Math.sin(t * Math.PI);
          return (
            <line
              key={i}
              x1={x}
              y1={y - 6}
              x2={x}
              y2={y + 6}
              stroke={color}
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.35"
            />
          );
        })}

        {/* rails */}
        <path
          d="M0 80 Q300 10 600 20 Q900 30 1200 80"
          stroke={color}
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity="0.6"
        />
        <path
          d="M0 88 Q300 18 600 28 Q900 38 1200 88"
          stroke={color}
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity="0.6"
        />

        {/* coaster car */}
        <text
          x="600"
          y="12"
          fontSize="22"
          textAnchor="middle"
          style={{ transform: flip ? "scaleX(-1)" : undefined, transformOrigin: "600px 12px" }}
        >
          🎢
        </text>
      </svg>
    </div>
  );
}
