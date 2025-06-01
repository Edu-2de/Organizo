"use client";
import React, { useEffect, useState } from "react";
import { useTheme } from "@/components/ThemeContext";

const weekLabels = ["S", "T", "Q", "Q", "S", "S", "D"];

function getCurrentWeek() {
  const today = new Date();
  const week = [];
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    week.push({ date: d, label: weekLabels[i] });
  }
  return week;
}

type TaskType = {
  id: number;
  text: string;
  done: boolean;
  completedAt?: string;
  subtasks?: { id: number; text: string; done: boolean }[];
};

// Cores por tema
const THEME_COLORS = {
  classic: {
    barActive: "#e9c46a",
    barHover: "#f4a261",
    barInactive: "#f1e9d2",
    label: "#523A68",
    bg: "#f8f8f4",
    tooltipBg: "#fffbe6",
    tooltipText: "#523A68",
    tooltipBorder: "#e9c46a",
    barShadow: "#e9c46a33",
    barSelected: "#523A68",
    barSelectedOutline: "#e9c46a"
  },
  sunset: {
    barActive: "#F76D77",
    barHover: "#A4508B",
    barInactive: "#FFECD2",
    label: "#A4508B",
    bg: "#FFF5E1",
    tooltipBg: "#FFECD2",
    tooltipText: "#A4508B",
    tooltipBorder: "#F76D77",
    barShadow: "#F76D7740",
    barSelected: "#A4508B",
    barSelectedOutline: "#FFD452"
  },
  ocean: {
    barActive: "#247BA0",
    barHover: "#155263",
    barInactive: "#E0FBFC",
    label: "#155263",
    bg: "#E0F4FB",
    tooltipBg: "#E0FBFC",
    tooltipText: "#155263",
    tooltipBorder: "#247BA0",
    barShadow: "#247BA040",
    barSelected: "#155263",
    barSelectedOutline: "#97C1A9"
  }
};

export default function ProductivityChart({ tasks }: { tasks: TaskType[] }) {
  const themeCtx = useTheme?.();
  const themeKey = themeCtx?.themeKey || "classic";
  const colors = THEME_COLORS[themeKey];

  const week = getCurrentWeek();
  const data = week.map((d, idx) => {
    const count = tasks.filter(
      t =>
        t.done &&
        t.completedAt &&
        new Date(t.completedAt).getDate() === d.date.getDate() &&
        new Date(t.completedAt).getMonth() === d.date.getMonth() &&
        new Date(t.completedAt).getFullYear() === d.date.getFullYear()
    ).length;
    return { label: d.label, count, date: d.date };
  });

  const [animated, setAnimated] = useState(false);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [shakeIdx, setShakeIdx] = useState<number | null>(null);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [barMessage, setBarMessage] = useState<string | null>(null);
  const [barMessageType, setBarMessageType] = useState<"success" | "empty" | "info" | null>(null);

  useEffect(() => {
    setAnimated(false);
    const timeout = setTimeout(() => setAnimated(true), 200);
    return () => clearTimeout(timeout);
  }, [tasks, themeKey]);

  const max = Math.max(...data.map(d => d.count), 1);

  function handleBarClick(idx: number) {
    setShakeIdx(idx);
    setSelectedIdx(idx);

    if (data[idx].count > 0) {
      const emojis = ["🎉", "👏", "🚀", "🙌", "✨", "💪"];
      const phrases = [
        "Mandou bem!",
        "Ótimo trabalho!",
        "Produtividade em alta!",
        "Continue assim!",
        "Você está voando!",
        "Dia produtivo!"
      ];
      const emoji = emojis[Math.floor(Math.random() * emojis.length)];
      const phrase = phrases[Math.floor(Math.random() * phrases.length)];
      setBarMessage(`${emoji} ${phrase} ${data[idx].count} tarefa${data[idx].count > 1 ? "s" : ""} concluída${data[idx].count > 1 ? "s" : ""}!`);
      setBarMessageType("success");
    } else {
      const emptyMsgs = [
        "Nenhuma tarefa concluída nesse dia.",
        "Dia livre ou de descanso?",
        "Sem tarefas finalizadas aqui.",
        "Que tal planejar algo para esse dia? 😉"
      ];
      setBarMessage(emptyMsgs[Math.floor(Math.random() * emptyMsgs.length)]);
      setBarMessageType("empty");
    }

    setTimeout(() => setShakeIdx(null), 400);
    setTimeout(() => setSelectedIdx(null), 2000);
    setTimeout(() => setBarMessage(null), 1800);
    setTimeout(() => setBarMessageType(null), 1800);
  }

  function handleBarDoubleClick(idx: number) {
    setBarMessage(`📅 Dia: ${data[idx].date.toLocaleDateString("pt-BR")}`);
    setBarMessageType("info");
    setTimeout(() => setBarMessage(null), 1800);
    setTimeout(() => setBarMessageType(null), 1800);
  }

  return (
    <div className="w-full flex flex-col items-center py-3" style={{ background: colors.bg, borderRadius: 12 }}>
      <div className="flex justify-between w-full mb-2 px-2 items-center">
        <span className="font-semibold text-lg" style={{ color: colors.label }}>Produtividade</span>
        <span className="text-xs" style={{ color: colors.barSelectedOutline }}>Últimos 7 dias</span>
      </div>
      {barMessage && (
        <div
          className={`
            mb-2 px-4 py-2 rounded font-semibold shadow animate-fadeIn
            ${barMessageType === "success" ? "msg-success" : ""}
            ${barMessageType === "empty" ? "msg-empty" : ""}
            ${barMessageType === "info" ? "msg-info" : ""}
          `}
          style={{
            background: barMessageType === "success" ? colors.tooltipBg
              : barMessageType === "empty" ? "#f8e1e1"
              : barMessageType === "info" ? "#f4e285"
              : undefined,
            color: barMessageType === "success" ? colors.tooltipText
              : barMessageType === "empty" ? "#b85c5c"
              : barMessageType === "info" ? colors.label
              : undefined,
            border: `1.5px solid ${colors.tooltipBorder}`
          }}
        >
          {barMessage}
        </div>
      )}
      <div
        className="
          flex items-end justify-center gap-2 w-full
          h-40 sm:h-48 md:h-56
          px-1 sm:px-2 relative
          overflow-visible
        "
        style={{ minWidth: 0, paddingTop: 24, paddingBottom: 24 }}
      >
        {data.map((d, i) => (
          <div
            key={i}
            className="flex flex-col items-center flex-1 min-w-[32px] max-w-[48px] group relative"
            onMouseEnter={() => setHoverIdx(i)}
            onMouseLeave={() => setHoverIdx(null)}
            onClick={() => handleBarClick(i)}
            onDoubleClick={() => handleBarDoubleClick(i)}
            style={{ zIndex: hoverIdx === i || selectedIdx === i ? 20 : 1, cursor: "pointer" }}
            tabIndex={0}
            aria-label={`Barra de ${d.label}, ${d.count} tarefas concluídas`}
            onKeyDown={e => {
              if (e.key === "Enter" || e.key === " ") handleBarClick(i);
              if (e.key === "d") handleBarDoubleClick(i);
            }}
          >
            {/* Tooltip */}
            {(hoverIdx === i || selectedIdx === i) && d.count > 0 && (
              <div
                className="absolute -top-12 left-1/2 -translate-x-1/2 px-2 py-1 rounded shadow-lg animate-fadeIn z-30 whitespace-nowrap flex flex-col items-center"
                style={{
                  minWidth: 80,
                  background: colors.tooltipBg,
                  color: colors.tooltipText,
                  border: `1.5px solid ${colors.tooltipBorder}`,
                  fontWeight: 700
                }}>
                <span>
                  {d.count} tarefa{d.count > 1 ? "s" : ""} concluída{d.count > 1 ? "s" : ""}
                </span>
                <span className="tooltip-arrow" />
              </div>
            )}
            {/* Barra */}
            <div
              className={`
                relative transition-all duration-700
                w-5 xs:w-6 sm:w-7 md:w-8
                rounded-md
                ${hoverIdx === i && d.count > 0 ? "bar-hover" : ""}
                ${selectedIdx === i && d.count > 0 ? "bar-selected" : ""}
                ${shakeIdx === i ? "animate-shake" : ""}
              `}
              style={{
                background: d.count > 0
                  ? (hoverIdx === i || selectedIdx === i
                      ? colors.barHover
                      : colors.barActive)
                  : colors.barInactive,
                height: animated ? `${(d.count / max) * 90 + 18}px` : "18px",
                boxShadow: d.count > 0 ? `0 2px 12px ${colors.barShadow}` : undefined,
                transitionDelay: `${i * 80}ms`
              }}
            />
            <span className="mt-2 text-xs font-semibold" style={{ color: colors.label }}>{d.label}</span>
            <span className="text-xs" style={{ color: colors.barSelectedOutline }}>{d.count}</span>
          </div>
        ))}
        {/* Efeito de brilho animado */}
        <div className="pointer-events-none absolute inset-0 flex items-end justify-center gap-2 w-full h-full z-0">
          {data.map((d, i) => (
            <div
              key={i}
              className="w-5 xs:w-6 sm:w-7 md:w-8"
              style={{
                height: animated ? `${(d.count / max) * 90 + 18}px` : "18px",
                background: "linear-gradient(180deg,rgba(255,255,255,0.10) 0%,rgba(255,255,255,0) 100%)",
                borderRadius: "0.375rem",
                opacity: 0.5,
                transition: "height 0.7s cubic-bezier(.4,1.3,.6,1)",
                transitionDelay: `${i * 80}ms`
              }}
            />
          ))}
        </div>
      </div>
      <style>{`
        .bar-hover {
          filter: brightness(1.10) saturate(1.12);
        }
        .bar-selected {
          outline: 2.5px solid ${colors.barSelectedOutline};
          outline-offset: 2px;
          filter: brightness(1.15) saturate(1.18);
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px);}
          to { opacity: 1; transform: translateY(0);}
        }
        .animate-shake {
          animation: shake 0.35s cubic-bezier(.36,.07,.19,.97);
        }
        @keyframes shake {
          0% { transform: translateX(0);}
          20% { transform: translateX(-6px);}
          40% { transform: translateX(6px);}
          60% { transform: translateX(-4px);}
          80% { transform: translateX(4px);}
          100% { transform: translateX(0);}
        }
        .tooltip-arrow {
          width: 0; height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 7px solid ${colors.tooltipBorder};
          margin-top: -2px;
        }
      `}</style>
    </div>
  );
}