"use client";
import { useState, useRef, useEffect } from "react";
import { useTypewriterLoop } from "../hooks/useTypewriter";

function SoftShapes() {
  return (
    <>
      <div className="absolute -top-48 -left-52 animate-blob1 w-[44rem] h-[33rem] rounded-full blur-3xl pointer-events-none z-0" style={{ background: "#E9C46A55" }} />
      <div className="absolute top-40 right-0 animate-blob2 w-[32rem] h-[26rem] rounded-full blur-2xl pointer-events-none z-0" style={{ background: "#F6F5F299" }} />
      <div className="absolute bottom-0 left-0 animate-blob3 w-[24rem] h-[17rem] rounded-full blur-2xl pointer-events-none z-0" style={{ background: "#A9C5A099" }} />
      <div className="absolute bottom-0 right-0 animate-blob4 w-[20rem] h-[12rem] rounded-full blur-2xl pointer-events-none z-0" style={{ background: "#523A6826" }} />
      <style jsx>{`
        .animate-blob1 { animation: blobMove1 11s ease-in-out infinite alternate; }
        .animate-blob2 { animation: blobMove2 13s ease-in-out infinite alternate; }
        .animate-blob3 { animation: blobMove3 12s ease-in-out infinite alternate; }
        .animate-blob4 { animation: blobMove4 9s ease-in-out infinite alternate; }
        @keyframes blobMove1 { 0% { transform: translateY(0) scale(1); } 100% { transform: translateY(24px) scale(1.07); } }
        @keyframes blobMove2 { 0% { transform: translateY(0) scale(1); } 100% { transform: translateY(-16px) scale(1.04); } }
        @keyframes blobMove3 { 0% { transform: translateX(0) scale(1); } 100% { transform: translateX(18px) scale(1.08); } }
        @keyframes blobMove4 { 0% { transform: translateY(0) scale(1); } 100% { transform: translateY(-14px) scale(1.03); } }
      `}</style>
    </>
  );
}

const slogans = [
  "Organize sua vida com elegância.",
  "Produtividade com sofisticação.",
  "Seu tempo, sua prioridade.",
  "Planeje. Realize. Viva melhor."
];

const layouts = [
  "stacked",      // Frase animada fora da caixa branca, tudo centralizado
  "sidebyside",   // Layout inovador: tela dividida
  "together",     // Layout inovador: timeline curva
  "movable"       // Caixa branca pode ser movida livremente
];

export default function Hero() {
  const typed = useTypewriterLoop(slogans, 38, 22, 1200);
  const [layoutIndex, setLayoutIndex] = useState(0);

  // Transição suave entre layouts
  const [show, setShow] = useState(true);
  const nextLayout = () => {
    setShow(false);
    setTimeout(() => {
      setLayoutIndex((i) => (i + 1) % layouts.length);
      setShow(true);
    }, 250);
  };

  // Movable box state
  const [boxPos, setBoxPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef<{ x: number; y: number; mouseX: number; mouseY: number } | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  // Função para manter o card dentro da área do Hero (efeito ricochete)
  function bounceBackIfOutOfBounds(x: number, y: number) {
    const hero = heroRef.current;
    if (!hero) return { x, y };

    const heroRect = hero.getBoundingClientRect();
    const cardWidth = 480;
    const cardHeight = 340;
    const minX = -heroRect.width / 2 + cardWidth / 2 + 12;
    const maxX = heroRect.width / 2 - cardWidth / 2 - 12;
    const minY = -heroRect.height / 2 + cardHeight / 2 + 12;
    const maxY = heroRect.height / 2 - cardHeight / 2 - 12;

    let nx = x, ny = y;
    if (x < minX) nx = minX + (minX - x) * 0.4;
    if (x > maxX) nx = maxX - (x - maxX) * 0.4;
    if (y < minY) ny = minY + (minY - y) * 0.4;
    if (y > maxY) ny = maxY - (y - maxY) * 0.4;
    return { x: nx, y: ny };
  }

  // Mouse/touch events para movable layout
  useEffect(() => {
    if (!dragging) return;
    const onMove = (clientX: number, clientY: number) => {
      if (!dragStart.current) return;
      const dx = clientX - dragStart.current.mouseX;
      const dy = clientY - dragStart.current.mouseY;
      // eslint-disable-next-line prefer-const
      let newX = dragStart.current.x + dx;
      // eslint-disable-next-line prefer-const
      let newY = dragStart.current.y + dy;
      const { x: bx, y: by } = bounceBackIfOutOfBounds(newX, newY);
      setBoxPos({ x: bx, y: by });
    };
    const onMouseMove = (e: MouseEvent) => onMove(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      if (!e.touches[0]) return;
      onMove(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onEnd = () => setDragging(false);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onEnd);
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onEnd);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onEnd);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onEnd);
    };
    // eslint-disable-next-line
  }, [dragging]);

  const onDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setDragging(true);
    let clientX = 0, clientY = 0;
    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    dragStart.current = {
      x: boxPos.x,
      y: boxPos.y,
      mouseX: clientX,
      mouseY: clientY,
    };
  };

  return (
    <section
      ref={heroRef}
      className="relative isolate overflow-hidden flex flex-col items-center justify-center min-h-[90vh]"
      style={{
        background: "linear-gradient(135deg, #F6F5F2 0%, #E9C46A66 55%, #A9C5A099 100%)",
        userSelect: dragging ? "none" : "auto"
      }}
    >
      <SoftShapes />

      {/* Layouts com transição */}
      <div
        style={{
          transition: "opacity 0.25s",
          opacity: show ? 1 : 0,
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {/* Layout 1: Stacked */}
        {layouts[layoutIndex] === "stacked" && (
          <div className="w-full flex flex-col items-center">
            <div
              className="z-20 mb-8 w-full flex justify-center"
              style={{
                fontSize: "2.6rem",
                fontWeight: 800,
                color: "#E9C46A",
                letterSpacing: "-0.01em",
                whiteSpace: "nowrap",
                textAlign: "center",
                textShadow: "0 2px 16px #E9C46A33",
                lineHeight: 1.1,
              }}
            >
              {typed}
              <span className="animate-blink ml-1" style={{ marginLeft: 4 }}>|</span>
            </div>
            <div className="relative z-10 w-full max-w-xl mx-auto flex flex-col items-center px-6 py-14 bg-white/90 rounded-3xl shadow-xl border border-yellow-200">
              <h1
                className="font-extrabold tracking-tight mb-7"
                style={{
                  color: "#264653",
                  fontSize: "3.5rem",
                  fontWeight: 900,
                  textAlign: "center",
                  letterSpacing: "-0.04em",
                  marginBottom: 24,
                  lineHeight: 1.1,
                }}
              >
                Organizo
              </h1>
              <p
                className="text-lg font-medium mb-10"
                style={{
                  color: "#264653DE",
                  fontSize: "1.08rem",
                  textAlign: "center",
                  maxWidth: 420,
                  lineHeight: 1.6,
                  marginBottom: 32,
                }}
              >
                Um ambiente refinado para gerenciar tarefas, compromissos e inspirações.<br />
                Minimalismo, clareza e poder – tudo em um só lugar.
              </p>
              <div className="flex gap-4 flex-col sm:flex-row items-center w-full justify-center">
                <button
                  className="rounded-full px-8 py-3 text-lg font-bold shadow-xl transition-all duration-200"
                  style={{
                    background: "#E9C46A",
                    color: "#264653",
                    border: "none",
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    borderRadius: 40,
                    boxShadow: "0 2px 12px 0 #E9C46A55"
                  }}
                >
                  Comece agora
                </button>
                <a
                  href="#features"
                  className="inline-block rounded-full border-2 px-8 py-3 text-base font-semibold"
                  style={{
                    borderColor: "#E9C46A",
                    color: "#E9C46A",
                    background: "rgba(255,255,255,0.20)",
                    fontWeight: 600,
                    fontSize: "1rem",
                    borderRadius: 40,
                  }}
                >
                  Saiba mais
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Layout 2: Tela dividida metade branca metade fundo com frase */}
        {layouts[layoutIndex] === "sidebyside" && (
          <div className="relative z-10 w-full flex min-h-[70vh]">
            {/* Lado esquerdo: caixa branca */}
            <div className="flex-1 flex flex-col justify-center items-center bg-white/95 rounded-r-none rounded-l-3xl shadow-xl border border-yellow-200 px-10 py-16">
              <h1 className="text-5xl font-extrabold tracking-tight mb-6" style={{
                color: "#264653",
                letterSpacing: "-0.04em",
                fontSize: "3.2rem"
              }}>
                Organizo
              </h1>
              <p className="text-lg max-w-xl mb-8 font-medium" style={{
                color: "#264653DE",
                fontSize: "1.08rem",
                textAlign: "left",
                maxWidth: 390,
                lineHeight: 1.6
              }}>
                Um ambiente refinado para gerenciar tarefas, compromissos e inspirações.<br />
                Minimalismo, clareza e poder – tudo em um só lugar.
              </p>
              <div className="flex gap-4 flex-col sm:flex-row items-start">
                <button
                  className="rounded-full px-8 py-3 text-lg font-bold shadow-xl transition-all duration-200"
                  style={{
                    background: "#E9C46A",
                    color: "#264653",
                    border: "none",
                    fontWeight: 700,
                    fontSize: "1rem",
                    borderRadius: 40,
                    boxShadow: "0 2px 12px 0 #E9C46A55"
                  }}
                >
                  Comece agora
                </button>
                <a
                  href="#features"
                  className="inline-block rounded-full border-2 px-8 py-3 text-base font-semibold"
                  style={{
                    borderColor: "#E9C46A",
                    color: "#E9C46A",
                    background: "rgba(255,255,255,0.20)",
                    fontWeight: 600,
                    fontSize: "0.98rem",
                    borderRadius: 40,
                  }}
                >
                  Saiba mais
                </a>
              </div>
            </div>
            {/* Lado direito: fundo com frase animada centralizada */}
            <div className="flex-1 flex items-center justify-center relative">
              <div
                className="w-full h-full flex items-center justify-center"
                style={{
                  background: "transparent",
                  minHeight: "100%",
                }}
              >
                <div
                  style={{
                    fontSize: "2.6rem",
                    fontWeight: 800,
                    color: "#E9C46A",
                    letterSpacing: "-0.01em",
                    textAlign: "center",
                    textShadow: "0 2px 16px #E9C46A33",
                    lineHeight: 1.1,
                    maxWidth: 420,
                    margin: "0 auto",
                  }}
                >
                  {typed}
                  <span className="animate-blink ml-1" style={{ marginLeft: 4 }}>|</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Layout 3: Inovador - Linha do tempo curva com cards flutuantes */}
        {layouts[layoutIndex] === "together" && (
          <div className="relative z-10 w-full flex flex-col items-center justify-center min-h-[70vh] py-10">
            {/* SVG curva */}
            <svg
              className="absolute left-1/2 top-0 -translate-x-1/2 z-0"
              width="90%"
              height="420"
              viewBox="0 0 900 420"
              fill="none"
              style={{ maxWidth: 900, minWidth: 320, pointerEvents: "none" }}
            >
              <path
                d="M60 400 Q 200 100 450 210 Q 700 320 840 60"
                stroke="#E9C46A"
                strokeWidth="10"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="12 16"
                opacity="0.18"
              />
            </svg>
            {/* Cards flutuantes ao longo da curva */}
            <div className="absolute left-1/2 top-0 -translate-x-1/2 w-full max-w-[900px] h-[420px] pointer-events-none">
              {/* Card 1 */}
              <div
                className="absolute"
                style={{
                  left: "4%",
                  top: "320px",
                  transform: "translate(-50%, -50%)",
                  pointerEvents: "auto"
                }}
              >
                <div className="bg-white/95 border border-yellow-100 rounded-2xl shadow-lg px-7 py-6 min-w-[220px] max-w-[260px]">
                  <div className="text-[#E9C46A] font-bold text-lg mb-1">Organize</div>
                  <div className="text-[#264653] font-semibold text-base mb-2">Tarefas e Inspirações</div>
                  <div className="text-[#264653bb] text-sm">Tudo em um só lugar, com clareza e leveza.</div>
                </div>
              </div>
              {/* Card 2 */}
              <div
                className="absolute"
                style={{
                  left: "36%",
                  top: "120px",
                  transform: "translate(-50%, -50%)",
                  pointerEvents: "auto"
                }}
              >
                <div className="bg-white/95 border border-yellow-100 rounded-2xl shadow-lg px-7 py-6 min-w-[220px] max-w-[260px]">
                  <div className="text-[#E9C46A] font-bold text-lg mb-1">Visualize</div>
                  <div className="text-[#264653] font-semibold text-base mb-2">Seu progresso</div>
                  <div className="text-[#264653bb] text-sm">Acompanhe sua evolução de forma visual.</div>
                </div>
              </div>
              {/* Card 3 */}
              <div
                className="absolute"
                style={{
                  left: "68%",
                  top: "260px",
                  transform: "translate(-50%, -50%)",
                  pointerEvents: "auto"
                }}
              >
                <div className="bg-white/95 border border-yellow-100 rounded-2xl shadow-lg px-7 py-6 min-w-[220px] max-w-[260px]">
                  <div className="text-[#E9C46A] font-bold text-lg mb-1">Personalize</div>
                  <div className="text-[#264653] font-semibold text-base mb-2">Seu jeito</div>
                  <div className="text-[#264653bb] text-sm">Adapte o Organizo ao seu estilo de vida.</div>
                </div>
              </div>
              {/* Card 4 */}
              <div
                className="absolute"
                style={{
                  left: "92%",
                  top: "70px",
                  transform: "translate(-50%, -50%)",
                  pointerEvents: "auto"
                }}
              >
                <div className="bg-white/95 border border-yellow-100 rounded-2xl shadow-lg px-7 py-6 min-w-[220px] max-w-[260px]">
                  <div className="text-[#E9C46A] font-bold text-lg mb-1">Viva melhor</div>
                  <div className="text-[#264653] font-semibold text-base mb-2">Com equilíbrio</div>
                  <div className="text-[#264653bb] text-sm">Planeje, realize e aproveite cada momento.</div>
                </div>
              </div>
            </div>
            {/* Frase animada centralizada - mais embaixo */}
            <div className="relative z-10 flex flex-col items-center mt-[340px]">
              <div
                style={{
                  fontSize: "2.1rem",
                  fontWeight: 800,
                  color: "#E9C46A",
                  letterSpacing: "-0.01em",
                  textAlign: "center",
                  textShadow: "0 2px 16px #E9C46A33",
                  lineHeight: 1.15,
                  wordBreak: "break-word",
                  whiteSpace: "normal",
                  marginBottom: 18,
                }}
              >
                {typed}
                <span className="animate-blink ml-1" style={{ marginLeft: 4 }}>|</span>
              </div>
              <button
                className="rounded-full px-8 py-3 text-lg font-bold shadow-xl transition-all duration-200 mt-4"
                style={{
                  background: "#E9C46A",
                  color: "#264653",
                  border: "none",
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  borderRadius: 40,
                  boxShadow: "0 2px 12px 0 #E9C46A55"
                }}
              >
                Comece agora
              </button>
            </div>
          </div>
        )}

        {/* Layout 4: Movable */}
        {layouts[layoutIndex] === "movable" && (
          <div style={{ width: "100%", height: "70vh", position: "relative" }}>
            <div
              className="z-20 mb-8 w-full flex justify-center"
              style={{
                fontSize: "2.2rem",
                fontWeight: 800,
                color: "#E9C46A",
                letterSpacing: "-0.01em",
                textAlign: "center",
                textShadow: "0 2px 16px #E9C46A33",
                lineHeight: 1.1,
                marginTop: 24,
              }}
            >
              {typed}
              <span className="animate-blink ml-1" style={{ marginLeft: 4 }}>|</span>
            </div>
            <div
              className="absolute"
              style={{
                left: `calc(50% + ${boxPos.x}px - 240px)`,
                top: `calc(40% + ${boxPos.y}px - 120px)`,
                cursor: dragging ? "grabbing" : "grab",
                zIndex: 30,
                width: 480,
                maxWidth: "90vw",
                transition: dragging ? "none" : "box-shadow 0.2s",
                boxShadow: dragging
                  ? "0 8px 32px 0 #E9C46A44"
                  : "0 2px 12px 0 #E9C46A55",
              }}
              onMouseDown={onDragStart}
              onTouchStart={onDragStart}
            >
              <div className="w-full flex flex-col items-center px-6 py-14 bg-white/95 rounded-3xl border border-yellow-200 select-none">
                <h1
                  className="font-extrabold tracking-tight mb-7"
                  style={{
                    color: "#264653",
                    fontSize: "3.5rem",
                    fontWeight: 900,
                    textAlign: "center",
                    letterSpacing: "-0.04em",
                    marginBottom: 24,
                    lineHeight: 1.1,
                  }}
                >
                  Organizo
                </h1>
                <p
                  className="text-lg font-medium mb-10"
                  style={{
                    color: "#264653DE",
                    fontSize: "1.08rem",
                    textAlign: "center",
                    maxWidth: 420,
                    lineHeight: 1.6,
                    marginBottom: 32,
                  }}
                >
                  Um ambiente refinado para gerenciar tarefas, compromissos e inspirações.<br />
                  Minimalismo, clareza e poder – tudo em um só lugar.
                </p>
                <div className="flex gap-4 flex-col sm:flex-row items-center w-full justify-center">
                  <button
                    className="rounded-full px-8 py-3 text-lg font-bold shadow-xl transition-all duration-200"
                    style={{
                      background: "#E9C46A",
                      color: "#264653",
                      border: "none",
                      fontWeight: 700,
                      fontSize: "1.1rem",
                      borderRadius: 40,
                      boxShadow: "0 2px 12px 0 #E9C46A55"
                    }}
                  >
                    Comece agora
                  </button>
                  <a
                    href="#features"
                    className="inline-block rounded-full border-2 px-8 py-3 text-base font-semibold"
                    style={{
                      borderColor: "#E9C46A",
                      color: "#E9C46A",
                      background: "rgba(255,255,255,0.20)",
                      fontWeight: 600,
                      fontSize: "1rem",
                      borderRadius: 40,
                    }}
                  >
                    Saiba mais
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Botão para trocar layout - sempre no canto inferior direito */}
      <div
        style={{
          position: "absolute",
          bottom: 32,
          right: 32,
          zIndex: 50,
        }}
        className="flex"
      >
        <button
          aria-label="Trocar layout"
          onClick={nextLayout}
          style={{
            background: "#fff",
            border: "1.5px solid #E9C46A",
            borderRadius: "50%",
            width: 48,
            height: 48,
            boxShadow: "0 2px 12px 0 #E9C46A33",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "background 0.2s",
          }}
          className="hover:bg-yellow-50 focus:outline-none"
        >
          {layoutIndex === 0 ? (
            <svg width="24" height="24" fill="none" stroke="#E9C46A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          ) : layoutIndex === 1 ? (
            <svg width="24" height="24" fill="none" stroke="#E9C46A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/></svg>
          ) : layoutIndex === 2 ? (
            <svg width="24" height="24" fill="none" stroke="#E9C46A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/></svg>
          ) : (
            <svg width="24" height="24" fill="none" stroke="#E9C46A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20L20 4M4 4h16v16"/></svg>
          )}
        </button>
      </div>

      <style jsx>{`
        .animate-blink {
          animation: blink 1s steps(2, start) infinite;
        }
        @keyframes blink { to { opacity: 0; } }
      `}</style>
    </section>
  );
}