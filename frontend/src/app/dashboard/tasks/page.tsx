"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import { getTarefas, atualizarTarefa, deletarTarefa } from "@/api/taskApi";

type Tarefa = {
  id: string;
  titulo: string;
  descricao: string;
  prioridade: string;
  concluida: boolean;
  data_limite?: string;
  categoria?: string;
};

export default function TasksPage() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    getTarefas()
      .then(setTarefas)
      .catch(() => setTarefas([]))
      .finally(() => setLoading(false));
  }, []);

  const handleAtualizarTarefa = async (id: string, data: Partial<Tarefa>) => {
    await atualizarTarefa(id, data);
    setTarefas((tarefas) =>
      tarefas.map((t) => (t.id === id ? { ...t, ...data } : t))
    );
  };

  const handleDeletarTarefa = async (id: string) => {
    await deletarTarefa(id);
    setTarefas((tarefas) => tarefas.filter((t) => t.id !== id));
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <main className={`flex-1 px-2 md:px-8 py-8 transition-all duration-300 ${sidebarCollapsed ? "ml-20" : "ml-72"}`}>
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">Quadro de Tarefas</h1>
          <Link href="/dashboard/tasks/nova">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-xl shadow-md hover:bg-blue-700 transition font-semibold">
              + Nova Tarefa
            </button>
          </Link>
        </div>
        <div className="flex flex-col md:flex-row gap-8 justify-center">
          {/* Pendentes */}
          <section className="flex-1 min-w-[320px]">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 flex flex-col h-full">
              <h2 className="text-2xl font-bold text-gray-700 mb-6 border-b pb-2">Pendentes</h2>
              <div className="flex flex-col gap-5 flex-1">
                {loading && <div className="text-gray-400 text-center">Carregando tarefas...</div>}
                {tarefas.filter(t => !t.concluida).length === 0 && !loading && (
                  <div className="text-gray-400 text-center">Nenhuma tarefa pendente.</div>
                )}
                {tarefas.filter(t => !t.concluida).map((t) => (
                  <div
                    key={t.id}
                    className="group bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col gap-2 hover:shadow-lg transition relative"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-lg text-gray-800">{t.titulo}</h3>
                      <span className={`text-xs px-2 py-1 rounded font-semibold uppercase tracking-wide
                        ${t.prioridade === "alta"
                          ? "bg-red-100 text-red-600"
                          : t.prioridade === "media"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                        }`}>
                        {t.prioridade}
                      </span>
                    </div>
                    <p className="text-gray-600">{t.descricao}</p>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-500 mt-1">
                      {t.categoria && <span className="bg-gray-200 rounded px-2 py-0.5">{t.categoria}</span>}
                      <span className="bg-gray-100 rounded px-2 py-0.5">
                        {t.data_limite ? `Limite: ${new Date(t.data_limite).toLocaleString()}` : "Sem data limite"}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition font-medium"
                        onClick={() => handleAtualizarTarefa(t.id, { concluida: true })}
                      >
                        Concluir
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition font-medium"
                        onClick={() => handleDeletarTarefa(t.id)}
                      >
                        Deletar
                      </button>
                    </div>
                    <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-10 bg-blue-400 rounded-r-lg opacity-0 group-hover:opacity-100 transition" />
                  </div>
                ))}
              </div>
            </div>
          </section>
          {/* Concluídas */}
          <section className="flex-1 min-w-[320px]">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 flex flex-col h-full">
              <h2 className="text-2xl font-bold text-gray-700 mb-6 border-b pb-2">Concluídas</h2>
              <div className="flex flex-col gap-5 flex-1">
                {tarefas.filter(t => t.concluida).length === 0 && !loading && (
                  <div className="text-gray-400 text-center">Nenhuma tarefa concluída.</div>
                )}
                {tarefas.filter(t => t.concluida).map((t) => (
                  <div
                    key={t.id}
                    className="group bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col gap-2 opacity-80 hover:shadow-lg transition relative"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-lg text-gray-800 line-through">{t.titulo}</h3>
                      <span className={`text-xs px-2 py-1 rounded font-semibold uppercase tracking-wide
                        ${t.prioridade === "alta"
                          ? "bg-red-100 text-red-600"
                          : t.prioridade === "media"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                        }`}>
                        {t.prioridade}
                      </span>
                    </div>
                    <p className="text-gray-600">{t.descricao}</p>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-500 mt-1">
                      {t.categoria && <span className="bg-gray-200 rounded px-2 py-0.5">{t.categoria}</span>}
                      <span className="bg-gray-100 rounded px-2 py-0.5">
                        {t.data_limite ? `Limite: ${new Date(t.data_limite).toLocaleString()}` : "Sem data limite"}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition font-medium"
                        onClick={() => handleAtualizarTarefa(t.id, { concluida: false })}
                      >
                        Voltar ao quadro
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition font-medium"
                        onClick={() => handleDeletarTarefa(t.id)}
                      >
                        Deletar
                      </button>
                    </div>
                    <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-1 h-10 bg-green-400 rounded-l-lg opacity-0 group-hover:opacity-100 transition" />
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}