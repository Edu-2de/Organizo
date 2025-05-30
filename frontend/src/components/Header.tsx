"use client";
import { useEffect, useRef, useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

export default function Header() {
  const [visible, setVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastScroll = useRef(0);

  // Controla o header sumir só quando o menu não está aberto
  useEffect(() => {
    if (menuOpen) return; // Não ativa scroll quando menu está aberto

    let ticking = false;
    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          if (scrollY < 10) {
            setVisible(true);
          } else if (scrollY > lastScroll.current) {
            setVisible(false);
          } else {
            setVisible(true);
          }
          lastScroll.current = scrollY;
          ticking = false;
        });
        ticking = true;
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [menuOpen]);

  // Fecha menu ao redimensionar para desktop
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768) setMenuOpen(false);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Impede scroll do body quando menu está aberto
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Fecha menu ao clicar fora do dropdown (mas não fecha ao clicar dentro)
  function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) {
      setMenuOpen(false);
    }
  }

  return (
    <header
      className="backdrop-blur-md sticky top-0 z-50 transition-all"
      style={{
        background: "rgba(246,245,242,0.80)",
        borderBottom: "1px solid rgba(233,196,106,0.3)",
        boxShadow: "0 1px 6px 0 rgba(233,196,106,0.08)",
        transform: visible || menuOpen ? "translateY(0)" : "translateY(-110%)",
        opacity: visible || menuOpen ? 1 : 0,
        pointerEvents: visible || menuOpen ? "auto" : "none",
        transition: "transform 0.35s cubic-bezier(.4,0,.2,1), opacity 0.25s",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <span
          className="text-2xl font-extrabold tracking-tight select-none"
          style={{
            color: "#264653",
            textShadow: "0 1px 8px rgba(233,196,106,0.08)",
            letterSpacing: "-0.03em",
          }}
        >
          <span style={{ color: "#E9C46A" }}>O</span>rganizo
        </span>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 items-center">
          {["Início", "Sobre", "Contato"].map((item) => (
            <a
              key={item}
              href="#"
              className="px-3 py-2 rounded-full font-medium text-[#264653e6] transition-colors duration-150 hover:bg-[#E9C46A]/20 hover:text-[#E9C46A] focus:outline-none"
              style={{ textDecoration: "none" }}
            >
              {item}
            </a>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-full border border-[#E9C46A]/30 bg-white/70 shadow transition hover:bg-[#fff9e7] focus:outline-none focus:ring-2 focus:ring-[#E9C46A]/40"
          aria-label="Abrir menu"
          onClick={() => setMenuOpen(true)}
        >
          <Bars3Icon className="h-7 w-7 text-[#E9C46A]" />
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-50 flex flex-col"
          style={{
            background: "rgba(38,70,83,0.96)", // fundo escuro, cobre toda a tela
            backdropFilter: "blur(6px)",
            height: "100vh",
          }}
          onClick={handleBackdropClick}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E9C46A]/20 bg-white/90 shadow-md">
            <span className="text-2xl font-extrabold tracking-tight select-none" style={{ color: "#264653" }}>
              <span style={{ color: "#E9C46A" }}>O</span>rganizo
            </span>
            <button
              className="p-2 rounded-full border border-[#E9C46A]/30 bg-white/80 shadow hover:bg-[#fff9e7] focus:outline-none focus:ring-2 focus:ring-[#E9C46A]/40 transition"
              aria-label="Fechar menu"
              onClick={() => setMenuOpen(false)}
            >
              <XMarkIcon className="h-7 w-7 text-[#E9C46A]" />
            </button>
          </div>
          {/* Fundo branco para o menu */}
          <div className="flex-1 w-full flex flex-col items-center justify-center bg-white/90">
            <nav className="flex flex-col gap-4 px-8 py-10 items-center animate-fade-in-down w-full max-w-md mx-auto">
              {["Início", "Sobre", "Contato"].map((item, idx) => (
                <a
                  key={item}
                  href="#"
                  className="w-full text-center text-xl font-bold text-[#264653] rounded-2xl py-3 px-6 mb-2 bg-white shadow-md hover:bg-[#E9C46A]/20 hover:text-[#E9C46A] transition-all duration-150"
                  style={{
                    animation: `slideIn .3s cubic-bezier(.4,2,.6,.9) ${idx * 60}ms both`,
                  }}
                  onClick={() => setMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>
          <style jsx>{`
            @keyframes slideIn {
              0% {
                opacity: 0;
                transform: translateY(32px) scale(0.98);
              }
              100% {
                opacity: 1;
                transform: translateY(0) scale(1);
              }
            }
          `}</style>
        </div>
      )}
    </header>
  );
}