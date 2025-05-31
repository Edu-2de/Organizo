"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import MiniDashboard from "@/components/MiniDashboard";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("token")) {
      router.replace("/dashboard");
    }
  }, [router]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 main-bg">
      <Header />
      <main className="flex-1">
        <Hero />
        <Features />
        <MiniDashboard />
      </main>
      <Footer />
    </div>
  );
}