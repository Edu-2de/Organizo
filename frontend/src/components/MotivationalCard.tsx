"use client";
import React, { useEffect, useState, useRef } from "react";
import { ClipboardIcon, ArrowPathIcon, SparklesIcon } from "@heroicons/react/24/outline";
import Card from "@/components/Card";
import { useTheme } from "@/components/ThemeContext";
import { THEMES } from "@/components/themes";

// Frases motivacionais
const phrases = [
  "Você é capaz de fazer grandes coisas hoje! 💡",
  "Cada pequeno passo é progresso. Continue!",
  "Foco, força e fé para conquistar seus objetivos.",
  "O sucesso é a soma de pequenos esforços repetidos diariamente.",
  "Acredite no seu potencial e faça acontecer!"
];

// Cores de fundo por tema (clean e sem muito degradê)
const backgroundsByTheme = {
  classic: [
    "#fffbe8", "#e8f5e9", "#fce4ec", "#e0f7fa", "#f3e5f5"
  ],
  sunset: [
    "#FFD452", "#FFAF7B", "#F76D77", "#FFECD2", "#A4508B"
  ],
  ocean: [
    "#E0FBFC", "#97C1A9", "#3A506B", "#247BA0", "#155263"
  ]
};

export default function MotivationalCard() {
  const themeCtx = useTheme?.();
  const themeKey = themeCtx?.themeKey || "classic";
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const theme = THEMES[themeKey];

  // Escolhe backgrounds conforme o tema
  const backgrounds = backgroundsByTheme[themeKey] || backgroundsByTheme.classic;

  const [phrase, setPhrase] = useState(() => phrases[Math.floor(Math.random() * phrases.length)]);
  const [bg, setBg] = useState(backgrounds[0]);
  const [tooltip, setTooltip] = useState(false);
  const [slide, setSlide] = useState(false);
  const [shine, setShine] = useState(false);
  const [bouncing, setBouncing] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const interval = setInterval(() => handleChangePhrase(), 30000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [phrase, themeKey]);

  function getRandomPhrase(current: string) {
    let newPhrase = current;
    while (newPhrase === current) {
      newPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    }
    return newPhrase;
  }

  function getRandomBg(current: string) {
    let newBg = current;
    while (newBg === current) {
      newBg = backgrounds[Math.floor(Math.random() * backgrounds.length)];
    }
    return newBg;
  }

  function handleChangePhrase() {
    setSlide(true);
    setShine(true);
    setTimeout(() => {
      setPhrase(getRandomPhrase(phrase));
      setBg(getRandomBg(bg));
      setSlide(false);
      setTimeout(() => setShine(false), 800);
      audioRef.current?.play();
    }, 400);
  }

  function handleCopy() {
    navigator.clipboard.writeText(phrase);
    setTooltip(true);
    setTimeout(() => setTooltip(false), 1200);
  }

  function handleLetterHover(idx: number) {
    setBouncing(idx);
    setTimeout(() => setBouncing(null), 350);
  }

  // Split frase preservando espaços
  function splitWithSpaces(text: string) {
    return text.split(/(\s)/g);
  }

  // Cores por tema para detalhes (clean e consistente)
  const themeColors = {
    classic: {
      icon: "#f4a261",
      title: "#523A68",
      text: "#264653",
      button1: "#f4a261",
      button1Hover: "#e76f51",
      button1Text: "#fff",
      button2: "#e9c46a",
      button2Hover: "#f4e285",
      button2Text: "#523A68",
      tooltipBg: "#523A68",
      tooltipText: "#fff",
      shineGradient: "linear-gradient(90deg, #f4a261 10%, #fffbe8 50%, #f4a261 90%)",
      shineColor: "#264653",
      shineShadow: "#f4a26133",
      shineSelection: "#f4a26133"
    },
    sunset: {
      icon: "#A4508B",
      title: "#A4508B",
      text: "#2D142C",
      button1: "#F76D77",
      button1Hover: "#A4508B",
      button1Text: "#fff",
      button2: "#FFD452",
      button2Hover: "#FFAF7B",
      button2Text: "#A4508B",
      tooltipBg: "#FFD452",
      tooltipText: "#A4508B",
      shineGradient: "linear-gradient(90deg, #FFD452 10%, #F76D77 50%, #A4508B 90%)",
      shineColor: "#A4508B",
      shineShadow: "#FFD45233",
      shineSelection: "#FFD45233"
    },
    ocean: {
      icon: "#247BA0",
      title: "#155263",
      text: "#155263",
      button1: "#247BA0",
      button1Hover: "#155263",
      button1Text: "#E0FBFC",
      button2: "#97C1A9",
      button2Hover: "#3A506B",
      button2Text: "#155263",
      tooltipBg: "#E0FBFC",
      tooltipText: "#155263",
      shineGradient: "linear-gradient(90deg, #E0FBFC 10%, #247BA0 50%, #3A506B 90%)",
      shineColor: "#155263",
      shineShadow: "#247BA033",
      shineSelection: "#E0FBFC33"
    }
  };

  const colors = themeColors[themeKey] || themeColors.classic;

  // Ajuste para garantir contraste do texto no fundo
  const cardStyle = {
    background: bg,
    border: "none",
    boxShadow: `0 2px 12px ${colors.icon}22`,
    color: colors.text
  };

  return (
    <Card
      className={`relative flex flex-col items-center justify-center min-h-[120px] sm:min-h-[140px] px-4 py-6 rounded-xl shadow-md transition-all duration-500
        ${slide ? "animate-fade-out" : "animate-fade-in"}
      `}
      style={cardStyle}
    >
      <audio ref={audioRef} src="https://cdn.pixabay.com/audio/2022/07/26/audio_124bfae6c2.mp3" preload="auto" />
      <div className="flex items-center gap-2 mb-2">
        <SparklesIcon className="w-5 h-5" style={{ color: colors.icon }} />
        <span className="text-base sm:text-lg font-semibold select-none" style={{ color: colors.title }}>
          Motivação do dia
        </span>
      </div>
      <span
        className={`
          text-sm sm:text-base text-center min-h-[40px] select-text font-medium
          transition-all duration-300 cursor-pointer
          ${shine ? "hovered-motivation" : ""}
        `}
        onMouseEnter={() => setShine(true)}
        onMouseLeave={() => setShine(false)}
        title="Passe o mouse para um efeito especial"
        style={{
          color: colors.text,
          textShadow:
            themeKey === "ocean"
              ? "0 2px 8px #E0FBFC99"
              : themeKey === "sunset"
              ? "0 2px 8px #FFD45299"
              : "none"
        }}
      >
        {splitWithSpaces(phrase).map((char, idx) => (
          <span
            key={idx}
            className={`
              inline-block transition-transform duration-300
              ${bouncing === idx ? "animate-bounce-letter" : ""}
              ${char === " " ? "w-1" : ""}
            `}
            onMouseEnter={() => char !== " " && handleLetterHover(idx)}
            style={{
              color:
                themeKey === "ocean"
                  ? "#155263"
                  : themeKey === "sunset"
                  ? "#A4508B"
                  : undefined
            }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>
      <div className="flex gap-2 mt-4">
        <button
          onClick={handleChangePhrase}
          className="flex items-center justify-center p-2 rounded-lg transition text-white shadow"
          title="Nova frase"
          style={{
            background: colors.button1,
            color: colors.button1Text
          }}
          onMouseOver={e => (e.currentTarget.style.background = colors.button1Hover)}
          onMouseOut={e => (e.currentTarget.style.background = colors.button1)}
        >
          <ArrowPathIcon className="w-5 h-5" />
        </button>
        <button
          onClick={handleCopy}
          className="flex items-center justify-center p-2 rounded-lg transition shadow relative"
          title="Copiar frase"
          style={{
            background: colors.button2,
            color: colors.button2Text
          }}
          onMouseOver={e => (e.currentTarget.style.background = colors.button2Hover)}
          onMouseOut={e => (e.currentTarget.style.background = colors.button2)}
        >
          <ClipboardIcon className="w-5 h-5" />
          {tooltip && (
            <span
              className="absolute left-1/2 -translate-x-1/2 -top-8 text-xs px-2 py-1 rounded shadow animate-fade-in"
              style={{
                background: colors.tooltipBg,
                color: colors.tooltipText
              }}
            >
              Copiado!
            </span>
          )}
        </button>
      </div>
      <style>{`
        .hovered-motivation {
          background: ${colors.shineGradient};
          background-size: 200% 100%;
          background-clip: text;
          -webkit-background-clip: text;
          color: ${colors.shineColor};
          -webkit-text-fill-color: ${colors.shineColor};
          animation: gradient-move 1.2s linear infinite;
          transform: scale(1.045);
          text-shadow: 0 2px 16px ${colors.shineShadow}, 0 1px 0 ${bg};
          filter: brightness(1.10);
        }
        .hovered-motivation::selection {
          background: ${colors.shineSelection};
        }
        @keyframes gradient-move {
          0% { background-position: 200% 0; }
          100% { background-position: 0 0; }
        }
        .animate-bounce-letter {
          animation: bounce 0.35s cubic-bezier(.36,.07,.19,.97);
        }
        @keyframes bounce {
          0% { transform: translateY(0);}
          30% { transform: translateY(-10px) scale(1.2);}
          60% { transform: translateY(2px) scale(0.95);}
          100% { transform: translateY(0) scale(1);}
        }
        .animate-fade-in {
          animation: fadeIn 0.3s;
        }
        .animate-fade-out {
          animation: fadeOut 0.4s;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px);}
          to { opacity: 1; transform: translateY(0);}
        }
        @keyframes fadeOut {
          from { opacity: 1; transform: translateY(0);}
          to { opacity: 0; transform: translateY(-20px);}
        }
      `}</style>
    </Card>
  );
}