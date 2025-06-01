"use client";

import Sidebar from "@/components/Sidebar";
import MobileSidebar from "@/components/MobileSidebar";
import DashboardContent from "@/components/DashboardContent";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/components/ThemeContext";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // Use o tema para o fundo do dashboard
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { theme, themeKey } = useTheme?.() || {};
  // Se não houver tema, use cor padrão
  const bgColor = theme?.beige || "#F6F5F2";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }
    setTimeout(() => setLoading(false), 500);
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: bgColor }}>
        <span className="text-[#264653] text-xl font-semibold">Carregando...</span>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen w-full flex overflow-x-auto"
      style={{ background: bgColor, transition: "background 0.3s" }}
    >
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <MobileSidebar show={showSidebar} setShow={setShowSidebar} />
      <button
        className="fixed top-4 left-4 z-30 md:hidden bg-[#E9C46A] text-[#264653] p-2 rounded-full shadow-lg hover:bg-[#264653] hover:text-[#E9C46A] transition"
        onClick={() => setShowSidebar(true)}
        aria-label="Abrir menu"
      >
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
      </button>
      <div className={`transition-all duration-300 w-full ${collapsed ? "ml-20" : "ml-72"}`}>
        <DashboardContent />
      </div>
    </main>
  );
}