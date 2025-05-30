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

// Tipo só para os dados do array
type FeatureData = {
  Icon: ElementType;
  accent: "gold" | "petrol";
  title: string;
  description: string;
};

// Props completas do card
type FeatureCardProps = FeatureData & {
  index: number;
  shuffle: boolean;
};

const allFeatures: FeatureData[] = [
  {
    Icon: BoltIcon,
    accent: "gold",
    title: "Rápido e Moderno",
    description:
      "Interface instantânea, fluida e elegante. Foco total no essencial, sem distrações.",
  },
  {
    Icon: DevicePhoneMobileIcon,
    accent: "petrol",
    title: "100% Responsivo",
    description:
      "Use em qualquer tela: notebook, tablet ou celular. Sempre bonito e funcional.",
  },
  {
    Icon: Cog6ToothIcon,
    accent: "petrol",
    title: "Personalizável",
    description:
      "Mude temas, cores e organização em segundos. O Organizo se adapta ao seu fluxo.",
  },
  {
    Icon: ShieldCheckIcon,
    accent: "petrol",
    title: "Seguro e Privado",
    description:
      "Seus dados protegidos com criptografia e privacidade total.",
  },
  {
    Icon: ClockIcon,
    accent: "gold",
    title: "Produtividade Real",
    description:
      "Ferramentas para você focar no que importa e ganhar tempo de verdade.",
  },
  {
    Icon: SparklesIcon,
    accent: "gold",
    title: "Design Inspirador",
    description:
      "Visual minimalista, leve e agradável para motivar sua rotina.",
  },
  {
    Icon: AdjustmentsHorizontalIcon,
    accent: "petrol",
    title: "Totalmente Ajustável",
    description:
      "Adapte listas, categorias e temas ao seu jeito de organizar.",
  },
];

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function FeatureCard(props: FeatureCardProps) {
  const { Icon, accent, title, description, index, shuffle: isShuffling } = props;
  const ref = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const card = ref.current;
    if (!card) return;
    const onClick = () => {
      card.classList.add("ring-4", "ring-[var(--color-gold)]/40");
      setTimeout(() => {
        card.classList.remove("ring-4", "ring-[var(--color-gold)]/40");
      }, 250);
    };
    card.addEventListener("mousedown", onClick);
    return () => card.removeEventListener("mousedown", onClick);
  }, []);

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

  const accentColor = accent === "gold" ? "var(--color-gold)" : "var(--color-petrol)";
  const textColor = "var(--color-petrol)";
  const bgColor = "var(--color-beige)";

  return (
    <div
      ref={ref}
      tabIndex={0}
      className={`
        group border rounded-3xl shadow-xl
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
        background: bgColor,
        borderColor: "var(--color-beige)",
        boxShadow: "0 4px 32px 0 var(--color-gold)13",
      }}
    >
      <div
        className={`
          mb-6 rounded-2xl p-5 flex items-center justify-center
          transition-all duration-300 group-hover:scale-110 group-focus:scale-110
          shadow
        `}
        style={{
          background: bgColor,
          boxShadow: "0 4px 16px 0 rgba(38,70,83,0.13)",
        }}
      >
        <Icon className="h-10 w-10" style={{ color: accentColor }} />
      </div>
      <h3 className="text-xl font-extrabold mb-2 tracking-tight" style={{ color: textColor }}>
        {title}
      </h3>
      <p className="font-medium leading-relaxed text-base" style={{ color: "var(--color-petrol)", opacity: 0.73 }}>
        {description}
      </p>
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
    <section
      className="relative py-24 overflow-hidden"
      style={{ background: "var(--color-beige)" }}
    >
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        {/* Título animado e criativo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-3">
            <h2
              className="text-4xl md:text-5xl font-black text-center tracking-tight drop-shadow-sm leading-tight"
              style={{ color: "var(--color-petrol)" }}
            >
              O que faz o <span style={{ color: "var(--color-gold)" }}>Organizo</span> ser único?
            </h2>
            <button
              aria-label="Embaralhar recursos"
              onClick={handleRefresh}
              disabled={refreshing}
              className={`
                p-5 rounded-full border-2 shadow-lg transition
                hover:bg-[#fff9e7] hover:scale-110 active:scale-95
                focus:outline-none
                ${refreshing ? "opacity-60 pointer-events-none" : ""}
              `}
              style={{
                borderColor: "var(--color-gold)",
                background: "var(--color-beige)",
                boxShadow: "0 2px 8px 0 var(--color-gold)22",
                transition: "all 0.2s",
              }}
            >
              <ArrowPathIcon
                className={`h-8 w-8`}
                style={{
                  color: "var(--color-gold)",
                  transition: "color 0.2s",
                  animation: refreshing ? "spin 1s linear infinite" : undefined,
                }}
              />
            </button>
          </div>
        </div>
        {/* Mini texto animado */}
        <div className="flex justify-center mb-16">
          <div className="relative max-w-2xl text-center">
            <p
              className="text-lg font-medium leading-relaxed transition-all duration-500 hover:scale-[1.03]"
              style={{
                color: "var(--color-petrol)",
                opacity: 0.7,
              }}
            >
              Mais do que um organizador:{" "}
              <span className="font-bold" style={{ color: "var(--color-gold)", opacity: 1 }}>
                experimente produtividade com leveza
              </span>
              .<br />
              Simples, elegante e feito para inspirar você todos os dias.
            </p>
          </div>
        </div>
        <div className="grid gap-10 md:gap-14 grid-cols-1 md:grid-cols-3 items-stretch">
          {features.map((f, i) => (
            <FeatureCard
              key={f.title}
              Icon={f.Icon}
              accent={f.accent}
              title={f.title}
              description={f.description}
              index={i}
              shuffle={shuffleAnim}
            />
          ))}
        </div>
      </div>
      <style jsx global>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </section>
  );
}