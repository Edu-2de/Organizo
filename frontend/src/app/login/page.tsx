"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

// Hook de tema simples para alternar dark/light (usando body.dark-mode)
function useLocalTheme() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme") as "light" | "dark") || "light";
    }
    return "light";
  });

  useEffect(() => {
    // Aplica/remover classe dark-mode no body
    if (typeof window !== "undefined") {
      document.body.classList.toggle("dark-mode", theme === "dark");
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  function toggleTheme() {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  }

  return { theme, toggleTheme };
}

type AnimState =
  | null
  | "kick-email"
  | "kick-senha"
  | "kick-nome"
  | "kick-confirm"
  | "kick-finish"
  | "kick-in";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [focusField, setFocusField] = useState<"email" | "senha" | "nome" | "confirm" | null>(null);

  // Registro
  const [isRegister, setIsRegister] = useState(false);
  const [nome, setNome] = useState("");
  const [confirmSenha, setConfirmSenha] = useState("");
  const [registerMsg, setRegisterMsg] = useState<string | null>(null);

  // Animação de "chutão"
  const [animState, setAnimState] = useState<AnimState>(null);

  // Controla exibição dos campos individualmente
  const [loginFields, setLoginFields] = useState(["email", "senha"]);
  const [registerFields, setRegisterFields] = useState(["nome", "email", "senha", "confirm"]);

  // Hover/click da logo
  const logoWord = "Organizo".split("");
  const [hoveredLetter, setHoveredLetter] = useState<number | null>(0);

  // Tema
  const { theme, toggleTheme } = useLocalTheme();

  // Salva a letra clicada no localStorage
  useEffect(() => {
    const saved = localStorage.getItem("organizo-highlight");
    if (saved !== null) setHoveredLetter(Number(saved));
    else setHoveredLetter(0);
  }, []);
  function handleLogoClick(idx: number) {
    setHoveredLetter(idx);
    localStorage.setItem("organizo-highlight", String(idx));
  }

  // Controla exibição dos blocos
  const [showLogin, setShowLogin] = useState(true);
  const [showRegister, setShowRegister] = useState(false);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (email && senha) {
      setMsg("🎉 Login realizado com sucesso!");
      setTimeout(() => setMsg(null), 2000);
    } else {
      setMsg("Preencha todos os campos.");
    }
  }

  function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (nome && email && senha && confirmSenha) {
      if (senha !== confirmSenha) {
        setRegisterMsg("As senhas não coincidem.");
        return;
      }
      setRegisterMsg("🎉 Cadastro realizado com sucesso!");
      setTimeout(() => setRegisterMsg(null), 2000);
    } else {
      setRegisterMsg("Preencha todos os campos.");
    }
  }

  // Animação de saída dos campos um por um e entrada dos outros um por um
  function kickSwitchForm() {
    setMsg(null);
    setRegisterMsg(null);

    if (!isRegister) {
      // Login -> Register
      setAnimState("kick-email");
      setTimeout(() => setLoginFields(fields => fields.filter(f => f !== "email")), 250);
      setTimeout(() => setAnimState("kick-senha"), 320);
      setTimeout(() => setLoginFields(fields => fields.filter(f => f !== "senha")), 570);
      setTimeout(() => setAnimState("kick-finish"), 600);
      setTimeout(() => {
        setShowLogin(false);
        setShowRegister(true);
        setIsRegister(true);
        setRegisterFields([]);
        // Entrada dos campos de registro um por um
        setTimeout(() => {
          setRegisterFields(["nome"]);
          setAnimState("kick-in");
          setTimeout(() => setRegisterFields(["nome", "email"]), 90);
          setTimeout(() => setRegisterFields(["nome", "email", "senha"]), 180);
          setTimeout(() => setRegisterFields(["nome", "email", "senha", "confirm"]), 270);
          setTimeout(() => setAnimState(null), 500);
        }, 80);
      }, 700);
    } else {
      // Register -> Login
      setAnimState("kick-nome");
      setTimeout(() => setRegisterFields(fields => fields.filter(f => f !== "nome")), 250);
      setTimeout(() => setAnimState("kick-email"), 320);
      setTimeout(() => setRegisterFields(fields => fields.filter(f => f !== "email")), 570);
      setTimeout(() => setAnimState("kick-senha"), 640);
      setTimeout(() => setRegisterFields(fields => fields.filter(f => f !== "senha")), 890);
      setTimeout(() => setAnimState("kick-confirm"), 960);
      setTimeout(() => setRegisterFields(fields => fields.filter(f => f !== "confirm")), 1210);
      setTimeout(() => setAnimState("kick-finish"), 1250);
      setTimeout(() => {
        setShowRegister(false);
        setShowLogin(true);
        setIsRegister(false);
        setLoginFields([]);
        // Entrada dos campos de login um por um
        setTimeout(() => {
          setLoginFields(["email"]);
          setAnimState("kick-in");
          setTimeout(() => setLoginFields(["email", "senha"]), 90);
          setTimeout(() => setAnimState(null), 500);
        }, 80);
      }, 1350);
    }
  }

  // Utilitário para aplicar animação de chute campo a campo
  function getKickClass(field: string) {
    if (animState === `kick-${field}`) return "animate-chutao-out";
    if (animState === "kick-finish") return "opacity-0 pointer-events-none";
    if (animState === "kick-in") return "animate-chutao-in";
    return "";
  }

  return (
    <main
      className={`
        min-h-screen flex items-center justify-center
        bg-gradient-to-br
        from-[#F6F5F2] via-[#fff9e7] to-[#A9C5A0]/30
        px-4 relative overflow-hidden transition-colors
        dark-mode-bg
      `}
    >
      {/* Botão voltar para Home */}
      <Link
        href="/"
        className={`
          fixed left-4 top-4 sm:left-8 sm:top-8 w-10 h-10 flex items-center justify-center
          rounded-full bg-white/90 shadow border border-[#E9C46A]/40 z-20
          hover:bg-[#E9C46A]/90 transition group
        `}
        tabIndex={0}
        aria-label="Voltar para Home"
      >
        <span className="text-2xl text-[#264653] group-hover:text-white transition select-none font-bold">×</span>
      </Link>

      {/* Botão de alternar tema */}
      <button
        onClick={toggleTheme}
        className={`
          fixed right-4 top-4 sm:right-8 sm:top-8 w-10 h-10 flex items-center justify-center
          rounded-full bg-white/90 shadow border border-[#E9C46A]/40 z-20
          hover:bg-[#E9C46A]/90 transition
        `}
        aria-label="Alternar tema"
        type="button"
      >
        <span className="text-xl font-bold select-none">
          {theme === "dark" ? "🌙" : "☀️"}
        </span>
      </button>

      {/* Animated Blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#E9C46A]/30 hero-softshape-1 rounded-full filter blur-3xl animate-pulse z-0 dark-mode-blob1" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#264653]/30 hero-softshape-2 rounded-full filter blur-3xl animate-pulse z-0 dark-mode-blob2" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#A9C5A0]/20 hero-softshape-3 rounded-full filter blur-2xl animate-spin-slow z-0 dark-mode-blob3" />

      <div className={`
        w-full max-w-md
        bg-white/90 hero-card
        rounded-2xl shadow-2xl p-8 flex flex-col gap-6 relative z-10
        animate-fade-in-down overflow-hidden min-h-[420px]
        border border-[#E9C46A]/20
        dark-mode-card
      `}>
        <div className="flex flex-col items-center gap-2">
          <span className="text-5xl sm:text-6xl font-extrabold text-[#264653] select-none drop-shadow-lg animate-bounce mb-1 dark-mode-logo">
            {logoWord.map((letra, idx) => (
              <span
                key={idx}
                className={`
                  transition-colors duration-150 cursor-pointer px-1
                  ${
                    hoveredLetter === idx
                      ? (theme === "dark"
                        ? "text-[#2a9df4] logo-o-dark"
                        : "text-[#E9C46A] logo-o")
                      : (theme === "dark"
                        ? "text-[#AEE2FF] logo-text-dark"
                        : "text-[#264653] logo-text-light")
                  }
                  dark-mode-logo-letter
                `}
                onMouseEnter={() => setHoveredLetter(idx)}
                onMouseLeave={() =>
                  setHoveredLetter(
                    localStorage.getItem("organizo-highlight") !== null
                      ? Number(localStorage.getItem("organizo-highlight"))
                      : 0
                  )
                }
                onClick={() => handleLogoClick(idx)}
                style={{ userSelect: "none" }}
              >
                {letra}
              </span>
            ))}
          </span>
          <span className="text-lg text-[#264653b2] font-medium animate-fade-in logo-text-light dark-mode-logo-sub">
            {isRegister ? "Crie sua conta" : "Entre na sua conta"}
          </span>
        </div>
        {/* Login */}
        {showLogin && (
          <form className="flex flex-col gap-4 transition-all duration-700" onSubmit={handleLogin} autoComplete="off">
            {loginFields.includes("email") && (
              <label className={`flex flex-col gap-1 group transition-all duration-300 ${getKickClass("email")}`}>
                <span
                  className={`
                    font-semibold transition-colors
                    ${focusField === "email"
                      ? "text-[#E9C46A]"
                      : "text-[#264653]"}
                    dark-mode-label
                  `}
                >
                  E-mail
                </span>
                <input
                  type="email"
                  required
                  className={`
                    px-4 py-3 rounded border
                    bg-white
                    text-base text-[#264653]
                    placeholder-[#26465399]
                    focus:outline-none focus:ring-2 transition
                    border-[#E9C46A]/30
                    focus:ring-[#E9C46A]/60
                    shadow-sm group-hover:scale-105 duration-200
                    ${focusField === "email" ? "ring-2 ring-[#E9C46A]" : ""}
                    dark-mode-input
                  `}
                  placeholder="seu@email.com"
                  value={email}
                  onFocus={() => setFocusField("email")}
                  onBlur={() => setFocusField(null)}
                  onChange={e => setEmail(e.target.value)}
                  disabled={!!animState}
                />
              </label>
            )}
            {loginFields.includes("senha") && (
              <label className={`flex flex-col gap-1 group relative transition-all duration-300 ${getKickClass("senha")}`}>
                <span
                  className={`
                    font-semibold transition-colors
                    ${focusField === "senha"
                      ? "text-[#E9C46A]"
                      : "text-[#264653]"}
                    dark-mode-label
                  `}
                >
                  Senha
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className={`
                    px-4 py-3 rounded border
                    bg-white
                    text-base text-[#264653]
                    placeholder-[#26465399]
                    focus:outline-none focus:ring-2 transition
                    border-[#E9C46A]/30
                    focus:ring-[#E9C46A]/60
                    shadow-sm group-hover:scale-105 duration-200
                    ${focusField === "senha" ? "ring-2 ring-[#E9C46A]" : ""}
                    dark-mode-input
                  `}
                  placeholder="Sua senha"
                  value={senha}
                  onFocus={() => setFocusField("senha")}
                  onBlur={() => setFocusField(null)}
                  onChange={e => setSenha(e.target.value)}
                  disabled={!!animState}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-3 top-9 text-[#E9C46A] hover:text-[#264653] transition"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  disabled={!!animState}
                >
                  {showPassword ? (
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M3 12s3.6-7 9-7 9 7 9 7-3.6 7-9 7-9-7-9-7Z" stroke="currentColor" strokeWidth="1.5"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/></svg>
                  ) : (
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M3 3l18 18M10.7 10.7A3 3 0 0 0 12 15a3 3 0 0 0 2.3-4.3M6.6 6.6C4.7 8 3 12 3 12s3.6 7 9 7c1.6 0 3.1-.3 4.4-.9M17.4 17.4C19.3 16 21 12 21 12s-3.6-7-9-7c-1.2 0-2.4.2-3.4.6" stroke="currentColor" strokeWidth="1.5"/></svg>
                  )}
                </button>
              </label>
            )}
            {loginFields.length === 2 && (
              <button
                type="submit"
                className="w-full px-4 py-3 rounded-full bg-[#E9C46A] text-[#264653] font-bold text-base hover:bg-[#E9C46A]/80 transition shadow-lg hover:scale-105 active:scale-95 duration-150 main-btn dark-mode-btn"
                disabled={!!animState}
              >
                Entrar
              </button>
            )}
            {msg && (
              <span className="text-[#264653] text-sm font-semibold text-center mt-1 animate-pulse dark-mode-label">
                {msg}
              </span>
            )}
            {loginFields.length === 2 && (
              <div className="text-center text-[#264653b2] text-base mt-2 animate-fade-in dark-mode-label">
                Não tem uma conta?{" "}
                <button
                  className="text-[#E9C46A] font-bold hover:underline hover:text-[#264653] transition"
                  onClick={kickSwitchForm}
                  disabled={!!animState}
                >
                  Cadastre-se
                </button>
              </div>
            )}
          </form>
        )}
        {/* Registro */}
        {showRegister && (
          <form className="flex flex-col gap-4 transition-all duration-700" onSubmit={handleRegister} autoComplete="off">
            {registerFields.includes("nome") && (
              <label className={`flex flex-col gap-1 group transition-all duration-300 ${getKickClass("nome")}`}>
                <span
                  className={`
                    font-semibold transition-colors
                    ${focusField === "nome"
                      ? "text-[#E9C46A]"
                      : "text-[#264653]"}
                    dark-mode-label
                  `}
                >
                  Nome
                </span>
                <input
                  type="text"
                  required
                  className={`
                    px-4 py-3 rounded border
                    bg-white
                    text-base text-[#264653]
                    placeholder-[#26465399]
                    focus:outline-none focus:ring-2 transition
                    border-[#E9C46A]/30
                    focus:ring-[#E9C46A]/60
                    shadow-sm group-hover:scale-105 duration-200
                    ${focusField === "nome" ? "ring-2 ring-[#E9C46A]" : ""}
                    dark-mode-input
                  `}
                  placeholder="Seu nome"
                  value={nome}
                  onFocus={() => setFocusField("nome")}
                  onBlur={() => setFocusField(null)}
                  onChange={e => setNome(e.target.value)}
                  disabled={!!animState}
                />
              </label>
            )}
            {registerFields.includes("email") && (
              <label className={`flex flex-col gap-1 group transition-all duration-300 ${getKickClass("email")}`}>
                <span
                  className={`
                    font-semibold transition-colors
                    ${focusField === "email"
                      ? "text-[#E9C46A]"
                      : "text-[#264653]"}
                    dark-mode-label
                  `}
                >
                  E-mail
                </span>
                <input
                  type="email"
                  required
                  className={`
                    px-4 py-3 rounded border
                    bg-white
                    text-base text-[#264653]
                    placeholder-[#26465399]
                    focus:outline-none focus:ring-2 transition
                    border-[#E9C46A]/30
                    focus:ring-[#E9C46A]/60
                    shadow-sm group-hover:scale-105 duration-200
                    ${focusField === "email" ? "ring-2 ring-[#E9C46A]" : ""}
                    dark-mode-input
                  `}
                  placeholder="seu@email.com"
                  value={email}
                  onFocus={() => setFocusField("email")}
                  onBlur={() => setFocusField(null)}
                  onChange={e => setEmail(e.target.value)}
                  disabled={!!animState}
                />
              </label>
            )}
            {registerFields.includes("senha") && (
              <label className={`flex flex-col gap-1 group relative transition-all duration-300 ${getKickClass("senha")}`}>
                <span
                  className={`
                    font-semibold transition-colors
                    ${focusField === "senha"
                      ? "text-[#E9C46A]"
                      : "text-[#264653]"}
                    dark-mode-label
                  `}
                >
                  Senha
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className={`
                    px-4 py-3 rounded border
                    bg-white
                    text-base text-[#264653]
                    placeholder-[#26465399]
                    focus:outline-none focus:ring-2 transition
                    border-[#E9C46A]/30
                    focus:ring-[#E9C46A]/60
                    shadow-sm group-hover:scale-105 duration-200
                    ${focusField === "senha" ? "ring-2 ring-[#E9C46A]" : ""}
                    dark-mode-input
                  `}
                  placeholder="Crie uma senha"
                  value={senha}
                  onFocus={() => setFocusField("senha")}
                  onBlur={() => setFocusField(null)}
                  onChange={e => setSenha(e.target.value)}
                  disabled={!!animState}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-3 top-9 text-[#E9C46A] hover:text-[#264653] transition"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  disabled={!!animState}
                >
                  {showPassword ? (
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M3 12s3.6-7 9-7 9 7 9 7-3.6 7-9 7-9-7-9-7Z" stroke="currentColor" strokeWidth="1.5"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/></svg>
                  ) : (
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M3 3l18 18M10.7 10.7A3 3 0 0 0 12 15a3 3 0 0 0 2.3-4.3M6.6 6.6C4.7 8 3 12 3 12s3.6 7 9 7c1.6 0 3.1-.3 4.4-.9M17.4 17.4C19.3 16 21 12 21 12s-3.6-7-9-7c-1.2 0-2.4.2-3.4.6" stroke="currentColor" strokeWidth="1.5"/></svg>
                  )}
                </button>
              </label>
            )}
            {registerFields.includes("confirm") && (
              <label className={`flex flex-col gap-1 group transition-all duration-300 ${getKickClass("confirm")}`}>
                <span className="font-semibold text-[#264653] dark-mode-label">Confirmar senha</span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="px-4 py-3 rounded border bg-white text-base text-[#264653] placeholder-[#26465399] focus:outline-none focus:ring-2 border-[#E9C46A]/30 focus:ring-[#E9C46A]/60 shadow-sm group-hover:scale-105 duration-200 dark-mode-input"
                  placeholder="Repita a senha"
                  value={confirmSenha}
                  onChange={e => setConfirmSenha(e.target.value)}
                  disabled={!!animState}
                />
              </label>
            )}
            {registerFields.length === 4 && (
              <button
                type="submit"
                className="w-full px-4 py-3 rounded-full bg-[#264653] text-[#E9C46A] font-bold text-base hover:bg-[#264653]/90 transition shadow-lg hover:scale-105 active:scale-95 duration-150 main-btn dark-mode-btn"
                disabled={!!animState}
              >
                Cadastrar
              </button>
            )}
            {registerMsg && (
              <span className="text-[#264653] text-sm font-semibold text-center mt-1 animate-pulse dark-mode-label">
                {registerMsg}
              </span>
            )}
            {registerFields.length === 4 && (
              <div className="text-center text-[#264653b2] text-base mt-2 animate-fade-in dark-mode-label">
                Já tem uma conta?{" "}
                <button
                  className="text-[#E9C46A] font-bold hover:underline hover:text-[#264653] transition"
                  onClick={kickSwitchForm}
                  disabled={!!animState}
                >
                  Entrar
                </button>
              </div>
            )}
          </form>
        )}
      </div>
      {/* Tailwind Animations + Dark Mode */}
      <style jsx global>{`
        @keyframes fade-in-down {
          0% {
            opacity: 0;
            transform: translateY(-32px) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.7s cubic-bezier(.4,2,.6,.9) both;
        }
        @keyframes spin-slow {
          0% { transform: rotate(0deg);}
          100% { transform: rotate(360deg);}
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
        @keyframes fade-in {
          0% { opacity: 0;}
          100% { opacity: 1;}
        }
        .animate-fade-in {
          animation: fade-in 1.2s ease both;
        }
        /* Chutão para fora campo a campo */
        @keyframes chutao-out {
          0% { opacity: 1; transform: translateX(0) rotate(0deg) scale(1);}
          60% { opacity: 1; transform: translateX(40px) rotate(12deg) scale(1.08);}
          100% { opacity: 0; transform: translateX(120vw) rotate(40deg) scale(0.9);}
        }
        .animate-chutao-out {
          animation: chutao-out 0.25s cubic-bezier(.7,0,.3,1) both;
        }
        /* Chutão para dentro */
        @keyframes chutao-in {
          0% { opacity: 0; transform: translateX(-120vw) rotate(-40deg) scale(0.9);}
          60% { opacity: 1; transform: translateX(-40px) rotate(-12deg) scale(1.08);}
          100% { opacity: 1; transform: translateX(0) rotate(0deg) scale(1);}
        }
        .animate-chutao-in {
          animation: chutao-in 0.5s cubic-bezier(.7,0,.3,1) both;
        }

        /* DARK MODE ESTILO */
        body.dark-mode {
          background: #101624 !important;
        }
        body.dark-mode .dark-mode-bg {
          background: linear-gradient(135deg, #101624 0%, #181B2A 60%, #23283B 100%) !important;
        }
        body.dark-mode .dark-mode-card {
          background: #181B2A !important;
          border-color: #2a9df4 !important;
        }
        body.dark-mode .dark-mode-btn {
          background: #2a9df4 !important;
          color: #181B2A !important;
        }
        body.dark-mode .dark-mode-label,
        body.dark-mode .dark-mode-logo-sub {
          color: #AEE2FF !important;
        }
        body.dark-mode .dark-mode-logo,
        body.dark-mode .dark-mode-logo-letter {
          color: #AEE2FF !important;
        }
        body.dark-mode .logo-o-dark {
          color: #2a9df4 !important;
        }
        body.dark-mode .dark-mode-input {
          background: #23283B !important;
          color: #AEE2FF !important;
          border-color: #2a9df4 !important;
        }
        body.dark-mode .dark-mode-input::placeholder {
          color: #AEE2FF77 !important;
        }
        body.dark-mode .dark-mode-blob1 {
          background: #2a9df433 !important;
        }
        body.dark-mode .dark-mode-blob2 {
          background: #23283B99 !important;
        }
        body.dark-mode .dark-mode-blob3 {
          background: #2a9df41a !important;
        }
        /* Hover azul nas letras no modo escuro */
        body.dark-mode .dark-mode-logo-letter:hover {
          color: #2a9df4 !important;
        }
      `}</style>
    </main>
  );
}