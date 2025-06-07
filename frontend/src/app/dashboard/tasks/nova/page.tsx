"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { criarTarefa } from "@/api/taskApi";
import Sidebar from "@/components/Sidebar";

export default function NovaTarefaPage() {
  const [form, setForm] = useState({
    titulo: "",
    descricao: "",
    prioridade: "media",
    categoria: "",
    data_limite: "",
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErro(null);
    try {
      await criarTarefa(form);
      router.push("/dashboard/tasks");
    } catch (err: any) {
      // Tenta mostrar o erro detalhado do backend
      if (err.response && err.response.json) {
        const data = await err.response.json();
        setErro(JSON.stringify(data));
      } else if (err.message) {
        setErro(err.message);
      } else {
        setErro("Erro ao criar tarefa.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <main className={`flex-1 px-4 md:px-8 py-8 transition-all duration-300 ${sidebarCollapsed ? "ml-20" : "ml-72"}`}>
        <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">Nova Tarefa</h1>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Título</label>
              <input
                type="text"
                name="titulo"
                value={form.titulo}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Descrição</label>
              <textarea
                name="descricao"
                value={form.descricao}
                onChange={handleChange}
                rows={3}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-gray-700 font-medium mb-1">Prioridade</label>
                <select
                  name="prioridade"
                  value={form.prioridade}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="baixa">Baixa</option>
                  <option value="media">Média</option>
                  <option value="alta">Alta</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-gray-700 font-medium mb-1">Categoria</label>
                <input
                  type="text"
                  name="categoria"
                  value={form.categoria}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Data Limite</label>
              <input
                type="datetime-local"
                name="data_limite"
                value={form.data_limite}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            {erro && <div className="text-red-500 break-all">{erro}</div>}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                onClick={() => router.push("/dashboard/tasks")}
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
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