"use client";

import { useRouter } from "next/navigation";

const menuItems = [
  { key: "home", label: "Início", icon: "🏠" },
  { key: "tasks", label: "Tarefas", icon: "📋" },
  { key: "calendar", label: "Agenda", icon: "📅" },
  { key: "settings", label: "Configurações", icon: "⚙️" },
];

export default function MobileSidebar({ show, setShow }: { show: boolean, setShow: (v: boolean) => void }) {
  const router = useRouter();

  return (
    <aside className={`
      fixed top-0 left-0 z-40 h-screen w-64 bg-white/95 border-r border-[#E9C46A]/30 shadow-2xl flex flex-col py-8 px-4 gap-6 dark-mode-card
      transition-transform duration-300
      ${show ? "translate-x-0" : "-translate-x-full"}
      md:hidden
    `}>
      <div className="flex items-center gap-2 mb-8">
        <span className="text-3xl font-extrabold text-[#264653] dark-mode-logo drop-shadow">Organizo</span>
      </div>
      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => (
          <button
            key={item.key}
            className={`
              flex items-center px-4 py-3 rounded-lg font-semibold
              transition text-[#264653] hover:bg-[#E9C46A]/30 dark-mode-label
            `}
            onClick={() => {
              router.push(`/dashboard?tab=${item.key}`);
              setShow(false);
            }}
          >
            <span className="mr-2">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
      <div className="mt-auto">
        <button
          className="w-full px-4 py-3 rounded-full bg-[#E9C46A] text-[#264653] font-bold text-base hover:bg-[#E9C46A]/80 transition shadow-lg hover:scale-105 active:scale-95 duration-150 main-btn dark-mode-btn flex items-center justify-center"
          onClick={() => {
            localStorage.removeItem("token");
            router.replace("/login");
          }}
        >
          <span className="mr-2">🚪</span>
          Sair
        </button>
      </div>
      {/* Botão fechar sidebar mobile */}
      <button
        className="absolute top-4 right-4 text-[#264653] hover:text-[#E9C46A] transition"
        onClick={() => setShow(false)}
        aria-label="Fechar menu"
      >
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
      </button>
    </aside>
  );
}