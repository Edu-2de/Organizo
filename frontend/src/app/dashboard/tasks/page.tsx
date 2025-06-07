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

  useEffect(() => {
    const token = localStorage.getItem("token") || "";
    fetchTasks(token).then(setTasks);
  }, []);

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
    <div className="flex min-h-screen bg-white">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <main className="flex-1 flex flex-col items-center px-2 py-6 md:px-8 md:py-10 bg-white">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-blue-900">
              Tarefas
            </h1>
            <span className="text-sm text-gray-500 font-medium">
              {new Date().toLocaleDateString("pt-BR", { weekday: "long", month: "long", day: "numeric" })}
            </span>
          </div>
          {/* Card do formulário */}
          <form
            className="mb-10 bg-white shadow-lg rounded-2xl p-4 md:p-8 flex flex-col gap-6 border border-gray-100"
            onSubmit={handleAddTask}
            autoComplete="off"
          >
            {/* Título e Prioridade */}
            <div className="flex flex-col md:flex-row gap-4">
              <input
                className="border border-gray-200 focus:border-blue-400 outline-none rounded-lg px-4 py-3 flex-1 transition placeholder-gray-400 text-base shadow-sm"
                placeholder="Título da tarefa *"
                value={inputTitulo}
                onChange={e => setInputTitulo(e.target.value)}
                required
                maxLength={200}
                autoFocus
              />
              <select
                className="border border-gray-200 focus:border-blue-400 outline-none rounded-lg px-4 py-3 w-full md:w-44 transition text-base shadow-sm"
                value={inputPrioridade}
                onChange={e => setInputPrioridade(e.target.value)}
              >
                {prioridadeOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            {/* Descrição */}
            <textarea
              className="border border-gray-200 focus:border-blue-400 outline-none rounded-lg px-4 py-3 resize-none transition placeholder-gray-400 text-base shadow-sm"
              placeholder="Descrição (opcional)"
              value={inputDescricao}
              onChange={e => setInputDescricao(e.target.value)}
              rows={2}
              maxLength={500}
            />
            {/* Data, Categoria, Responsável */}
            <div className="flex flex-col md:flex-row gap-4">
              <input
                className="border border-gray-200 focus:border-blue-400 outline-none rounded-lg px-4 py-3 flex-1 transition placeholder-gray-400 shadow-sm"
                type="date"
                value={inputDataLimite}
                onChange={e => setInputDataLimite(e.target.value)}
                placeholder="Data limite"
              />
              <input
                className="border border-gray-200 focus:border-blue-400 outline-none rounded-lg px-4 py-3 flex-1 transition placeholder-gray-400 shadow-sm"
                placeholder="Categoria"
                value={inputCategoria}
                onChange={e => setInputCategoria(e.target.value)}
                maxLength={100}
              />
              <input
                className="border border-gray-200 focus:border-blue-400 outline-none rounded-lg px-4 py-3 flex-1 transition placeholder-gray-400 shadow-sm"
                placeholder="Responsável (email ou nome)"
                value={inputResponsavel}
                onChange={e => setInputResponsavel(e.target.value)}
              />
            </div>
            {/* Tags */}
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <input
                  ref={tagInputRef}
                  className="border border-gray-200 focus:border-blue-400 outline-none rounded-lg px-4 py-3 transition placeholder-gray-400 shadow-sm"
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
                />
                <button
                  type="button"
                  className="bg-blue-50 text-blue-700 px-4 py-3 rounded-lg font-bold hover:bg-blue-100 transition active:scale-95 shadow"
                  title="Adicionar tag"
                  onClick={handleTagAdd}
                >
                  <span className="text-xl">+</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {inputTags.map(tag => (
                  <span
                    key={tag}
                    className="bg-blue-50 border border-blue-200 text-blue-700 px-3 py-1 rounded-lg flex items-center gap-1 text-sm animate-fade-in shadow-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      className="ml-1 text-xs text-red-500 hover:text-red-700 font-bold"
                      onClick={() => handleTagRemove(tag)}
                      title="Remover tag"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
            {/* Lembrete, Recorrência, Anexo */}
            <div className="flex flex-col md:flex-row gap-4">
              <input
                className="border border-gray-200 focus:border-blue-400 outline-none rounded-lg px-4 py-3 flex-1 transition placeholder-gray-400 shadow-sm"
                type="datetime-local"
                value={inputLembrete}
                onChange={e => setInputLembrete(e.target.value)}
                placeholder="Lembrete"
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={inputRecorrente}
                  onChange={e => setInputRecorrente(e.target.checked)}
                  className="accent-blue-600 scale-125"
                />
                <span className="text-gray-700 font-medium">Recorrente</span>
              </label>
              <select
                className="border border-gray-200 focus:border-blue-400 outline-none rounded-lg px-4 py-3 w-full md:w-44 transition shadow-sm"
                value={inputRecorrencia}
                onChange={e => setInputRecorrencia(e.target.value)}
                disabled={!inputRecorrente}
              >
                {recorrenciaOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <input
                className="border border-gray-200 focus:border-blue-400 outline-none rounded-lg px-4 py-3 flex-1 transition shadow-sm"
                type="file"
                onChange={e => setInputAnexo(e.target.files?.[0] || null)}
              />
            </div>
            {/* Botão de ação */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow hover:bg-blue-700 transition active:scale-95 flex items-center gap-2 group"
              >
                <span className="inline-block text-xl transition-transform group-hover:scale-125">+</span>
                Adicionar Tarefa
              </button>
            </div>
            {erro && <span className="text-red-600 text-base font-medium">{erro}</span>}
          </form>
          {/* Lista de tarefas */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-2 md:p-4">
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
        .animate-fade-in {
          animation: fadeIn 0.3s;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px);}
          to { opacity: 1; transform: none;}
        }
      `}</style>
    </div>
  );
}