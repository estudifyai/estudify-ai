"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
  twinklePhase: number;
  color: string;
}

interface Shooting {
  x: number;
  y: number;
  len: number;
  speed: number;
  angle: number;
  progress: number;
  life: number;
  color: string;
}

export default function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let stars: Star[] = [];
    let shootings: Shooting[] = [];
    let lastShooting = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const setup = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(Math.floor((w * h) / 6000), 350);
      stars = Array.from({ length: count }, () => {
        const colorRoll = Math.random();
        let color = "#ffffff";
        if (colorRoll < 0.02) color = "#C3F73A";
        else if (colorRoll < 0.035) color = "#5EC8E8";
        else if (colorRoll < 0.05) color = "#8B7FD8";
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          size: Math.random() * 1.3 + 0.3,
          opacity: Math.random() * 0.4 + 0.15,
          twinkleSpeed: Math.random() * 0.008 + 0.002,
          twinklePhase: Math.random() * Math.PI * 2,
          color,
        };
      });
    };

    const spawnShooting = () => {
      const fromLeft = Math.random() > 0.5;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const colorRoll = Math.random();
      const color =
        colorRoll < 0.3
          ? "#C3F73A"
          : colorRoll < 0.6
          ? "#5EC8E8"
          : colorRoll < 0.85
          ? "#8B7FD8"
          : "#ffffff";
      shootings.push({
        x: fromLeft ? -80 : w + 80,
        y: Math.random() * h * 0.7,
        len: 100 + Math.random() * 60,
        speed: 8 + Math.random() * 6,
        angle: fromLeft ? Math.PI / 7 : Math.PI - Math.PI / 7,
        progress: 0,
        life: 1,
        color,
      });
    };

    const draw = (t: number) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      // Twinkle stars
      for (const s of stars) {
        const twinkle = 0.6 + Math.sin(t * s.twinkleSpeed + s.twinklePhase) * 0.4;
        ctx.globalAlpha = s.opacity * twinkle;
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();

        if (s.color !== "#ffffff") {
          ctx.globalAlpha = s.opacity * twinkle * 0.35;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size * 3.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (t - lastShooting > 10000 + Math.random() * 8000) {
        spawnShooting();
        lastShooting = t;
      }

      shootings = shootings.filter((sh) => {
        sh.progress += sh.speed;
        const x = sh.x + Math.cos(sh.angle) * sh.progress;
        const y = sh.y + Math.sin(sh.angle) * sh.progress;
        sh.life -= 0.006;

        if (sh.life <= 0) return false;
        if (x > w + 200 || x < -200) return false;

        const tailX = x - Math.cos(sh.angle) * sh.len;
        const tailY = y - Math.sin(sh.angle) * sh.len;

        const grad = ctx.createLinearGradient(x, y, tailX, tailY);
        const alpha = Math.floor(sh.life * 255)
          .toString(16)
          .padStart(2, "0");
        grad.addColorStop(0, sh.color + alpha);
        grad.addColorStop(1, sh.color + "00");

        ctx.globalAlpha = 1;
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();

        ctx.fillStyle = sh.color;
        ctx.globalAlpha = sh.life;
        ctx.beginPath();
        ctx.arc(x, y, 1.8, 0, Math.PI * 2);
        ctx.fill();

        return true;
      });

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };

    setup();
    raf = requestAnimationFrame(draw);

    // Debounced resize — no loop infinito
    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(setup, 150);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeTimer);
      // Reset canvas para que se re-inicialice al montar de nuevo
      if (canvas) {
        canvas.width = 0;
        canvas.height = 0;
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="starfield-canvas"
      aria-hidden="true"
    />
  );
}
