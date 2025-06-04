const API_URL = "http://localhost:8000/api/tarefas/";

export async function fetchTasks(token: string) {
  const res = await fetch(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  return res.json();
}

export async function createTask(token: string, data: unknown) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteTask(token: string, id: string) {
  await fetch(`${API_URL}${id}/`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function toggleTask(token: string, id: string, concluida: boolean) {
  const res = await fetch(`${API_URL}${id}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ concluida }),
  });
  return res.json();
}