import React, { createContext, useContext, useEffect, useState } from "react";
import { THEMES } from "./themes";

type ThemeKey = keyof typeof THEMES;

const ThemeContext = createContext<{
  theme: typeof THEMES.classic,
  themeKey: ThemeKey,
  setThemeKey: (key: ThemeKey) => void
}>({
  theme: THEMES.classic,
  themeKey: "classic",
  setThemeKey: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeKey, setThemeKey] = useState<ThemeKey>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("dashboard_theme") as ThemeKey) || "classic";
    }
    return "classic";
  });

  useEffect(() => {
    localStorage.setItem("dashboard_theme", themeKey);
  }, [themeKey]);

  const value = {
    theme: THEMES[themeKey],
    themeKey,
    setThemeKey,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}