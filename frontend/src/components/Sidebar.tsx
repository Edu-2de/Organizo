"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { LogoOrganizo } from "./LogoOrganizo";

// Icons
const Icons = {
  home: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <path d="M3 11.5L12 4l9 7.5" stroke="#264653" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="6" y="13" width="12" height="7" rx="2" fill="#E9C46A" stroke="#264653" strokeWidth="2" />
    </svg>
  ),
  tasks: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="4" width="16" height="16" rx="4" fill="#A9C5A0" />
      <path d="M8 12l3 3 5-5" stroke="#264653" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  calendar: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="5" width="18" height="16" rx="3" stroke="#264653" strokeWidth="2.2" fill="#fff"/>
      <path d="M16 3v4M8 3v4" stroke="#264653" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  ),
  settings: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3" fill="#E9C46A" stroke="#264653" strokeWidth="2"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.65 1.65 0 0 0 15 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 8.6 15a1.65 1.65 0 0 0-1.82-.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 15 8.6c.22.13.47.2.72.2s.5-.07.72-.2a1.65 1.65 0 0 0 1.82.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 15z" stroke="#264653" strokeWidth="1.5" />
    </svg>
  ),
  logout: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path d="M16 17l5-5-5-5" stroke="#E76F51" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M21 12H9" stroke="#E76F51" strokeWidth="2.2" strokeLinecap="round"/>
      <rect x="3" y="4" width="8" height="16" rx="2" fill="#fff" stroke="#E76F51" strokeWidth="2"/>
    </svg>
  ),
  chevron: (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path d="M15 6l-6 6 6 6" stroke="#A9C5A0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};

const menuItems = [
  { key: "home", label: "Início", icon: Icons.home, href: "/dashboard?tab=home" },
  { key: "tasks", label: "Tarefas", icon: Icons.tasks, href: "/dashboard?tab=tasks" },
  { key: "calendar", label: "Agenda", icon: Icons.calendar, href: "/dashboard?tab=calendar" },
  { key: "settings", label: "Configurações", icon: Icons.settings, href: "/dashboard?tab=settings" },
];

function OnlyOLogo() {
  return (
    <span
      className="text-4xl font-extrabold flex items-center justify-center select-none"
      style={{
        color: "#E9C46A",
        fontFamily: "inherit",
        letterSpacing: ".04em",
        minHeight: "60px",
        width: "100%",
        lineHeight: 1.0,
      }}
    >
      O
    </span>
  );
}

export default function Sidebar({ collapsed, setCollapsed }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = useMemo(() => searchParams?.get("tab") || "home", [searchParams]);
  const [logoutAnim, setLogoutAnim] = useState(false);

  // animação botão sair
  function handleLogout() {
    setLogoutAnim(true);
    setTimeout(() => {
      setLogoutAnim(false);
      localStorage.removeItem("token");
      router.replace("/login");
    }, 1100); // tempo da animação
  }

  return (
    <aside
      className={`
        fixed top-0 left-0 h-screen z-30
        flex flex-col py-7 px-2 bg-white border-r border-[#E9C46A]/20
        shadow-lg transition-all duration-300
        ${collapsed ? "w-20 min-w-[5rem] max-w-[5rem]" : "w-72 min-w-[16rem] max-w-[18rem]"}
        hidden md:flex
      `}
      style={{
        background: "#fff"
      }}
    >
      {/* Botão de collapse */}
      <button
        className={`
          absolute top-4 right-[-16px] z-40 w-8 h-8 rounded-full bg-white border border-[#e2e3e7] shadow
          flex items-center justify-center transition-all duration-200 hover:bg-[#F6F5F2] active:scale-90
        `}
        style={{
          transform: collapsed ? "rotate(180deg)" : "none",
          boxShadow: "0 1.5px 5px #E9C46A0c",
        }}
        aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
        onClick={() => setCollapsed(c => !c)}
        tabIndex={0}
      >
        {Icons.chevron}
      </button>

      {/* Logo */}
      <div className={`mb-8 flex flex-col items-center w-full transition-all duration-300 ${collapsed ? "py-2" : ""}`}>
        {collapsed ? <OnlyOLogo /> : <LogoOrganizo />}
      </div>

      {/* Menu */}
      <nav className={`flex flex-col gap-1 ${collapsed ? "items-center" : ""}`}>
        {menuItems.map((item) => {
          const isActive = activeTab === item.key;
          return (
            <button
              key={item.key}
              className={`
                group flex ${collapsed ? "justify-center" : "items-center"} gap-3 px-0 py-3 rounded-lg
                transition-all duration-200 font-medium text-base w-full relative
                ${isActive
                  ? "bg-[#E9C46A22] text-[#264653] font-semibold"
                  : "text-[#22223B] hover:bg-[#E9C46A11]"
                }
                outline-none
                focus:ring-2 focus:ring-[#E9C46A]/40
              `}
              onClick={() => router.push(item.href)}
              tabIndex={0}
              aria-current={isActive ? "page" : undefined}
              title={item.label}
            >
              <span className={`w-8 h-8 flex items-center justify-center transition-all ${isActive ? "scale-110" : ""}`}>
                {item.icon}
              </span>
              {!collapsed && <span className="transition-all">{item.label}</span>}
              {/* Highlight bolinha animada */}
              <span
                className={`
                  absolute ${collapsed ? "right-3" : "right-4"} top-1/2 -translate-y-1/2 w-2 h-2 rounded-full
                  transition-all duration-300
                  ${isActive ? "bg-[#E9C46A] opacity-100 scale-100" : "opacity-0 scale-0"}
                `}
              />
            </button>
          );
        })}
      </nav>

      {/* Botão Sair */}
      <div className={`mt-auto flex flex-col items-center w-full mb-4`}>
        <button
          className={`
            relative w-[90%] ${collapsed ? "px-0" : "px-0"} py-2 rounded-xl
            flex items-center justify-center gap-2 text-base font-bold
            border-2 border-[#E76F51]
            ${collapsed
              ? "bg-white text-[#E76F51] hover:bg-[#E76F51]/10"
              : "bg-white text-[#E76F51] hover:bg-[#E76F51]/10"}
            overflow-hidden shadow-none transition-all duration-200
            active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#E76F51]/30 group
            ${logoutAnim ? "logout-anim" : ""}
          `}
          style={{
            minHeight: 44,
          }}
          onClick={handleLogout}
          tabIndex={0}
        >
          <span className={`transition-all duration-200 group-hover:scale-110 group-hover:-translate-x-1 ${logoutAnim ? "logout-icon-anim" : ""}`}>{Icons.logout}</span>
          {!collapsed && (
            <span className={`transition-all duration-200 group-hover:tracking-wider ${logoutAnim ? "logout-text-anim" : ""}`}>
              Sair
            </span>
          )}
          {/* Animação SVG splash */}
          <span
            className={`
              pointer-events-none absolute inset-0 z-10
              ${logoutAnim ? "logout-splash" : ""}
            `}
          />
        </button>
        {/* Extra anim CSS */}
        <style jsx>{`
          .logout-anim {
            animation: logout-pop 0.5s cubic-bezier(.68,1.8,.4,1) 1;
          }
          .logout-icon-anim {
            animation: logout-icon-pop 0.8s cubic-bezier(.68,1.8,.4,1) 1;
          }
          .logout-text-anim {
            animation: logout-text-wiggle 0.6s cubic-bezier(.7,2,.3,1) 1;
          }
          .logout-splash {
            background: radial-gradient(circle at 60% 50%, #E76F51cc 0%, #E9C46A55 60%, #fff0 100%);
            animation: logout-splash-anim 0.7s cubic-bezier(.7,2,.3,1) 1;
            opacity: 0.88;
          }
          @keyframes logout-pop {
            0% { transform: scale(1); box-shadow: 0 0 0 #E76F5100;}
            58% { transform: scale(1.17); box-shadow: 0 2px 30px #E76F5144;}
            80% { transform: scale(0.96);}
            100% { transform: scale(1); box-shadow: 0 0 0 #E76F5100;}
          }
          @keyframes logout-icon-pop {
            0% { transform: scale(1);}
            38% { transform: scale(1.36) rotate(-13deg);}
            62% { transform: scale(1.1) rotate(8deg);}
            100% { transform: scale(1);}
          }
          @keyframes logout-text-wiggle {
            0% { letter-spacing: 0em;}
            35% { letter-spacing: 0.12em;}
            60% { letter-spacing: -0.06em;}
            100% { letter-spacing: 0.02em;}
          }
          @keyframes logout-splash-anim {
            0% { opacity: 0.4; transform: scale(0.7);}
            60% { opacity: 0.9; transform: scale(1.09);}
            100% { opacity: 0; transform: scale(1.2);}
          }
        `}</style>
      </div>
    </aside>
  );
}