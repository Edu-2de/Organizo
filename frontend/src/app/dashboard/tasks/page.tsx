"use client";

import { useEffect, useState, FormEvent, useRef } from "react";
import Sidebar from "@/components/Sidebar";
import TaskList from "@/components/TaskList";
import { fetchTasks, createTask, deleteTask, toggleTask } from "@/api/taskApi";

type Task = {
  id: string;
  titulo: string;
  descricao?: string;
  prioridade?: string;
  data_limite?: string;
  categoria?: string;
  responsavel?: string;
  anexo?: string;
  tags?: string[];
  lembrete?: string;
  recorrente?: boolean;
  recorrencia?: string;
  concluida: boolean;
};

const prioridadeOptions = [
  { value: "baixa", label: "Baixa" },
  { value: "media", label: "Média" },
  { value: "alta", label: "Alta" },
];

const recorrenciaOptions = [
  { value: "", label: "Nenhuma" },
  { value: "diaria", label: "Diária" },
  { value: "semanal", label: "Semanal" },
  { value: "mensal", label: "Mensal" },
  { value: "anual", label: "Anual" },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inputTitulo, setInputTitulo] = useState("");
  const [inputDescricao, setInputDescricao] = useState("");
  const [inputPrioridade, setInputPrioridade] = useState("media");
  const [inputDataLimite, setInputDataLimite] = useState("");
  const [inputCategoria, setInputCategoria] = useState("");
  const [inputResponsavel, setInputResponsavel] = useState("");
  const [inputTags, setInputTags] = useState<string[]>([]);
  const [inputTagText, setInputTagText] = useState("");
  const [inputLembrete, setInputLembrete] = useState("");
  const [inputRecorrente, setInputRecorrente] = useState(false);
  const [inputRecorrencia, setInputRecorrencia] = useState("");
  const [inputAnexo, setInputAnexo] = useState<File | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [erro, setErro] = useState("");
  const tagInputRef = useRef<HTMLInputElement>(null);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token") || "";
    fetchTasks(token).then(setTasks);
    setDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
  }, []);

  // Interativo: Highlight animation para inputs focados
  function handleInputFocus(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    e.currentTarget.classList.add("input-highlight");
  }
  function handleInputBlur(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    e.currentTarget.classList.remove("input-highlight");
  }

  // Interativo: animação de sucesso ao adicionar tarefa
  function playSuccessEffect() {
    const el = document.getElementById("task-form");
    if (el) {
      el.classList.remove("animate-success");
      void el.offsetWidth; // reflow
      el.classList.add("animate-success");
    }
  }

  function handleTagAdd() {
    if (inputTagText.trim() && !inputTags.includes(inputTagText.trim())) {
      setInputTags([...inputTags, inputTagText.trim()]);
      setInputTagText("");
      setTimeout(() => tagInputRef.current?.focus(), 100);
    }
  }

  function handleTagRemove(tag: string) {
    setInputTags(inputTags.filter(t => t !== tag));
  }

  async function handleAddTask(e: FormEvent) {
    e.preventDefault();
    setErro("");
    if (!inputTitulo.trim()) {
      setErro("O título é obrigatório.");
      return;
    }
    const token = localStorage.getItem("token") || "";

    let newTask;
    if (inputAnexo) {
      const formData = new FormData();
      formData.append("titulo", inputTitulo);
      formData.append("descricao", inputDescricao);
      formData.append("prioridade", inputPrioridade);
      if (inputDataLimite) formData.append("data_limite", inputDataLimite);
      if (inputCategoria) formData.append("categoria", inputCategoria);
      if (inputResponsavel) formData.append("responsavel", inputResponsavel);
      if (inputLembrete) formData.append("lembrete", inputLembrete);
      formData.append("recorrente", inputRecorrente ? "true" : "false");
      if (inputRecorrencia) formData.append("recorrencia", inputRecorrencia);
      formData.append("anexo", inputAnexo);
      inputTags.forEach(tag => formData.append("tags", tag));
      newTask = await createTask(token, formData, true);
    } else {
      newTask = await createTask(token, {
        titulo: inputTitulo,
        descricao: inputDescricao,
        prioridade: inputPrioridade,
        data_limite: inputDataLimite ? inputDataLimite : undefined,
        categoria: inputCategoria,
        responsavel: inputResponsavel,
        tags: inputTags,
        lembrete: inputLembrete,
        recorrente: inputRecorrente,
        recorrencia: inputRecorrencia,
      });
    }
    setTasks((prev) => [newTask, ...prev]);
    setInputTitulo("");
    setInputDescricao("");
    setInputPrioridade("media");
    setInputDataLimite("");
    setInputCategoria("");
    setInputResponsavel("");
    setInputTags([]);
    setInputLembrete("");
    setInputRecorrente(false);
    setInputRecorrencia("");
    setInputAnexo(null);
    playSuccessEffect();
  }

  async function handleRemoveTask(id: string) {
    const token = localStorage.getItem("token") || "";
    await deleteTask(token, id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  async function handleToggleTask(id: string) {
    const token = localStorage.getItem("token") || "";
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const updated = await toggleTask(token, id, !task.concluida);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
  }

  return (
    <div className={`flex min-h-screen transition-colors duration-300 ${dark ? "bg-neutral-900" : "bg-gray-50"}`}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <main className="flex-1 flex flex-col items-center px-2 py-6 md:px-8 md:py-12 transition-colors duration-300">
        <div className="w-full max-w-[95rem] mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-6">
            <div className="flex items-center gap-4">
              <h1 className={`text-3xl sm:text-4xl font-black tracking-tight transition-colors duration-300 ${dark ? "text-white" : "text-gray-900"}`}>
                Tarefas
              </h1>
              <button
                aria-label="Alternar modo escuro"
                className={`ml-2 p-2 rounded-full focus:outline-none focus-visible:ring-2 ring-blue-400 
                  ${dark ? "bg-neutral-800 hover:bg-neutral-700 text-blue-200" : "bg-gray-200 hover:bg-gray-300 text-blue-600"}`}
                onClick={() => setDark((d) => !d)}
                tabIndex={0}
              >
                {dark ? "🌙" : "☀️"}
              </button>
            </div>
            <span className={`text-sm font-semibold transition-colors duration-300 ${dark ? "text-blue-200" : "text-gray-500"}`}>
              {new Date().toLocaleDateString("pt-BR", { weekday: "long", month: "long", day: "numeric" })}
            </span>
          </div>
          {/* Card do formulário */}
          <form
            id="task-form"
            className={`mb-12 border ${dark ? "border-neutral-800 bg-neutral-900/90 shadow-lg" : "border-gray-200 bg-white/95 shadow-lg"} rounded-2xl p-6 md:p-10 flex flex-col gap-8 transition-colors duration-300`}
            onSubmit={handleAddTask}
            autoComplete="off"
          >
            {/* Título e Prioridade */}
            <div className="flex flex-col md:flex-row gap-4">
              <input
                className={`input-base flex-1 ${dark ? "bg-neutral-800 text-blue-100" : "bg-white text-gray-900"}`}
                placeholder="Título da tarefa *"
                value={inputTitulo}
                onChange={e => setInputTitulo(e.target.value)}
                required
                maxLength={200}
                autoFocus
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
              <select
                className={`input-base w-full md:w-44 ${dark ? "bg-neutral-800 text-blue-100" : "bg-white text-gray-900"}`}
                value={inputPrioridade}
                onChange={e => setInputPrioridade(e.target.value)}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              >
                {prioridadeOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            {/* Descrição */}
            <textarea
              className={`input-base resize-none ${dark ? "bg-neutral-800 text-blue-100" : "bg-white text-gray-900"}`}
              placeholder="Descrição (opcional)"
              value={inputDescricao}
              onChange={e => setInputDescricao(e.target.value)}
              rows={2}
              maxLength={500}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />
            {/* Data, Categoria, Responsável */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                className={`input-base ${dark ? "bg-neutral-800 text-blue-100" : "bg-white text-gray-900"}`}
                type="date"
                value={inputDataLimite}
                onChange={e => setInputDataLimite(e.target.value)}
                placeholder="Data limite"
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
              <input
                className={`input-base ${dark ? "bg-neutral-800 text-blue-100" : "bg-white text-gray-900"}`}
                placeholder="Categoria"
                value={inputCategoria}
                onChange={e => setInputCategoria(e.target.value)}
                maxLength={100}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
              <input
                className={`input-base ${dark ? "bg-neutral-800 text-blue-100" : "bg-white text-gray-900"}`}
                placeholder="Responsável (email ou nome)"
                value={inputResponsavel}
                onChange={e => setInputResponsavel(e.target.value)}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
            </div>
            {/* Tags */}
            <div>
              <div className="flex gap-2 mb-2">
                <input
                  ref={tagInputRef}
                  className={`input-base flex-1 ${dark ? "bg-neutral-800 text-blue-100" : "bg-white text-gray-900"}`}
                  placeholder="Adicionar tag"
                  value={inputTagText}
                  onChange={e => setInputTagText(e.target.value)}
                  maxLength={50}
                  onKeyDown={e => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleTagAdd();
                    }
                  }}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
                <button
                  type="button"
                  className={`transition px-4 py-3 rounded-lg font-bold shadow-md focus:outline-none focus-visible:ring-2 ring-blue-400 active:scale-95
                    ${dark
                      ? "bg-blue-700 text-white hover:bg-blue-600"
                      : "bg-blue-50 text-blue-700 hover:bg-blue-100"}`}
                  title="Adicionar tag"
                  onClick={handleTagAdd}
                  tabIndex={0}
                >
                  <span className="text-xl">+</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {inputTags.map(tag => (
                  <span
                    key={tag}
                    className={`flex items-center gap-1 px-3 py-1 rounded-2xl border text-sm animate-fade-in
                      ${dark
                        ? "bg-blue-900/60 border-blue-800 text-blue-200"
                        : "bg-blue-50 border-blue-200 text-blue-800"}`}
                  >
                    {tag}
                    <button
                      type="button"
                      className="ml-1 text-xs text-red-500 hover:text-red-700 font-bold"
                      onClick={() => handleTagRemove(tag)}
                      title="Remover tag"
                      tabIndex={0}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
            {/* Lembrete, Recorrência, Anexo */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                className={`input-base ${dark ? "bg-neutral-800 text-blue-100" : "bg-white text-gray-900"}`}
                type="datetime-local"
                value={inputLembrete}
                onChange={e => setInputLembrete(e.target.value)}
                placeholder="Lembrete"
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={inputRecorrente}
                  onChange={e => setInputRecorrente(e.target.checked)}
                  className="accent-blue-600 scale-125"
                />
                <span className={`font-medium ${dark ? "text-blue-100" : "text-gray-700"}`}>Recorrente</span>
              </label>
              <select
                className={`input-base ${dark ? "bg-neutral-800 text-blue-100" : "bg-white text-gray-900"}`}
                value={inputRecorrencia}
                onChange={e => setInputRecorrencia(e.target.value)}
                disabled={!inputRecorrente}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              >
                {recorrenciaOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <input
                className={`input-base ${dark ? "bg-neutral-800 text-blue-100" : "bg-white text-gray-900"}`}
                type="file"
                onChange={e => setInputAnexo(e.target.files?.[0] || null)}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
            </div>
            {/* Botão de ação */}
            <div className="flex justify-end">
              <button
                type="submit"
                className={`transition-all duration-200 px-10 py-3 rounded-2xl font-bold shadow-xl flex items-center gap-2 group focus:outline-none focus-visible:ring-2 ring-blue-400
                  ${dark
                    ? "bg-blue-700 text-white hover:bg-blue-900"
                    : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"}`}
              >
                <span className="inline-block text-2xl transition-transform group-hover:scale-125">+</span>
                Adicionar Tarefa
              </button>
            </div>
            {erro && <span className="text-red-400 text-base font-medium">{erro}</span>}
          </form>
          {/* Lista de tarefas */}
          <div className={`rounded-2xl shadow-xl border ${dark ? "border-neutral-800 bg-neutral-900/80" : "border-gray-200 bg-white"} p-2 md:p-6 transition-colors duration-300`}>
            <TaskList
              tasks={tasks}
              onRemove={handleRemoveTask}
              onToggle={handleToggleTask}
              onAdd={handleAddTask}
              inputValue={inputTitulo}
              setInputValue={setInputTitulo}
              onAddSubtask={() => {}}
              onToggleSubtask={() => {}}
              onRemoveSubtask={() => {}}
              subtaskInputs={{}}
              setSubtaskInputs={() => {}}
            />
          </div>
        </div>
      </main>
      <style jsx global>{`
        .animate-fade-in { animation: fadeIn 0.3s; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px);} to { opacity: 1; transform: none;}}
        .input-base {
          border-radius: 1rem;
          border: 2px solid #e5e7eb;
          padding: 0.75rem 1.25rem;
          font-size: 1.09rem;
          outline: none;
          transition: border 0.2s, box-shadow 0.2s, background 0.2s;
          box-shadow: 0 1px 2px rgb(0 0 0 / 0.01);
        }
        .input-base:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 2px #2563eb22;
          background: #f1f5fd;
        }
        .input-base.input-highlight {
          background: #f1f5fd;
          border-color: #2563eb;
          box-shadow: 0 0 0 2px #2563eb22;
        }
        /* Efeito de sucesso ao adicionar tarefa */
        #task-form.animate-success {
          animation: taskFormSuccess 0.5s;
        }
        @keyframes taskFormSuccess {
          0% { box-shadow: 0 0 0 0 #2563eb40; }
          50% { box-shadow: 0 0 24px 8px #2563eb60; }
          100% { box-shadow: 0 0 0 0 #2563eb00; }
        }
      `}</style>
    </div>
  );
}