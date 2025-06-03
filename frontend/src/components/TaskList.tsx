"use client";
import React, { useRef } from "react";
import COLORS from "@/components/colors";
import { useTheme } from "@/components/ThemeContext";

const TASK_ICONS = {
  trash: (
    <svg width={18} height={18} fill="none" viewBox="0 0 20 20">
      <rect x="4.5" y="6" width="11" height="9" rx="2" stroke="#155263" strokeWidth="1.6"/>
      <path d="M7 9v4M10 9v4M13 9v4" stroke="#155263" strokeWidth="1.4" strokeLinecap="round"/>
      <rect x="7" y="3.5" width="6" height="2" rx="1" fill="#97C1A9" />
    </svg>
  ),
  plus: (
    <svg width={18} height={18} fill="none" viewBox="0 0 20 20">
      <circle cx={10} cy={10} r={9} fill="#97C1A9" />
      <path d="M10 7v6M7 10h6" stroke="#155263" strokeWidth={2} strokeLinecap="round"/>
    </svg>
  ),
};

type SubTaskType = { id: number; text: string; done: boolean };
type TaskType = {
  id: number;
  text: string;
  done: boolean;
  completedAt?: string;
  subtasks?: SubTaskType[];
};

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
  const themeCtx = useTheme?.();
  const themeKey = themeCtx?.themeKey || "classic";

  // Paletas e estilos por tema
  const themeStyles = {
    classic: {
      inputBg: "#F6F5F2",
      inputBorder: "#e2e3e7",
      inputText: COLORS.petrol,
      subtaskBg: "#f8f8f4",
      subtaskBorder: "#e2e3e7",
      subtaskShadow: "0 1px 4px #E9C46A08",
      subtaskDone: COLORS.olive,
      subtaskActive: COLORS.gold,
      subtaskText: COLORS.petrol,
      subtaskTextDone: COLORS.olive,
      subtaskRemoveHover: "#FFD6E033",
      emptyText: "#264653",
    },
    sunset: {
      inputBg: "#FFF5E1",
      inputBorder: "#FFD452",
      inputText: "#A4508B",
      subtaskBg: "#FFF5E1",
      subtaskBorder: "#FFD452",
      subtaskShadow: "0 2px 8px #FFD45222",
      subtaskDone: "#F76D77",
      subtaskActive: "#FFD452",
      subtaskText: "#A4508B",
      subtaskTextDone: "#F76D77",
      subtaskRemoveHover: "#FFD45233",
      emptyText: "#A4508B",
    },
    ocean: {
      inputBg: "#E0FBFC",
      inputBorder: "#97C1A9",
      inputText: "#155263",
      subtaskBg: "#E0FBFC",
      subtaskBorder: "#97C1A9",
      subtaskShadow: "0 4px 18px #247BA022",
      subtaskDone: "#247BA0",
      subtaskActive: "#97C1A9",
      subtaskText: "#155263",
      subtaskTextDone: "#247BA0",
      subtaskRemoveHover: "#B6E6F533",
      emptyText: "#155263",
    }
  };

  const style = themeStyles[themeKey];

  const inputRef = useRef<HTMLInputElement>(null);
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      onAdd();
    }
  }
  return (
    <div className={`ml-5 sm:ml-8 my-1`}>
      <form
        className={`flex gap-2 mb-1 ${themeKey === "ocean" ? "bg-[#E0FBFC] rounded-xl p-2 border border-[#97C1A9]" : ""}`}
        onSubmit={e => {
          e.preventDefault();
          onAdd();
        }}
      >
        <input
          ref={inputRef}
          className={`rounded-lg border px-2 py-1 text-xs focus:outline-none transition w-full placeholder:opacity-60 ${themeKey === "ocean" ? "bg-[#F6F8FA] border-[#97C1A9] text-[#155263] font-mono" : ""}`}
          placeholder="Nova sub-tarefa..."
          type="text"
          value={value}
          maxLength={60}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            background: style.inputBg,
            color: style.inputText,
            borderColor: style.inputBorder,
          }}
        />
        <button
          type="submit"
          className={`flex items-center px-2 py-1 rounded-lg font-bold shadow-sm border transition ${themeKey === "ocean" ? "bg-[#97C1A9] text-[#155263] border-[#97C1A9] hover:bg-[#B6E6F5]" : ""}`}
          style={{
            color: style.subtaskActive,
            borderColor: style.inputBorder,
            background: themeKey === "ocean" ? "#97C1A9" : "#fff",
          }}
          aria-label="Adicionar sub-tarefa"
          disabled={value.trim().length === 0}
        >
          {themeKey === "ocean" ? (
            <svg width={18} height={18} fill="none" viewBox="0 0 20 20">
              <circle cx={10} cy={10} r={9} fill="#B6E6F5" />
              <path d="M10 7v6M7 10h6" stroke="#155263" strokeWidth={2} strokeLinecap="round"/>
            </svg>
          ) : TASK_ICONS.plus}
        </button>
      </form>
      <ul className="flex flex-col gap-0.5">
        {subtasks.length === 0 && (
          <li className="text-xs" style={{ color: style.emptyText, opacity: 0.5 }}>Sem sub-tarefas.</li>
        )}
        {subtasks.map((st) => (
          <li
            key={st.id}
            className={`
              flex items-center px-2 transition-all duration-400 group
              ${st.done ? "opacity-70" : ""}
              ${themeKey === "sunset" ? "rounded-2xl border-0" : ""}
              ${themeKey === "ocean" ? "rounded-xl border-2 border-[#97C1A9] bg-[#E0FBFC] shadow-md" : "rounded-xl"}
            `}
            style={{
              fontSize: "0.97rem",
              minHeight: 0,
              marginTop: "2px",
              background: style.subtaskBg,
              boxShadow: style.subtaskShadow,
              border: themeKey === "ocean" ? undefined : `1px solid ${style.subtaskBorder}`,
              padding: "3px 0",
            }}
          >
            <button
              className={`
                flex items-center justify-center w-6 h-6 mr-2 transition
                ${themeKey === "sunset" ? "rounded-full" : ""}
                ${themeKey === "ocean" ? "rounded-md border-2 border-[#97C1A9] bg-[#B6E6F5]" : "rounded-full border-2"}
                hover:scale-105
              `}
              style={{
                borderColor: st.done ? style.subtaskDone : style.subtaskActive,
                background: st.done ? style.subtaskDone : style.subtaskBg,
              }}
              aria-label={st.done ? "Desmarcar sub-tarefa" : "Concluir sub-tarefa"}
              onClick={() => onToggle(st.id)}
            >
              {st.done ? (
                <svg width={14} height={14} fill="none" viewBox="0 0 20 20">
                  <circle cx={10} cy={10} r={8} fill={style.subtaskDone} />
                  <path d="M6 11l3 3 5-5" stroke={style.subtaskText} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg width={14} height={14} fill="none" viewBox="0 0 20 20">
                  <circle cx={10} cy={10} r={8} fill={themeKey === "ocean" ? "#E0FBFC" : style.subtaskBg} stroke={style.subtaskActive} strokeWidth={1.3}/>
                </svg>
              )}
            </button>
            <span className={`flex-1 text-xs font-medium truncate ${st.done ? "line-through opacity-60" : ""} ${themeKey === "ocean" ? "font-mono" : ""}`}
              style={{
                color: st.done ? style.subtaskTextDone : style.subtaskText,
                fontFamily: themeKey === "ocean" ? "monospace, 'Inter', sans-serif" : undefined,
                letterSpacing: themeKey === "ocean" ? "0.01em" : undefined,
              }}
            >{st.text}</span>
            <button
              className="p-1 rounded ml-1 transition"
              style={{
                background: "transparent",
              }}
              onMouseOver={e => { (e.currentTarget as HTMLElement).style.background = style.subtaskRemoveHover; }}
              onMouseOut={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              onClick={() => onRemove(st.id)}
              title="Excluir sub-tarefa"
            >
              {themeKey === "ocean" ? (
                <svg width={18} height={18} fill="none" viewBox="0 0 20 20">
                  <rect x="4.5" y="6" width="11" height="9" rx="2" stroke="#155263" strokeWidth="1.6"/>
                  <path d="M7 9v4M10 9v4M13 9v4" stroke="#155263" strokeWidth="1.4" strokeLinecap="round"/>
                  <rect x="7" y="3.5" width="6" height="2" rx="1" fill="#B6E6F5" />
                </svg>
              ) : TASK_ICONS.trash}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function TaskList({
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
  const themeCtx = useTheme?.();
  const themeKey = themeCtx?.themeKey || "classic";

  // Paletas e estilos por tema
  const themeStyles = {
    classic: {
      inputBg: "#F6F5F2",
      inputBorder: "#e2e3e7",
      inputText: COLORS.petrol,
      taskBg: "#fff",
      taskBorder: "#e2e3e7",
      taskShadow: "0 1px 6px #E9C46A11",
      taskDone: COLORS.olive,
      taskActive: COLORS.gold,
      taskText: COLORS.petrol,
      taskTextDone: COLORS.olive,
      taskRemoveHover: "#FFD6E033",
      emptyText: "#264653",
    },
    sunset: {
      inputBg: "#FFF5E1",
      inputBorder: "#FFD452",
      inputText: "#A4508B",
      taskBg: "#FFF5E1",
      taskBorder: "#FFD452",
      taskShadow: "0 2px 12px #FFD45222",
      taskDone: "#F76D77",
      taskActive: "#FFD452",
      taskText: "#A4508B",
      taskTextDone: "#F76D77",
      taskRemoveHover: "#FFD45233",
      emptyText: "#A4508B",
    },
    ocean: {
      inputBg: "#E0FBFC",
      inputBorder: "#97C1A9",
      inputText: "#155263",
      taskBg: "#E0FBFC",
      taskBorder: "#97C1A9",
      taskShadow: "0 4px 24px #247BA022",
      taskDone: "#247BA0",
      taskActive: "#97C1A9",
      taskText: "#155263",
      taskTextDone: "#247BA0",
      taskRemoveHover: "#B6E6F533",
      emptyText: "#155263",
    }
  };

  const style = themeStyles[themeKey];

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
        className={`flex gap-2 mb-2 ${themeKey === "ocean" ? "bg-[#E0FBFC] rounded-xl p-3 border border-[#97C1A9]" : ""}`}
        onSubmit={e => {
          e.preventDefault();
          onAdd();
        }}
      >
        <input
          ref={inputRef}
          className={`flex-1 rounded-lg border px-3 py-2 text-sm focus:outline-none transition placeholder:opacity-60 ${themeKey === "ocean" ? "bg-[#F6F8FA] border-[#97C1A9] text-[#155263] font-mono" : ""}`}
          placeholder="Nova tarefa..."
          type="text"
          value={inputValue}
          maxLength={80}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            background: style.inputBg,
            color: style.inputText,
            borderColor: style.inputBorder,
          }}
        />
        <button
          type="submit"
          className={`flex items-center px-3 py-2 rounded-lg font-bold shadow-sm border transition text-base ${themeKey === "ocean" ? "bg-[#97C1A9] text-[#155263] border-[#97C1A9] hover:bg-[#B6E6F5]" : ""}`}
          style={{
            color: style.taskActive,
            borderColor: style.inputBorder,
            background: themeKey === "ocean" ? "#97C1A9" : "#fff",
          }}
          aria-label="Adicionar tarefa"
          disabled={inputValue.trim().length === 0}
        >
          {themeKey === "ocean" ? (
            <svg width={18} height={18} fill="none" viewBox="0 0 20 20">
              <circle cx={10} cy={10} r={9} fill="#B6E6F5" />
              <path d="M10 7v6M7 10h6" stroke="#155263" strokeWidth={2} strokeLinecap="round"/>
            </svg>
          ) : TASK_ICONS.plus}
        </button>
      </form>
      <ul className="flex flex-col gap-1">
        {tasks.length === 0 && (
          <li className="text-center py-8" style={{ color: style.emptyText, opacity: 0.6 }}>Sem tarefas.</li>
        )}
        {tasks.map((t) => (
          <li
            key={t.id}
            className={`
              flex flex-col group transition-all duration-400
              ${themeKey === "sunset" ? "rounded-2xl border-0" : ""}
              ${themeKey === "ocean" ? "rounded-xl border-2 border-[#97C1A9] bg-[#E0FBFC] shadow-md" : "rounded-xl"}
              ${themeKey === "classic" ? "rounded-xl" : ""}
              mb-1
              ${t.done ? "opacity-70" : ""}
            `}
            style={{
              transition: "all 0.4s cubic-bezier(.4,1.3,.6,1)",
              overflow: "hidden",
              minHeight: 0,
              background: style.taskBg,
              boxShadow: style.taskShadow,
              border: themeKey === "ocean" ? undefined : `1.5px solid ${style.taskBorder}`,
            }}
          >
            <div className="flex items-center">
              <button
                className={`
                  flex items-center justify-center w-7 h-7 mr-3 transition
                  ${themeKey === "sunset" ? "rounded-full" : ""}
                  ${themeKey === "ocean" ? "rounded-md border-2 border-[#97C1A9] bg-[#B6E6F5]" : "rounded-full border-2"}
                  hover:scale-105
                `}
                style={{
                  borderColor: t.done ? style.taskDone : style.taskActive,
                  background: t.done ? style.taskDone : style.taskBg,
                  boxShadow: t.done
                    ? "0 2px 8px #B6E6F533"
                    : "0 2px 8px #247BA022",
                }}
                aria-label={t.done ? "Desmarcar tarefa" : "Concluir tarefa"}
                onClick={() => onToggle(t.id)}
              >
                <span className="transition-all duration-200">
                  {t.done ? (
                    <svg width={18} height={18} fill="none" viewBox="0 0 20 20">
                      <circle cx={10} cy={10} r={9} fill={style.taskDone} />
                      <path d="M6 11l3 3 5-5" stroke={style.taskText} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <svg width={18} height={18} fill="none" viewBox="0 0 20 20">
                      <circle cx={10} cy={10} r={9} fill={themeKey === "ocean" ? "#E0FBFC" : style.taskBg} stroke={style.taskActive} strokeWidth={1.3}/>
                    </svg>
                  )}
                </span>
              </button>
              <span className={`
                flex-1 text-base font-medium truncate
                ${t.done ? "line-through opacity-60" : ""}
                transition-all duration-300
                ${themeKey === "ocean" ? "font-mono" : ""}
              `}
                style={{
                  color: t.done ? style.taskTextDone : style.taskText,
                  fontSize: "1rem",
                  letterSpacing: themeKey === "ocean" ? "0.01em" : "0.01em",
                  fontFamily: themeKey === "ocean" ? "monospace, 'Inter', sans-serif" : undefined,
                  paddingTop: "3px",
                  paddingBottom: "2px",
                }}>
                {t.text}
              </span>
              <button
                className="p-1 rounded ml-2 transition"
                style={{
                  background: "transparent",
                }}
                onMouseOver={e => { (e.currentTarget as HTMLElement).style.background = style.taskRemoveHover; }}
                onMouseOut={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                onClick={() => onRemove(t.id)}
                title="Excluir tarefa"
              >
                {themeKey === "ocean" ? (
                  <svg width={18} height={18} fill="none" viewBox="0 0 20 20">
                    <rect x="4.5" y="6" width="11" height="9" rx="2" stroke="#155263" strokeWidth="1.6"/>
                    <path d="M7 9v4M10 9v4M13 9v4" stroke="#155263" strokeWidth="1.4" strokeLinecap="round"/>
                    <rect x="7" y="3.5" width="6" height="2" rx="1" fill="#B6E6F5" />
                  </svg>
                ) : TASK_ICONS.trash}
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