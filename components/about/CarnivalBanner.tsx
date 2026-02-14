/**
 * CarnivalBanner — thin warm-lit stripe divider between page zones.
 * Uses only warm carnival colors: gold, orange, red, yellow.
 * NO indigo, NO teal, NO purple — pure carnival warmth.
 */
export default function CarnivalBanner({ flip = false }: { flip?: boolean }) {
  const colors = flip
    ? "#ff8a3d, #ff8a3d 10px, #f59e0b 10px, #f59e0b 20px, #e84b5c 20px, #e84b5c 30px, #f6c453 30px, #f6c453 40px"
    : "#f59e0b, #f59e0b 10px, #e84b5c 10px, #e84b5c 20px, #ff8a3d 20px, #ff8a3d 30px, #f6c453 30px, #f6c453 40px";

  return (
    <div
      className="w-full h-1 opacity-30"
      style={{ background: `repeating-linear-gradient(90deg, ${colors})` }}
    />
  );
}
