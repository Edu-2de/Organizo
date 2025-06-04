import React from "react";
import { useTheme } from "@/components/ThemeContext";
import COLORS from "@/components/colors";

type CardProps = {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
};

export default function Card({ children, className = "", style, ...rest }: CardProps) {
  const themeCtx = useTheme?.();
  const isClassic = themeCtx?.themeKey === "classic" || !themeCtx?.theme;
  const theme = isClassic ? COLORS : themeCtx.theme;

  // Permite sobrescrever o estilo via prop, mas aplica o padrão do tema se não houver
  const cardStyle: React.CSSProperties = {
    borderRadius: 18,
    background: isClassic ? "#fff" : theme.beige,
    boxShadow: isClassic
      ? "0 2px 8px #e9c46a33"
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      : `0 2px 12px ${(theme as any).accent ?? "#e9c46a"}33`,
    border: isClassic
      ? "1px solid #e2e3e7"
      : `2px solid ${"accent" in theme ? theme.accent : "#e9c46a"}`,
    ...style,
  };

  return (
    <div
      className={`border ${className}`}
      style={cardStyle}
      {...rest}
    >
      {children}
    </div>
  );
}