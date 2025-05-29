"use client";
import { useRef, useEffect, ElementType } from "react";
import {
  BoltIcon,
  DevicePhoneMobileIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

type FeatureCardProps = {
  Icon: ElementType;
  accent: string;
  title: string;
  description: string;
  index: number;
};

const features = [
  {
    Icon: BoltIcon,
    accent: "bg-[#E9C46A]/25 text-[#E9C46A]",
    title: "Rápido e Moderno",
    description:
      "Interface instantânea, fluida e elegante. Foco total no essencial, sem distrações.",
  },
  {
    Icon: DevicePhoneMobileIcon,
    accent: "bg-[#A9C5A0]/20 text-[#264653]",
    title: "100% Responsivo",
    description:
      "Use em qualquer tela: notebook, tablet ou celular. Sempre bonito e funcional.",
  },
  {
    Icon: Cog6ToothIcon,
    accent: "bg-[#264653]/10 text-[#264653]",
    title: "Personalizável",
    description:
      "Mude temas, cores e organização em segundos. O Organizo se adapta ao seu fluxo.",
  },
];

// Fade-in animado ao aparecer no scroll + micro efeito sutil de flutuação no hover
function FeatureCard({ Icon, accent, title, description, index }: FeatureCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = ref.current;
    if (!card) return;

    card.classList.remove("visible");
    card.classList.add("feature-fade-in");

    // IntersectionObserver para fade-in ao aparecer
    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            card.classList.add("visible");
            observer.disconnect();
          }
        });
      },
      { threshold: 0.25 }
    );
    observer.observe(card);

    return () => observer.disconnect();
  }, [index]);

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

  return (
    <div
      ref={ref}
      tabIndex={0}
      className="group bg-white/80 border border-[#f6f5f2] rounded-xl shadow-sm
      px-7 py-7 flex flex-col items-start text-left
      transition-all duration-300 cursor-pointer outline-none
      hover:scale-[1.04] focus:scale-[1.04] active:scale-[0.97]
      hover:-translate-y-1 focus:-translate-y-1
      hover:shadow-lg focus:shadow-lg
      hover:bg-white focus:bg-white"
      style={{
        minWidth: 0,
        maxWidth: 360,
        width: "100%",
      }}
    >
      <div
        className={`mb-4 ${accent} rounded-lg p-2 transition-all duration-300 group-hover:scale-110 group-focus:scale-110`}
      >
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="text-base font-bold mb-1 text-[#264653]">{title}</h3>
      <p className="text-[#264653cc] font-normal leading-relaxed text-sm">{description}</p>
    </div>
  );
}

export default function Features() {
  return (
    <section className="relative py-16 bg-gradient-to-br from-[#fff9e7] via-[#F6F5F2] to-[#A9C5A0]/30 overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <h2 className="text-xl md:text-2xl font-extrabold text-center mb-2 text-[#264653] tracking-tight">
          Por que escolher o <span className="text-[#E9C46A]">Organizo</span>?
        </h2>
        <p className="text-center text-sm max-w-lg mx-auto mb-10 text-[#264653b2] font-medium">
          Simples, elegante e eficiente. Tudo o que você precisa para organizar sua vida.
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <FeatureCard key={f.title} {...f} index={i} />
          ))}
        </div>
      </div>
      {/* Linha decorativa discreta */}
      <svg
        className="absolute right-0 top-6 h-20 md:h-28 w-36 opacity-10 z-0 pointer-events-none"
        viewBox="0 0 170 130"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M0 70 Q40 16 90 99 T170 30"
          stroke="#E9C46A"
          strokeWidth="11"
          fill="none"
        />
      </svg>
      <style jsx>{`
        .feature-fade-in {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.7s cubic-bezier(.23,1.04,.44,.98),
                      transform 0.7s cubic-bezier(.23,1.04,.44,.98);
        }
        .feature-fade-in.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .group:active {
          box-shadow: 0 2px 16px 0 #E9C46A33 !important;
        }
      `}</style>
    </section>
  );
}