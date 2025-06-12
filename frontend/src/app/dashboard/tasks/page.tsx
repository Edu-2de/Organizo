"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import { getTarefas, atualizarTarefa, deletarTarefa } from "@/api/taskApi";
import { CheckCircleIcon, ArrowUturnLeftIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";

type Tarefa = {
  id: string;
  titulo: string;
  descricao: string;
  prioridade: string;
  concluida: boolean;
  data_limite?: string;
  categoria?: string;
};

const prioridadeBadge = (prioridade: string) => {
  switch (prioridade) {
    case "alta":
      return "bg-[#E9C46A] text-[#264653] border-[#E9C46A]";
    case "media":
      return "bg-[#A9C5A0] text-[#264653] border-[#A9C5A0]";
    default:
      return "bg-[#F6F5F2] text-[#264653] border-[#F6F5F2]";
  }
};

export default function TasksPage() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showPendentes, setShowPendentes] = useState(true);
  const [showConcluidas, setShowConcluidas] = useState(true);

  useEffect(() => {
    getTarefas()
      .then(setTarefas)
      .catch(() => setTarefas([]))
      .finally(() => setLoading(false));
  }, []);

const handleAtualizarTarefa = async (id: string, data: Partial<Tarefa>) => {
  const updated = await atualizarTarefa(id, data); // updated deve ser o objeto retornado pela API
  setTarefas((tarefas) =>
    tarefas.map((t) => (t.id === id ? { ...t, ...updated } : t))
  );
};

  const handleDeletarTarefa = async (id: string) => {
    await deletarTarefa(id);
    setTarefas((tarefas) => tarefas.filter((t) => t.id !== id));
  };

  return (
    <div className="flex min-h-screen" style={{ background: "#F6F5F2" }}>
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <main className={`flex-1 px-2 md:px-8 py-8 transition-all duration-300 ${sidebarCollapsed ? "ml-20" : "ml-72"}`}>
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-3xl font-bold" style={{ color: "#264653" }}>
            Quadro de Tarefas
            <span className="ml-2"><PlusIcon className="w-7 h-7 text-[#A9C5A0]" /></span>
          </h1>
          <Link href="/dashboard/tasks/nova">
            <button
              className="px-6 py-2 rounded-lg shadow font-semibold flex items-center gap-2 transition"
              style={{
                background: "#264653",
                color: "#F6F5F2",
              }}
            >
              <PlusIcon className="w-5 h-5" />
              Nova Tarefa
            </button>
          </Link>
        </div>
        <div className="flex flex-col md:flex-row gap-8 justify-center">
          {/* Pendentes */}
          <section className="flex-1 min-w-[320px]">
            <div
              className="rounded-xl shadow border p-6 flex flex-col h-full"
              style={{ background: "#fff", borderColor: "#A9C5A0" }}
            >
              <button
                className="flex items-center justify-between w-full mb-4 text-base font-semibold transition"
                style={{ color: "#264653" }}
                onClick={() => setShowPendentes((v) => !v)}
                aria-expanded={showPendentes}
              >
                <span>Pendentes</span>
                <span className={`ml-2 transition-transform ${showPendentes ? "rotate-180" : ""}`}>▼</span>
              </button>
              <div className={`flex flex-col gap-5 flex-1 transition-all duration-300 ${showPendentes ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}>
                {loading && <div className="text-gray-400 text-center">Carregando tarefas...</div>}
                {tarefas.filter(t => !t.concluida).length === 0 && !loading && (
                  <div className="text-gray-400 text-center">Nenhuma tarefa pendente.</div>
                )}
                {tarefas.filter(t => !t.concluida).map((t) => (
                  <div
                    key={t.id}
                    className="group border rounded-lg p-4 shadow-sm flex flex-col gap-2 hover:shadow-md transition relative"
                    style={{ background: "#fff", borderColor: "#F6F5F2" }}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg flex items-center gap-2" style={{ color: "#264653" }}>
                        <span className="inline-block w-2 h-2 rounded-full" style={{ background: "#A9C5A0" }} />
                        {t.titulo}
                      </h3>
                      <span className={`text-xs px-2 py-1 rounded border font-semibold uppercase tracking-wide ${prioridadeBadge(t.prioridade)}`}>
                        {t.prioridade}
                      </span>
                    </div>
                    <p className="text-gray-600">{t.descricao}</p>
                    <div className="flex flex-wrap gap-3 text-xs mt-1" style={{ color: "#264653" }}>
                      {t.categoria && <span className="bg-[#A9C5A0] text-[#264653] rounded px-2 py-0.5">{t.categoria}</span>}
                      <span className="bg-[#F6F5F2] rounded px-2 py-0.5">
                        {t.data_limite ? `Limite: ${new Date(t.data_limite).toLocaleString()}` : "Sem data limite"}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button
                        className="px-3 py-1 rounded border font-medium flex items-center gap-1 transition"
                        style={{
                          background: "#F6F5F2",
                          color: "#264653",
                          borderColor: "#A9C5A0",
                        }}
                        onClick={() => handleAtualizarTarefa(t.id, { concluida: true })}
                      >
                        <CheckCircleIcon className="w-5 h-5" /> Concluir
                      </button>
                      <button
                        className="px-3 py-1 rounded border font-medium flex items-center gap-1 transition"
                        style={{
                          background: "#F6F5F2",
                          color: "#264653",
                          borderColor: "#E9C46A",
                        }}
                        onClick={() => handleDeletarTarefa(t.id)}
                      >
                        <TrashIcon className="w-5 h-5" /> Deletar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
          {/* Concluídas */}
          <section className="flex-1 min-w-[320px]">
            <div
              className="rounded-xl shadow border p-6 flex flex-col h-full"
              style={{ background: "#fff", borderColor: "#E9C46A" }}
            >
              <button
                className="flex items-center justify-between w-full mb-4 text-base font-semibold transition"
                style={{ color: "#264653" }}
                onClick={() => setShowConcluidas((v) => !v)}
                aria-expanded={showConcluidas}
              >
                <span>Concluídas</span>
                <span className={`ml-2 transition-transform ${showConcluidas ? "rotate-180" : ""}`}>▼</span>
              </button>
              <div className={`flex flex-col gap-5 flex-1 transition-all duration-300 ${showConcluidas ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}>
                {tarefas.filter(t => t.concluida).length === 0 && !loading && (
                  <div className="text-gray-400 text-center">Nenhuma tarefa concluída.</div>
                )}
                {tarefas.filter(t => t.concluida).map((t) => (
                  <div
                    key={t.id}
                    className="group border rounded-lg p-4 shadow-sm flex flex-col gap-2 opacity-80 hover:shadow-md transition relative"
                    style={{ background: "#F6F5F2", borderColor: "#E9C46A" }}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg line-through flex items-center gap-2" style={{ color: "#264653" }}>
                        <CheckCircleIcon className="w-5 h-5 text-[#A9C5A0]" />
                        {t.titulo}
                      </h3>
                      <span className={`text-xs px-2 py-1 rounded border font-semibold uppercase tracking-wide ${prioridadeBadge(t.prioridade)}`}>
                        {t.prioridade}
                      </span>
                    </div>
                    <p className="text-gray-600">{t.descricao}</p>
                    <div className="flex flex-wrap gap-3 text-xs mt-1" style={{ color: "#264653" }}>
                      {t.categoria && <span className="bg-[#A9C5A0] text-[#264653] rounded px-2 py-0.5">{t.categoria}</span>}
                      <span className="bg-[#F6F5F2] rounded px-2 py-0.5">
                        {t.data_limite ? `Limite: ${new Date(t.data_limite).toLocaleString()}` : "Sem data limite"}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button
                        className="px-3 py-1 rounded border font-medium flex items-center gap-1 transition"
                        style={{
                          background: "#F6F5F2",
                          color: "#264653",
                          borderColor: "#A9C5A0",
                        }}
                        onClick={() => handleAtualizarTarefa(t.id, { concluida: false })}
                      >
                        <ArrowUturnLeftIcon className="w-5 h-5" /> Voltar ao quadro
                      </button>
                      <button
                        className="px-3 py-1 rounded border font-medium flex items-center gap-1 transition"
                        style={{
                          background: "#F6F5F2",
                          color: "#264653",
                          borderColor: "#E9C46A",
                        }}
                        onClick={() => handleDeletarTarefa(t.id)}
                      >
                        <TrashIcon className="w-5 h-5" /> Deletar
                      </button>
                    </div>
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