"use client";
export default function Header() {
  return (
    <header
      style={{
        background: "rgba(246,245,242,0.80)", // beige/80
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid rgba(233,196,106,0.3)", // gold/30
        position: "sticky",
        top: 0,
        zIndex: 50,
        boxShadow: "0 1px 6px 0 rgba(233,196,106,0.08)",
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
            color: "#264653", // petrol
            textShadow: "0 1px 8px rgba(233,196,106,0.08)",
            userSelect: "none",
          }}
        >
          <span style={{ color: "#E9C46A" /* gold */ }}>O</span>rganizo
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
              color: "rgba(38,70,83,0.9)", // petrol/90
              textDecoration: "none",
              transition: "background 0.15s, color 0.15s",
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = "rgba(233,196,106,0.2)"; // gold/20
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