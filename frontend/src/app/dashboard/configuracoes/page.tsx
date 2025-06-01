"use client";
import { useTheme } from "@/components/ThemeContext";
import { THEMES } from "@/components/themes";
import Sidebar from "@/components/Sidebar";
import { useState } from "react";

export default function SettingsPage() {
  const { themeKey, setThemeKey } = useTheme();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <main className="min-h-screen w-full flex overflow-x-auto" style={{ background: THEMES[themeKey].beige, transition: "background 0.3s" }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className={`transition-all duration-300 w-full ${collapsed ? "ml-20" : "ml-72"}`}>
        <div className="p-6 max-w-xl mx-auto">
          <h2 className="text-2xl font-bold mb-6" style={{ color: THEMES[themeKey].petrol }}>
            Configurações de Tema
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {Object.entries(THEMES).map(([key, t]) => (
              <button
                key={key}
                onClick={() => setThemeKey(key as keyof typeof THEMES)}
                className={`rounded-xl border-2 p-4 flex flex-col items-center gap-2 transition-all
                  ${themeKey === key ? "border-[#E9C46A] shadow-lg scale-105" : "border-transparent bg-[#f6f5f2] hover:scale-105"}
                `}
                style={{ background: t.beige }}
              >
                <span className="font-semibold text-lg" style={{ color: t.petrol }}>{t.name}</span>
                <div className="flex gap-2 mt-2">
                  <span className="w-6 h-6 rounded-full" style={{ background: t.petrol }} />
                  <span className="w-6 h-6 rounded-full" style={{ background: t.gold }} />
                  <span className="w-6 h-6 rounded-full" style={{ background: t.olive }} />
                  <span className="w-6 h-6 rounded-full" style={{ background: t.deepPurple }} />
                  <span className="w-6 h-6 rounded-full" style={{ background: t.accent }} />
                </div>
                {themeKey === key && (
                  <span className="mt-2 text-xs text-[#E9C46A] font-bold">Selecionado</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}