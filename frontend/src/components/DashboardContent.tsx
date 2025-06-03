"use client";
import { useEffect, useState } from "react";
import Card from "@/components/Card";
import WeatherWidget from "@/components/WeatherWidget";
import ProductivityChart from "@/components/ProductivityChart";
import NotesBoard from "@/components/NotesBoard";
import MotivationalCard from "@/components/MotivationalCard";
import CircularProgressBar from "@/components/CircularProgressBar";
import TaskList from "@/components/TaskList";
import CalendarWeek from "@/components/CalendarWeek";
import TimerCard from "@/components/TimerCard";
import COLORS from "@/components/colors";
import { useTheme } from "@/components/ThemeContext";
import type { TaskType, NoteType } from "@/components/types";

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

export default function DashboardContent() {
  const themeCtx = useTheme?.();
  const isClassic = themeCtx?.themeKey === "classic" || !themeCtx?.theme;
  const theme = isClassic ? COLORS : themeCtx.theme;

  const [weekDays] = useState(getCurrentWeek());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // Persistência de tarefas
  const [tasks, setTasks] = useState<TaskType[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const data = localStorage.getItem("dashboard_tasks");
        if (data) return JSON.parse(data) as TaskType[];
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

  // Notas com cor do tema
  const [notes, setNotes] = useState<NoteType[]>([
    { text: "Lembrete: enviar e-mail", color: theme.yellow, x: 25, y: 20 },
    { text: "Chamar o fornecedor", color: theme.pink, x: 110, y: 60 },
  ]);

  useEffect(() => {
    setNotes(notes =>
      notes.map((note, idx) => ({
        ...note,
        color: idx % 2 === 0 ? theme.yellow : theme.pink,
      }))
    );
     
  }, [theme.yellow, theme.pink]);

  const [taskInput, setTaskInput] = useState("");
  const [subtaskInputs, setSubtaskInputs] = useState<{ [k: number]: string }>({});

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

  // Header styles por tema
  const headerStyles = isClassic
    ? {
        borderColor: "#E9C46A",
        background: "#fff8",
        backdropFilter: "blur(4px)",
      }
    : themeCtx?.themeKey === "sunset"
      ? {
          borderColor: "#FFD452",
          background: "#FFF5E1",
          boxShadow: "0 2px 0 0 #FFD45222",
          backdropFilter: "blur(2px)",
          transition: "all 0.3s"
        }
      : themeCtx?.themeKey === "ocean"
        ? {
            borderColor: "#97C1A9",
            background: "#E0FBFC",
            boxShadow: "0 2px 0 0 #97C1A9",
            backdropFilter: "blur(2px)",
            transition: "all 0.3s"
          }
        : {
            borderColor: theme.gold,
            background: "#fff8",
            backdropFilter: "blur(4px)",
            transition: "border-color 0.3s"
          };

  const headerTitleColor = isClassic
    ? theme.graphite
    : themeCtx?.themeKey === "sunset"
      ? "#A4508B"
      : themeCtx?.themeKey === "ocean"
        ? "#247BA0"
        : theme.graphite;

  const headerInputClass =
    isClassic
      ? "bg-[#f6f6f8] border-[#ececec]"
      : themeCtx?.themeKey === "sunset"
        ? "bg-[#FFF5E1] border-[#FFD452] text-[#A4508B]"
        : themeCtx?.themeKey === "ocean"
          ? "bg-[#E0FBFC] border-[#97C1A9] text-[#155263] font-mono"
          : "";

  const headerInputColor =
    isClassic
      ? theme.petrol
      : themeCtx?.themeKey === "sunset"
        ? "#A4508B"
        : themeCtx?.themeKey === "ocean"
          ? "#155263"
          : theme.petrol;

  const headerDateClass =
    isClassic
      ? ""
      : themeCtx?.themeKey === "sunset"
        ? "bg-[#FFD45222] px-2 py-1 rounded-lg"
        : themeCtx?.themeKey === "ocean"
          ? "bg-[#B6E6F533] px-2 py-1 rounded-lg font-mono"
          : "";

  const headerDateColor =
    isClassic
      ? theme.olive
      : themeCtx?.themeKey === "sunset"
        ? "#F76D77"
        : themeCtx?.themeKey === "ocean"
          ? "#247BA0"
          : theme.olive;

  return (
    <div
      className="relative min-h-screen w-full"
      style={
        isClassic
          ? { background: "#F6F5F2" }
          : { background: `linear-gradient(to top right, ${theme.beige}, #fff)`, transition: "background 0.3s" }
      }
    >
      {/* Header */}
      <header
        className={`w-full px-2 sm:px-4 md:px-8 pt-4 sm:pt-8 pb-3 flex flex-col md:flex-row items-start md:items-center justify-between border-b transition-all duration-300`}
        style={headerStyles}
      >
        <h1
          className="text-2xl sm:text-3xl font-extrabold tracking-tight select-none"
          style={{
            color: headerTitleColor,
            transition: "color 0.3s"
          }}
        >
          Dashboard
        </h1>
        <div className="flex gap-2 sm:gap-4 items-center w-full md:w-auto">
          <input
            className={`rounded-xl border px-3 py-1.5 sm:px-4 sm:py-2 text-base focus:outline-none transition placeholder:text-[#b6b7bb] shadow-sm w-full max-w-xs ${headerInputClass}`}
            placeholder="Buscar tarefa, compromisso..."
            type="search"
            style={{
              color: headerInputColor,
              transition: "color 0.3s"
            }}
            disabled
          />
          <span
            className={`hidden sm:block text-sm font-medium min-w-max ${headerDateClass}`}
            style={{
              color: headerDateColor,
              transition: "color 0.3s"
            }}
          >
            {new Date().toLocaleDateString("pt-BR", { weekday: "long", month: "long", day: "numeric" })}
          </span>
        </div>
      </header>

      {/* TOP CARDS */}
      <div className="w-full px-1 sm:px-4 md:px-8 pt-6 grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-7">
        {/* Cronômetro */}
        <TimerCard />
        {/* Tarefas */}
        <Card
          className="flex flex-col min-h-[120px] sm:min-h-[150px] px-0 py-0 overflow-visible border-0 shadow-md"
          style={
            isClassic
              ? { background: "#FFF", boxShadow: "0 2px 8px #e9c46a33" }
              : { backgroundColor: theme.beige, transition: "background-color 0.3s" }
          }
        >
          <div className="px-3 sm:px-4 pt-4 pb-2 flex items-center gap-3">
            <svg width={18} height={18} fill="none" viewBox="0 0 20 20">
              <circle cx={10} cy={10} r={10} fill={theme.olive} />
              <path d="M6 11l3 3 5-5" stroke={theme.petrol} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-lg font-bold" style={{ color: theme.olive, transition: "color 0.3s" }}>Tarefas</span>
          </div>
          <div className="flex-1 p-2 sm:p-3 mt-3 sm:mt-6"
            style={{
              minHeight: 0,
              maxHeight: 240,
              overflowY: "auto",
              overflowX: "hidden",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start"
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
        <Card
          className="flex flex-col items-center justify-center min-h-[160px] sm:min-h-[210px] px-2 sm:px-4 py-6 sm:py-8 border-0 shadow-md"
          style={
            isClassic
              ? { background: "#FFF", boxShadow: "0 2px 8px #e9c46a33" }
              : { backgroundColor: theme.beige, transition: "background-color 0.3s" }
          }
        >
          <WeatherWidget />
        </Card>
        {/* Motivação */}
        <MotivationalCard />
      </div>

      {/* SEGUNDA LINHA: Calendário | Produtividade | Resumo */}
      <div className="w-full px-1 sm:px-4 md:px-8 pt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-7">
        {/* Calendário */}
        <CalendarWeek
          weekDays={weekDays}
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
          getMonthName={getMonthName}
          hasEvent={hasEvent}
          getEventsForDay={getEventsForDay}
        />
        {/* Gráfico Produtividade */}
        <Card
          className="flex flex-col justify-center items-center p-0 min-h-[170px] sm:min-h-[230px] border-0 shadow-md"
          style={
            isClassic
              ? { background: "#FFF", boxShadow: "0 2px 8px #e9c46a33" }
              : { backgroundColor: theme.beige, transition: "background-color 0.3s" }
          }
        >
          <ProductivityChart tasks={tasks} />
        </Card>
        {/* Card de Resumo */}
        <Card
          className="flex flex-col justify-center items-center gap-2 p-0 min-h-[170px] sm:min-h-[230px] border-0 shadow-md"
          style={
            isClassic
              ? { background: "#FFF", boxShadow: "0 2px 8px #e9c46a33" }
              : { backgroundColor: theme.beige, transition: "background-color 0.3s" }
          }
        >
          <div className="flex flex-col items-center justify-center pt-6 sm:pt-8 pb-2 sm:pb-4 w-full">
            <span className="font-bold text-base sm:text-lg mb-2"
              style={{ color: theme.graphite, transition: "color 0.3s" }}>Resumo do dia</span>
            <div className="flex items-center justify-center mb-2">
              <CircularProgressBar
                percentage={tasks.length === 0 ? 0 : Math.round(tasks.filter(t => t.done).length / tasks.length * 100)}
                size={60}
                stroke={7}
                {...(isClassic ? { color: theme.gold } : {})}
                bg={theme.beige}
              >
                <span className="text-base sm:text-lg font-bold"
                  style={{ color: isClassic ? theme.gold : undefined, transition: "color 0.3s" }}>
                  {tasks.length === 0 ? 0 : Math.round(tasks.filter(t => t.done).length / tasks.length * 100)}%
                </span>
              </CircularProgressBar>
            </div>
            <div className="flex gap-2 sm:gap-4 text-xs sm:text-base font-semibold mb-2">
              <span
                style={{
                  color: isClassic
                    ? theme.olive
                    : themeCtx?.themeKey === "sunset"
                      ? "#A4508B"
                      : themeCtx?.themeKey === "ocean"
                        ? "#247BA0"
                        : theme.olive,
                  transition: "color 0.3s"
                }}
              >
                {tasks.filter(t => t.done).length} concluídas
              </span>
              <span
                style={{
                  color: isClassic
                    ? theme.gold
                    : themeCtx?.themeKey === "sunset"
                      ? "#F76D77"
                      : themeCtx?.themeKey === "ocean"
                        ? "#97C1A9"
                        : theme.gold,
                  transition: "color 0.3s"
                }}
              >
                {tasks.length - tasks.filter(t => t.done).length} pendente{tasks.length - tasks.filter(t => t.done).length !== 1 ? "s" : ""}
              </span>
            </div>
            <span className="text-xs"
              style={{ color: theme.deepPurple, opacity: 0.7, fontWeight: 500, transition: "color 0.3s" }}>
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
        <Card
          className="w-full max-w-[99vw] sm:max-w-[1600px] min-h-[180px] sm:min-h-[300px] md:min-h-[340px] lg:min-h-[360px] px-0 py-0 overflow-visible border-0 shadow-lg"
          style={
            isClassic
              ? { background: "#FFF", boxShadow: "0 2px 16px #e9c46a33" }
              : { backgroundColor: theme.beige, transition: "background-color 0.3s" }
          }
        >
          <NotesBoard notes={notes} setNotes={setNotes} />
        </Card>
      </div>
    </div>
  );
}