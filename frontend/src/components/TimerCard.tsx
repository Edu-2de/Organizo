"use client";
import React, { useEffect, useState, useRef } from "react";
import Card from "@/components/Card";
import COLORS from "@/components/colors";

// Timer logic
function useTimer() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const interval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (running) {
      interval.current = setInterval(() => setSeconds(s => s + 1), 1000);
    } else if (interval.current) {
      clearInterval(interval.current);
      interval.current = null;
    }
    return () => {
      if (interval.current) clearInterval(interval.current);
    };
  }, [running]);

  function start() { setRunning(true); }
  function pause() { setRunning(false); }
  function reset() { setRunning(false); setSeconds(0); }

  const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");
  return { running, seconds, mins, secs, start, pause, reset, setSeconds };
}

// Utilitário para mostrar hora formatada
function getTimeString(date: Date) {
  return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

// Picker rolável minimalista para hora/minuto
function ScrollPicker({
  min,
  max,
  value,
  setValue,
  pad = 2,
  step = 1,
  ariaLabel,
}: {
  min: number, max: number, value: number, setValue: (v: number) => void, pad?: number, step?: number, ariaLabel?: string
}) {
  const options = Array.from({ length: Math.floor((max - min + 1) / step) }, (_, i) => min + i * step);
  const listRef = useRef<HTMLDivElement>(null);

  // Scrolla até o valor selecionado
  useEffect(() => {
    if (listRef.current) {
      const idx = Math.floor((value - min) / step);
      const el = listRef.current.children[idx] as HTMLElement;
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [value, min, step]);

  // Scroll ao arrastar
  function handleWheel(e: React.WheelEvent<HTMLDivElement>) {
    e.preventDefault();
    let idx = options.indexOf(value);
    if (e.deltaY > 0 && idx < options.length - 1) setValue(options[idx + 1]);
    if (e.deltaY < 0 && idx > 0) setValue(options[idx - 1]);
  }

  return (
    <div
      className="relative w-12 h-28 overflow-y-scroll flex flex-col items-center select-none rounded-md border border-[#ececec] bg-[#f6f5f2] snap-y snap-mandatory"
      style={{ scrollbarWidth: "none" }}
      tabIndex={0}
      ref={listRef}
      aria-label={ariaLabel}
      onWheel={handleWheel}
    >
      {options.map((n) => (
        <div
          key={n}
          onClick={() => setValue(n)}
          className={`h-8 flex items-center justify-center w-full cursor-pointer transition font-mono text-lg snap-center ${n === value ? "text-[#22223B]" : "text-[#A9C5A0]"}`}
          style={{
            background: n === value ? COLORS.gold + "22" : "transparent",
            fontWeight: n === value ? 700 : 500,
          }}
        >
          {n.toString().padStart(pad, "0")}
        </div>
      ))}
    </div>
  );
}

export default function TimerCard() {
  const [tab, setTab] = useState<"timer" | "alarm">("timer");
  const timer = useTimer();

  // Alarme
  const [alarmTarget, setAlarmTarget] = useState<Date | null>(null);
  const [alarmActive, setAlarmActive] = useState(false);

  // Picker interativo direto na "hora/minuto"
  const now = new Date();
  const [hour, setHour] = useState<number>(now.getHours());
  const [minute, setMinute] = useState<number>(Math.ceil(now.getMinutes() / 5) * 5 % 60); // arredonda para 5min

  // Estado: se alarme está aguardando disparo
  const alarmSet = Boolean(alarmTarget);

  // Checa alarme
  useEffect(() => {
    if (!alarmTarget) return;
    const check = setInterval(() => {
      const now = new Date();
      if (now >= alarmTarget) {
        setAlarmActive(true);
        setAlarmTarget(null);
      }
    }, 1000);
    return () => clearInterval(check);
  }, [alarmTarget]);

  // Ativa/desativa alarme
  function toggleAlarm() {
    if (alarmSet) {
      setAlarmTarget(null);
    } else {
      const now = new Date();
      let target = new Date(now);
      target.setHours(hour, minute, 0, 0);
      if (target <= now) target.setDate(target.getDate() + 1);
      setAlarmTarget(target);
    }
  }

  function clearAlarmPopup() {
    setAlarmActive(false);
  }

  // Seta para trocar entre cronômetro e alarme
  function ArrowSwitch() {
    return (
      <button
        className="p-1.5 rounded-full bg-[#f6f5f2] hover:bg-[#E9C46A]/20 transition border border-[#ececec] shadow-sm absolute right-3 top-3"
        onClick={() => setTab(tab === "timer" ? "alarm" : "timer")}
        aria-label="Trocar entre cronômetro e alarme"
      >
        <svg
          width={22}
          height={22}
          viewBox="0 0 24 24"
          fill="none"
          style={{
            transform: tab === "timer" ? "rotate(0deg)" : "rotate(180deg)",
            transition: "transform 0.25s cubic-bezier(.4,1.4,.6,1)"
          }}
        >
          <path d="M8 5l8 7-8 7" stroke={COLORS.gold} strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    );
  }

  function TimerView() {
    return (
      <div className="flex flex-col items-center w-full">
        <span
          className="text-[2.3rem] font-mono font-extrabold tracking-widest select-none mb-2"
          style={{
            color: COLORS.petrol,
            textShadow: "0 2px 14px #E9C46A22",
            letterSpacing: 2,
            lineHeight: 1,
          }}
        >
          {timer.mins}:{timer.secs}
        </span>
        <div className="flex gap-1.5 mt-1">
          {timer.running ? (
            <button
              className="py-1 px-4 rounded-lg font-bold bg-[#E9C46A] text-[#22223B] hover:bg-[#F4A261] transition text-base"
              onClick={timer.pause}
            >Pausar</button>
          ) : (
            <button
              className="py-1 px-4 rounded-lg font-bold bg-[#E9C46A] text-[#22223B] hover:bg-[#F4A261] transition text-base"
              onClick={timer.start}
            >Iniciar</button>
          )}
          <button
            className="py-1 px-4 rounded-lg font-bold bg-[#f6f5f2] text-[#264653] hover:bg-[#E9C46A]/20 transition text-base"
            onClick={timer.reset}
          >Zerar</button>
        </div>
      </div>
    );
  }

  function AlarmView() {
    return (
      <div className="flex flex-col items-center w-full">
        <div className="flex items-center gap-1 mb-2">
          {/* Hora picker */}
          <ScrollPicker
            min={0}
            max={23}
            value={hour}
            setValue={setHour}
            ariaLabel="Selecionar hora"
          />
          <span className="text-xl font-mono flex items-center" style={{ color: COLORS.petrol, margin: "0 2px" }}>:</span>
          {/* Minuto picker */}
          <ScrollPicker
            min={0}
            max={55}
            value={minute}
            setValue={setMinute}
            step={5}
            ariaLabel="Selecionar minutos"
          />
        </div>
        <button
          className={`mt-1 py-1 px-6 rounded-lg font-bold text-base shadow transition
            ${alarmSet
              ? "bg-[#f6f5f2] text-[#264653] hover:bg-[#E9C46A]/20"
              : "bg-[#E9C46A] text-[#22223B] hover:bg-[#F4A261]"
            }`}
          onClick={toggleAlarm}
        >
          {alarmSet
            ? `Cancelar (${getTimeString(alarmTarget!)})`
            : `Ativar ${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`}
        </button>
      </div>
    );
  }

  return (
    <>
      <Card className="flex flex-col items-center justify-center py-6 px-3 min-h-[150px] gap-2 bg-white/90 border-0 shadow-md hover:shadow-lg transition relative">
        <ArrowSwitch />
        <div className="w-full flex flex-col items-center justify-center">
          {tab === "timer" ? <TimerView /> : <AlarmView />}
        </div>
      </Card>
      {/* Popup de alarme disparado */}
      {alarmActive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl px-8 py-8 flex flex-col items-center animate-bounce-in">
            <svg width={54} height={54} fill="none" viewBox="0 0 54 54">
              <circle cx={27} cy={27} r={25} fill={COLORS.gold} stroke={COLORS.petrol} strokeWidth={3} />
              <path d="M27 13v14l10 5" stroke={COLORS.petrol} strokeWidth={3} strokeLinecap="round" />
            </svg>
            <h2 className="text-xl font-extrabold mt-4 mb-1" style={{ color: COLORS.petrol }}>
              Alarme!
            </h2>
            <button
              className="mt-3 px-6 py-2 rounded-lg font-bold bg-[#E9C46A] text-[#22223B] hover:bg-[#F4A261] transition text-base shadow"
              onClick={clearAlarmPopup}
            >
              OK
            </button>
          </div>
          <style>{`
            @keyframes bounce-in {
              0% { transform: scale(0.7); opacity: 0; }
              60% { transform: scale(1.08); opacity: 1; }
              80% { transform: scale(0.95);}
              100% { transform: scale(1);}
            }
            .animate-bounce-in { animation: bounce-in 0.7s cubic-bezier(.7,2,.2,1) 1; }
          `}</style>
        </div>
      )}
    </>
  );
}