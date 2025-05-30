"use client";
import { useEffect, useRef, useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useTheme } from "@/app/contexts/ThemeContext";

export default function Header() {
  const [visible, setVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastScroll = useRef(0);
  const { theme, toggleTheme } = useTheme();

  // Controla o header sumir só quando o menu não está aberto
  useEffect(() => {
    if (menuOpen) return;

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

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768) setMenuOpen(false);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) {
      setMenuOpen(false);
    }
  }

  // Cores para modo claro e escuro
  const logoOClass = "logo-o";
  const logoTextClass = theme === "dark" ? "logo-text-dark" : "logo-text-light";
  const svgStroke = theme === "dark" ? "#2a9df4" : "#264653";
  const navItemClass = theme === "dark" ? "nav-item-dark" : "nav-item-light";
  const navItemHover = theme === "dark" ? "#fff" : "#E9C46A";
  const navBg = theme === "dark" ? "#181B2A" : "rgba(246,245,242,0.80)";
  const navBorder = theme === "dark" ? "none" : "1px solid rgba(233,196,106,0.3)";
  const navShadow = theme === "dark"
    ? "0 1px 8px 0 #10121A55"
    : "0 1px 6px 0 rgba(233,196,106,0.08)";
  const btnBg = theme === "dark" ? "#23283B" : "#fff";
  const btnText = theme === "dark" ? "#e9e9f3" : "#264653";
  const btnBgHover = theme === "dark" ? "#23283Bcc" : "#fff9e7";
  const btnShadow = theme === "dark"
    ? "0 2px 8px 0 #2a9df433"
    : "0 2px 8px 0 rgba(42,157,244,0.10)";

  // Mobile dropdown styles
  const mobileDropdownBg = theme === "dark" ? "#10121A" : "#fff";
  const mobileDropdownItemBg = theme === "dark" ? "#23283B" : "#fff";
  const mobileDropdownItemClass = theme === "dark" ? "nav-item-dark" : "nav-item-light";
  const mobileDropdownItemShadow = theme === "dark"
    ? "0 2px 8px 0 #10121A55"
    : "0 2px 12px 0 #00000022";

  // Linha abaixo do header
  const headerLine =
    theme === "dark"
      ? (
        <div
          style={{
            height: 2,
            background: "linear-gradient(90deg, #2a9df4 0%, #523A68 100%)",
            width: "100%",
            margin: 0,
            padding: 0,
            opacity: 0.8,
          }}
        />
      )
      : (
        <div
          style={{
            height: 2,
            background: "linear-gradient(90deg, #A9C5A0 0%, #E9C46A 100%)",
            width: "100%",
            margin: 0,
            padding: 0,
            opacity: 0.7,
          }}
        />
      );

  return (
    <header
      className={`backdrop-blur-md sticky top-0 z-50 transition-all ${theme === "dark" ? "dark-header" : ""}`}
      style={{
        background: navBg,
        borderBottom: navBorder,
        boxShadow: navShadow,
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
            textShadow: theme === "dark"
              ? "0 1px 8px #2a9df433"
              : "0 1px 8px rgba(233,196,106,0.08)",
            letterSpacing: "-0.03em",
          }}
        >
          <span className={logoOClass}>O</span>
          <span className={logoTextClass}>rganizo</span>
        </span>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 items-center">
          {["Início", "Sobre", "Contato"].map((item) => (
            <a
              key={item}
              href="#"
              className={`px-3 py-2 rounded-full font-medium transition-colors duration-150 focus:outline-none ${navItemClass}`}
              style={{
                background: "transparent",
                textDecoration: "none",
                opacity: 1,
              }}
              onMouseOver={e => {
                (e.currentTarget as HTMLElement).style.color = navItemHover;
              }}
              onMouseOut={e => {
                (e.currentTarget as HTMLElement).style.color = "";
              }}
            >
              {item}
            </a>
          ))}
          {/* Botão de tema */}
          <button
            onClick={toggleTheme}
            className="ml-2 px-3 py-2 rounded-full font-bold text-base transition"
            aria-label="Alternar tema"
            style={{
              background: btnBg,
              color: btnText,
              boxShadow: btnShadow,
              border: "none",
              fontWeight: 700,
              letterSpacing: "-0.01em",
              transition: "background 0.2s, color 0.2s",
            }}
            onMouseOver={e => {
              (e.currentTarget as HTMLElement).style.background = btnBgHover;
            }}
            onMouseOut={e => {
              (e.currentTarget as HTMLElement).style.background = btnBg;
            }}
          >
            {theme === "dark" ? "🌙 Escuro" : "☀️ Claro"}
          </button>
          {/* Login/Register CTA */}
          <span className="ml-6 flex items-center gap-2">
            <Link
              href="/login"
              className="flex items-center gap-2 px-5 py-2 rounded-full font-bold text-base shadow transition focus:outline-none focus:ring-2"
              style={{
                background: btnBg,
                color: btnText,
                boxShadow: btnShadow,
                border: "none",
                fontWeight: 700,
                letterSpacing: "-0.01em",
                transition: "background 0.2s, color 0.2s",
              }}
              onMouseOver={e => {
                (e.currentTarget as HTMLElement).style.background = btnBgHover;
              }}
              onMouseOut={e => {
                (e.currentTarget as HTMLElement).style.background = btnBg;
              }}
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" stroke={svgStroke} strokeWidth="1.5"/>
                <path d="M21 21c0-3.866-4.03-7-9-7s-9 3.134-9 7" stroke={svgStroke} strokeWidth="1.5"/>
              </svg>
              Entrar
            </Link>
          </span>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-full border border-[#E9C46A]/30 bg-white/70 shadow transition focus:outline-none focus:ring-2 focus:ring-[#E9C46A]/40"
          aria-label="Abrir menu"
          onClick={() => setMenuOpen(true)}
          style={{
            background: theme === "dark" ? "#23283B" : "#fff",
            color: theme === "dark" ? "#fff" : "#264653",
            border: theme === "dark" ? "none" : "1px solid #E9C46A33",
            boxShadow: theme === "dark" ? "0 2px 8px 0 #2a9df433" : "0 2px 8px 0 #E9C46A22"
          }}
        >
          <Bars3Icon className="h-7 w-7" style={{ color: theme === "dark" ? "#2a9df4" : "#E9C46A" }} />
        </button>
      </div>

      {/* Linha abaixo do header */}
      {headerLine}

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-50 flex flex-col"
          style={{
            background: mobileDropdownBg,
            backdropFilter: "blur(6px)",
            height: "100vh",
          }}
          onClick={handleBackdropClick}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E9C46A]/20"
            style={{
              background: theme === "dark" ? "#181B2A" : "#fff",
              borderBottom: theme === "dark" ? "none" : "1px solid #E9C46A33"
            }}>
            <span className="text-2xl font-extrabold tracking-tight select-none">
              <span className={logoOClass}>O</span>
              <span className={logoTextClass}>rganizo</span>
            </span>
            <button
              className="p-2 rounded-full shadow transition focus:outline-none"
              style={{
                background: theme === "dark" ? "#23283B" : "#fff",
                color: "#2a9df4",
                border: "none"
              }}
              aria-label="Fechar menu"
              onClick={() => setMenuOpen(false)}
            >
              <XMarkIcon className="h-7 w-7" style={{ color: "#2a9df4" }} />
            </button>
          </div>
          <div className="flex-1 w-full flex flex-col items-center justify-center"
            style={{
              background: theme === "dark" ? "#181B2A" : "#fff"
            }}>
            <nav className="flex flex-col gap-4 px-8 py-10 items-center animate-fade-in-down w-full max-w-md mx-auto">
              {["Início", "Sobre", "Contato"].map((item, idx) => (
                <a
                  key={item}
                  href="#"
                  className={`w-full text-center text-xl font-bold rounded-2xl py-3 px-6 mb-2 transition-all duration-150 ${mobileDropdownItemClass}`}
                  style={{
                    animation: `slideIn .3s cubic-bezier(.4,2,.6,.9) ${idx * 60}ms both`,
                    background: mobileDropdownItemBg,
                    opacity: 1,
                    boxShadow: mobileDropdownItemShadow,
                  }}
                  onClick={() => setMenuOpen(false)}
                  onMouseOver={e => {
                    (e.currentTarget as HTMLElement).style.color = "#fff";
                  }}
                  onMouseOut={e => {
                    (e.currentTarget as HTMLElement).style.color = "";
                  }}
                >
                  {item}
                </a>
              ))}
              {/* Botão de tema mobile */}
              <button
                onClick={toggleTheme}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-full font-bold text-lg shadow transition mt-2"
                aria-label="Alternar tema"
                style={{
                  background: btnBg,
                  color: btnText,
                  border: "none",
                  boxShadow: btnShadow,
                  fontWeight: 700,
                  letterSpacing: "-0.01em",
                  transition: "background 0.2s, color 0.2s",
                }}
                onMouseOver={e => {
                  (e.currentTarget as HTMLElement).style.background = btnBgHover;
                }}
                onMouseOut={e => {
                  (e.currentTarget as HTMLElement).style.background = btnBg;
                }}
              >
                {theme === "dark" ? "🌙 Modo Escuro" : "☀️ Modo Claro"}
              </button>
              {/* Login/Register CTA mobile */}
              <div className="w-full flex flex-col items-center mt-6">
                <Link
                  href="/login"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-full font-bold text-lg shadow transition focus:outline-none focus:ring-2"
                  onClick={() => setMenuOpen(false)}
                  style={{
                    background: btnBg,
                    color: btnText,
                    border: "none",
                    boxShadow: btnShadow,
                    fontWeight: 700,
                    letterSpacing: "-0.01em",
                    transition: "background 0.2s, color 0.2s",
                  }}
                  onMouseOver={e => {
                    (e.currentTarget as HTMLElement).style.background = btnBgHover;
                  }}
                  onMouseOut={e => {
                    (e.currentTarget as HTMLElement).style.background = btnBg;
                  }}
                >
                  <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                    <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" stroke={svgStroke} strokeWidth="1.5"/>
                    <path d="M21 21c0-3.866-4.03-7-9-7s-9 3.134-9 7" stroke={svgStroke} strokeWidth="1.5"/>
                  </svg>
                  Entrar
                </Link>
              </div>
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