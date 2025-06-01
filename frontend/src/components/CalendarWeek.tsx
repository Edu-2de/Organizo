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
  const theme = isClassic ? COLORS : themeCtx.theme;

  // Definições de cores para cada tema (exemplo ocean e sunset)
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
      accent: COLORS.accent,
    },
    sunset: {
      cardBg: "linear-gradient(135deg, #FFD452 60%, #A4508B 100%)",
      cardShadow: "0 2px 12px #F76D7733",
      cardBorder: "2px solid #F76D77",
      month: "#A4508B",
      link: "#A4508B",
      todayBg: "#FFD45233",
      todayText: "#A4508B",
      selectedBg: "#FFD45255",
      selectedBorder: "#A4508B",
      dayText: "#2D142C",
      eventDot: "#F76D77",
      eventText: "#2D142C",
      emptyText: "#FFAF7B",
      accent: "#F76D77",
    },
    ocean: {
      cardBg: "linear-gradient(135deg, #155263 60%, #3A506B 100%)",
      cardShadow: "0 2px 12px #247BA033",
      cardBorder: "2px solid #247BA0",
      month: "#247BA0",
      link: "#247BA0",
      todayBg: "#247BA033",
      todayText: "#E0FBFC",
      selectedBg: "#15526355",
      selectedBorder: "#247BA0",
      dayText: "#E0FBFC",
      eventDot: "#247BA0",
      eventText: "#E0FBFC",
      emptyText: "#97C1A9",
      accent: "#247BA0",
    },
  };

  // Seleciona as cores do tema atual
  const currentColors =
    themeCtx?.themeKey && themeColors[themeCtx.themeKey]
      ? themeColors[themeCtx.themeKey]
      : themeColors.classic;

  return (
    <Card
      className="flex flex-col px-2 sm:px-4 md:px-7 py-5 gap-4 sm:gap-6 min-h-[170px] sm:min-h-[230px] border-0 shadow-md transition"
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
          style={{ color: currentColors.month }}
        >
          {getMonthName(weekDays[0].date)}
        </span>
        <a
          className="text-sm font-medium hover:underline"
          href="/calendar"
          style={{ color: currentColors.link }}
        >
          Ver agenda &rarr;
        </a>
      </div>
      <div className="grid grid-cols-7 gap-2 w-full mb-3">
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
              className="flex flex-col items-center justify-end relative"
              style={{ minHeight: 64 }}
            >
              <button
                className={`
                  flex flex-col items-center justify-center pt-2 pb-0 rounded-xl focus:outline-none transition
                  ${selected ? "ring-2 scale-105 z-10" : ""}
                `}
                style={{
                  background: selected
                    ? currentColors.selectedBg
                    : isToday
                    ? currentColors.todayBg
                    : undefined,
                  color: isToday
                    ? currentColors.todayText
                    : currentColors.dayText,
                  fontWeight: isToday || selected ? 700 : 500,
                  fontSize: "clamp(1.08rem, 2vw, 1.3rem)",
                  width: "100%",
                  minHeight: 44,
                  borderColor: selected ? currentColors.selectedBorder : undefined,
                  ring: selected ? `2px solid ${currentColors.selectedBorder}` : undefined,
                  transition: "background 0.3s, color 0.3s, border 0.3s",
                }}
                onClick={() => setSelectedDay(idx)}
              >
                <span
                  className="text-xs sm:text-base font-bold uppercase tracking-wide"
                  style={{
                    color: isToday
                      ? currentColors.todayText
                      : currentColors.dayText,
                    opacity: isToday ? 1 : 0.9,
                  }}
                >
                  {d.label}
                </span>
                <span
                  className="text-xl sm:text-2xl md:text-3xl font-bold mb-0"
                  style={{
                    color: isToday
                      ? currentColors.todayText
                      : currentColors.dayText,
                  }}
                >
                  {d.date.getDate()}
                </span>
                <span style={{ display: "block", height: 22 }} />
              </button>
              {hasEvent(d.date) && (
                <span
                  className="absolute left-1/2 -translate-x-1/2"
                  style={{
                    bottom: 8,
                    width: 10,
                    height: 10,
                    borderRadius: 8,
                    background: currentColors.eventDot,
                    display: "inline-block",
                    zIndex: 20,
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
          style={{ color: currentColors.month }}
        >
          Compromissos do dia
        </div>
        {selectedDay !== null && getEventsForDay(weekDays[selectedDay].date).length > 0 ? (
          <ul>
            {getEventsForDay(weekDays[selectedDay].date).map((ev, i) => (
              <li
                key={ev.title + i}
                className="flex items-center py-1 gap-2 sm:gap-3"
                style={{ color: currentColors.eventText }}
              >
                <span
                  className="w-3 h-3 rounded-full block"
                  style={{ background: currentColors.eventDot }}
                />
                <span className="text-xs sm:text-base font-medium">{ev.title}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div
            className="text-xs sm:text-base"
            style={{ color: currentColors.emptyText, opacity: 0.8 }}
          >
            Nenhum compromisso.
          </div>
        )}
      </div>
    </Card>
  );
}