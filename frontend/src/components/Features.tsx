"use client";
import { useRef, useEffect, ElementType, useState } from "react";
import {
  BoltIcon,
  DevicePhoneMobileIcon,
  Cog6ToothIcon,
  ArrowPathIcon,
  SparklesIcon,
  AdjustmentsHorizontalIcon,
  ShieldCheckIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

type FeatureCardProps = {
  Icon: ElementType;
  accent: string;
  title: string;
  description: string;
  index: number;
  shuffle: boolean;
};

const allFeatures = [
  {
    Icon: BoltIcon,
    accent: "from-[#E9C46A]/30 to-[#fff9e7]/60 text-[#E9C46A]",
    title: "Rápido e Moderno",
    description:
      "Interface instantânea, fluida e elegante. Foco total no essencial, sem distrações.",
  },
  {
    Icon: DevicePhoneMobileIcon,
    accent: "from-[#A9C5A0]/30 to-[#F6F5F2]/60 text-[#264653]",
    title: "100% Responsivo",
    description:
      "Use em qualquer tela: notebook, tablet ou celular. Sempre bonito e funcional.",
  },
  {
    Icon: Cog6ToothIcon,
    accent: "from-[#264653]/10 to-[#E9C46A]/10 text-[#264653]",
    title: "Personalizável",
    description:
      "Mude temas, cores e organização em segundos. O Organizo se adapta ao seu fluxo.",
  },
  {
    Icon: ShieldCheckIcon,
    accent: "from-[#264653]/10 to-[#A9C5A0]/10 text-[#264653]",
    title: "Seguro e Privado",
    description:
      "Seus dados protegidos com criptografia e privacidade total.",
  },
  {
    Icon: ClockIcon,
    accent: "from-[#E9C46A]/20 to-[#A9C5A0]/10 text-[#E9C46A]",
    title: "Produtividade Real",
    description:
      "Ferramentas para você focar no que importa e ganhar tempo de verdade.",
  },
  {
    Icon: SparklesIcon,
    accent: "from-[#fff9e7]/40 to-[#E9C46A]/20 text-[#E9C46A]",
    title: "Design Inspirador",
    description:
      "Visual minimalista, leve e agradável para motivar sua rotina.",
  },
  {
    Icon: AdjustmentsHorizontalIcon,
    accent: "from-[#A9C5A0]/20 to-[#fff9e7]/40 text-[#264653]",
    title: "Totalmente Ajustável",
    description:
      "Adapte listas, categorias e temas ao seu jeito de organizar.",
  },
];

function shuffle<T>(arr: T[]): T[] {
  // Fisher-Yates shuffle
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function FeatureCard({ Icon, accent, title, description, index, shuffle: isShuffling }: FeatureCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Fade-in ao aparecer no scroll
  useEffect(() => {
    const card = ref.current;
    if (!card) return;

    const handleScroll = () => {
      const rect = card.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.92) {
        card.classList.add("opacity-100", "translate-y-0");
        card.classList.remove("opacity-0", "translate-y-12");
      }
    };

    card.classList.add("opacity-0", "translate-y-12");
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Efeito de highlight ao clicar
  useEffect(() => {
    const card = ref.current;
    if (!card) return;
    const onClick = () => {
      card.classList.add("ring-4", "ring-[#E9C46A]/40");
      setTimeout(() => {
        card.classList.remove("ring-4", "ring-[#E9C46A]/40");
      }, 250);
    };
    card.addEventListener("mousedown", onClick);
    return () => card.removeEventListener("mousedown", onClick);
  }, []);

  // Animação de shuffle (embaralhar)
  useEffect(() => {
    const card = ref.current;
    if (!card) return;
    if (isShuffling) {
      card.classList.add("shuffle-anim");
      setTimeout(() => {
        card.classList.remove("shuffle-anim");
      }, 500);
    }
  }, [isShuffling]);

  return (
    <div
      ref={ref}
      tabIndex={0}
      className={`
        group bg-white/90 border border-[#f6f5f2] rounded-3xl shadow-xl
        px-12 py-14 flex flex-col items-center text-center
        transition-all duration-700 ease-[cubic-bezier(.23,1.04,.44,.98)]
        cursor-pointer outline-none
        hover:scale-[1.04] focus:scale-[1.04] active:scale-[0.98]
        hover:-translate-y-2 focus:-translate-y-2
        hover:shadow-2xl focus:shadow-2xl
        hover:bg-white focus:bg-white
        opacity-0 translate-y-12
      `}
      style={{
        minWidth: 0,
        maxWidth: 420,
        width: "100%",
        margin: "0 auto",
        transitionDelay: `${index * 120}ms`,
        background:
          "linear-gradient(135deg,rgba(255,255,255,0.97) 80%,rgba(233,196,106,0.09) 100%)",
        boxShadow: "0 4px 32px 0 #E9C46A13",
      }}
    >
      <div
        className={`
          mb-6 bg-gradient-to-br ${accent} rounded-2xl p-5 flex items-center justify-center
          transition-all duration-300 group-hover:scale-110 group-focus:scale-110
          shadow
        `}
        style={{
          boxShadow: "0 4px 16px 0 #E9C46A22",
        }}
      >
        <Icon className="h-10 w-10" />
      </div>
      <h3 className="text-xl font-extrabold mb-2 text-[#264653] tracking-tight">{title}</h3>
      <p className="text-[#264653bb] font-medium leading-relaxed text-base">{description}</p>
      <style jsx>{`
        .shuffle-anim {
          animation: shuffleCard 0.5s cubic-bezier(.4,2,.6,.9);
        }
        @keyframes shuffleCard {
          0% { transform: scale(1) rotate(0deg); }
          20% { transform: scale(1.08) rotate(-6deg); }
          50% { transform: scale(0.92) rotate(8deg); }
          80% { transform: scale(1.04) rotate(-4deg);}
          100% { transform: scale(1) rotate(0deg);}
        }
      `}</style>
    </div>
  );
}

export default function Features() {
  const [features, setFeatures] = useState(() =>
    shuffle(allFeatures).slice(0, 3)
  );
  const [refreshing, setRefreshing] = useState(false);
  const [shuffleAnim, setShuffleAnim] = useState(false);

  function handleRefresh() {
    setRefreshing(true);
    setShuffleAnim(true);
    setTimeout(() => {
      setFeatures(shuffle(allFeatures).slice(0, 3));
      setRefreshing(false);
      setTimeout(() => setShuffleAnim(false), 500);
    }, 350);
  }

    return (
    <section className="relative py-24 bg-gradient-to-br from-[#fff9e7] via-[#F6F5F2] to-[#A9C5A0]/20 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        {/* Título animado e criativo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2">
            <span className="inline-block px-4 py-1 rounded-full bg-[#E9C46A]/20 text-[#E9C46A] text-xs font-bold tracking-widest uppercase animate-pulse shadow-sm">
              Descubra o diferencial
            </span>
            <button
              aria-label="Embaralhar recursos"
              onClick={handleRefresh}
              disabled={refreshing}
              className={`
                ml-2 p-2 rounded-full border border-[#E9C46A]/40 bg-white/80 shadow transition
                hover:bg-[#fff9e7] hover:scale-110 active:scale-95
                focus:outline-none focus:ring-2 focus:ring-[#E9C46A]/40
                ${refreshing ? "opacity-60 pointer-events-none" : ""}
              `}
              style={{ transition: "all 0.2s" }}
            >
              <ArrowPathIcon
                className={`h-5 w-5 text-[#E9C46A] ${refreshing ? "animate-spin" : ""}`}
              />
            </button>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-center mb-3 text-[#264653] tracking-tight drop-shadow-sm leading-tight">
            O que faz o <span className="text-[#E9C46A]">Organizo</span> ser único?
          </h2>
        </div>
        {/* Mini texto animado */}
        <div className="flex justify-center mb-16">
          <div className="relative max-w-2xl text-center">
            <p className="text-lg text-[#264653b2] font-medium leading-relaxed transition-all duration-500 hover:scale-[1.03] hover:text-[#264653]">
              Mais do que um organizador: <span className="font-bold text-[#E9C46A]">experimente produtividade com leveza</span>.<br />
              Simples, elegante e feito para inspirar você todos os dias.
            </p>
          </div>
        </div>
        <div className="grid gap-10 md:gap-14 grid-cols-1 md:grid-cols-3 items-stretch">
          {features.map((f, i) => (
            <FeatureCard key={f.title} {...f} index={i} shuffle={shuffleAnim} />
          ))}
        </div>
      </div>
      {/* Linha decorativa animada REMOVIDA */}
      <style jsx>{`
        @keyframes floatLine {
          0% { transform: translateY(0); }
          100% { transform: translateY(18px); }
        }
      `}</style>
    </section>
  );
}