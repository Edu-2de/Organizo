"use client";
import React from "react";
import COLORS from "@/components/colors";
import { useTheme } from "@/components/ThemeContext";

export default function CircularProgressBar({
  percentage,
  size = 102,
  stroke = 10,
  color,
  bg,
  children,
}: {
  percentage: number,
  size?: number,
  stroke?: number,
  color?: string,
  bg?: string,
  children?: React.ReactNode
}) {
  const themeCtx = useTheme?.();
  const isClassic = themeCtx?.themeKey === "classic" || !themeCtx?.theme;
  const theme = isClassic ? COLORS : themeCtx.theme;

  // Definições de cores para cada tema
  const themeColors = {
    classic: {
      color: COLORS.gold,
      bg: COLORS.beige,
      shadow: "#E9C46A33",
    },
    sunset: {
      color: "#A4508B",
      bg: "#FFD452",
      shadow: "#A4508B33",
    },
    ocean: {
      color: "#247BA0",
      bg: "#155263",
      shadow: "#247BA033",
    },
  };

  const currentColors =
    themeCtx?.themeKey && themeColors[themeCtx.themeKey]
      ? themeColors[themeCtx.themeKey]
      : themeColors.classic;

  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (percentage / 100) * circ;

  return (
    <svg width={size} height={size} className="circular-progress-bar" style={{ display: "block" }}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={bg || currentColors.bg}
        strokeWidth={stroke}
        style={{ filter: "blur(0.2px)" }}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color || currentColors.color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        style={{
          transition: "stroke-dashoffset 1.2s cubic-bezier(.7,1.5,.65,1) 0s",
          filter: `drop-shadow(0 0 6px ${currentColors.shadow})`,
        }}
      />
      {children && (
        <foreignObject x={stroke / 2} y={stroke / 2} width={size - stroke} height={size - stroke}>
          <div className="flex items-center justify-center w-full h-full text-center">
            {children}
          </div>
        </foreignObject>
      )}
    </svg>
  );
}