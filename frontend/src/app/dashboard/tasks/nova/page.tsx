"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { criarTarefa } from "@/api/taskApi";
import Sidebar from "@/components/Sidebar";
import { ChevronDownIcon, ChevronUpIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function NovaTarefaPage() {
  const [form, setForm] = useState({
    titulo: "",
    descricao: "",
    prioridade: "media",
    categoria: "",
    data_limite: "",
  });
  const [subtarefas, setSubtarefas] = useState<string[]>([]);
  const [novaSubtarefa, setNovaSubtarefa] = useState("");
  const [showSubtarefas, setShowSubtarefas] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddSubtarefa = () => {
    if (novaSubtarefa.trim()) {
      setSubtarefas([...subtarefas, novaSubtarefa.trim()]);
      setNovaSubtarefa("");
    }
  };

  const handleRemoveSubtarefa = (idx: number) => {
    setSubtarefas(subtarefas.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErro(null);
    try {
      await criarTarefa({ ...form, subtarefas });
      router.push("/dashboard/tasks");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      try {
        const obj = JSON.parse(err.message);
        setErro(
          Object.entries(obj)
            .map(([campo, msg]) => `${campo}: ${Array.isArray(msg) ? msg.join(", ") : msg}`)
            .join("\n")
        );
      } catch {
        setErro("Erro ao criar tarefa.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen" style={{ background: "#F6F5F2" }}>
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <main className={`flex-1 px-4 md:px-8 py-8 transition-all duration-300 ${sidebarCollapsed ? "ml-20" : "ml-72"}`}>
        <div className="max-w-xl mx-auto bg-white rounded-xl shadow border border-[#A9C5A0] p-8">
          <h1 className="text-3xl font-bold mb-6 flex items-center gap-2" style={{ color: "#264653" }}>
            Nova Tarefa
            <span className="ml-2 text-[#A9C5A0]"><PlusIcon className="w-7 h-7" /></span>
          </h1>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block font-semibold mb-1" style={{ color: "#264653" }}>Título</label>
              <input
                type="text"
                name="titulo"
                value={form.titulo}
                onChange={handleChange}
                required
                className="w-full border border-[#A9C5A0] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#A9C5A0] bg-[#F6F5F2] text-[#264653] transition"
                placeholder="Ex: Estudar React"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1" style={{ color: "#264653" }}>Descrição</label>
              <textarea
                name="descricao"
                value={form.descricao}
                onChange={handleChange}
                rows={3}
                className="w-full border border-[#A9C5A0] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#A9C5A0] bg-[#F6F5F2] text-[#264653] transition"
                placeholder="Detalhe sua tarefa..."
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block font-semibold mb-1" style={{ color: "#264653" }}>Prioridade</label>
                <select
                  name="prioridade"
                  value={form.prioridade}
                  onChange={handleChange}
                  className="w-full border border-[#A9C5A0] rounded px-3 py-2 bg-[#F6F5F2] text-[#264653]"
                >
                  <option value="baixa">Baixa</option>
                  <option value="media">Média</option>
                  <option value="alta">Alta</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block font-semibold mb-1" style={{ color: "#264653" }}>Categoria</label>
                <input
                  type="text"
                  name="categoria"
                  value={form.categoria}
                  onChange={handleChange}
                  className="w-full border border-[#A9C5A0] rounded px-3 py-2 bg-[#F6F5F2] text-[#264653]"
                  placeholder="Ex: Estudos"
                />
              </div>
            </div>
            <div>
              <label className="block font-semibold mb-1" style={{ color: "#264653" }}>Data Limite</label>
              <input
                type="datetime-local"
                name="data_limite"
                value={form.data_limite}
                onChange={handleChange}
                className="w-full border border-[#A9C5A0] rounded px-3 py-2 bg-[#F6F5F2] text-[#264653]"
              />
            </div>
            {/* Subtarefas */}
            <div className="bg-[#F6F5F2] rounded-xl p-4 border border-[#A9C5A0]">
              <button
                type="button"
                className="flex items-center gap-2 text-[#264653] font-semibold mb-2 focus:outline-none"
                onClick={() => setShowSubtarefas((v) => !v)}
                aria-expanded={showSubtarefas}
              >
                {showSubtarefas ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
                {showSubtarefas ? "Ocultar Subtarefas" : "Adicionar Subtarefas"}
              </button>
              <div className={`transition-all duration-300 overflow-hidden ${showSubtarefas ? "max-h-96" : "max-h-0"}`}>
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    value={novaSubtarefa}
                    onChange={e => setNovaSubtarefa(e.target.value)}
                    className="flex-1 border border-[#A9C5A0] rounded px-3 py-2 bg-white text-[#264653]"
                    placeholder="Nova subtarefa..."
                    onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); handleAddSubtarefa(); } }}
                  />
                  <button
                    type="button"
                    className="px-3 py-2 rounded border font-medium flex items-center gap-1 transition bg-[#A9C5A0] text-[#264653] border-[#A9C5A0] hover:bg-[#E9C46A] hover:border-[#E9C46A]"
                    onClick={handleAddSubtarefa}
                  >
                    <PlusIcon className="w-5 h-5" />
                  </button>
                </div>
                <ul className="mt-3 space-y-2">
                  {subtarefas.map((sub, idx) => (
                    <li key={idx} className="flex items-center justify-between bg-white border border-[#A9C5A0] rounded px-3 py-2">
                      <span className="text-[#264653]">{sub}</span>
                      <button
                        type="button"
                        className="text-[#E9C46A] hover:text-[#264653] transition"
                        onClick={() => handleRemoveSubtarefa(idx)}
                        title="Remover"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </li>
                  ))}
                  {subtarefas.length === 0 && (
                    <li className="text-gray-400 italic text-sm">Nenhuma subtarefa adicionada.</li>
                  )}
                </ul>
              </div>
            </div>
            {/* Fim subtarefas */}
            {erro && (
              <div className="text-red-500 break-all whitespace-pre-wrap border border-red-200 bg-red-50 rounded p-2">
                {erro}
              </div>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                className="px-4 py-2 rounded border border-[#A9C5A0] bg-[#F6F5F2] text-[#264653] hover:bg-[#A9C5A0] hover:text-[#264653] transition"
                onClick={() => router.push("/dashboard/tasks")}
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded border border-[#A9C5A0] bg-[#A9C5A0] text-[#264653] font-semibold hover:bg-[#E9C46A] hover:border-[#E9C46A] transition"
                disabled={loading}
              >
                {loading ? "Salvando..." : "Criar"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}