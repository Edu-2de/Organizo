"use client";
import React, { useRef } from "react";
import COLORS from "@/components/colors";

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