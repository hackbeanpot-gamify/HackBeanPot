"use client";

interface Checkpoint {
  y: number;
  color: string;
  label: string;
}

interface RollercoasterTrackProps {
  checkpoints: Checkpoint[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function RollercoasterTrack({ checkpoints }: RollercoasterTrackProps) {
  const W = 600;
  const H = 4800;
  const RAIL_GAP = 18;

  const points = [
    { x: 300, y: 0 },
    { x: 150, y: 400 },
    { x: 450, y: 950 },
    { x: 150, y: 1400 },
    { x: 450, y: 1850 },
    { x: 150, y: 2350 },
    { x: 450, y: 2900 },
    { x: 450, y: 3450 },
    { x: 150, y: 3900 },
    { x: 300, y: H },
  ];

  // Generate smooth cubic bezier path
  let mainPath = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const cy = (p0.y + p1.y) / 2;
    mainPath += ` C ${p0.x} ${cy}, ${p1.x} ${cy}, ${p1.x} ${p1.y}`;
  }

  // Second rail — offset to the right
  let secondRailPath = `M ${points[0].x + RAIL_GAP} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const cy = (p0.y + p1.y) / 2;
    secondRailPath += ` C ${p0.x + RAIL_GAP} ${cy}, ${p1.x + RAIL_GAP} ${cy}, ${p1.x + RAIL_GAP} ${p1.y}`;
  }

  // Support structures
  const supports = points.filter((_, i) => i > 0 && i < points.length - 1 && i % 2 === 1);

  return (
    <svg
      className="absolute inset-0 w-full h-full z-0 pointer-events-none"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
    >
      {/* Support structures */}
      {supports.map((s, i) => (
        <g key={`support-${i}`} opacity="0.12">
          <line x1={s.x + RAIL_GAP / 2} y1={s.y} x2={s.x + RAIL_GAP / 2} y2={s.y + 120} stroke="#b8956e" strokeWidth="3" />
          <line x1={s.x + RAIL_GAP / 2} y1={s.y} x2={s.x + RAIL_GAP / 2 - 25} y2={s.y + 120} stroke="#b8956e" strokeWidth="2" />
          <line x1={s.x + RAIL_GAP / 2} y1={s.y} x2={s.x + RAIL_GAP / 2 + 25} y2={s.y + 120} stroke="#b8956e" strokeWidth="2" />
          <line x1={s.x + RAIL_GAP / 2 - 25} y1={s.y + 120} x2={s.x + RAIL_GAP / 2 + 25} y2={s.y + 120} stroke="#b8956e" strokeWidth="2" />
        </g>
      ))}

      {/* Left rail */}
      <path d={mainPath} stroke="#d4a574" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* Right rail */}
      <path d={secondRailPath} stroke="#d4a574" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}
