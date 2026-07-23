"use client";

const COLORS = ["#C3F73A", "#7EE8C6", "#5EC8E8", "#8B7FD8", "#ffffff"];

export default function Confetti() {
  const pieces = Array.from({ length: 90 }, (_, i) => ({
    left: Math.random() * 100,
    delay: Math.random() * 0.6,
    duration: 2.4 + Math.random() * 1.4,
    size: 6 + Math.random() * 7,
    color: COLORS[i % COLORS.length],
    rotate: Math.random() * 360,
    drift: (Math.random() - 0.5) * 240,
  }));

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden" aria-hidden>
      {pieces.map((p, i) => (
        <span
          key={i}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 0.45,
            background: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            ["--drift" as any]: `${p.drift}px`,
            ["--spin" as any]: `${p.rotate + 720}deg`,
          }}
        />
      ))}
    </div>
  );
}
