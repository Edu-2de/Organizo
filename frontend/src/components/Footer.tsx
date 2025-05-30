"use client";

import { useState, useEffect } from "react";

function useDarkMode() {
  const [isDark, setIsDark] = useState(() =>
    typeof window !== "undefined"
      ? document.body.classList.contains("dark-mode")
      : false
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const observer = new MutationObserver(() => {
      setIsDark(document.body.classList.contains("dark-mode"));
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    setIsDark(document.body.classList.contains("dark-mode"));
    return () => observer.disconnect();
  }, []);

  return isDark;
}

export default function Footer() {
  const [newsletterMsg, setNewsletterMsg] = useState<string | null>(null);
  const isDark = useDarkMode();

  return (
    <footer
      className={
        isDark
          ? "bg-gradient-to-br from-[#101a2f] via-[#181B2A] to-[#23283B] border-t border-[#2a9df4]/30 py-14"
          : "bg-gradient-to-br from-[#264653] via-[#2a4d4c] to-[#1b2e35] border-t border-[#E9C46A]/20 py-14"
      }
    >
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-5 gap-12 items-start">
        {/* Logo e slogan */}
        <div className="flex flex-col items-center md:items-start gap-4 col-span-2">
          <span className="text-4xl font-extrabold text-[#E9C46A] select-none drop-shadow">
            <span className="logo-o">O</span>
            <span className={isDark ? "text-[#fff]" : "text-[#fff]"}>rganizo</span>
          </span>
          <span className={`text-base font-medium ${isDark ? "text-[#AEE2FF]" : "text-[#fff9]"}`}>
            Organize sua vida com leveza e eficiência.
          </span>
          <div className="flex gap-3 mt-3">
            <button
              className={`px-4 py-2 rounded-full text-base font-semibold transition shadow ${
                isDark
                  ? "bg-[#2a9df4]/20 text-[#AEE2FF] hover:bg-[#2a9df4]/40"
                  : "bg-[#E9C46A]/30 text-[#fff] hover:bg-[#E9C46A]/60"
              }`}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              Voltar ao topo
            </button>
            <a
              href="#"
              className={`px-4 py-2 rounded-full text-base font-semibold transition shadow ${
                isDark
                  ? "bg-[#FFD87B]/20 text-[#FFD87B] hover:bg-[#FFD87B]/40"
                  : "bg-[#A9C5A0]/30 text-[#fff] hover:bg-[#A9C5A0]/60"
              }`}
            >
              Experimente grátis
            </a>
          </div>
        </div>
        {/* Links rápidos */}
        <div>
          <h4 className={`font-bold mb-3 text-lg uppercase tracking-wider ${isDark ? "text-[#2a9df4]" : "text-[#E9C46A]"}`}>Navegação</h4>
          <nav className={`flex flex-col gap-2 text-base font-semibold ${isDark ? "text-[#AEE2FF]" : "text-[#fff9]"}`}>
            <a href="#" className={`transition hover:${isDark ? "text-[#2a9df4]" : "text-[#E9C46A]"}`}>Início</a>
            <a href="#" className={`transition hover:${isDark ? "text-[#2a9df4]" : "text-[#E9C46A]"}`}>Funcionalidades</a>
            <a href="#" className={`transition hover:${isDark ? "text-[#2a9df4]" : "text-[#E9C46A]"}`}>Sobre</a>
            <a href="#" className={`transition hover:${isDark ? "text-[#2a9df4]" : "text-[#E9C46A]"}`}>Contato</a>
            <a href="#" className={`transition hover:${isDark ? "text-[#2a9df4]" : "text-[#E9C46A]"}`}>Ajuda</a>
          </nav>
        </div>
        {/* Recursos */}
        <div>
          <h4 className={`font-bold mb-3 text-lg uppercase tracking-wider ${isDark ? "text-[#2a9df4]" : "text-[#E9C46A]"}`}>Recursos</h4>
          <ul className={`flex flex-col gap-2 text-base font-semibold ${isDark ? "text-[#AEE2FF]" : "text-[#fff9]"}`}>
            <li>
              <button
                className={`transition underline underline-offset-2 hover:${isDark ? "text-[#2a9df4]" : "text-[#E9C46A]"}`}
                onClick={() => alert("100% Responsivo: Use em qualquer dispositivo!")}
              >
                100% Responsivo
              </button>
            </li>
            <li>
              <button
                className={`transition underline underline-offset-2 hover:${isDark ? "text-[#2a9df4]" : "text-[#E9C46A]"}`}
                onClick={() => alert("Personalizável: Adapte ao seu jeito!")}
              >
                Personalizável
              </button>
            </li>
            <li>
              <button
                className={`transition underline underline-offset-2 hover:${isDark ? "text-[#2a9df4]" : "text-[#E9C46A]"}`}
                onClick={() => alert("Seguro e Privado: Seus dados protegidos!")}
              >
                Seguro e Privado
              </button>
            </li>
            <li>
              <button
                className={`transition underline underline-offset-2 hover:${isDark ? "text-[#2a9df4]" : "text-[#E9C46A]"}`}
                onClick={() => alert("Design Inspirador: Visual minimalista e leve!")}
              >
                Design Inspirador
              </button>
            </li>
          </ul>
        </div>
        {/* Contato e redes */}
        <div className="flex flex-col items-center md:items-end gap-3">
          <h4 className={`font-bold mb-3 text-lg uppercase tracking-wider ${isDark ? "text-[#2a9df4]" : "text-[#E9C46A]"}`}>Contato</h4>
          <a href="mailto:contato@organizo.com" className={`text-base font-semibold transition ${isDark ? "text-[#AEE2FF] hover:text-[#2a9df4]" : "text-[#fff] hover:text-[#E9C46A]"}`}>
            contato@organizo.com
          </a>
          <span className={`text-sm ${isDark ? "text-[#AEE2FF99]" : "text-[#fff7]"}`}>Segunda a sexta, 9h às 18h</span>
          <div className="flex gap-4 mt-2">
            <a href="#" aria-label="Instagram" className={`transition ${isDark ? "text-[#AEE2FF] hover:text-[#2a9df4]" : "text-[#fff] hover:text-[#E9C46A]"}`}>
              <svg width="26" height="26" fill="none" viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="3" rx="5" stroke="currentColor" strokeWidth="1.5"/><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5"/><circle cx="17" cy="7" r="1" fill="currentColor"/></svg>
            </a>
            <a href="#" aria-label="Twitter" className={`transition ${isDark ? "text-[#AEE2FF] hover:text-[#2a9df4]" : "text-[#fff] hover:text-[#E9C46A]"}`}>
              <svg width="26" height="26" fill="none" viewBox="0 0 24 24"><path d="M21 7.5c-.6.3-1.2.5-1.8.6.7-.4 1.1-1 1.4-1.7-.7.4-1.3.7-2 .8a3.1 3.1 0 0 0-5.3 2.8c-2.6-.1-5-1.4-6.6-3.5-.3.5-.5 1-.5 1.6 0 1.1.6 2.1 1.6 2.7-.5 0-1-.2-1.4-.4v.1c0 1.5 1.1 2.7 2.5 3-.3.1-.6.2-.9.2-.2 0-.4 0-.6-.1.4 1.2 1.6 2.1 3 2.1A6.2 6.2 0 0 1 3 18.1c-.4 0-.7 0-1-.1A8.7 8.7 0 0 0 7.3 19.5c5.7 0 8.8-4.7 8.8-8.8v-.4c.6-.4 1.1-1 1.5-1.6Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>
            </a>
            <a href="#" aria-label="WhatsApp" className={`transition ${isDark ? "text-[#AEE2FF] hover:text-[#2a9df4]" : "text-[#fff] hover:text-[#E9C46A]"}`}>
              <svg width="26" height="26" fill="none" viewBox="0 0 24 24"><path d="M5 19l1.5-4A7 7 0 1 1 12 19a7 7 0 0 1-6.5-4z" stroke="currentColor" strokeWidth="1.5"/><path d="M8.5 13.5c.5 1 1.5 2 2.5 2.5.5.2 1 .2 1.5 0l.5-.5c.2-.2.2-.5 0-.7l-.7-.7c-.2-.2-.5-.2-.7 0l-.2.2c-.1.1-.2.1-.3 0a5.5 5.5 0 0 1-1.2-1.2c-.1-.1-.1-.2 0-.3l.2-.2c.2-.2.2-.5 0-.7l-.7-.7c-.2-.2-.5-.2-.7 0l-.5.5c-.2.5-.2 1 0 1.5z" stroke="currentColor" strokeWidth="1.5"/></svg>
            </a>
          </div>
          <form
            className="w-full mt-4 flex flex-col gap-2"
            onSubmit={e => {
              e.preventDefault();
              setNewsletterMsg("Mensagem enviada! Em breve entraremos em contato.");
              setTimeout(() => setNewsletterMsg(null), 3000);
            }}
          >
            <input
              type="email"
              required
              placeholder="Seu e-mail"
              className={`w-full px-4 py-3 rounded border text-base focus:outline-none focus:ring-2 transition ${
                isDark
                  ? "border-[#2a9df4]/30 bg-[#181B2A] text-[#AEE2FF] placeholder-[#AEE2FF99] focus:ring-[#2a9df4]/30"
                  : "border-[#E9C46A]/30 bg-[#1b2e35] text-[#fff] placeholder-[#fff9] focus:ring-[#E9C46A]/30"
              }`}
            />
            <button
              type="submit"
              className={`w-full px-4 py-3 rounded font-bold text-base transition ${
                isDark
                  ? "bg-[#2a9df4] text-[#181B2A] hover:bg-[#2490db]"
                  : "bg-[#E9C46A] text-[#264653] hover:bg-[#E9C46A]/80"
              }`}
            >
              Receber novidades
            </button>
            {newsletterMsg && (
              <span className={`text-sm font-semibold text-center mt-1 animate-pulse ${isDark ? "text-[#2a9df4]" : "text-[#E9C46A]"}`}>
                {newsletterMsg}
              </span>
            )}
          </form>
        </div>
      </div>
      <div className={`mt-12 text-center text-base font-semibold tracking-wide ${isDark ? "text-[#AEE2FF99]" : "text-[#fff8]"}`}>
        © {new Date().getFullYear()} Organizo. Todos os direitos reservados.
      </div>
    </footer>
  );
}