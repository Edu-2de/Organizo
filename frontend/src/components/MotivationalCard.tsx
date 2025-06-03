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

// Cores de fundo por tema
const backgroundsByTheme = {
  classic: [
    "#fffbe8", "#f1e9d2", "#fff9c4"
  ],
  sunset: [
    "#FFF5E1", "#FFAF7B", "#F76D77"
  ],
  ocean: [
    "#F7FEFF", "#E0FBFC", "#B6E6F5", "#fff"
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

  // Cores por tema para detalhes (clean, consistente e fiéis à paleta)
  const themeColors = {
    classic: {
      icon: "#e9c46a",
      title: "#b08968",
      text: "#264653",
      button1: "#e9c46a",
      button1Hover: "#f4e285",
      button1Text: "#264653",
      button2: "#f4e285",
      button2Hover: "#e9c46a",
      button2Text: "#264653",
      tooltipBg: "#fffbe8",
      tooltipText: "#523A68",
      shineColor: "#264653"
    },
    sunset: {
      icon: "#FFD452",
      title: "#A4508B",
      text: "#A4508B",
      button1: "#F76D77",
      button1Hover: "#FFD452",
      button1Text: "#fff",
      button2: "#FFD452",
      button2Hover: "#FFAF7B",
      button2Text: "#A4508B",
      tooltipBg: "#FFF5E1",
      tooltipText: "#A4508B",
      shineColor: "#A4508B"
    },
    ocean: {
      icon: "#247BA0",
      title: "#247BA0",
      text: "#155263",
      button1: "#247BA0",
      button1Hover: "#155263",
      button1Text: "#fff",
      button2: "#B6E6F5",
      button2Hover: "#97C1A9",
      button2Text: "#247BA0",
      tooltipBg: "#E0FBFC",
      tooltipText: "#155263",
      shineColor: "#247BA0"
    }
  };

  const colors = themeColors[themeKey] || themeColors.classic;

  // Estilo especial para o tema ocean: clean, flat, sem degrade, mais "card" e menos sombra
  const cardStyle =
    themeKey === "ocean"
      ? {
          background: bg,
          border: "1.5px solid #B6E6F5",
          boxShadow: "0 2px 8px #B6E6F522",
          color: colors.text,
          borderRadius: "1.25rem",
          padding: "1.5rem 1.2rem",
          fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
          minHeight: 130,
          transition: "background 0.5s, box-shadow 0.4s",
          display: "flex",
          flexDirection: "column" as const,
          alignItems: "center" as const,
          justifyContent: "center" as const,
        }
      : {
          background: bg,
          color: colors.text
        };

  return (
    <Card
      className={`relative flex flex-col items-center justify-center min-h-[110px] sm:min-h-[120px] px-3 py-5
        ${themeKey === "sunset" ? "rounded-xl border border-[#FFD45244] shadow-none" : ""}
        ${themeKey === "ocean" ? "rounded-2xl border-0 shadow-none" : ""}
        ${themeKey === "classic" ? "rounded-lg shadow" : ""}
        transition-all duration-500
        ${slide ? "animate-fade-out" : "animate-fade-in"}
        ${themeKey === "ocean" ? "backdrop-blur-0" : ""}
      `}
      style={cardStyle}
    >
      <audio ref={audioRef} src="https://cdn.pixabay.com/audio/2022/07/26/audio_124bfae6c2.mp3" preload="auto" />
      <div
        className="flex items-center gap-2 mb-2"
        style={
          themeKey === "ocean"
            ? {
                width: "100%",
                justifyContent: "flex-start",
                marginBottom: "0.5rem"
              }
            : undefined
        }
      >
        <SparklesIcon
          className="w-5 h-5"
          style={{
            color: colors.icon,
            filter: themeKey === "ocean" ? "none" : undefined,
            marginRight: themeKey === "ocean" ? "0.25rem" : undefined
          }}
        />
        <span
          className="text-base sm:text-lg font-semibold select-none"
          style={{
            color: colors.title,
            letterSpacing: themeKey === "ocean" ? "0.01em" : undefined,
            fontFamily: themeKey === "ocean" ? "'Inter', 'Segoe UI', Arial, sans-serif" : undefined,
            fontWeight: themeKey === "ocean" ? 700 : undefined
          }}
        >
          Motivação do dia
        </span>
      </div>
      <span
        className={`
          text-sm sm:text-base text-center min-h-[36px] select-text font-medium
          transition-all duration-300 cursor-pointer
          ${shine ? "hovered-motivation" : ""}
        `}
        onMouseEnter={() => setShine(true)}
        onMouseLeave={() => setShine(false)}
        style={{
          color: colors.text,
          textShadow: themeKey === "ocean" ? "none" : undefined,
          letterSpacing: themeKey === "ocean" ? "0.01em" : undefined,
          fontFamily: themeKey === "ocean" ? "'Inter', 'Segoe UI', Arial, sans-serif" : undefined,
          fontWeight: themeKey === "ocean" ? 500 : undefined,
          marginBottom: themeKey === "ocean" ? "0.5rem" : undefined
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
              color: colors.text
            }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>
      <div
        className="flex gap-2 mt-4"
        style={
          themeKey === "ocean"
            ? {
                width: "100%",
                justifyContent: "flex-end",
                marginTop: "1.2rem"
              }
            : undefined
        }
      >
        <button
          onClick={handleChangePhrase}
          className="flex items-center justify-center p-2 rounded-md transition"
          title="Nova frase"
          style={{
            background: colors.button1,
            color: colors.button1Text,
            border: "none",
            boxShadow: themeKey === "ocean" ? "none" : undefined,
            fontWeight: 600,
            fontFamily: themeKey === "ocean" ? "'Inter', 'Segoe UI', Arial, sans-serif" : undefined,
            outline: themeKey === "ocean" ? "1.5px solid #B6E6F5" : undefined,
            transition: "background 0.2s"
          }}
          onMouseOver={e => (e.currentTarget.style.background = colors.button1Hover)}
          onMouseOut={e => (e.currentTarget.style.background = colors.button1)}
        >
          <ArrowPathIcon className="w-5 h-5" />
        </button>
        <button
          onClick={handleCopy}
          className="flex items-center justify-center p-2 rounded-md transition relative"
          title="Copiar frase"
          style={{
            background: colors.button2,
            color: colors.button2Text,
            border: "none",
            boxShadow: themeKey === "ocean" ? "none" : undefined,
            fontWeight: 600,
            fontFamily: themeKey === "ocean" ? "'Inter', 'Segoe UI', Arial, sans-serif" : undefined,
            outline: themeKey === "ocean" ? "1.5px solid #B6E6F5" : undefined,
            transition: "background 0.2s"
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
                color: colors.tooltipText,
                border: "none",
                boxShadow: themeKey === "ocean" ? "none" : undefined,
                fontFamily: themeKey === "ocean" ? "'Inter', 'Segoe UI', Arial, sans-serif" : undefined
              }}
            >
              Copiado!
            </span>
          )}
        </button>
      </div>
      <style>{`
        .hovered-motivation {
          filter: brightness(1.08) contrast(1.05);
          text-decoration: underline wavy ${colors.icon}22 1.5px;
        }
        .hovered-motivation::selection {
          background: ${colors.tooltipBg};
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