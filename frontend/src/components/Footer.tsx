"use client";

import { useState } from "react";

export default function Footer() {
  const [newsletterMsg, setNewsletterMsg] = useState<string | null>(null);

  return (
    <footer className="bg-gradient-to-br from-[#264653] via-[#2a4d4c] to-[#1b2e35] border-t border-[#E9C46A]/20 py-14">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-5 gap-12 items-start">
        {/* Logo e slogan */}
        <div className="flex flex-col items-center md:items-start gap-4 col-span-2">
          <span className="text-4xl font-extrabold text-[#E9C46A] select-none drop-shadow">
            <span className="text-[#E9C46A]">O</span>
            <span className="text-[#fff]">rganizo</span>
          </span>
          <span className="text-base text-[#fff9] font-medium">
            Organize sua vida com leveza e eficiência.
          </span>
          <div className="flex gap-3 mt-3">
            <button
              className="px-4 py-2 rounded-full bg-[#E9C46A]/30 text-[#fff] text-base font-semibold hover:bg-[#E9C46A]/60 transition shadow"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              Voltar ao topo
            </button>
            <a
              href="#"
              className="px-4 py-2 rounded-full bg-[#A9C5A0]/30 text-[#fff] text-base font-semibold hover:bg-[#A9C5A0]/60 transition shadow"
            >
              Experimente grátis
            </a>
          </div>
        </div>
        {/* Links rápidos */}
        <div>
          <h4 className="text-[#E9C46A] font-bold mb-3 text-lg uppercase tracking-wider">Navegação</h4>
          <nav className="flex flex-col gap-2 text-base text-[#fff9] font-semibold">
            <a href="#" className="hover:text-[#E9C46A] transition">Início</a>
            <a href="#" className="hover:text-[#E9C46A] transition">Funcionalidades</a>
            <a href="#" className="hover:text-[#E9C46A] transition">Sobre</a>
            <a href="#" className="hover:text-[#E9C46A] transition">Contato</a>
            <a href="#" className="hover:text-[#E9C46A] transition">Ajuda</a>
          </nav>
        </div>
        {/* Recursos */}
        <div>
          <h4 className="text-[#E9C46A] font-bold mb-3 text-lg uppercase tracking-wider">Recursos</h4>
          <ul className="flex flex-col gap-2 text-base text-[#fff9] font-semibold">
            <li>
              <button
                className="hover:text-[#E9C46A] transition underline underline-offset-2"
                onClick={() => alert("100% Responsivo: Use em qualquer dispositivo!")}
              >
                100% Responsivo
              </button>
            </li>
            <li>
              <button
                className="hover:text-[#E9C46A] transition underline underline-offset-2"
                onClick={() => alert("Personalizável: Adapte ao seu jeito!")}
              >
                Personalizável
              </button>
            </li>
            <li>
              <button
                className="hover:text-[#E9C46A] transition underline underline-offset-2"
                onClick={() => alert("Seguro e Privado: Seus dados protegidos!")}
              >
                Seguro e Privado
              </button>
            </li>
            <li>
              <button
                className="hover:text-[#E9C46A] transition underline underline-offset-2"
                onClick={() => alert("Design Inspirador: Visual minimalista e leve!")}
              >
                Design Inspirador
              </button>
            </li>
          </ul>
        </div>
        {/* Contato e redes */}
        <div className="flex flex-col items-center md:items-end gap-3">
          <h4 className="text-[#E9C46A] font-bold mb-3 text-lg uppercase tracking-wider">Contato</h4>
          <a href="mailto:contato@organizo.com" className="text-[#fff] hover:text-[#E9C46A] text-base transition font-semibold">
            contato@organizo.com
          </a>
          <span className="text-sm text-[#fff7]">Segunda a sexta, 9h às 18h</span>
          <div className="flex gap-4 mt-2">
            <a href="#" aria-label="Instagram" className="hover:text-[#E9C46A] text-[#fff] transition">
              <svg width="26" height="26" fill="none" viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="3" rx="5" stroke="currentColor" strokeWidth="1.5"/><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5"/><circle cx="17" cy="7" r="1" fill="currentColor"/></svg>
            </a>
            <a href="#" aria-label="Twitter" className="hover:text-[#E9C46A] text-[#fff] transition">
              <svg width="26" height="26" fill="none" viewBox="0 0 24 24"><path d="M21 7.5c-.6.3-1.2.5-1.8.6.7-.4 1.1-1 1.4-1.7-.7.4-1.3.7-2 .8a3.1 3.1 0 0 0-5.3 2.8c-2.6-.1-5-1.4-6.6-3.5-.3.5-.5 1-.5 1.6 0 1.1.6 2.1 1.6 2.7-.5 0-1-.2-1.4-.4v.1c0 1.5 1.1 2.7 2.5 3-.3.1-.6.2-.9.2-.2 0-.4 0-.6-.1.4 1.2 1.6 2.1 3 2.1A6.2 6.2 0 0 1 3 18.1c-.4 0-.7 0-1-.1A8.7 8.7 0 0 0 7.3 19.5c5.7 0 8.8-4.7 8.8-8.8v-.4c.6-.4 1.1-1 1.5-1.6Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>
            </a>
            <a href="#" aria-label="WhatsApp" className="hover:text-[#E9C46A] text-[#fff] transition">
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
              className="w-full px-4 py-3 rounded border border-[#E9C46A]/30 bg-[#1b2e35] text-base text-[#fff] placeholder-[#fff9] focus:outline-none focus:ring-2 focus:ring-[#E9C46A]/30 transition"
            />
            <button
              type="submit"
              className="w-full px-4 py-3 rounded bg-[#E9C46A] text-[#264653] font-bold text-base hover:bg-[#E9C46A]/80 transition"
            >
              Receber novidades
            </button>
            {newsletterMsg && (
              <span className="text-[#E9C46A] text-sm font-semibold text-center mt-1 animate-pulse">
                {newsletterMsg}
              </span>
            )}
          </form>
        </div>
      </div>
      <div className="mt-12 text-center text-base text-[#fff8] font-semibold tracking-wide">
        © {new Date().getFullYear()} Organizo. Todos os direitos reservados.
      </div>
    </footer>
  );
}