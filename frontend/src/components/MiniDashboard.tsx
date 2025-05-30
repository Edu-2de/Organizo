"use client";
import { useState, useRef, useEffect } from "react";

// Paleta de cores ainda mais clean e suaves
const COLORS = {
  petrol: "#4A5568",
  olive: "#7BC47F", // Verde suave para ícones ativos
  gold: "#F7E9B7",
  beige: "#F9FAFB",
  graphite: "#22223B",
  deepPurple: "#D6D3F0",
};

type Subtask = {
  id: string;
  text: string;
  done: boolean;
};

type Task = {
  id: string;
  title: string;
  description: string;
  date: string;
  done: boolean;
  subtasks: Subtask[];
};

type Note = {
  id: string;
  text: string;
  date: string;
};

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

function load<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

const MENU = [
  {
    key: "tasks",
    label: "Tarefas",
    icon: (
      <svg width={22} height={22} fill="none" stroke={COLORS.olive} strokeWidth={2}><rect x="3" y="4" width="16" height="14" rx="3"/><path d="M7 8h6M7 12h4"/></svg>
    ),
  },
  {
    key: "calendar",
    label: "Calendário",
    icon: (
      <svg width={22} height={22} fill="none" stroke={COLORS.olive} strokeWidth={2}><rect x="3" y="5" width="16" height="14" rx="3"/><path d="M16 3v4M8 3v4M3 9h16"/></svg>
    ),
  },
  {
    key: "notes",
    label: "Anotações",
    icon: (
      <svg width={22} height={22} fill="none" stroke={COLORS.olive} strokeWidth={2}><rect x="4" y="4" width="14" height="14" rx="3"/><path d="M8 8h6M8 12h4"/></svg>
    ),
  },
];

// Animation hook
function useScrollFade(
  ref: React.RefObject<HTMLDivElement>,
  direction: "left" | "right" = "left"
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.92) {
        el.classList.add("opacity-100", "translate-x-0");
        el.classList.remove(
          "opacity-0",
          direction === "left" ? "-translate-x-12" : "translate-x-12"
        );
      }
    };
    el.classList.add(
      "opacity-0",
      direction === "left" ? "-translate-x-12" : "translate-x-12"
    );
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [ref, direction]);
}

// Detecta modo escuro de forma reativa ao alterar a classe no body
function useDarkMode() {
  const [isDark, setIsDark] = useState(() =>
    typeof window !== "undefined"
      ? document.body.classList.contains("dark-mode")
      : false
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const observer = new MutationObserver(() => {
      setIsDark(document.body.classList.contains("dark-mode"));
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    // Atualiza imediatamente caso o modo mude antes do mount
    setIsDark(document.body.classList.contains("dark-mode"));
    return () => observer.disconnect();
  }, []);

  return isDark;
}

export default function MiniDashboard() {
  const [selectedMenu, setSelectedMenu] = useState("tasks");
  const [selectedDate, setSelectedDate] = useState(getToday());
  const [tasks, setTasks] = useState<Task[]>(() => load("tasks", []));
  const [notes, setNotes] = useState<Note[]>(() => load("notes", []));
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [noteInput, setNoteInput] = useState("");
  const [subtaskInputs, setSubtaskInputs] = useState<string[]>([]);

  // Animation refs
  const leftRef = useRef<HTMLDivElement | null>(null);
  const rightRef = useRef<HTMLDivElement | null>(null);
  useScrollFade(leftRef as React.RefObject<HTMLDivElement>, "left");
  useScrollFade(rightRef as React.RefObject<HTMLDivElement>, "right");

  // Modo escuro reativo
  const isDark = useDarkMode();

  function updateTasks(newTasks: Task[]) {
    setTasks(newTasks);
    save("tasks", newTasks);
  }
  function updateNotes(newNotes: Note[]) {
    setNotes(newNotes);
    save("notes", newNotes);
  }

  function addTask() {
    if (!taskTitle.trim()) return;
    const subtasks: Subtask[] = subtaskInputs
      .filter((t) => t.trim())
      .map((t) => ({
        id: Math.random().toString(36).slice(2),
        text: t,
        done: false,
      }));
    const newTask: Task = {
      id: Math.random().toString(36).slice(2),
      title: taskTitle,
      description: taskDescription,
      date: selectedDate,
      done: false,
      subtasks,
    };
    updateTasks([...tasks, newTask]);
    setTaskTitle("");
    setTaskDescription("");
    setSubtaskInputs([]);
  }

  function addNote() {
    if (!noteInput.trim()) return;
    const newNote: Note = {
      id: Math.random().toString(36).slice(2),
      text: noteInput,
      date: selectedDate,
    };
    updateNotes([...notes, newNote]);
    setNoteInput("");
  }

  function toggleTask(id: string) {
    updateTasks(
      tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  }

  function removeTask(id: string) {
    updateTasks(tasks.filter((t) => t.id !== id));
  }

  function removeNote(id: string) {
    updateNotes(notes.filter((n) => n.id !== id));
  }

  function changeDay(delta: number) {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + delta);
    setSelectedDate(d.toISOString().slice(0, 10));
  }

  function addSubtaskInput() {
    setSubtaskInputs([...subtaskInputs, ""]);
  }

  function updateSubtaskInput(idx: number, value: string) {
    setSubtaskInputs(subtaskInputs.map((t, i) => (i === idx ? value : t)));
  }

  function removeSubtaskInput(idx: number) {
    setSubtaskInputs(subtaskInputs.filter((_, i) => i !== idx));
  }

  function toggleSubtask(taskId: string, subId: string) {
    updateTasks(
      tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              subtasks: t.subtasks.map((s) =>
                s.id === subId ? { ...s, done: !s.done } : s
              ),
            }
          : t
      )
    );
  }

  const dayTasks = tasks.filter((t) => t.date === selectedDate);
  const dayNotes = notes.filter((n) => n.date === selectedDate);

  function renderCalendar() {
    const today = getToday();
    const d = new Date(selectedDate);
    const year = d.getFullYear();
    const month = d.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: string[] = [];
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const dateStr = new Date(year, month, i).toISOString().slice(0, 10);
      days.push(dateStr);
    }
    const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];
    const offset = firstDay.getDay();
    return (
      <div>
        <div className="flex justify-between items-center mb-2">
          <button
            className={`rounded px-2 py-1 font-bold transition ${
              isDark
                ? "bg-[#23283B] text-white hover:bg-[#2a9df4]/10"
                : "bg-[#E6EFE6] text-[#4A5568] hover:bg-[#b7eac7]"
            }`}
            onClick={() => {
              const prev = new Date(year, month - 1, 1);
              setSelectedDate(prev.toISOString().slice(0, 10));
            }}
          >
            {"<"}
          </button>
          <span
            className={`font-semibold capitalize text-base ${
              isDark ? "text-white" : "text-[#4A5568]"
            }`}
          >
            {d.toLocaleString("pt-BR", { month: "short", year: "numeric" })}
          </span>
          <button
            className={`rounded px-2 py-1 font-bold transition ${
              isDark
                ? "bg-[#23283B] text-white hover:bg-[#2a9df4]/10"
                : "bg-[#E6EFE6] text-[#4A5568] hover:bg-[#b7eac7]"
            }`}
            onClick={() => {
              const next = new Date(year, month + 1, 1);
              setSelectedDate(next.toISOString().slice(0, 10));
            }}
          >
            {">"}
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-xs mb-1">
          {weekDays.map((w, i) => (
            <div
              key={i}
              className={`text-center font-semibold ${
                isDark ? "text-[#AEE2FF]" : "text-[#B7AFC3]"
              }`}
            >
              {w}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2 pb-2">
          {Array(offset)
            .fill(null)
            .map((_, i) => (
              <div key={"empty" + i}></div>
            ))}
          {days.map((dateStr) => {
            const isToday = dateStr === today;
            const isSelected = dateStr === selectedDate;
            const hasTask = tasks.some((t) => t.date === dateStr);
            const hasNote = notes.some((n) => n.date === dateStr);
            return (
              <div key={dateStr} className="flex flex-col items-center">
                <button
                  className={`aspect-square w-10 sm:w-12 rounded-lg flex items-center justify-center border transition
                    ${
                      isSelected
                        ? isDark
                          ? "bg-[#23283B] text-white border-[#2a9df4] font-bold shadow"
                          : "bg-[#E6EFE6] text-[#4A5568] border-[#E6EFE6] font-bold shadow"
                        : isDark
                        ? "bg-[#181B2A] text-white border-[#181B2A]"
                        : "bg-[#F9FAFB] text-[#4A5568] border-[#F9FAFB]"
                    }
                    ${
                      isToday && !isSelected
                        ? isDark
                          ? "ring-2 ring-[#2a9df4]"
                          : "ring-2 ring-[#7BC47F]"
                        : ""
                    }
                    hover:bg-[#E6EFE6]/60 relative`}
                  style={{
                    minHeight: "2.5rem",
                  }}
                  onClick={() => setSelectedDate(dateStr)}
                >
                  <span>{parseInt(dateStr.slice(-2))}</span>
                </button>
                {(hasTask || hasNote) && (
                  <span className="flex gap-1 mt-2">
                    {hasTask && (
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isDark ? "bg-[#2a9df4]" : "bg-[#7BC47F]"
                        } opacity-70`}
                      ></span>
                    )}
                    {hasNote && (
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isDark ? "bg-[#FFD87B]" : "bg-[#D6D3F0]"
                        } opacity-70`}
                      ></span>
                    )}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`max-w-[95vw] xl:max-w-[1600px] mx-auto my-16 px-2 flex flex-col md:flex-row items-stretch gap-0 md:gap-16`}
      // Removido o background da div principal, para herdar do body (dark) ou do container externo
      style={{
        transition: "background 0.4s",
      }}
    >
      {/* Lado esquerdo: Demonstração */}
      <aside
        ref={leftRef}
        className={`w-full md:w-[500px] flex flex-col justify-center items-start py-16 px-10 rounded-2xl border mb-8 md:mb-0 transition-all duration-700 opacity-0 -translate-x-12 shadow-sm ${
          isDark
            ? "bg-gradient-to-br from-[#23283B] via-[#181B2A] to-[#101a2f] border-[#2a9df4]"
            : "bg-[#F9FAFB] border-[#E6EFE6]"
        }`}
        style={
          isDark
            ? {
                boxShadow: "0 4px 32px 0 #10121A55, 0 0px 0px 1.5px #2a9df411",
                borderWidth: 2,
              }
            : {}
        }
      >
        <h1
          className={`text-4xl font-extrabold mb-4 tracking-tight leading-tight ${
            isDark ? "text-white" : "text-[#4A5568]"
          }`}
        >
          Ambiente de testes
        </h1>
        <p
          className={`text-lg mb-6 leading-relaxed max-w-lg ${
            isDark ? "text-[#AEE2FF]" : "text-[#4A5568bb]"
          }`}
        >
          Crie tarefas, anotações e navegue pelo calendário.<br />
          <span
            className={`font-semibold ${
              isDark ? "text-[#FFD87B]" : "text-[#B7AFC3]"
            }`}
          >
            Tudo salvo localmente, só para testar!
          </span>
        </p>
        <ul
          className={`text-base space-y-2 mb-8 ${
            isDark ? "text-[#AEE2FF]" : "text-[#B7AFC3]"
          }`}
        >
          <li className="flex items-center gap-2">
            Tarefas do dia
            <span
              className={`w-3 h-3 rounded-full ${
                isDark ? "bg-[#2a9df4]" : "bg-[#7BC47F]"
              } inline-block`}
              title="Tarefa"
            ></span>
          </li>
          <li className="flex items-center gap-2">
            Anotações rápidas
            <span
              className={`w-3 h-3 rounded-full ${
                isDark ? "bg-[#FFD87B]" : "bg-[#D6D3F0]"
              } inline-block`}
              title="Anotação"
            ></span>
          </li>
          <li>Calendário mensal</li>
        </ul>
        <div
          className={`text-sm italic ${
            isDark ? "text-[#AEE2FF99]" : "text-[#4A556899]"
          }`}
        >
          Visual, sem cadastro.
        </div>
      </aside>

      {/* Lado direito: Dashboard funcional */}
      <section
        ref={rightRef}
        className={`flex-1 flex rounded-2xl min-h-[700px] relative overflow-hidden transition-all duration-700 opacity-0 translate-x-12 border`}
        style={{
          background: isDark
            ? "linear-gradient(135deg, #181B2A 80%, #101a2f 100%)"
            : "#fff",
          borderColor: isDark ? "#23283B" : "#E6EFE6",
          boxShadow: isDark
            ? "0 4px 32px 0 #10121A55, 0 0px 0px 1.5px #2a9df411"
            : "0 4px 32px 0 #4A556811",
          transition: "background 0.4s, box-shadow 0.4s",
        }}
      >
        {/* Sidebar vertical */}
        <nav
          className={`w-24 sm:w-32 flex flex-col items-center py-10 gap-4 rounded-l-2xl border-r ${
            isDark
              ? "bg-[#23283B] border-[#2a9df4]"
              : "bg-[#F9FAFB] border-[#E6EFE6]"
          }`}
        >
          <span
            className={`text-xl font-bold mb-6 ${
              isDark ? "text-[#FFD87B]" : "text-[#7BC47F]"
            }`}
          >
            Mini
          </span>
          {MENU.map((item) => (
            <button
              key={item.key}
              className={`flex flex-col items-center gap-1 px-2 py-2 rounded-xl w-full transition
                ${
                  selectedMenu === item.key
                    ? isDark
                      ? "bg-[#2a9df4]/10 text-white font-bold shadow scale-105"
                      : "bg-[#E6EFE6] text-[#4A5568] font-bold shadow scale-105"
                    : isDark
                    ? "hover:bg-[#2a9df4]/10 text-[#AEE2FF]"
                    : "hover:bg-[#E6EFE6]/60 text-[#B7AFC3]"
                }
                `}
              onClick={() => setSelectedMenu(item.key)}
            >
              <span>{item.icon}</span>
              <span className="text-xs sm:text-sm">{item.label}</span>
            </button>
          ))}
        </nav>
        {/* Conteúdo principal */}
        <div className="flex-1 flex flex-col px-10 sm:px-20 py-12">
          {/* Tarefas */}
          {selectedMenu === "tasks" && (
            <>
              <h2
                className={`text-lg font-bold mb-2 flex items-center gap-2 ${
                  isDark ? "text-white" : "text-[#4A5568]"
                }`}
              >
                <svg width={20} height={20} fill="none" stroke={COLORS.olive} strokeWidth={2}><rect x="3" y="4" width="14" height="12" rx="3"/><path d="M7 8h6M7 12h4"/></svg>
                Tarefas do dia
              </h2>
              <div className="flex items-center gap-2 mb-3">
                <button
                  className={`rounded px-2 py-1 font-bold transition ${
                    isDark
                      ? "bg-[#23283B] text-white hover:bg-[#2a9df4]/10"
                      : "bg-[#E6EFE6] text-[#4A5568] hover:bg-[#b7eac7]"
                  }`}
                  onClick={() => changeDay(-1)}
                >
                  {"<"}
                </button>
                <input
                  type="date"
                  className="custom-input"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
                <button
                  className={`rounded px-2 py-1 font-bold transition ${
                    isDark
                      ? "bg-[#23283B] text-white hover:bg-[#2a9df4]/10"
                      : "bg-[#E6EFE6] text-[#4A5568] hover:bg-[#b7eac7]"
                  }`}
                  onClick={() => changeDay(1)}
                >
                  {">"}
                </button>
              </div>
              <div className="flex flex-col gap-2 mb-2">
                <input
                  className="custom-input"
                  placeholder="Título da tarefa..."
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addTask()}
                />
                <textarea
                  className="custom-input"
                  placeholder="Descrição da tarefa (opcional)..."
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  rows={2}
                  style={{ resize: "vertical" }}
                />
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-xs font-semibold ${
                        isDark ? "text-[#AEE2FF]" : "text-[#B7AFC3]"
                      }`}
                    >
                      Subtarefas
                    </span>
                    <button
                      className={`text-xs px-2 py-1 rounded transition ${
                        isDark
                          ? "bg-[#23283B] text-white hover:bg-[#2a9df4]/10"
                          : "bg-[#E6EFE6] text-[#4A5568] hover:bg-[#b7eac7]"
                      }`}
                      onClick={addSubtaskInput}
                      type="button"
                    >
                      + Adicionar subtarefa
                    </button>
                  </div>
                  {subtaskInputs.map((sub, idx) => (
                    <div key={idx} className="flex items-center gap-2 mb-1">
                      <input
                        className="custom-input flex-1"
                        placeholder={`Subtarefa ${idx + 1}`}
                        value={sub}
                        onChange={e => updateSubtaskInput(idx, e.target.value)}
                      />
                      <button
                        className="text-xs text-red-400 px-2 py-1 rounded hover:bg-red-50"
                        onClick={() => removeSubtaskInput(idx)}
                        type="button"
                        title="Remover subtarefa"
                      >
                        x
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  className={`font-bold px-3 py-1 rounded transition self-end ${
                    isDark
                      ? "bg-[#2a9df4] text-[#181B2A] hover:bg-[#2490db]"
                      : "bg-[#7BC47F] text-[#4A5568] hover:bg-[#E6EFE6]"
                  }`}
                  onClick={addTask}
                  type="button"
                >
                  Adicionar tarefa
                </button>
              </div>
              <ul className="mt-2">
                {dayTasks.length === 0 && (
                  <li className={`text-xs ${isDark ? "text-[#AEE2FF]" : "text-[#B7AFC3]"}`}>
                    Nenhuma tarefa para este dia.
                  </li>
                )}
                {dayTasks.map((t) => (
                  <li
                    key={t.id}
                    className={`flex flex-col gap-1 mb-4 group border-b pb-2 ${
                      isDark ? "border-[#2a9df4]" : "border-[#E6EFE6]"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <button
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition shadow ${
                          t.done
                            ? isDark
                              ? "bg-[#2a9df4] border-[#2a9df4]"
                              : "bg-[#7BC47F] border-[#7BC47F]"
                            : isDark
                            ? "bg-[#181B2A] border-[#2a9df4]"
                            : "bg-white border-[#7BC47F]"
                        }`}
                        onClick={() => toggleTask(t.id)}
                        aria-label="Marcar como feita"
                      >
                        {t.done && (
                          <span className="text-white font-bold">&#10003;</span>
                        )}
                      </button>
                      <span
                        className={`flex-1 font-semibold ${
                          t.done
                            ? "line-through text-[#B7AFC3]"
                            : isDark
                            ? "text-white"
                            : "text-[#4A5568]"
                        }`}
                      >
                        {t.title}
                      </span>
                      <button
                        className="text-xs text-red-300 opacity-0 group-hover:opacity-100 transition"
                        onClick={() => removeTask(t.id)}
                        aria-label="Remover tarefa"
                      >
                        remover
                      </button>
                    </div>
                    {t.description && (
                      <div
                        className={`ml-7 text-sm ${
                          isDark ? "text-[#AEE2FF]" : "text-[#4A5568bb]"
                        }`}
                      >
                        {t.description}
                      </div>
                    )}
                    {t.subtasks && t.subtasks.length > 0 && (
                      <ul className="ml-7 mt-1 flex flex-col gap-1">
                        {t.subtasks.map((s) => (
                          <li key={s.id} className="flex items-center gap-2">
                            <button
                              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition ${
                                s.done
                                  ? isDark
                                    ? "bg-[#2a9df4] border-[#2a9df4]"
                                    : "bg-[#7BC47F] border-[#7BC47F]"
                                  : isDark
                                  ? "bg-[#181B2A] border-[#2a9df4]"
                                  : "bg-white border-[#7BC47F]"
                              }`}
                              onClick={() => toggleSubtask(t.id, s.id)}
                              aria-label="Marcar subtarefa como feita"
                            >
                              {s.done && (
                                <span className="text-white text-xs font-bold">&#10003;</span>
                              )}
                            </button>
                            <span
                              className={`text-xs ${
                                s.done
                                  ? "line-through text-[#B7AFC3]"
                                  : isDark
                                  ? "text-white"
                                  : "text-[#4A5568]"
                              }`}
                            >
                              {s.text}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </>
          )}

          {/* Calendário */}
          {selectedMenu === "calendar" && (
            <div className="flex flex-col items-center">
              <h2
                className={`text-lg font-bold mb-2 flex items-center gap-2 ${
                  isDark ? "text-white" : "text-[#4A5568]"
                }`}
              >
                <svg width={20} height={20} fill="none" stroke={COLORS.olive} strokeWidth={2}><rect x="3" y="5" width="14" height="12" rx="3"/><path d="M16 3v4M8 3v4M3 9h14"/></svg>
                Calendário
              </h2>
              {renderCalendar()}
              <div className="mt-5 w-full">
                <div
                  className={`font-semibold mb-2 text-xs ${
                    isDark ? "text-[#AEE2FF]" : "text-[#B7AFC3]"
                  }`}
                >
                  Tarefas e Anotações do dia:
                </div>
                <ul>
                  {dayTasks.map((t) => (
                    <li key={t.id} className="flex items-center gap-2 mb-1">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isDark ? "bg-[#2a9df4]" : "bg-[#7BC47F]"
                        }`}
                      />
                      <span
                        className={`flex-1 ${
                          t.done
                            ? "line-through text-[#B7AFC3]"
                            : isDark
                            ? "text-white"
                            : "text-[#4A5568]"
                        }`}
                      >
                        {t.title}
                      </span>
                    </li>
                  ))}
                  {dayNotes.map((n) => (
                    <li key={n.id} className="flex items-center gap-2 mb-1">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isDark ? "bg-[#FFD87B]" : "bg-[#D6D3F0]"
                        }`}
                      />
                      <span
                        className={`flex-1 ${
                          isDark ? "text-white" : "text-[#4A5568]"
                        }`}
                      >
                        {n.text}
                      </span>
                    </li>
                  ))}
                  {dayTasks.length === 0 && dayNotes.length === 0 && (
                    <li className={`text-xs ${isDark ? "text-[#AEE2FF]" : "text-[#B7AFC3]"}`}>
                      Nada para este dia.
                    </li>
                  )}
                </ul>
              </div>
            </div>
          )}

          {/* Anotações */}
          {selectedMenu === "notes" && (
            <>
              <h2
                className={`text-lg font-bold mb-2 flex items-center gap-2 ${
                  isDark ? "text-white" : "text-[#4A5568]"
                }`}
              >
                <svg width={20} height={20} fill="none" stroke={COLORS.olive} strokeWidth={2}><rect x="4" y="4" width="12" height="12" rx="3"/><path d="M8 8h4M8 12h2"/></svg>
                Anotações do dia
              </h2>
              <div className="flex items-center gap-2 mb-3">
                <button
                  className={`rounded px-2 py-1 font-bold transition ${
                    isDark
                      ? "bg-[#23283B] text-white hover:bg-[#2a9df4]/10"
                      : "bg-[#E6EFE6] text-[#4A5568] hover:bg-[#b7eac7]"
                  }`}
                  onClick={() => changeDay(-1)}
                >
                  {"<"}
                </button>
                <input
                  type="date"
                  className="custom-input"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
                <button
                  className={`rounded px-2 py-1 font-bold transition ${
                    isDark
                      ? "bg-[#23283B] text-white hover:bg-[#2a9df4]/10"
                      : "bg-[#E6EFE6] text-[#4A5568] hover:bg-[#b7eac7]"
                  }`}
                  onClick={() => changeDay(1)}
                >
                  {">"}
                </button>
              </div>
              <div className="flex gap-2 mb-2">
                <input
                  className="custom-input flex-1"
                  placeholder="Nova anotação..."
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addNote()}
                />
                <button
                  className={`font-bold px-3 py-1 rounded transition ${
                    isDark
                      ? "bg-[#2a9df4] text-[#181B2A] hover:bg-[#2490db]"
                      : "bg-[#7BC47F] text-[#4A5568] hover:bg-[#E6EFE6]"
                  }`}
                  onClick={addNote}
                >
                  +
                </button>
              </div>
              <ul className="mt-2">
                {dayNotes.length === 0 && (
                  <li className={`text-xs ${isDark ? "text-[#AEE2FF]" : "text-[#B7AFC3]"}`}>
                    Nenhuma anotação para este dia.
                  </li>
                )}
                {dayNotes.map((n) => (
                  <li
                    key={n.id}
                    className="flex items-center gap-2 mb-1 group"
                  >
                    <span className={`flex-1 ${isDark ? "text-white" : "text-[#4A5568]"}`}>{n.text}</span>
                    <button
                      className="text-xs text-red-300 opacity-0 group-hover:opacity-100 transition"
                      onClick={() => removeNote(n.id)}
                      aria-label="Remover anotação"
                    >
                      remover
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>
      {/* Custom input styles */}
      <style jsx>{`
        .custom-input {
          background: ${isDark ? "#23283B" : "#F9FAFB"};
          border: 1.5px solid ${isDark ? "#2a9df4" : "#E6EFE6"};
          border-radius: 0.75rem;
          padding: 0.5rem 1rem;
          font-size: 1rem;
          color: ${isDark ? "#fff" : "#4A5568"};
          outline: none;
          transition: border 0.2s, box-shadow 0.2s, background 0.2s;
          box-shadow: 0 1px 4px 0 ${isDark ? "#2a9df411" : "#4A556811"};
          font-weight: 500;
          letter-spacing: 0.01em;
        }
        .custom-input:focus {
          border-color: ${isDark ? "#fff" : "#4A5568"};
          background: ${isDark ? "#181B2A" : "#fff"};
          box-shadow: 0 2px 8px 0 ${isDark ? "#2a9df422" : "#4A556822"};
        }
        .custom-input::placeholder {
          color: ${isDark ? "#AEE2FF" : "#B7AFC3"};
          opacity: 1;
          font-style: italic;
        }
      `}</style>
    </div>
  );
}