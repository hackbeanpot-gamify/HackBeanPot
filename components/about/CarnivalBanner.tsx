export default function CarnivalBanner({ flip = false }: { flip?: boolean }) {
  const colors = flip
    ? "#93C5FD, #93C5FD 16px, #FDE68A 16px, #FDE68A 32px, #F9A8D4 32px, #F9A8D4 48px, #6EE7B7 48px, #6EE7B7 64px"
    : "#F9A8D4, #F9A8D4 16px, #FDE68A 16px, #FDE68A 32px, #93C5FD 32px, #93C5FD 48px, #6EE7B7 48px, #6EE7B7 64px";

  return (
    <div
      className="w-full h-2.5"
      style={{
        background: `repeating-linear-gradient(90deg, ${colors})`,
      }}
    />
  );
}
