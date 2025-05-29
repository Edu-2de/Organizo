"use client";
import { useState, useRef, useEffect } from "react";

// Paleta de cores
const COLORS = {
  petrol: "#264653",
  olive: "#A9C5A0",
  gold: "#E9C46A",
  beige: "#F6F5F2",
  graphite: "#22223B",
  deepPurple: "#523A68",
};

type Task = {
  id: string;
  text: string;
  date: string;
  done: boolean;
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
      <svg width={22} height={22} fill="none" stroke={COLORS.gold} strokeWidth={2}><rect x="3" y="4" width="16" height="14" rx="3"/><path d="M7 8h6M7 12h4"/></svg>
    ),
  },
  {
    key: "calendar",
    label: "Calendário",
    icon: (
      <svg width={22} height={22} fill="none" stroke={COLORS.gold} strokeWidth={2}><rect x="3" y="5" width="16" height="14" rx="3"/><path d="M16 3v4M8 3v4M3 9h16"/></svg>
    ),
  },
  {
    key: "notes",
    label: "Anotações",
    icon: (
      <svg width={22} height={22} fill="none" stroke={COLORS.gold} strokeWidth={2}><rect x="4" y="4" width="14" height="14" rx="3"/><path d="M8 8h6M8 12h4"/></svg>
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
          direction === "left" ? "-translate-x-16" : "translate-x-16"
        );
      }
    };
    el.classList.add(
      "opacity-0",
      direction === "left" ? "-translate-x-16" : "translate-x-16"
    );
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [ref, direction]);
}

export default function MiniDashboard() {
  const [selectedMenu, setSelectedMenu] = useState("tasks");
  const [selectedDate, setSelectedDate] = useState(getToday());
  const [tasks, setTasks] = useState<Task[]>(() => load("tasks", []));
  const [notes, setNotes] = useState<Note[]>(() => load("notes", []));
  const [taskInput, setTaskInput] = useState("");
  const [noteInput, setNoteInput] = useState("");

  // Animation refs
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  useScrollFade(leftRef, "left");
  useScrollFade(rightRef, "right");

  // Persistência local
  function updateTasks(newTasks: Task[]) {
    setTasks(newTasks);
    save("tasks", newTasks);
  }
  function updateNotes(newNotes: Note[]) {
    setNotes(newNotes);
    save("notes", newNotes);
  }

  function addTask() {
    if (!taskInput.trim()) return;
    const newTask: Task = {
      id: Math.random().toString(36).slice(2),
      text: taskInput,
      date: selectedDate,
      done: false,
    };
    updateTasks([...tasks, newTask]);
    setTaskInput("");
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
            className="rounded-full px-2 py-1 bg-[#A9C5A0]/30 text-[#264653] font-bold hover:bg-[#A9C5A0]/60 transition"
            onClick={() => {
              const prev = new Date(year, month - 1, 1);
              setSelectedDate(prev.toISOString().slice(0, 10));
            }}
          >
            {"<"}
          </button>
          <span className="font-semibold text-[#264653]">
            {d.toLocaleString("pt-BR", { month: "long", year: "numeric" })}
          </span>
          <button
            className="rounded-full px-2 py-1 bg-[#A9C5A0]/30 text-[#264653] font-bold hover:bg-[#A9C5A0]/60 transition"
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
            <div key={i} className="text-center font-bold text-[#A9C5A0]">
              {w}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
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
              <button
                key={dateStr}
                className={`aspect-square rounded-lg flex flex-col items-center justify-center border transition
                  ${
                    isSelected
                      ? "bg-[#A9C5A0]/80 text-[#22223B] border-[#A9C5A0] font-bold shadow"
                      : "bg-white text-[#264653] border-[#F6F5F2]"
                  }
                  ${isToday && !isSelected ? "ring-2 ring-[#E9C46A]" : ""}
                  hover:bg-[#A9C5A0]/20 relative`}
                onClick={() => setSelectedDate(dateStr)}
              >
                {parseInt(dateStr.slice(-2))}
                <span className="flex gap-0.5 absolute bottom-1 left-1/2 -translate-x-1/2">
                  {hasTask && (
                    <span className="w-1 h-1 rounded-full bg-[#E9C46A]"></span>
                  )}
                  {hasNote && (
                    <span className="w-1 h-1 rounded-full bg-[#523A68]"></span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto my-20 px-2 flex flex-col md:flex-row items-stretch gap-0 md:gap-12">
      {/* Lado esquerdo: Demonstração */}
      <aside
        ref={leftRef}
        className="w-full md:w-[520px] flex flex-col justify-center items-start md:items-start py-20 px-12 bg-[#F6F5F2] rounded-3xl shadow-none border border-[#F6F5F2] mb-8 md:mb-0 transition-all duration-700 opacity-0 -translate-x-16"
      >
        <h1 className="text-5xl font-extrabold text-[#264653] mb-6 tracking-tight leading-tight">
          Demonstração
        </h1>
        <p className="text-xl text-[#22223B] mb-8 leading-relaxed max-w-lg">
          Experimente o <span className="font-bold text-[#E9C46A]">Organizo</span> de forma visual.<br />
          Crie tarefas, anotações e navegue pelo calendário.<br />
          <span className="text-[#523A68] font-semibold">Tudo salvo localmente, só para você testar!</span>
        </p>
        <ul className="text-lg text-[#523A68] space-y-3 mb-10">
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#E9C46A] inline-block" />
            Tarefas do dia
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#523A68] inline-block" />
            Anotações rápidas
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#A9C5A0] inline-block" />
            Calendário mensal
          </li>
        </ul>
        <div className="text-base text-[#26465399] italic">
          Experiência visual, sem cadastro.
        </div>
      </aside>

      {/* Lado direito: Dashboard funcional */}
      <section
        ref={rightRef}
        className="flex-1 flex bg-[#fff] rounded-3xl shadow-xl border border-[#F6F5F2] min-h-[540px] relative overflow-hidden transition-all duration-700 opacity-0 translate-x-16"
      >
        {/* Sidebar vertical */}
        <nav className="w-24 sm:w-32 bg-[#264653] flex flex-col items-center py-10 gap-4 rounded-l-3xl">
          <div className="mb-8 flex flex-col items-center">
            <span className="text-2xl font-extrabold text-[#E9C46A] tracking-tight drop-shadow">Mini</span>
            <span className="block text-lg font-bold text-[#fff] -mt-1 drop-shadow">Dashboard</span>
          </div>
          {MENU.map((item) => (
            <button
              key={item.key}
              className={`flex flex-col items-center gap-1 px-2 py-3 rounded-xl w-full transition
                ${
                  selectedMenu === item.key
                    ? "bg-[#A9C5A0] text-[#264653] font-bold shadow scale-105"
                    : "hover:bg-[#A9C5A0]/30 text-[#fff]"
                }
                `}
              onClick={() => setSelectedMenu(item.key)}
            >
              <span>{item.icon}</span>
              <span className="text-xs sm:text-sm">{item.label}</span>
            </button>
          ))}
          <div className="flex-1" />
          <div className="text-[11px] text-[#A9C5A0] mt-8 italic">Local</div>
        </nav>
        {/* Conteúdo principal */}
        <div className="flex-1 flex flex-col px-6 sm:px-10 py-8">
          {/* Tarefas */}
          {selectedMenu === "tasks" && (
            <>
              <h2 className="text-xl font-extrabold text-[#264653] mb-2 flex items-center gap-2">
                <svg width={22} height={22} fill="none" stroke={COLORS.gold} strokeWidth={2}><rect x="3" y="4" width="16" height="14" rx="3"/><path d="M7 8h6M7 12h4"/></svg>
                Tarefas do dia
              </h2>
              <div className="flex items-center gap-2 mb-4">
                <button
                  className="rounded-full px-3 py-1 bg-[#A9C5A0]/30 text-[#264653] font-bold hover:bg-[#A9C5A0]/60 transition"
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
                  className="rounded-full px-3 py-1 bg-[#A9C5A0]/30 text-[#264653] font-bold hover:bg-[#A9C5A0]/60 transition"
                  onClick={() => changeDay(1)}
                >
                  {">"}
                </button>
                <span className="ml-2 text-xs text-[#26465399]">
                  Escolha o dia
                </span>
              </div>
              <div className="flex gap-2 mb-2">
                <input
                  className="custom-input flex-1"
                  placeholder="Nova tarefa..."
                  value={taskInput}
                  onChange={(e) => setTaskInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addTask()}
                />
                <button
                  className="bg-[#E9C46A] text-[#264653] font-bold px-4 py-1 rounded shadow hover:bg-[#A9C5A0]/80 transition"
                  onClick={addTask}
                >
                  Adicionar
                </button>
              </div>
              <ul className="mt-2">
                {dayTasks.length === 0 && (
                  <li className="text-sm text-[#26465399]">
                    Nenhuma tarefa para este dia.
                  </li>
                )}
                {dayTasks.map((t) => (
                  <li
                    key={t.id}
                    className="flex items-center gap-2 mb-1 group"
                  >
                    <button
                      className={`w-5 h-5 rounded-full border-2 border-[#E9C46A] flex items-center justify-center transition ${
                        t.done ? "bg-[#E9C46A]" : "bg-white"
                      } shadow`}
                      onClick={() => toggleTask(t.id)}
                      aria-label="Marcar como feita"
                    >
                      {t.done && (
                        <span className="text-white font-bold">&#10003;</span>
                      )}
                    </button>
                    <span
                      className={`flex-1 ${
                        t.done
                          ? "line-through text-[#26465366]"
                          : "text-[#264653]"
                      }`}
                    >
                      {t.text}
                    </span>
                    <button
                      className="text-xs text-red-400 opacity-0 group-hover:opacity-100 transition"
                      onClick={() => removeTask(t.id)}
                      aria-label="Remover tarefa"
                    >
                      remover
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}

          {/* Calendário */}
          {selectedMenu === "calendar" && (
            <div className="flex flex-col items-center">
              <h2 className="text-xl font-extrabold text-[#264653] mb-2 flex items-center gap-2">
                <svg width={22} height={22} fill="none" stroke={COLORS.gold} strokeWidth={2}><rect x="3" y="5" width="16" height="14" rx="3"/><path d="M16 3v4M8 3v4M3 9h16"/></svg>
                Calendário
              </h2>
              {renderCalendar()}
              <div className="mt-6 w-full">
                <div className="text-[#A9C5A0] font-semibold mb-2">
                  Tarefas e Anotações do dia selecionado:
                </div>
                <ul>
                  {dayTasks.map((t) => (
                    <li
                      key={t.id}
                      className="flex items-center gap-2 mb-1"
                    >
                      <span className={`w-2 h-2 rounded-full bg-[#E9C46A]`} />
                      <span
                        className={`flex-1 ${
                          t.done
                            ? "line-through text-[#26465366]"
                            : "text-[#264653]"
                        }`}
                      >
                        {t.text}
                      </span>
                    </li>
                  ))}
                  {dayNotes.map((n) => (
                    <li
                      key={n.id}
                      className="flex items-center gap-2 mb-1"
                    >
                      <span className="w-2 h-2 rounded-full bg-[#523A68]" />
                      <span className="flex-1 text-[#264653]">
                        {n.text}
                      </span>
                    </li>
                  ))}
                  {dayTasks.length === 0 && dayNotes.length === 0 && (
                    <li className="text-sm text-[#26465399]">
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
              <h2 className="text-xl font-extrabold text-[#264653] mb-2 flex items-center gap-2">
                <svg width={22} height={22} fill="none" stroke={COLORS.gold} strokeWidth={2}><rect x="4" y="4" width="14" height="14" rx="3"/><path d="M8 8h6M8 12h4"/></svg>
                Anotações do dia
              </h2>
              <div className="flex items-center gap-2 mb-4">
                <button
                  className="rounded-full px-3 py-1 bg-[#A9C5A0]/30 text-[#264653] font-bold hover:bg-[#A9C5A0]/60 transition"
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
                  className="rounded-full px-3 py-1 bg-[#A9C5A0]/30 text-[#264653] font-bold hover:bg-[#A9C5A0]/60 transition"
                  onClick={() => changeDay(1)}
                >
                  {">"}
                </button>
                <span className="ml-2 text-xs text-[#26465399]">
                  Escolha o dia
                </span>
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
                  className="bg-[#E9C46A] text-[#264653] font-bold px-4 py-1 rounded shadow hover:bg-[#A9C5A0]/80 transition"
                  onClick={addNote}
                >
                  Adicionar
                </button>
              </div>
              <ul className="mt-2">
                {dayNotes.length === 0 && (
                  <li className="text-sm text-[#26465399]">
                    Nenhuma anotação para este dia.
                  </li>
                )}
                {dayNotes.map((n) => (
                  <li
                    key={n.id}
                    className="flex items-center gap-2 mb-1 group"
                  >
                    <span className="flex-1 text-[#264653]">{n.text}</span>
                    <button
                      className="text-xs text-red-400 opacity-0 group-hover:opacity-100 transition"
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
          background: #F6F5F2;
          border: 1.5px solid #A9C5A0;
          border-radius: 0.75rem;
          padding: 0.5rem 1rem;
          font-size: 1rem;
          color: #264653;
          outline: none;
          transition: border 0.2s, box-shadow 0.2s, background 0.2s;
          box-shadow: 0 1px 4px 0 #26465311;
          font-weight: 500;
          letter-spacing: 0.01em;
        }
        .custom-input:focus {
          border-color: #264653;
          background: #fff;
          box-shadow: 0 2px 8px 0 #26465322;
        }
        .custom-input::placeholder {
          color: #26465366;
          opacity: 1;
          font-style: italic;
        }
      `}</style>
    </div>
  );
}