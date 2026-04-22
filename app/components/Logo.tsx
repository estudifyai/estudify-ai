"use client";

import Image from "next/image";
import { useState } from "react";

interface LogoProps {
  variant?: "full" | "mark";
  className?: string;
  size?: number;
  glow?: boolean;
}

export default function Logo({
  variant = "full",
  className = "",
  size = 36,
  glow = false,
}: LogoProps) {
  const [errored, setErrored] = useState(false);
  const src = variant === "mark" ? "/brand/logo-mark.png" : "/brand/logo.png";
  const aspectRatio = variant === "mark" ? 1 : 3.5;
  const width = Math.round(size * aspectRatio);

  // Fallback visual si el archivo no existe: gradiente con texto
  if (errored) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg ${className}`}
        style={{
          width: `${width}px`,
          height: `${size}px`,
          background:
            "linear-gradient(115deg, #C3F73A, #7EE8C6, #5EC8E8, #8B7FD8)",
        }}
      >
        <span
          className="font-bold text-black"
          style={{ fontSize: `${size * 0.4}px` }}
        >
          {variant === "mark" ? "e" : "estudify.ai"}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt="estudify.ai"
      width={width * 2}
      height={size * 2}
      priority
      unoptimized
      onError={() => setErrored(true)}
      className={`${className} ${glow ? "logo-pulse" : ""}`}
      style={{
        height: `${size}px`,
        width: `${width}px`,
        display: "block",
        objectFit: "contain",
      }}
    />
  );
}
