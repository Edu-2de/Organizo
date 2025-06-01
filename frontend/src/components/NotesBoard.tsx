/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "@/components/ThemeContext";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { THEMES } from "@/components/themes";

// Paletas de post-it por tema
const POSTIT_COLORS_BY_THEME = {
  classic: [
    "#FFF9C4", "#FFD6E0", "#D0F1FF", "#D9F9D2", "#EAD1FF"
  ],
  sunset: [
    "#FFD452", "#FFAF7B", "#F76D77", "#FFECD2", "#A4508B"
  ],
  ocean: [
    "#E0FBFC", "#97C1A9", "#3A506B", "#247BA0", "#155263"
  ]
};

// Moldura dos post-its por tema
const POSTIT_BORDER_BY_THEME = {
  classic: "#e9c46a",
  sunset: "#F76D77",
  ocean: "#247BA0"
};

const LABEL_COLORS = {
  classic: "#523A68",
  sunset: "#A4508B",
  ocean: "#155263"
};

// Fundo do quadro de post-its por tema
const BOARD_BG_BY_THEME = {
  classic: "#f8f8f4",
  sunset: "#FFF5E1",
  ocean: "#E0F4FB"
};

// Personalização de sombra dos post-its por tema
const POSTIT_SHADOW_BY_THEME = {
  classic: "2px 4px 18px #e9c46a33",
  sunset: "2px 4px 18px #F76D7740",
  ocean: "2px 4px 18px #247BA040"
};

// Ícones 100% personalizados para cada tema, com contraste máximo
const ICONS_BY_THEME = (themeKey: string) => ({
  trash:
    themeKey === "classic" ? (
      <svg width={18} height={18} fill="none" viewBox="0 0 20 20">
        <rect x="4.5" y="6" width="11" height="9" rx="2" stroke="#523A68" strokeWidth="1.7" />
        <path d="M7 9v4M10 9v4M13 9v4" stroke="#523A68" strokeWidth="1.5" strokeLinecap="round" />
        <rect x="7" y="3.5" width="6" height="2" rx="1" fill="#e9c46a" />
      </svg>
    ) : themeKey === "sunset" ? (
      <svg width={18} height={18} fill="none" viewBox="0 0 20 20">
        <rect x="4.5" y="6" width="11" height="9" rx="2" stroke="#fff" strokeWidth="2" />
        <path d="M7 9v4M10 9v4M13 9v4" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" />
        <rect x="7" y="3.5" width="6" height="2" rx="1" fill="#A4508B" />
      </svg>
    ) : (
      // ocean
      <svg width={18} height={18} fill="none" viewBox="0 0 20 20">
        <rect x="4.5" y="6" width="11" height="9" rx="2" stroke="#155263" strokeWidth="2" />
        <path d="M7 9v4M10 9v4M13 9v4" stroke="#155263" strokeWidth="1.7" strokeLinecap="round" />
        <rect x="7" y="3.5" width="6" height="2" rx="1" fill="#E0FBFC" />
      </svg>
    ),
  plus:
    themeKey === "classic" ? (
      <svg width={18} height={18} fill="none" viewBox="0 0 20 20">
        <circle cx={10} cy={10} r={9} fill="#e9c46a" />
        <path d="M10 7v6M7 10h6" stroke="#523A68" strokeWidth={2} strokeLinecap="round" />
      </svg>
    ) : themeKey === "sunset" ? (
      <svg width={18} height={18} fill="none" viewBox="0 0 20 20">
        <circle cx={10} cy={10} r={9} fill="#FFD452" />
        <path d="M10 7v6M7 10h6" stroke="#A4508B" strokeWidth={2} strokeLinecap="round" />
      </svg>
    ) : (
      // ocean
      <svg width={18} height={18} fill="none" viewBox="0 0 20 20">
        <circle cx={10} cy={10} r={9} fill="#247BA0" />
        <path d="M10 7v6M7 10h6" stroke="#E0FBFC" strokeWidth={2} strokeLinecap="round" />
      </svg>
    ),
  drag:
    themeKey === "classic" ? (
      <svg width={16} height={16} fill="none" viewBox="0 0 20 20">
        <circle cx={5} cy={6} r={1.2} fill="#e9c46a" />
        <circle cx={5} cy={10} r={1.2} fill="#e9c46a" />
        <circle cx={5} cy={14} r={1.2} fill="#e9c46a" />
        <circle cx={13} cy={6} r={1.2} fill="#e9c46a" />
        <circle cx={13} cy={10} r={1.2} fill="#e9c46a" />
        <circle cx={13} cy={14} r={1.2} fill="#e9c46a" />
      </svg>
    ) : themeKey === "sunset" ? (
      <svg width={16} height={16} fill="none" viewBox="0 0 20 20">
        <circle cx={5} cy={6} r={1.2} fill="#FFD452" />
        <circle cx={5} cy={10} r={1.2} fill="#FFD452" />
        <circle cx={5} cy={14} r={1.2} fill="#FFD452" />
        <circle cx={13} cy={6} r={1.2} fill="#FFD452" />
        <circle cx={13} cy={10} r={1.2} fill="#FFD452" />
        <circle cx={13} cy={14} r={1.2} fill="#FFD452" />
      </svg>
    ) : (
      // ocean
      <svg width={16} height={16} fill="none" viewBox="0 0 20 20">
        <circle cx={5} cy={6} r={1.2} fill="#247BA0" />
        <circle cx={5} cy={10} r={1.2} fill="#247BA0" />
        <circle cx={5} cy={14} r={1.2} fill="#247BA0" />
        <circle cx={13} cy={6} r={1.2} fill="#247BA0" />
        <circle cx={13} cy={10} r={1.2} fill="#247BA0" />
        <circle cx={13} cy={14} r={1.2} fill="#247BA0" />
      </svg>
    ),
  duplicate:
    themeKey === "classic" ? (
      <svg width={17} height={17} viewBox="0 0 20 20">
        <rect x="4" y="7" width="10" height="8" rx="2" fill="none" stroke="#523A68" strokeWidth="1.5" />
        <rect x="6" y="5" width="10" height="8" rx="2" fill="none" stroke="#e9c46a" strokeWidth="1.5" />
      </svg>
    ) : themeKey === "sunset" ? (
      <svg width={17} height={17} viewBox="0 0 20 20">
        <rect x="4" y="7" width="10" height="8" rx="2" fill="none" stroke="#fff" strokeWidth="1.7" />
        <rect x="6" y="5" width="10" height="8" rx="2" fill="none" stroke="#A4508B" strokeWidth="1.7" />
      </svg>
    ) : (
      // ocean
      <svg width={17} height={17} viewBox="0 0 20 20">
        <rect x="4" y="7" width="10" height="8" rx="2" fill="none" stroke="#155263" strokeWidth="1.7" />
        <rect x="6" y="5" width="10" height="8" rx="2" fill="none" stroke="#E0FBFC" strokeWidth="1.7" />
      </svg>
    ),
});

export type NoteType = { text: string; color: string; x: number; y: number };

export default function NotesBoard({
  notes,
  setNotes,
}: {
  notes: NoteType[];
  setNotes: React.Dispatch<React.SetStateAction<NoteType[]>>;
}) {
  const themeCtx = useTheme?.();
  const themeKey = themeCtx?.themeKey || "classic";

  const POSTIT_COLORS = POSTIT_COLORS_BY_THEME[themeKey] || POSTIT_COLORS_BY_THEME.classic;
  const BOARD_BG = BOARD_BG_BY_THEME[themeKey] || BOARD_BG_BY_THEME.classic;
  const LABEL_COLOR = LABEL_COLORS[themeKey] || LABEL_COLORS.classic;
  const POSTIT_BORDER = POSTIT_BORDER_BY_THEME[themeKey] || "#e9c46a";
  const POSTIT_SHADOW = POSTIT_SHADOW_BY_THEME[themeKey] || "2px 4px 18px #e9c46a33";
  const TASK_ICONS = ICONS_BY_THEME(themeKey);

  const boardRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({
    w: 820,
    h: 320,
    noteW: 180,
    noteH: 182,
  });

  // Corrige bug de transparência ao trocar de tema
  useEffect(() => {
    setTimeout(() => {
      if (boardRef.current) {
        const width = Math.max(220, Math.min(boardRef.current.offsetWidth, 1200));
        let height = 320;
        if (window.innerWidth < 640) height = 160;
        else if (window.innerWidth < 900) height = 220;
        else if (window.innerWidth < 1200) height = 280;
        else height = 320;
        const noteW = width < 400 ? 88 : width < 540 ? 110 : width < 700 ? 140 : width < 1000 ? 160 : 180;
        const noteH = Math.round(height * 0.68);
        setDimensions({ w: width, h: height, noteW, noteH });
      }
    }, 10);
  }, [themeKey]);

  useEffect(() => {
    function updateSize() {
      if (boardRef.current) {
        const width = Math.max(220, Math.min(boardRef.current.offsetWidth, 1200));
        let height = 320;
        if (window.innerWidth < 640) height = 160;
        else if (window.innerWidth < 900) height = 220;
        else if (window.innerWidth < 1200) height = 280;
        else height = 320;
        const noteW = width < 400 ? 88 : width < 540 ? 110 : width < 700 ? 140 : width < 1000 ? 160 : 180;
        const noteH = Math.round(height * 0.68);
        setDimensions({ w: width, h: height, noteW, noteH });
      }
    }
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const BOARD_W = dimensions.w;
  const BOARD_H = dimensions.h;
  const NOTE_W = dimensions.noteW;
  const NOTE_H = dimensions.noteH;

  const [dragged, setDragged] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showColorIdx, setShowColorIdx] = useState<number | null>(null);
  const [topZ, setTopZ] = useState(100);
  const [zList, setZList] = useState<number[]>(notes.map((_, i) => i));

  useEffect(() => {
    setZList(notes.map((_, i) => i));
  }, [notes.length]);

  function bringToFront(idx: number) {
    setZList(zs => {
      const max = Math.max(...zs, topZ);
      const newZ = [...zs];
      newZ[idx] = max + 1;
      setTopZ(max + 1);
      return [...newZ];
    });
  }

  function handlePointerDown(e: React.MouseEvent, idx: number) {
    if ((e.target as HTMLElement).classList.contains("color-dot") || (e.target as HTMLElement).tagName === "TEXTAREA") return;
    setDragged(idx);
    bringToFront(idx);
    if (!boardRef.current) return;
    const rect = boardRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left - notes[idx].x,
      y: e.clientY - rect.top - notes[idx].y,
    });
  }
  function handlePointerMove(e: MouseEvent) {
    if (dragged === null) return;
    if (!boardRef.current) return;
    const rect = boardRef.current.getBoundingClientRect();

    let nx = e.clientX - rect.left - dragOffset.x;
    let ny = e.clientY - rect.top - dragOffset.y;

    const maxX = boardRef.current.offsetWidth - NOTE_W;
    const maxY = boardRef.current.offsetHeight - NOTE_H;

    nx = Math.max(0, Math.min(nx, maxX));
    ny = Math.max(0, Math.min(ny, maxY));

    setNotes((ns) =>
      ns.map((n, i) => (i !== dragged ? n : { ...n, x: nx, y: ny }))
    );
  }
  function handlePointerUp() {
    setDragged(null);
  }

  function handleTouchStart(e: React.TouchEvent, idx: number) {
    setDragged(idx);
    bringToFront(idx);
    if (!boardRef.current) return;
    const touch = e.touches[0];
    const rect = boardRef.current.getBoundingClientRect();
    setDragOffset({
      x: touch.clientX - rect.left - notes[idx].x,
      y: touch.clientY - rect.top - notes[idx].y,
    });
  }
  function handleTouchMove(e: TouchEvent) {
    if (dragged === null) return;
    if (!boardRef.current) return;
    const touch = e.touches[0];
    const rect = boardRef.current.getBoundingClientRect();
    let nx = touch.clientX - rect.left - dragOffset.x;
    let ny = touch.clientY - rect.top - dragOffset.y;
    nx = Math.max(0, Math.min(nx, boardRef.current.offsetWidth - NOTE_W));
    ny = Math.max(0, Math.min(ny, boardRef.current.offsetHeight - NOTE_H));
    setNotes((ns) =>
      ns.map((n, i) => (i !== dragged ? n : { ...n, x: nx, y: ny }))
    );
  }
  function handleTouchEnd() {
    setDragged(null);
  }

  useEffect(() => {
    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("mouseup", handlePointerUp);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);
    return () => {
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseup", handlePointerUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [dragged, dragOffset, notes, BOARD_W, BOARD_H, NOTE_W, NOTE_H]);

  function handleColorChange(idx: number, color: string) {
    setNotes(notes => notes.map((n, i) => i === idx ? { ...n, color } : n));
    setShowColorIdx(null);
  }
  function handleTextChange(idx: number, value: string) {
    setNotes(notes => notes.map((n, i) => i === idx ? { ...n, text: value } : n));
  }
  function handleDelete(idx: number) {
    setNotes(notes => notes.filter((_, i) => i !== idx));
    setZList(zs => zs.filter((_, i) => i !== idx));
  }
  function handleDuplicate(idx: number) {
    let boardW = BOARD_W, boardH = BOARD_H;
    if (boardRef.current) {
      boardW = boardRef.current.offsetWidth;
      boardH = boardRef.current.offsetHeight;
    }
    setNotes(notes => {
      const n = notes[idx];
      return [...notes, { ...n, x: Math.min(n.x + 40, boardW - NOTE_W), y: Math.min(n.y + 30, boardH - NOTE_H) }];
    });
    setZList(zs => [...zs, Math.max(...zs, topZ) + 1]);
    setTopZ(z => z + 1);
  }
  function handleAddNote() {
    const count = notes.length;
    let boardW = BOARD_W, boardH = BOARD_H;
    if (boardRef.current) {
      boardW = boardRef.current.offsetWidth;
      boardH = boardRef.current.offsetHeight;
    }
    setNotes(notes => [
      ...notes,
      {
        text: "",
        color: POSTIT_COLORS[Math.floor(Math.random() * POSTIT_COLORS.length)],
        x: 25 + (count * 36) % Math.max(1, (boardW - NOTE_W)),
        y: 20 + (count * 30) % Math.max(1, (boardH - NOTE_H)),
      },
    ]);
    setZList(zs => [...zs, Math.max(...zs, topZ) + 1]);
    setTopZ(z => z + 1);
  }

  return (
    <div
      ref={boardRef}
      className="w-full pb-2 px-0 relative "
      style={{
        minHeight: 160,
        height: BOARD_H,
        maxHeight: 400,
        maxWidth: "100%",
        margin: "0 auto",
        userSelect: dragged !== null ? "none" : undefined,
        transition: "height 0.2s,width 0.2s",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 px-2 gap-2">
        <span className="font-semibold text-lg" style={{ color: LABEL_COLOR }}>Quadro de Post-its</span>
        <button
          onClick={handleAddNote}
          className="flex items-center gap-1 px-3 py-1.5 rounded font-semibold shadow transition"
          style={{
            background: themeKey === "classic" ? "#e9c46a" : themeKey === "sunset" ? "#FFD452" : "#247BA0",
            color: themeKey === "classic" ? "#523A68" : themeKey === "sunset" ? "#A4508B" : "#E0FBFC",
            border: `1.5px solid ${themeKey === "classic" ? "#e9c46a" : themeKey === "sunset" ? "#FFD452" : "#247BA0"}`,
          }}
        >
          {TASK_ICONS.plus} Novo post-it
        </button>
      </div>
      <div
        style={{
          position: "relative",
          width: "100%",
          height: BOARD_H,
          background: BOARD_BG,
          borderRadius: 12,
          boxShadow: POSTIT_SHADOW,
          minHeight: 120,
          minWidth: 120,
          overflow: "hidden",
          transition: "height 0.2s,width 0.2s",
          padding: 0,
        }}
      >
        {notes.length === 0 && (
          <div className="text-center opacity-60 w-full py-10 absolute left-0 right-0 top-0"
            style={{ color: LABEL_COLOR }}>
            Nenhum post-it ainda. Clique em "Novo post-it" para começar!
          </div>
        )}
        {notes.map((note, idx) => (
          <div
            key={idx}
            tabIndex={0}
            onMouseDown={e => handlePointerDown(e, idx)}
            onTouchStart={e => handleTouchStart(e, idx)}
            onClick={e => {
              bringToFront(idx);
              if ((e.target as HTMLElement).classList.contains("color-dot") || (e.target as HTMLElement).tagName === "TEXTAREA") return;
              setShowColorIdx(idx === showColorIdx ? null : idx);
            }}
            className={`
              absolute rounded-xl p-2 sm:p-3 flex flex-col justify-between select-text
              transition cursor-grab group
              ${dragged === idx ? "ring-2 ring-accent z-[2000]" : ""}
            `}
            style={{
              left: Math.max(0, Math.min(note.x, BOARD_W - NOTE_W)),
              top: Math.max(0, Math.min(note.y, BOARD_H - NOTE_H)),
              background: note.color,
              border: `2.5px solid ${POSTIT_BORDER}`,
              boxShadow: POSTIT_SHADOW,
              opacity: 1,
              zIndex: (zList[idx] ?? idx) + (showColorIdx === idx ? 1000 : 0),
              wordBreak: "break-word",
              overflow: "hidden",
              width: NOTE_W,
              height: NOTE_H,
              minWidth: 60,
              minHeight: 80,
              maxWidth: BOARD_W,
              maxHeight: BOARD_H,
              pointerEvents: dragged === null || dragged === idx ? "auto" : "none",
            }}
          >
            <textarea
              className="w-full font-semibold bg-transparent focus:outline-none resize-none text-[1rem] rounded"
              value={note.text}
              maxLength={120}
              placeholder="Escreva aqui..."
              onChange={e => handleTextChange(idx, e.target.value)}
              style={{
                minHeight: 32,
                background: "none",
                color:
                  themeKey === "classic"
                    ? "#523A68"
                    : themeKey === "sunset"
                      ? (
                        note.color === "#FFD452" || note.color === "#FFAF7B" || note.color === "#FFECD2"
                          ? "#A4508B"
                          : "#fff"
                      )
                      : (
                        note.color === "#E0FBFC" || note.color === "#97C1A9"
                          ? "#155263"
                          : "#E0FBFC"
                      ),
                fontWeight: themeKey === "sunset" ? 700 : 600,
                letterSpacing: themeKey === "ocean" ? "0.01em" : undefined,
                fontFamily: themeKey === "ocean" ? "monospace, 'Inter', sans-serif" : undefined
              }}
              onClick={e => { e.stopPropagation(); bringToFront(idx); }}
            />
            <div className="flex justify-between items-end mt-2">
              <div className="flex gap-1">
                {showColorIdx === idx && (
                  <div className="flex gap-1 transition-all duration-200">
                    {POSTIT_COLORS.map(c => (
                      <button
                        key={c}
                        type="button"
                        onClick={e => { e.stopPropagation(); handleColorChange(idx, c); }}
                        className={`color-dot w-5 h-5 rounded-full border-2 border-[#fff] shadow transition
                          ${note.color === c ? "ring-2 ring-[#22223B]" : ""}
                        `}
                        style={{
                          background: c,
                          borderColor: c === "#F6F5F2" ? POSTIT_BORDER : "#fff"
                        }}
                        aria-label={`Cor ${c}`}
                      />
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-1">
                <button
                  className="p-1 rounded hover:bg-opacity-20 ml-1"
                  onClick={e => { e.stopPropagation(); handleDelete(idx); }}
                  title="Excluir post-it"
                >
                  {TASK_ICONS.trash}
                </button>
                <button
                  className="p-1 rounded hover:bg-opacity-20 ml-1"
                  onClick={e => { e.stopPropagation(); handleDuplicate(idx); }}
                  title="Duplicar post-it"
                >
                  {TASK_ICONS.duplicate}
                </button>
              </div>
            </div>
            <div className="absolute right-2 top-2 opacity-60 cursor-grab">{TASK_ICONS.drag}</div>
          </div>
        ))}
      </div>
    </div>
  );
}