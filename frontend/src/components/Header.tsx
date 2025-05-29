"use client";
import { useEffect, useRef, useState } from "react";

export default function Header() {
  const [visible, setVisible] = useState(true);
  const lastScroll = useRef(0);

  useEffect(() => {
    let ticking = false;
    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          // Só esconde se não está no topo (evita bug visual)
          if (scrollY < 10) {
            setVisible(true);
          } else if (scrollY > lastScroll.current) {
            setVisible(false); // rolando para baixo, esconde
          } else {
            setVisible(true); // rolando para cima, mostra
          }
          lastScroll.current = scrollY;
          ticking = false;
        });
        ticking = true;
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      style={{
        background: "rgba(246,245,242,0.80)",
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid rgba(233,196,106,0.3)",
        position: "sticky",
        top: 0,
        zIndex: 50,
        boxShadow: "0 1px 6px 0 rgba(233,196,106,0.08)",
        transition: "transform 0.35s cubic-bezier(.4,0,.2,1), opacity 0.25s",
        transform: visible ? "translateY(0)" : "translateY(-110%)",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "1rem 1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontSize: "2rem",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: "#264653",
            textShadow: "0 1px 8px rgba(233,196,106,0.08)",
            userSelect: "none",
          }}
        >
          <span style={{ color: "#E9C46A" }}>O</span>rganizo
        </span>
        <nav
          style={{
            display: "flex",
            gap: "1.5rem",
            alignItems: "center",
          }}
        >
          <a
            href="#"
            style={{
              padding: "0.5rem 0.75rem",
              borderRadius: "999px",
              fontWeight: 500,
              color: "rgba(38,70,83,0.9)",
              textDecoration: "none",
              transition: "background 0.15s, color 0.15s",
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = "rgba(233,196,106,0.2)";
              e.currentTarget.style.color = "#E9C46A";
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "rgba(38,70,83,0.9)";
            }}
          >
            Início
          </a>
          <a
            href="#"
            style={{
              padding: "0.5rem 0.75rem",
              borderRadius: "999px",
              fontWeight: 500,
              color: "rgba(38,70,83,0.9)",
              textDecoration: "none",
              transition: "background 0.15s, color 0.15s",
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = "rgba(233,196,106,0.2)";
              e.currentTarget.style.color = "#E9C46A";
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "rgba(38,70,83,0.9)";
            }}
          >
            Sobre
          </a>
          <a
            href="#"
            style={{
              padding: "0.5rem 0.75rem",
              borderRadius: "999px",
              fontWeight: 500,
              color: "rgba(38,70,83,0.9)",
              textDecoration: "none",
              transition: "background 0.15s, color 0.15s",
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = "rgba(233,196,106,0.2)";
              e.currentTarget.style.color = "#E9C46A";
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "rgba(38,70,83,0.9)";
            }}
          >
            Contato
          </a>
        </nav>
      </div>
    </header>
  );
}