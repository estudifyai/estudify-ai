"use client";

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
  const src = variant === "mark" ? "/brand/logo-mark.png" : "/brand/logo.png";

  return (
    <img
      src={src}
      alt="estudify.ai"
      className={`${className} ${glow ? "logo-pulse" : ""}`}
      style={{
        height: `${size}px`,
        width: "auto",
        display: "block",
        objectFit: "contain",
      }}
    />
  );
}