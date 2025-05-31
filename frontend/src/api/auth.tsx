export async function login(email: string, password: string) {
  const res = await fetch("http://localhost:8000/api/login/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Login inválido");
  return res.json(); // deve retornar { token: "..." }
}

export async function register(nome: string, email: string, password: string) {
  const res = await fetch("http://localhost:8000/api/register/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, email, password }),
  });
  if (!res.ok) throw new Error("Erro ao registrar");
  return res.json(); // deve retornar { token: "..." }
}