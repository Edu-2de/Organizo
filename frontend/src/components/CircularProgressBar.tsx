"use client";
import React, { useEffect, useRef, useState } from "react";
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
  const themeKey = themeCtx?.themeKey || "classic";
  const isClassic = themeKey === "classic" || !themeCtx?.theme;

  // Definições de cores e estilos para cada tema
  const themeStyles = {
    classic: {
      color: COLORS.gold,
      bg: COLORS.beige,
      shadow: "#E9C46A33",
      circleProps: { style: {} },
      progressProps: { style: {} },
      wrapper: {},
      children: {},
    },
    sunset: {
      color: "#F76D77", // rosa, sem dourado
      bg: "#FFD452",
      shadow: "#A4508B33",
      circleProps: {
        style: {
          filter: "none",
        }
      },
      progressProps: {
        style: {
          filter: "drop-shadow(0 0 8px #FFD45255)",
        }
      },
      wrapper: {
        style: {
          borderRadius: "1.5rem",
          background: "#FFF5E1",
          boxShadow: "0 4px 24px #FFD45222",
          padding: 6,
          display: "inline-block"
        }
      },
      children: {
        style: {
          fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
          color: "#A4508B",
          fontWeight: 700,
          fontSize: "1.1rem"
        }
      }
    },
    ocean: {
      color: "#247BA0", // azul principal do tema ocean
      bg: "#E0FBFC",    // azul claro do tema ocean
      shadow: "#B6E6F533",
      circleProps: {
        style: {
          filter: "none",
        }
      },
      progressProps: {
        style: {
          filter: "drop-shadow(0 0 8px #B6E6F555)",
        }
      },
      wrapper: {
        style: {
          borderRadius: "2rem",
          background: "#F7FEFF",
          border: "1.5px solid #B6E6F5",
          boxShadow: "0 2px 12px #B6E6F522",
          padding: 8,
          display: "inline-block"
        }
      },
      children: {
        style: {
          fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
          color: "#247BA0",
          fontWeight: 700,
          fontSize: "1.15rem",
          letterSpacing: "0.01em"
        }
      }
    }
  };

  const current = themeStyles[themeKey] || themeStyles.classic;

  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;

  // Estado para animar o offset suavemente
  const [animatedOffset, setAnimatedOffset] = useState(() => {
    const initial = circ - (percentage / 100) * circ;
    return initial;
  });
  const prevPerc = useRef(percentage);

  useEffect(() => {
    // Animação suave usando requestAnimationFrame
    let frame: number;
    let start: number | null = null;
    const duration = 800; // ms
    const from = circ - (prevPerc.current / 100) * circ;
    const to = circ - (percentage / 100) * circ;

    function animate(ts: number) {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setAnimatedOffset(from + (to - from) * eased);
      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      } else {
        prevPerc.current = percentage;
      }
    }

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
    
  }, [percentage, circ]);

  // Wrapper para aplicar estilos de fundo/borda nos temas sunset/ocean
  const Wrapper = ({ children: wrapChildren }: { children: React.ReactNode }) =>
    isClassic ? <>{wrapChildren}</> : <div style={current.wrapper && "style" in current.wrapper ? current.wrapper.style : {}}>{wrapChildren}</div>;

  return (
    <Wrapper>
      <svg width={size} height={size} className="circular-progress-bar" style={{ display: "block" }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={bg || current.bg}
          strokeWidth={stroke}
          {...current.circleProps}
          style={{
            transition: "stroke 0.5s",
            ...(current.circleProps?.style || {})
          }}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color || current.color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={animatedOffset}
          {...current.progressProps}
          style={{
            transition: "stroke 0.5s",
            ...(current.progressProps?.style || {})
          }}
        />
        {children && (
          <foreignObject x={stroke / 2} y={stroke / 2} width={size - stroke} height={size - stroke}>
            <div
              className="flex items-center justify-center w-full h-full text-center"
              style={current.children && "style" in current.children ? current.children.style : undefined}
            >
              {children}
            </div>
          </foreignObject>
        )}
      </svg>
    </Wrapper>
  );
}