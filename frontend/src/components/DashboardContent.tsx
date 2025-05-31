"use client";
import { useEffect, useState, useRef } from "react";

// Palette
const COLORS = {
  petrol: "#264653",
  olive: "#A9C5A0",
  gold: "#E9C46A",
  beige: "#F6F5F2",
  graphite: "#22223B",
  deepPurple: "#523A68",
  yellow: "#FFF9C4",
  pink: "#FFD6E0",
  blue: "#D0F1FF",
  green: "#D9F9D2",
  lilac: "#EAD1FF",
};

const POSTIT_COLORS = [
  COLORS.yellow,
  COLORS.pink,
  COLORS.blue,
  COLORS.green,
  COLORS.lilac,
];

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

const TASK_ICONS = {
  trash: (
    <svg width={18} height={18} fill="none" viewBox="0 0 20 20">
      <rect x="4.5" y="6" width="11" height="9" rx="2" stroke={COLORS.petrol} strokeWidth="1.6"/>
      <path d="M7 9v4M10 9v4M13 9v4" stroke={COLORS.petrol} strokeWidth="1.4" strokeLinecap="round"/>
      <rect x="7" y="3.5" width="6" height="2" rx="1" fill={COLORS.gold} />
    </svg>
  ),
  plus: (
    <svg width={18} height={18} fill="none" viewBox="0 0 20 20">
      <circle cx={10} cy={10} r={9} fill={COLORS.gold} />
      <path d="M10 7v6M7 10h6" stroke={COLORS.petrol} strokeWidth={2} strokeLinecap="round"/>
    </svg>
  ),
  drag: (
    <svg width={16} height={16} fill="none" viewBox="0 0 20 20">
      <circle cx={5} cy={6} r={1.2} fill={COLORS.gold}/>
      <circle cx={5} cy={10} r={1.2} fill={COLORS.gold}/>
      <circle cx={5} cy={14} r={1.2} fill={COLORS.gold}/>
      <circle cx={13} cy={6} r={1.2} fill={COLORS.gold}/>
      <circle cx={13} cy={10} r={1.2} fill={COLORS.gold}/>
      <circle cx={13} cy={14} r={1.2} fill={COLORS.gold}/>
    </svg>
  ),
};

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
  return { running, seconds, mins, secs, start, pause, reset };
}

function Card({ children, className = "", ...rest }: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={`rounded-2xl shadow border border-[#e2e3e7] bg-white ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

// PRODUCTIVITY CHART
type SubTaskType = { id: number; text: string; done: boolean };
type TaskType = {
  id: number;
  text: string;
  done: boolean;
  completedAt?: string;
  subtasks?: SubTaskType[];
};

function ProductivityChart({ tasks }: { tasks: TaskType[] }) {
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

  useEffect(() => {
    setAnimated(false);
    const timeout = setTimeout(() => setAnimated(true), 200);
    return () => clearTimeout(timeout);
  }, [tasks]);

  const max = Math.max(...data.map(d => d.count), 1);

  return (
    <div className="w-full flex flex-col items-center py-3">
      <div className="flex justify-between w-full mb-2 px-2">
        <span className="font-semibold text-lg text-[#523A68]">Produtividade</span>
        <span className="text-xs text-[#A9C5A0]">Últimos 7 dias</span>
      </div>
      <div
        className="
          flex items-end gap-1 sm:gap-2 w-full
          h-24 xs:h-28 sm:h-32 md:h-36 lg:h-40
          px-1 sm:px-2 relative
          overflow-x-auto
          scrollbar-thin scrollbar-thumb-[#e2e3e7] scrollbar-track-transparent
        "
        style={{ minWidth: 0 }}
      >
        {data.map((d, i) => (
          <div
            key={i}
            className="flex flex-col items-center flex-1 min-w-[32px] max-w-[48px] group"
            onMouseEnter={() => setHoverIdx(i)}
            onMouseLeave={() => setHoverIdx(null)}
            style={{ zIndex: hoverIdx === i ? 10 : 1 }}
          >
            <div
              className={`
                w-5 xs:w-6 sm:w-7 md:w-8 rounded-t-lg transition-all duration-700 relative cursor-pointer
                ${hoverIdx === i && d.count > 0 ? "scale-110 shadow-lg" : ""}
              `}
              style={{
                height: animated ? `${(d.count / max) * 80 + 8}px` : "8px",
                background: d.count > 0 ? COLORS.gold : "#e2e3e7",
                boxShadow: d.count > 0 ? "0 2px 12px #E9C46A55" : undefined,
                transitionDelay: `${i * 80}ms`
              }}
            >
              {hoverIdx === i && d.count > 0 && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-[#fffbe8] border border-[#e9c46a] text-xs font-bold text-[#523A68] shadow-lg animate-fadeIn z-20 whitespace-nowrap">
                  {d.count} tarefa{d.count > 1 ? "s" : ""} concluída{d.count > 1 ? "s" : ""}
                </div>
              )}
            </div>
            <span className="mt-1 text-xs font-semibold text-[#264653]">{d.label}</span>
            <span className="text-xs text-[#A9C5A0]">{d.count}</span>
          </div>
        ))}
        {/* Efeito de brilho animado */}
        <div className="pointer-events-none absolute inset-0 flex items-end gap-1 sm:gap-2 w-full h-full z-0">
          {data.map((d, i) => (
            <div
              key={i}
              className="w-5 xs:w-6 sm:w-7 md:w-8"
              style={{
                height: animated ? `${(d.count / max) * 80 + 8}px` : "8px",
                background: "linear-gradient(180deg,rgba(255,255,255,0.18) 0%,rgba(255,255,255,0) 100%)",
                borderRadius: "0.75rem 0.75rem 0 0",
                opacity: 0.7,
                transition: "height 0.7s cubic-bezier(.4,1.3,.6,1)",
                transitionDelay: `${i * 80}ms`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// WEATHER WIDGET
function WeatherWidget() {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState<string>("");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=auto`;
          const res = await fetch(url);
          const data = await res.json();
          setWeather(data.current_weather);

          fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
            .then(r => r.json())
            .then(loc => setCity(loc.address?.city || loc.address?.town || loc.address?.village || "Sua cidade"));
          setLoading(false);
        },
        () => setLoading(false)
      );
    } else {
      setLoading(false);
    }
  }, []);

  function WeatherIcon() {
    if (!weather) return null;
    if (weather.weathercode === 0) {
      return (
        <span className="relative flex items-center justify-center">
          <span className="block w-16 h-16 rounded-full bg-[#ffe066] animate-spin-slow shadow-lg" />
          <span className="absolute text-5xl" style={{ left: 0, right: 0 }}>☀️</span>
        </span>
      );
    }
    if (weather.weathercode < 4) {
      return (
        <span className="relative flex items-center justify-center">
          <span className="block w-16 h-16 rounded-full bg-[#b3e0ff] animate-pulse shadow-lg" />
          <span className="absolute text-5xl" style={{ left: 0, right: 0 }}>⛅</span>
        </span>
      );
    }
    return (
      <span className="relative flex items-center justify-center">
        <span className="block w-16 h-16 rounded-full bg-[#b3c6ff] animate-bounce shadow-lg" />
        <span className="absolute text-5xl" style={{ left: 0, right: 0 }}>🌧️</span>
      </span>
    );
  }

  return (
    <div
      className={`
        flex flex-col items-center justify-center p-4 sm:p-6 rounded-2xl shadow-xl border border-[#e2e3e7]
        bg-gradient-to-br from-[#e9c46a22] to-[#fff] min-w-[150px] min-h-[170px] sm:min-w-[180px] sm:min-h-[190px]
        transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl cursor-pointer
        w-full h-full
      `}
      style={{
        maxWidth: 400,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        display: "flex"
      }}
      title="Clima"
    >
      <div className="flex flex-col items-center gap-2 w-full">
        <span className="font-semibold text-[#523A68]">Clima agora</span>
        {loading ? (
          <div className="animate-pulse text-[#A9C5A0] mt-4">Carregando...</div>
        ) : weather ? (
          <>
            <WeatherIcon />
            <span className="text-4xl sm:text-5xl font-bold text-[#264653] drop-shadow">{Math.round(weather.temperature)}°C</span>
            <span className="text-base text-[#523A68] mt-1">{city}</span>
            <div className="text-sm text-[#A9C5A0] mt-2">
              <div>Vento: {Math.round(weather.windspeed)} km/h</div>
              <div>Direção: {weather.winddirection}°</div>
              <div>Atualizado: {new Date().toLocaleTimeString("pt-BR")}</div>
            </div>
          </>
        ) : (
          <div className="text-[#A9C5A0] mt-4">Não foi possível obter o clima.</div>
        )}
      </div>
    </div>
  );
}

type NoteType = { text: string; color: string; x: number; y: number };
function NotesBoard({
  notes,
  setNotes,
}: {
  notes: NoteType[];
  setNotes: React.Dispatch<React.SetStateAction<NoteType[]>>;
}) {
  const boardRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({
    w: 820,
    h: 320,
    noteW: 180,
    noteH: 182,
  });

  useEffect(() => {
    function updateSize() {
      if (boardRef.current) {
        const width = Math.max(220, Math.min(boardRef.current.offsetWidth, 1200));
        let height = 320;
        if (window.innerWidth < 640) height = 160;
        else if (window.innerWidth < 900) height = 220;
        else if (window.innerWidth < 1200) height = 280;
        else height = 320;
        const noteW = width < 400 ? 88 : width < 540 ? 110 : width < 700 ? 140 : width < 1000 ? 160 : 180;
        const noteH = Math.round(height * 0.68);
        setDimensions({ w: width, h: height, noteW, noteH });
      }
    }
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const BOARD_W = dimensions.w;
  const BOARD_H = dimensions.h;
  const NOTE_W = dimensions.noteW;
  const NOTE_H = dimensions.noteH;

  const [dragged, setDragged] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showColorIdx, setShowColorIdx] = useState<number | null>(null);
  const [topZ, setTopZ] = useState(100);
  const [zList, setZList] = useState<number[]>(notes.map((_, i) => i));

  useEffect(() => {
    setZList(notes.map((_, i) => i));
  }, [notes.length]);

  function bringToFront(idx: number) {
    setZList(zs => {
      const max = Math.max(...zs, topZ);
      const newZ = [...zs];
      newZ[idx] = max + 1;
      setTopZ(max + 1);
      return [...newZ];
    });
  }

  function handlePointerDown(e: React.MouseEvent, idx: number) {
    if ((e.target as HTMLElement).classList.contains("color-dot") || (e.target as HTMLElement).tagName === "TEXTAREA") return;
    setDragged(idx);
    bringToFront(idx);
    if (!boardRef.current) return;
    const rect = boardRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left - notes[idx].x,
      y: e.clientY - rect.top - notes[idx].y,
    });
  }
  function handlePointerMove(e: MouseEvent) {
    if (dragged === null) return;
    if (!boardRef.current) return;
    const rect = boardRef.current.getBoundingClientRect();

    let nx = e.clientX - rect.left - dragOffset.x;
    let ny = e.clientY - rect.top - dragOffset.y;

    // Limite correto: NÃO desconto padding/border!
    const maxX = boardRef.current.offsetWidth - NOTE_W;
    const maxY = boardRef.current.offsetHeight - NOTE_H;

    nx = Math.max(0, Math.min(nx, maxX));
    ny = Math.max(0, Math.min(ny, maxY));

    setNotes((ns) =>
      ns.map((n, i) => (i !== dragged ? n : { ...n, x: nx, y: ny }))
    );
  }
  function handlePointerUp() {
    setDragged(null);
  }

  function handleTouchStart(e: React.TouchEvent, idx: number) {
    setDragged(idx);
    bringToFront(idx);
    if (!boardRef.current) return;
    const touch = e.touches[0];
    const rect = boardRef.current.getBoundingClientRect();
    setDragOffset({
      x: touch.clientX - rect.left - notes[idx].x,
      y: touch.clientY - rect.top - notes[idx].y,
    });
  }
  function handleTouchMove(e: TouchEvent) {
    if (dragged === null) return;
    if (!boardRef.current) return;
    const touch = e.touches[0];
    const rect = boardRef.current.getBoundingClientRect();
    let nx = touch.clientX - rect.left - dragOffset.x;
    let ny = touch.clientY - rect.top - dragOffset.y;
    nx = Math.max(0, Math.min(nx, boardRef.current.offsetWidth - NOTE_W));
    ny = Math.max(0, Math.min(ny, boardRef.current.offsetHeight - NOTE_H));
    setNotes((ns) =>
      ns.map((n, i) => (i !== dragged ? n : { ...n, x: nx, y: ny }))
    );
  }
  function handleTouchEnd() {
    setDragged(null);
  }

  useEffect(() => {
    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("mouseup", handlePointerUp);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);
    return () => {
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseup", handlePointerUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [dragged, dragOffset, notes, BOARD_W, BOARD_H, NOTE_W, NOTE_H]);

  function handleColorChange(idx: number, color: string) {
    setNotes(notes => notes.map((n, i) => i === idx ? { ...n, color } : n));
    setShowColorIdx(null);
  }
  function handleTextChange(idx: number, value: string) {
    setNotes(notes => notes.map((n, i) => i === idx ? { ...n, text: value } : n));
  }
  function handleDelete(idx: number) {
    setNotes(notes => notes.filter((_, i) => i !== idx));
    setZList(zs => zs.filter((_, i) => i !== idx));
  }
  function handleDuplicate(idx: number) {
    let boardW = BOARD_W, boardH = BOARD_H;
    if (boardRef.current) {
      boardW = boardRef.current.offsetWidth;
      boardH = boardRef.current.offsetHeight;
    }
    setNotes(notes => {
      const n = notes[idx];
      return [...notes, { ...n, x: Math.min(n.x + 40, boardW - NOTE_W), y: Math.min(n.y + 30, boardH - NOTE_H) }];
    });
    setZList(zs => [...zs, Math.max(...zs, topZ) + 1]);
    setTopZ(z => z + 1);
  }
  function handleAddNote() {
    const count = notes.length;
    let boardW = BOARD_W, boardH = BOARD_H;
    if (boardRef.current) {
      boardW = boardRef.current.offsetWidth;
      boardH = boardRef.current.offsetHeight;
    }
    setNotes(notes => [
      ...notes,
      {
        text: "",
        color: POSTIT_COLORS[Math.floor(Math.random() * POSTIT_COLORS.length)],
        x: 25 + (count * 36) % Math.max(1, (boardW - NOTE_W)),
        y: 20 + (count * 30) % Math.max(1, (boardH - NOTE_H)),
      },
    ]);
    setZList(zs => [...zs, Math.max(...zs, topZ) + 1]);
    setTopZ(z => z + 1);
  }

  return (
    <div
      ref={boardRef}
      className="w-full pb-2 px-0 relative "
      style={{
        // Defina altura mínima e máxima por breakpoint
        minHeight: 160,
        height: BOARD_H,
        maxHeight: 400,
        maxWidth: "100%",
        margin: "0 auto",
        userSelect: dragged !== null ? "none" : undefined,
        transition: "height 0.2s,width 0.2s",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 px-2 gap-2">
        <span className="font-semibold text-lg" style={{ color: "#523A68" }}>Quadro de Post-its</span>
        <button
          onClick={handleAddNote}
          className="flex items-center gap-1 px-3 py-1.5 rounded bg-gold hover:bg-[#E9C46Aef] border border-gold text-petrol font-semibold shadow transition"
          style={{ background: COLORS.gold, color: COLORS.petrol, borderColor: COLORS.gold }}
        >
          {TASK_ICONS.plus} Novo post-it
        </button>
      </div>
      <div
        style={{
          position: "relative",
          width: "100%",
          height: BOARD_H,
          background: "#f8f8f4",
          borderRadius: 12,
          boxShadow: "0 2px 10px #22223B13",
          minHeight: 120,
          minWidth: 120,
          overflow: "hidden",
          transition: "height 0.2s,width 0.2s",
          padding: 0,
        }}
      >
        {notes.length === 0 && (
          <div className="text-center text-[#523A68] opacity-60 w-full py-10 absolute left-0 right-0 top-0">Nenhum post-it ainda. Clique em "Novo post-it" para começar!</div>
        )}
        {notes.map((note, idx) => (
          <div
            key={idx}
            tabIndex={0}
            onMouseDown={e => handlePointerDown(e, idx)}
            onTouchStart={e => handleTouchStart(e, idx)}
            onClick={e => {
              bringToFront(idx);
              if ((e.target as HTMLElement).classList.contains("color-dot") || (e.target as HTMLElement).tagName === "TEXTAREA") return;
              setShowColorIdx(idx === showColorIdx ? null : idx);
            }}
            className={`
              absolute shadow-xl rounded-xl p-2 sm:p-3 flex flex-col justify-between select-text
              transition cursor-grab group
              ${dragged === idx ? "ring-2 ring-gold z-[2000]" : ""}
            `}
            style={{
              left: Math.max(0, Math.min(note.x, BOARD_W - NOTE_W)),
              top: Math.max(0, Math.min(note.y, BOARD_H - NOTE_H)),
              background: note.color,
              border: `2px solid ${note.color}`,
              boxShadow: (showColorIdx === idx ? `0 0 0 3px ${COLORS.gold}` : "2px 4px 18px #22223B16"),
              opacity: 1,
              zIndex: (zList[idx] ?? idx) + (showColorIdx === idx ? 1000 : 0),
              wordBreak: "break-word",
              overflow: "hidden",
              width: NOTE_W,
              height: NOTE_H,
              minWidth: 60,
              minHeight: 80,
              maxWidth: BOARD_W,
              maxHeight: BOARD_H,
              pointerEvents: dragged === null || dragged === idx ? "auto" : "none",
            }}
          >
            <textarea
              className="w-full font-semibold bg-transparent focus:outline-none resize-none text-[1rem] text-[#22223B] placeholder:text-[#22223B90] rounded"
              value={note.text}
              maxLength={120}
              placeholder="Escreva aqui..."
              onChange={e => handleTextChange(idx, e.target.value)}
              style={{ minHeight: 32, background: "none" }}
              onClick={e => { e.stopPropagation(); bringToFront(idx); }}
            />
            <div className="flex justify-between items-end mt-2">
              <div className="flex gap-1">
                {showColorIdx === idx && (
                  <div className="flex gap-1 transition-all duration-200">
                    {POSTIT_COLORS.map(c => (
                      <button
                        key={c}
                        type="button"
                        onClick={e => { e.stopPropagation(); handleColorChange(idx, c); }}
                        className={`color-dot w-5 h-5 rounded-full border-2 border-[#fff] shadow transition
                          ${note.color === c ? "ring-2 ring-[#22223B]" : ""}
                        `}
                        style={{ background: c, borderColor: c === COLORS.beige ? COLORS.gold : "#fff" }}
                        aria-label={`Cor ${c}`}
                      />
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-1">
                <button
                  className="p-1 rounded hover:bg-[#FFD6E033] ml-1"
                  onClick={e => { e.stopPropagation(); handleDelete(idx); }}
                  title="Excluir post-it"
                >
                  {TASK_ICONS.trash}
                </button>
                <button
                  className="p-1 rounded hover:bg-[#EAD1FF33] ml-1"
                  onClick={e => { e.stopPropagation(); handleDuplicate(idx); }}
                  title="Duplicar post-it"
                >
                  <svg width={17} height={17} viewBox="0 0 20 20"><rect x="4" y="7" width="10" height="8" rx="2" fill="none" stroke={COLORS.deepPurple} strokeWidth="1.4"/><rect x="6" y="5" width="10" height="8" rx="2" fill="none" stroke={COLORS.deepPurple} strokeWidth="1.4"/></svg>
                </button>
              </div>
            </div>
            <div className="absolute right-2 top-2 opacity-60 cursor-grab">{TASK_ICONS.drag}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// SubtaskList, TaskList, MotivationalCard, CircularProgressBar, TaskSummaryCard

function SubtaskList({
  subtasks,
  onToggle,
  onRemove,
  onAdd,
  value,
  setValue,
}: {
  subtasks: SubTaskType[];
  onToggle: (id: number) => void;
  onRemove: (id: number) => void;
  onAdd: () => void;
  value: string;
  setValue: (s: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      onAdd();
    }
  }
  return (
    <div className="ml-5 sm:ml-8 my-1">
      <form
        className="flex gap-2 mb-1"
        onSubmit={e => {
          e.preventDefault();
          onAdd();
        }}
      >
        <input
          ref={inputRef}
          className="rounded-lg border px-2 py-1 bg-[#F6F5F2] text-xs focus:outline-none focus:border-gold transition placeholder:text-[#c7c8ca] border-[#e2e3e7] w-full"
          placeholder="Nova sub-tarefa..."
          type="text"
          value={value}
          maxLength={60}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{ color: COLORS.petrol }}
        />
        <button
          type="submit"
          className="flex items-center px-2 py-1 rounded-lg font-bold shadow-sm border border-[#e2e3e7] bg-[#fff] text-gold hover:bg-[#E9C46A17] transition"
          style={{ color: COLORS.gold }}
          aria-label="Adicionar sub-tarefa"
          disabled={value.trim().length === 0}
        >
          {TASK_ICONS.plus}
        </button>
      </form>
      <ul className="flex flex-col gap-0.5">
        {subtasks.length === 0 && (
          <li className="text-xs text-[#264653] opacity-50">Sem sub-tarefas.</li>
        )}
        {subtasks.map((st) => (
          <li
            key={st.id}
            className={`
              flex items-center px-2 rounded-xl transition-all duration-400 bg-white
              group
              ${st.done ? "opacity-70" : ""}
            `}
            style={{
              fontSize: "0.97rem",
              minHeight: 0,
              marginTop: "2px",
              background: "#f8f8f4",
              boxShadow: "0 1px 4px #E9C46A08",
              border: "1px solid #e2e3e7",
              padding: "3px 0",
            }}
          >
            <button
              className={`
                flex items-center justify-center w-6 h-6 mr-2 rounded-full border-2 transition
                bg-gradient-to-br from-[#f6f5f2] to-[#fff] shadow-sm
                ${st.done ? "border-olive" : "border-gold"}
                ${st.done ? "bg-olive" : "bg-beige"}
                hover:scale-105
              `}
              style={{
                borderColor: st.done ? COLORS.olive : COLORS.gold,
                background: st.done ? COLORS.olive : COLORS.beige,
              }}
              aria-label={st.done ? "Desmarcar sub-tarefa" : "Concluir sub-tarefa"}
              onClick={() => onToggle(st.id)}
            >
              {st.done ? (
                <svg width={14} height={14} fill="none" viewBox="0 0 20 20">
                  <circle cx={10} cy={10} r={8} fill={COLORS.olive} />
                  <path d="M6 11l3 3 5-5" stroke={COLORS.petrol} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg width={14} height={14} fill="none" viewBox="0 0 20 20">
                  <circle cx={10} cy={10} r={8} fill={COLORS.beige} stroke={COLORS.gold} strokeWidth={1.3}/>
                </svg>
              )}
            </button>
            <span className={`flex-1 text-xs font-medium truncate ${st.done ? "line-through text-olive opacity-60" : "text-petrol"}`}>{st.text}</span>
            <button
              className="p-1 rounded hover:bg-[#FFD6E033] ml-1"
              onClick={() => onRemove(st.id)}
              title="Excluir sub-tarefa"
            >
              {TASK_ICONS.trash}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TaskList({
  tasks,
  onRemove,
  onToggle,
  onAdd,
  inputValue,
  setInputValue,
  onAddSubtask,
  onToggleSubtask,
  onRemoveSubtask,
  subtaskInputs,
  setSubtaskInputs,
}: {
  tasks: TaskType[];
  onRemove: (id: number) => void;
  onToggle: (id: number) => void;
  onAdd: () => void;
  inputValue: string;
  setInputValue: (s: string) => void;
  onAddSubtask: (taskId: number) => void;
  onToggleSubtask: (taskId: number, subId: number) => void;
  onRemoveSubtask: (taskId: number, subId: number) => void;
  subtaskInputs: { [k: number]: string };
  setSubtaskInputs: (f: (prev: { [k: number]: string }) => { [k: number]: string }) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      onAdd();
    }
  }

  return (
    <div>
      <form
        className="flex gap-2 mb-2"
        onSubmit={e => {
          e.preventDefault();
          onAdd();
        }}
      >
        <input
          ref={inputRef}
          className="flex-1 rounded-lg border px-3 py-2 bg-[#F6F5F2] text-sm focus:outline-none focus:border-gold transition placeholder:text-[#c7c8ca] border-[#e2e3e7]"
          placeholder="Nova tarefa..."
          type="text"
          value={inputValue}
          maxLength={80}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{ color: COLORS.petrol }}
        />
        <button
          type="submit"
          className="flex items-center px-3 py-2 rounded-lg font-bold shadow-sm border border-[#e2e3e7] bg-[#fff] text-gold hover:bg-[#E9C46A17] transition text-base"
          style={{ color: COLORS.gold }}
          aria-label="Adicionar tarefa"
          disabled={inputValue.trim().length === 0}
        >
          {TASK_ICONS.plus}
        </button>
      </form>
      <ul className="flex flex-col gap-1">
        {tasks.length === 0 && (
          <li className="text-center py-8 text-[#264653] opacity-60">Sem tarefas.</li>
        )}
        {tasks.map((t) => (
          <li
            key={t.id}
            className={`
              flex flex-col bg-white rounded-xl p-2 mb-1 shadow-sm
              group border border-[#e2e3e7] transition-all duration-400
              ${t.done ? "opacity-70" : ""}
            `}
            style={{
              transition: "all 0.4s cubic-bezier(.4,1.3,.6,1)",
              overflow: "hidden",
              minHeight: 0,
              background: "#fff",
              boxShadow: "0 1px 6px #E9C46A11",
            }}
          >
            <div className="flex items-center">
              <button
                className={`
                  flex items-center justify-center w-7 h-7 mr-3 rounded-full border-2 transition
                  bg-gradient-to-br from-[#f6f5f2] to-[#fff] shadow-sm
                  ${t.done ? "border-olive" : "border-gold"}
                  ${t.done ? "bg-olive" : "bg-beige"}
                  hover:scale-105
                `}
                style={{
                  borderColor: t.done ? COLORS.olive : COLORS.gold,
                  background: t.done ? COLORS.olive : COLORS.beige,
                  boxShadow: t.done ? "0 2px 8px #A9C5A033" : "0 2px 8px #E9C46A22",
                }}
                aria-label={t.done ? "Desmarcar tarefa" : "Concluir tarefa"}
                onClick={() => onToggle(t.id)}
              >
                <span className="transition-all duration-200">
                  {t.done ? (
                    <svg width={18} height={18} fill="none" viewBox="0 0 20 20">
                      <circle cx={10} cy={10} r={9} fill={COLORS.olive} />
                      <path d="M6 11l3 3 5-5" stroke={COLORS.petrol} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <svg width={18} height={18} fill="none" viewBox="0 0 20 20">
                      <circle cx={10} cy={10} r={9} fill={COLORS.beige} stroke={COLORS.gold} strokeWidth={1.3}/>
                    </svg>
                  )}
                </span>
              </button>
              <span className={`
                flex-1 text-base font-medium truncate
                ${t.done ? "line-through text-olive opacity-60" : "text-petrol"}
                transition-all duration-300
              `} style={{
                fontSize: "1rem",
                letterSpacing: "0.01em",
                paddingTop: "3px",
                paddingBottom: "2px",
              }}>
                {t.text}
              </span>
              <button
                className="p-1 rounded hover:bg-[#FFD6E033] ml-2"
                onClick={() => onRemove(t.id)}
                title="Excluir tarefa"
              >
                {TASK_ICONS.trash}
              </button>
            </div>
            {/* SUBTASKS */}
            <SubtaskList
              subtasks={t.subtasks ?? []}
              onToggle={subId => onToggleSubtask(t.id, subId)}
              onRemove={subId => onRemoveSubtask(t.id, subId)}
              onAdd={() => onAddSubtask(t.id)}
              value={subtaskInputs[t.id] || ""}
              setValue={val => setSubtaskInputs(i => ({ ...i, [t.id]: val }))}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

function MotivationalCard() {
  const phrases = [
    "Você é capaz de fazer grandes coisas hoje! 🚀",
    "Cada pequeno passo é progresso. Continue!",
    "Foco, força e fé para conquistar seus objetivos.",
    "O sucesso é a soma de pequenos esforços repetidos diariamente.",
    "Acredite no seu potencial e faça acontecer!"
  ];
  const [phrase, setPhrase] = useState(() => phrases[Math.floor(Math.random() * phrases.length)]);
  useEffect(() => {
    const interval = setInterval(() => {
      setPhrase(phrases[Math.floor(Math.random() * phrases.length)]);
    }, 30000);
    return () => clearInterval(interval);
  }, []);
  return (
    <Card className="flex flex-col items-center justify-center min-h-[120px] sm:min-h-[140px] px-2 sm:px-4 py-5 sm:py-6 bg-[#fffbe8]">
      <span className="text-base sm:text-lg font-semibold text-[#523A68] mb-2">Motivação do dia</span>
      <span className="text-sm sm:text-base text-[#264653] text-center">{phrase}</span>
    </Card>
  );
}

function CircularProgressBar({ percentage, size = 102, stroke = 10, color = COLORS.gold, bg = COLORS.beige, children }: { percentage: number, size?: number, stroke?: number, color?: string, bg?: string, children?: React.ReactNode }) {
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
        stroke={bg}
        strokeWidth={stroke}
        style={{ filter: "blur(0.2px)" }}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        style={{
          transition: "stroke-dashoffset 1.2s cubic-bezier(.7,1.5,.65,1) 0s",
          filter: "drop-shadow(0 0 6px #E9C46A33)",
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

// PRINCIPAL
export default function DashboardContent() {
  const [weekDays] = useState(getCurrentWeek());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // Persistência de tarefas
  const [tasks, setTasks] = useState<TaskType[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const data = localStorage.getItem("dashboard_tasks");
        if (data) return JSON.parse(data);
      } catch {}
    }
    return [
      { id: 1, text: "Enviar relatório semanal", done: false, subtasks: [] },
      { id: 2, text: "Revisar código", done: true, completedAt: new Date().toISOString(), subtasks: [{ id: 21, text: "Puxar branch nova", done: true }] },
      { id: 3, text: "Agendar reunião", done: false, subtasks: [] },
    ];
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("dashboard_tasks", JSON.stringify(tasks));
    }
  }, [tasks]);

  const [events] = useState([
    { date: weekDays[2].date.toISOString().slice(0, 10), title: "Reunião 10h" },
    { date: weekDays[4].date.toISOString().slice(0, 10), title: "Dentista" },
  ]);
  const [notes, setNotes] = useState<NoteType[]>([
    { text: "Lembrete: enviar e-mail", color: COLORS.yellow, x: 25, y: 20 },
    { text: "Chamar o fornecedor", color: COLORS.pink, x: 110, y: 60 },
  ]);

  // Timer
  const timer = useTimer();

  // Task input
  const [taskInput, setTaskInput] = useState("");

  // Subtask inputs (controle por task id)
  const [subtaskInputs, setSubtaskInputs] = useState<{ [k: number]: string }>({});

  // Auxiliares
  function getMonthName(date: Date) {
    return date.toLocaleString("pt-BR", { month: "long" });
  }
  function hasEvent(date: Date) {
    return events.some(ev => {
      const d = new Date(ev.date);
      return d.getDate() === date.getDate() && d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear();
    });
  }
  function getEventsForDay(date: Date) {
    return events.filter(ev => {
      const d = new Date(ev.date);
      return d.getDate() === date.getDate() && d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear();
    });
  }
  function handleToggleTask(id: number) {
    setTasks(tasks =>
      tasks.map((t) =>
        t.id === id
          ? {
              ...t,
              done: !t.done,
              completedAt: !t.done ? new Date().toISOString() : t.completedAt ?? undefined,
              subtasks: !t.done && t.subtasks && t.subtasks.length > 0
                ? t.subtasks.map(st => ({ ...st, done: false }))
                : t.subtasks,
            }
          : t
      )
    );
  }
  function handleRemoveTask(id: number) {
    setTasks(tasks => tasks.filter((t) => t.id !== id));
    setSubtaskInputs(inputs => {
      const newInputs = { ...inputs };
      delete newInputs[id];
      return newInputs;
    });
  }
  function handleAddTask() {
    const txt = taskInput.trim();
    if (!txt) return;
    setTasks(ts => [
      ...ts,
      {
        id: Date.now() + Math.floor(Math.random() * 1000),
        text: txt,
        done: false,
        subtasks: [],
      }
    ]);
    setTaskInput("");
  }

  // SUBTAREFAS
  function handleAddSubtask(taskId: number) {
    const txt = (subtaskInputs[taskId] || "").trim();
    if (!txt) return;
    setTasks(ts =>
      ts.map(t =>
        t.id === taskId
          ? {
              ...t,
              subtasks: [
                ...(t.subtasks || []),
                { id: Date.now() + Math.floor(Math.random() * 1000), text: txt, done: false },
              ],
              done: false,
            }
          : t
      )
    );
    setSubtaskInputs(inputs => ({ ...inputs, [taskId]: "" }));
  }
  function handleToggleSubtask(taskId: number, subId: number) {
    setTasks(ts => ts.map(t => {
      if (t.id !== taskId) return t;
      const updatedSubs = (t.subtasks || []).map(st =>
        st.id === subId ? { ...st, done: !st.done } : st
      );
      const allDone = updatedSubs.length > 0 && updatedSubs.every(st => st.done);
      return {
        ...t,
        subtasks: updatedSubs,
        done: allDone ? true : t.done && allDone,
        completedAt: allDone && !t.done ? new Date().toISOString() : t.completedAt,
      };
    }));
  }
  function handleRemoveSubtask(taskId: number, subId: number) {
    setTasks(ts => ts.map(t => {
      if (t.id !== taskId) return t;
      const updatedSubs = (t.subtasks || []).filter(st => st.id !== subId);
      return {
        ...t,
        subtasks: updatedSubs,
        done: updatedSubs.length > 0 && updatedSubs.every(st => st.done)
          ? true
          : updatedSubs.length === 0
            ? false
            : t.done,
        completedAt: updatedSubs.length > 0 && updatedSubs.every(st => st.done)
          ? new Date().toISOString()
          : t.completedAt,
      };
    }));
  }

 return (
  <div className="relative min-h-screen w-full bg-gradient-to-tr from-[#f6f5f2] to-[#fff]">
    {/* Header */}
    <header className="w-full px-2 sm:px-4 md:px-8 pt-4 sm:pt-8 pb-3 flex flex-col md:flex-row items-start md:items-center justify-between border-b border-[#ececec] bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-20 gap-3">
      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#22223B] select-none">
        Dashboard
      </h1>
      <div className="flex gap-2 sm:gap-4 items-center w-full md:w-auto">
        <input
          className="rounded-xl border px-3 py-1.5 sm:px-4 sm:py-2 bg-[#f6f6f8] text-base focus:outline-none focus:border-[#E9C46A] transition placeholder:text-[#b6b7bb] border-[#ececec] shadow-sm w-full max-w-xs"
          placeholder="Buscar tarefa, compromisso..."
          type="search"
          style={{ color: COLORS.petrol }}
          disabled
        />
        <span className="hidden sm:block text-sm font-medium text-[#A9C5A0] min-w-max">
          {new Date().toLocaleDateString("pt-BR", { weekday: "long", month: "long", day: "numeric" })}
        </span>
      </div>
    </header>

    {/* TOP CARDS */}
    <div className="w-full px-1 sm:px-4 md:px-8 pt-6 grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-7">
      {/* Cronômetro */}
      <Card className="flex flex-col items-center justify-center py-5 sm:py-7 px-2 sm:px-5 min-h-[120px] sm:min-h-[150px] gap-3 bg-white/90 border-0 shadow-md hover:shadow-lg transition">
        <div className="flex items-center gap-3 mb-2">
          <svg width={30} height={30} fill="none" viewBox="0 0 24 24">
            <circle cx={12} cy={12} r={10} fill={COLORS.gold} />
            <path d="M12 7v5l4 2" stroke={COLORS.petrol} strokeWidth={2.2} strokeLinecap="round" />
          </svg>
          <span className="text-lg sm:text-xl font-bold text-[#22223B]">Cronômetro</span>
        </div>
        <span
          className="text-[2rem] sm:text-[2.4rem] font-mono font-extrabold tracking-widest select-none"
          style={{
            color: COLORS.petrol,
            textShadow: "0 2px 14px #E9C46A22",
            letterSpacing: 2,
            lineHeight: 1,
          }}>
          {timer.mins}:{timer.secs}
        </span>
        <div className="flex gap-2 sm:gap-3 mt-2">
          {timer.running ? (
            <button
              className="py-2 px-4 sm:px-5 rounded-xl font-bold shadow border border-[#f2e9e1] bg-[#FAFAFA] text-[#E9C46A] hover:bg-[#FFF9C4]/60 hover:text-[#523A68] transition text-base"
              onClick={timer.pause}
            >Pausar</button>
          ) : (
            <button
              className="py-2 px-4 sm:px-5 rounded-xl font-bold shadow border border-[#f2e9e1] bg-[#FAFAFA] text-[#264653] hover:bg-[#EAD1FF]/30 transition text-base"
              onClick={timer.start}
            >Iniciar</button>
          )}
          <button
            className="py-2 px-4 sm:px-5 rounded-xl font-bold shadow border border-[#f2e9e1] bg-[#FAFAFA] text-[#A9C5A0] hover:bg-[#A9C5A0]/15 transition text-base"
            onClick={timer.reset}
          >Zerar</button>
        </div>
      </Card>
      {/* Tarefas */}
      <Card className="flex flex-col min-h-[120px] sm:min-h-[150px] px-0 py-0 overflow-visible border-0 shadow-md bg-white/90 hover:shadow-lg transition">
        <div className="px-3 sm:px-4 pt-4 pb-2 flex items-center gap-3">
          <svg width={18} height={18} fill="none" viewBox="0 0 20 20">
            <circle cx={10} cy={10} r={10} fill={COLORS.olive} />
            <path d="M6 11l3 3 5-5" stroke={COLORS.petrol} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-lg font-bold text-[#A9C5A0]">Tarefas</span>
        </div>
        <div className="flex-1 p-2 sm:p-3 mt-3 sm:mt-6" style={{
          minHeight: 0,
          maxHeight: 240,
          overflowY: "auto",
          overflowX: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
        }}>
          <TaskList
            tasks={tasks}
            onToggle={handleToggleTask}
            onRemove={handleRemoveTask}
            onAdd={handleAddTask}
            inputValue={taskInput}
            setInputValue={setTaskInput}
            onAddSubtask={handleAddSubtask}
            onToggleSubtask={handleToggleSubtask}
            onRemoveSubtask={handleRemoveSubtask}
            subtaskInputs={subtaskInputs}
            setSubtaskInputs={setSubtaskInputs}
          />
        </div>
      </Card>
      {/* Clima */}
      <Card className="flex flex-col items-center justify-center min-h-[160px] sm:min-h-[210px] px-2 sm:px-4 py-6 sm:py-8 border-0 shadow-md bg-white/90 hover:shadow-lg transition">
        <WeatherWidget />
      </Card>
      {/* Motivação */}
      <MotivationalCard />
    </div>

    {/* SEGUNDA LINHA: Calendário | Produtividade | Resumo */}
    <div className="w-full px-1 sm:px-4 md:px-8 pt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-7">
      {/* Calendário */}
      <Card className="flex flex-col px-2 sm:px-4 md:px-7 py-5 gap-4 sm:gap-6 min-h-[170px] sm:min-h-[230px] border-0 shadow-md bg-white/90 hover:shadow-lg transition">
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold text-lg sm:text-xl capitalize text-[#E9C46A]">{getMonthName(weekDays[0].date)}</span>
          <a className="text-sm font-medium hover:underline text-[#E9C46A]" href="/calendar">
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
                    ${selected ? "ring-2 ring-[#E9C46A] scale-105 z-10 bg-[#FFF8E1]" : ""}
                    hover:bg-[#F6F5F2]
                  `}
                  style={{
                    background: isToday ? COLORS.gold + "22" : undefined,
                    color: isToday ? COLORS.gold : COLORS.petrol,
                    fontWeight: isToday || selected ? 700 : 500,
                    fontSize: "clamp(1.08rem, 2vw, 1.3rem)",
                    width: "100%",
                    minHeight: 44,
                  }}
                  onClick={() => setSelectedDay(idx)}
                >
                  <span className="text-xs sm:text-base font-bold uppercase tracking-wide"
                    style={{
                      color: isToday ? COLORS.gold : COLORS.petrol,
                      opacity: isToday ? 1 : 0.9,
                    }}>
                    {d.label}
                  </span>
                  <span className="text-xl sm:text-2xl md:text-3xl font-bold mb-0"
                    style={{
                      color: isToday ? COLORS.gold : COLORS.petrol,
                    }}>
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
                      background: COLORS.gold,
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
          <div className="text-xs sm:text-sm font-medium mb-2 text-[#E9C46A] opacity-80">Compromissos do dia</div>
          {selectedDay !== null && getEventsForDay(weekDays[selectedDay].date).length > 0 ? (
            <ul>
              {getEventsForDay(weekDays[selectedDay].date).map((ev, i) => (
                <li key={ev.title + i} className="flex items-center py-1 gap-2 sm:gap-3 text-[#264653]">
                  <span className="w-3 h-3 rounded-full bg-[#E9C46A] block" />
                  <span className="text-xs sm:text-base font-medium">{ev.title}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-xs sm:text-base text-[#A9C5A0]">Nenhum compromisso.</div>
          )}
        </div>
      </Card>
      {/* Gráfico Produtividade */}
      <Card className="flex flex-col justify-center items-center p-0 min-h-[170px] sm:min-h-[230px] border-0 shadow-md bg-white/90 hover:shadow-lg transition">
        <ProductivityChart tasks={tasks} />
      </Card>
      {/* Card de Resumo */}
      <Card className="flex flex-col justify-center items-center gap-2 p-0 min-h-[170px] sm:min-h-[230px] border-0 shadow-md bg-white/90 hover:shadow-lg transition">
        <div className="flex flex-col items-center justify-center pt-6 sm:pt-8 pb-2 sm:pb-4 w-full">
          <span className="font-bold text-base sm:text-lg text-[#22223B] mb-2">Resumo do dia</span>
          <div className="flex items-center justify-center mb-2">
            <CircularProgressBar percentage={tasks.length === 0 ? 0 : Math.round(tasks.filter(t => t.done).length / tasks.length * 100)} size={60} stroke={7} color={COLORS.gold} bg="#f6f5f2">
              <span className="text-base sm:text-lg font-bold" style={{ color: COLORS.gold }}>
                {tasks.length === 0 ? 0 : Math.round(tasks.filter(t => t.done).length / tasks.length * 100)}%
              </span>
            </CircularProgressBar>
          </div>
          <div className="flex gap-2 sm:gap-4 text-xs sm:text-base font-semibold mb-2">
            <span style={{ color: COLORS.olive }}>
              {tasks.filter(t => t.done).length} concluídas
            </span>
            <span style={{ color: COLORS.gold }}>
              {tasks.length - tasks.filter(t => t.done).length} pendente{tasks.length - tasks.filter(t => t.done).length !== 1 ? "s" : ""}
            </span>
          </div>
          <span className="text-xs text-[#523A68] opacity-70 font-medium">
            {tasks.length === 0
              ? "Comece sua lista hoje!"
              : tasks.filter(t => t.done).length === tasks.length
                ? "Tudo concluído! 🎉"
                : tasks.filter(t => t.done).length > 0
                  ? "Ótimo progresso!"
                  : "Avance nas tarefas para ver seu progresso"}
          </span>
        </div>
      </Card>
    </div>

    {/* QUADRO DE POST-ITS EMBAIXO, OCUPANDO QUASE TODA LARGURA */}
    <div className="w-full px-1 sm:px-4 md:px-8 pt-7 pb-12 flex flex-col items-center">
      <Card className="w-full max-w-[99vw] sm:max-w-[1600px] min-h-[180px] sm:min-h-[300px] md:min-h-[340px] lg:min-h-[360px] px-0 py-0 overflow-visible border-0 shadow-lg bg-white/95">
        <NotesBoard notes={notes} setNotes={setNotes} />
      </Card>
    </div>
  </div>
);
}