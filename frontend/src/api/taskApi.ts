const API_URL = "http://localhost:8000/api/tarefas/";

function getAuthHeaders() {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return token
    ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
    : { "Content-Type": "application/json" };
}

export async function getTarefas() {
  const res = await fetch(API_URL, {
    credentials: "include",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Erro ao buscar tarefas");
  return res.json();
}

export async function atualizarTarefa(id: string, data: Partial<unknown>) {
  const res = await fetch(`${API_URL}${id}/`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erro ao atualizar tarefa");
  return res.json();
}

export async function deletarTarefa(id: string) {
  const res = await fetch(`${API_URL}${id}/`, {
    method: "DELETE",
    headers: getAuthHeaders(),
    credentials: "include",
  });
  if (!res.ok) throw new Error("Erro ao deletar tarefa");
  return true;
}

export async function criarTarefa(data: unknown) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(JSON.stringify(error)); // Mostra o erro real do backend
  }
  return res.json();
}