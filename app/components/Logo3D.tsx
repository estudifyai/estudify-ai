"use client";

import { useEffect, useRef, useState } from "react";
import Logo from "./Logo";

export default function Logo3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0, glowX: 50, glowY: 50 });

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    const start = performance.now();
    // Offset del mouse (se interpola suavemente hacia el objetivo)
    const mouse = { rx: 0, ry: 0 };
    const mouseTarget = { rx: 0, ry: 0 };

    const loop = (now: number) => {
      const t = (now - start) / 1000; // segundos

      // Rotación 3D continua (idle) — oscila siempre para que se vea 3D sin interacción
      const idleRy = Math.sin(t * 0.8) * 18;  // sutil, estilo Apple
      const idleRx = Math.cos(t * 0.6) * 12;

      // Suaviza el seguimiento del mouse
      mouse.rx += (mouseTarget.rx - mouse.rx) * 0.08;
      mouse.ry += (mouseTarget.ry - mouse.ry) * 0.08;

      const rotateX = idleRx + mouse.rx;
      const rotateY = idleRy + mouse.ry;

      setTransform({
        rotateX,
        rotateY,
        glowX: 50 - rotateY * 1.4,
        glowY: 50 + rotateX * 1.4,
      });

      raf = requestAnimationFrame(loop);
    };

    // Sin animación: deja un tilt fijo suave y no arranca el loop
    if (reduce) {
      setTransform({ rotateX: 6, rotateY: -10, glowX: 64, glowY: 58 });
      return;
    }

    const onMouse = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      mouseTarget.ry = nx * 18;
      mouseTarget.rx = -ny * 14;
    };

    window.addEventListener("mousemove", onMouse, { passive: true });
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMouse);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="float relative"
      style={{ perspective: "900px" }}
    >
      {/* Glow que se mueve con la rotación */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2"
        style={{
          background: `radial-gradient(circle at ${transform.glowX}% ${transform.glowY}%, rgba(195,247,58,0.14) 0%, rgba(94,200,232,0.10) 35%, rgba(139,127,216,0.07) 55%, transparent 70%)`,
          filter: "blur(50px)",
        }}
      />

      {/* Rotación 3D en su propia capa — el float del wrapper ya no la pisa */}
      <div
        className="relative will-change-transform"
        style={{
          transform: `rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg)`,
          transformStyle: "preserve-3d",
          transition: "transform 0.25s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <Logo variant="full" size={340} glow />
      </div>
    </div>
  );
}
