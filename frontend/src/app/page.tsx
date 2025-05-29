import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import MiniDashboard from "@/components/MiniDashboard";
export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
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