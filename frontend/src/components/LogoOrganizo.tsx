import { useEffect, useState } from "react";

const GOLD = "#E9C46A";
const DEFAULT = "#264653";
const WORD = "Organizo";
const ANIMATION_INTERVAL = 115; // ms entre letras
const ANIMATION_PAUSE = 1500;   // ms entre animações
const JUMP_HEIGHT = 18;         // px do pulo
const FINAL_HOLD = 1000;        // ms todas coloridas e animadas no final

export function LogoOrganizo() {
  // highlight: 0 = só O colorido, 1..N = animando, 'final' = todas coloridas animadas
  const [highlight, setHighlight] = useState<number | "final">(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let interval: NodeJS.Timeout;

    if (animating && typeof highlight === "number") {
      if (highlight < WORD.length - 1) {
        interval = setTimeout(() => setHighlight(h => (typeof h === "number" ? h + 1 : h)), ANIMATION_INTERVAL);
      } else if (highlight === WORD.length - 1) {
        interval = setTimeout(() => setHighlight("final"), ANIMATION_INTERVAL + 80);
      }
    }
    if (highlight === "final") {
      timeout = setTimeout(() => {
        setAnimating(false);
        setHighlight(0);
      }, FINAL_HOLD);
    }
    if (!animating && highlight === 0) {
      timeout = setTimeout(() => {
        setAnimating(true);
        setHighlight(1); // começa direto no 'r'
      }, ANIMATION_PAUSE * 2);
    }

    return () => {
      clearTimeout(timeout);
      clearTimeout(interval);
    };
  }, [animating, highlight]);

  return (
    <span
      className="text-4xl sm:text-5xl font-extrabold tracking-tight flex justify-center items-center select-none w-full"
      style={{
        fontFamily: "inherit",
        letterSpacing: ".04em",
        userSelect: "none",
        minHeight: "60px",
        lineHeight: 1.1,
      }}
    >
      {WORD.split("").map((char, idx) => {
        // Só o O inicial SEM efeito de pulo
        if (idx === 0) {
          return (
            <span
              key={idx}
              style={{
                color: GOLD,
                transition: "color 0.22s cubic-bezier(.4,1,.6,1)",
                display: "inline-block",
                textShadow: highlight === "final"
                  ? "0 2px 18px #E9C46A66"
                  : "none",
                transform: highlight === "final"
                  ? "scale(1.15) rotate(-6deg)"
                  : "none",
                transitionProperty: "color, transform, text-shadow",
                transitionDuration: highlight === "final" ? "0.38s" : "0.22s"
              }}
            >
              {char}
            </span>
          );
        }

        // Efeito de "pulo" para a letra que está sendo animada
        const isActive =
          (typeof highlight === "number" && highlight === idx) ||
          (highlight === "final");

        const color =
          highlight === "final"
            ? GOLD
            : isActive
              ? GOLD
              : DEFAULT;

        const jump =
          (typeof highlight === "number" && highlight === idx);

        // Efeito de pulo só na letra ativa (não no O, nunca) e efeito final em todas
        const jumpStyle =
          highlight === "final"
            ? {
                color,
                textShadow: "0 2px 18px #E9C46A55, 0 0px 0 #fff9c499",
                transform: `scale(1.21) rotate(${idx % 2 === 0 ? 9 : -8}deg) translateY(-8px)`,
                transition: "color 0.26s, transform 0.42s cubic-bezier(.68,2,.3,1), text-shadow 0.22s",
                zIndex: 1,
                animation: "logo-wiggle 0.7s cubic-bezier(.7,2,.2,1) 1",
              }
            : jump
              ? {
                  color,
                  textShadow: "0 4px 12px #E9C46A44, 0 2px 0 #fff9c4cc",
                  transform: "translateY(-16px) scale(1.13)",
                  transition: "color 0.22s cubic-bezier(.4,1,.6,1), transform 0.28s cubic-bezier(.7,2,.4,1), text-shadow 0.22s",
                  zIndex: 1,
                }
              : {
                  color,
                  textShadow: "none",
                  transform: "translateY(0px) scale(1)",
                  transition: "color 0.22s, transform 0.26s, text-shadow 0.2s",
                  zIndex: 0,
                };

        return (
          <span
            key={idx}
            style={{
              display: "inline-block",
              ...jumpStyle
            }}
          >
            {char}
          </span>
        );
      })}
      <style jsx>{`
        @keyframes logo-wiggle {
          0%   { transform: scale(1.17) rotate(0deg) translateY(-4px);}
          10%  { transform: scale(1.23) rotate(7deg) translateY(-12px);}
          35%  { transform: scale(1.22) rotate(-8deg) translateY(-13px);}
          60%  { transform: scale(1.18) rotate(2deg) translateY(-9px);}
          80%  { transform: scale(1.20) rotate(-4deg) translateY(-6px);}
          100% { transform: scale(1.21) rotate(var(--logo-wiggle-end, 7deg)) translateY(-8px);}
        }
      `}</style>
    </span>
  );
}