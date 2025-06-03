"use client";
import React from "react";
import Card from "@/components/Card";
import COLORS from "@/components/colors";
import { useTheme } from "@/components/ThemeContext";

type WeekDayType = { date: Date; label: string };

type CalendarWeekProps = {
  weekDays: WeekDayType[];
  selectedDay: number | null;
  setSelectedDay: (i: number) => void;
  getMonthName: (date: Date) => string;
  hasEvent: (date: Date) => boolean;
  getEventsForDay: (date: Date) => { date: string; title: string }[];
};

export default function CalendarWeek({
  weekDays,
  selectedDay,
  setSelectedDay,
  getMonthName,
  hasEvent,
  getEventsForDay,
}: CalendarWeekProps) {
  const themeCtx = useTheme?.();
  const isClassic = themeCtx?.themeKey === "classic" || !themeCtx?.theme;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const theme = isClassic ? COLORS : themeCtx.theme;

  // Definições de cores para cada tema (mais clean e únicos para sunset/ocean)
  const themeColors = {
    classic: {
      cardBg: "#fff",
      cardShadow: "0 2px 8px #e9c46a33",
      cardBorder: undefined,
      month: COLORS.gold,
      link: COLORS.gold,
      todayBg: COLORS.gold + "22",
      todayText: COLORS.gold,
      selectedBg: "#FFF8E1",
      selectedBorder: COLORS.gold,
      dayText: COLORS.petrol,
      eventDot: COLORS.gold,
      eventText: COLORS.petrol,
      emptyText: "#A9C5A0",
      accent: COLORS.gold,
      dayCircle: COLORS.gold,
      dayCircleSelected: COLORS.gold,
      dayCircleToday: COLORS.gold,
    },
    sunset: {
      cardBg: "#FFF5E1", // clean, sem degradê
      cardShadow: "0 4px 24px #FFD45233",
      cardBorder: "1.5px solid #FFD452",
      month: "#A4508B",
      link: "#A4508B",
      todayBg: "#FFD45233",
      todayText: "#A4508B",
      selectedBg: "#F76D7715",
      selectedBorder: "#A4508B",
      dayText: "#A4508B",
      eventDot: "#F76D77",
      eventText: "#A4508B",
      emptyText: "#FFAF7B",
      accent: "#F76D77",
      dayCircle: "#FFD452",
      dayCircleSelected: "#F76D77",
      dayCircleToday: "#A4508B",
    },
    ocean: {
      cardBg: "#E0F4FB",
      cardShadow: "0 6px 32px #247BA033",
      cardBorder: "2.5px solid #247ba0",
      month: "#247BA0",
      link: "#247BA0",
      todayBg: "#97C1A933",
      todayText: "#155263",
      selectedBg: "#247BA015",
      selectedBorder: "#155263",
      dayText: "#155263",
      eventDot: "#247BA0",
      eventText: "#155263",
      emptyText: "#97C1A9",
      accent: "#247BA0",
      dayCircle: "#97C1A9",
      dayCircleSelected: "#247BA0",
      dayCircleToday: "#155263",
    },
  };

  // Seleciona as cores do tema atual
  const currentColors =
    themeCtx?.themeKey && themeColors[themeCtx.themeKey]
      ? themeColors[themeCtx.themeKey]
      : themeColors.classic;

  // Clean circle style for days (sunset/ocean)
  function getDayCircleStyle(idx: number, isToday: boolean, selected: boolean) {
    if (themeCtx?.themeKey === "sunset") {
      let bg = "transparent";
      let border = `1.5px solid ${currentColors.dayCircle}`;
      let color = currentColors.dayText;
      if (selected) {
        bg = currentColors.dayCircleSelected;
        color = "#fff";
        border = `2.5px solid ${currentColors.selectedBorder}`;
      } else if (isToday) {
        bg = currentColors.dayCircleToday;
        color = "#FFD452";
        border = `2.5px solid ${currentColors.dayCircleToday}`;
      }
      return {
        background: bg,
        color,
        border,
        width: 38,
        height: 38,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: isToday || selected ? 700 : 500,
        fontSize: "1.18rem",
        margin: "0 auto",
        boxShadow: selected || isToday ? "0 2px 8px #FFD45233" : undefined,
        transition: "all 0.18s",
      };
    }
    if (themeCtx?.themeKey === "ocean") {
      let bg = "transparent";
      let border = `2px solid ${currentColors.dayCircle}`;
      let color = currentColors.dayText;
      if (selected) {
        bg = "#247BA0";
        color = "#E0FBFC";
        border = `2.5px solid #155263`;
      } else if (isToday) {
        bg = "#155263";
        color = "#E0FBFC";
        border = `2.5px solid #155263`;
      }
      return {
        background: bg,
        color,
        border,
        width: 36,
        height: 36,
        borderRadius: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: isToday || selected ? 700 : 500,
        fontSize: "1.13rem",
        margin: "0 auto",
        boxShadow: selected || isToday ? "0 2px 12px #247BA033" : undefined,
        transition: "all 0.18s",
      };
    }
    return {};
  }

  // Card shape/style por tema
  const cardClass =
    themeCtx?.themeKey === "sunset"
      ? "rounded-3xl border-0 shadow-lg"
      : themeCtx?.themeKey === "ocean"
      ? "rounded-xl border-2 shadow-none"
      : "border-0 shadow-md";

  return (
    <Card
      className={`flex flex-col px-2 sm:px-4 md:px-7 py-5 gap-4 sm:gap-6 min-h-[170px] sm:min-h-[230px] transition ${cardClass}`}
      style={{
        background: currentColors.cardBg,
        color: currentColors.dayText,
        boxShadow: currentColors.cardShadow,
        border: currentColors.cardBorder,
        transition: "background 0.3s, color 0.3s, border 0.3s",
      }}
    >
      <div className="flex justify-between items-center mb-2">
        <span
          className="font-semibold text-lg sm:text-xl capitalize"
          style={{
            color: currentColors.month,
            letterSpacing: themeCtx?.themeKey === "ocean" ? "0.04em" : undefined,
            fontFamily: themeCtx?.themeKey === "ocean" ? "monospace, 'Inter', sans-serif" : undefined,
          }}
        >
          {getMonthName(weekDays[0].date)}
        </span>
        <a
          className="text-sm font-medium hover:underline"
          href="/calendar"
          style={{
            color: currentColors.link,
            fontWeight: themeCtx?.themeKey === "sunset" ? 700 : undefined,
            letterSpacing: themeCtx?.themeKey === "ocean" ? "0.04em" : undefined,
          }}
        >
          Ver agenda &rarr;
        </a>
      </div>
      <div
        className={`grid grid-cols-7 gap-2 w-full mb-3 ${
          themeCtx?.themeKey === "ocean" ? "rounded-lg bg-[#E0FBFC] p-2" : ""
        }`}
        style={
          themeCtx?.themeKey === "sunset"
            ? {
                background: "#FFF5E1", // clean, sem degradê
                borderRadius: 18,
                padding: 8,
              }
            : undefined
        }
      >
        {weekDays.map((d, idx) => {
          const today = new Date();
          const isToday =
            d.date.getDate() === today.getDate() &&
            d.date.getMonth() === today.getMonth() &&
            d.date.getFullYear() === today.getFullYear();
          const selected = selectedDay === idx;
          return (
            <div
              key={idx}
              className={`flex flex-col items-center justify-end relative ${
                themeCtx?.themeKey === "ocean" ? "rounded-lg" : ""
              }`}
              style={{
                minHeight: 64,
                background:
                  themeCtx?.themeKey === "ocean" && selected
                    ? "#97C1A9"
                    : themeCtx?.themeKey === "ocean" && isToday
                    ? "#B6E6F5"
                    : undefined,
                transition: "background 0.2s",
              }}
            >
              <button
                className={`
                  flex flex-col items-center justify-center pt-2 pb-0 focus:outline-none transition
                  ${selected ? "scale-105 z-10" : ""}
                  ${
                    themeCtx?.themeKey === "sunset"
                      ? "rounded-full"
                      : themeCtx?.themeKey === "ocean"
                      ? "rounded-lg"
                      : "rounded-xl"
                  }
                `}
                style={{
                  background:
                    themeCtx?.themeKey === "sunset"
                      ? selected
                        ? "#F76D77"
                        : isToday
                        ? "#FFD452"
                        : "transparent"
                      : "transparent",
                  color:
                    themeCtx?.themeKey === "sunset"
                      ? selected
                        ? "#fff"
                        : isToday
                        ? "#A4508B"
                        : currentColors.dayText
                      : isToday
                      ? currentColors.todayText
                      : currentColors.dayText,
                  fontWeight: isToday || selected ? 700 : 500,
                  fontSize: "clamp(1.08rem, 2vw, 1.3rem)",
                  width: "100%",
                  minHeight: 44,
                  border: "none",
                  outline: selected
                    ? `2.5px solid ${currentColors.selectedBorder}`
                    : undefined,
                  boxShadow:
                    themeCtx?.themeKey === "sunset" && (selected || isToday)
                      ? "0 2px 8px #FFD45233"
                      : undefined,
                  transition: "background 0.3s, color 0.3s, border 0.3s",
                }}
                onClick={() => setSelectedDay(idx)}
              >
                <span
                  className="text-xs sm:text-base font-bold uppercase tracking-wide"
                  style={{
                    color:
                      themeCtx?.themeKey === "sunset"
                        ? selected
                          ? "#fff"
                          : isToday
                          ? "#A4508B"
                          : currentColors.dayText
                        : isToday
                        ? currentColors.todayText
                        : currentColors.dayText,
                    opacity: isToday ? 1 : 0.9,
                  }}
                >
                  {d.label}
                </span>
                {/* Clean circle or square for day number */}
                <span
                  className="mb-0"
                  style={getDayCircleStyle(idx, isToday, selected)}
                >
                  {d.date.getDate()}
                </span>
                {/* Espaço extra para as bolinhas de evento */}
                <span style={{ display: "block", height: themeCtx?.themeKey === "sunset" || themeCtx?.themeKey === "ocean" ? 28 : 18 }} />
              </button>
              {hasEvent(d.date) && (
                <span
                  className="absolute left-1/2 -translate-x-1/2"
                  style={{
                    bottom: themeCtx?.themeKey === "sunset" ? 0 : themeCtx?.themeKey === "ocean" ? -2 : 8,
                    width: 12,
                    height: 12,
                    borderRadius:
                      themeCtx?.themeKey === "ocean" ? 3 : 8,
                    background: currentColors.eventDot,
                    display: "inline-block",
                    zIndex: 20,
                    border: themeCtx?.themeKey === "sunset" ? "2px solid #FFF5E1" : themeCtx?.themeKey === "ocean" ? "2px solid #E0F4FB" : undefined,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
      <div>
        <div
          className="text-xs sm:text-sm font-medium mb-2 opacity-80"
          style={{
            color: currentColors.month,
            fontFamily: themeCtx?.themeKey === "ocean" ? "monospace, 'Inter', sans-serif" : undefined,
            letterSpacing: themeCtx?.themeKey === "ocean" ? "0.04em" : undefined,
          }}
        >
          Compromissos do dia
        </div>
        {selectedDay !== null && getEventsForDay(weekDays[selectedDay].date).length > 0 ? (
          <ul>
            {getEventsForDay(weekDays[selectedDay].date).map((ev, i) => (
              <li
                key={ev.title + i}
                className={`flex items-center py-1 gap-2 sm:gap-3 ${
                  themeCtx?.themeKey === "ocean" ? "rounded bg-[#F6F8FA] px-2" : ""
                }`}
                style={{
                  color: currentColors.eventText,
                  fontFamily: themeCtx?.themeKey === "ocean" ? "monospace, 'Inter', sans-serif" : undefined,
                  fontWeight: themeCtx?.themeKey === "sunset" ? 600 : undefined,
                }}
              >
                <span
                  className="w-3 h-3 block"
                  style={{
                    borderRadius: themeCtx?.themeKey === "ocean" ? 2 : 8,
                    background: currentColors.eventDot,
                  }}
                />
                <span className="text-xs sm:text-base font-medium">{ev.title}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div
            className="text-xs sm:text-base"
            style={{
              color: currentColors.emptyText,
              opacity: 0.8,
              fontFamily: themeCtx?.themeKey === "ocean" ? "monospace, 'Inter', sans-serif" : undefined,
            }}
          >
            Nenhum compromisso.
          </div>
        )}
      </div>
    </Card>
  );
}