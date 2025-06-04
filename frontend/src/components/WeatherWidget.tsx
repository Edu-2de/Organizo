"use client";
import React, { useEffect, useState } from "react";
import { useTheme } from "@/components/ThemeContext";

export default function WeatherWidget() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState<string>("");

  const themeCtx = useTheme?.();
  const themeKey = themeCtx?.themeKey || "classic";

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=auto`;
          const res = await fetch(url);
          const data = await res.json();
          setWeather(data.current_weather);

          fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
            .then(r => r.json())
            .then(loc => setCity(loc.address?.city || loc.address?.town || loc.address?.village || "Sua cidade"));
          setLoading(false);
        },
        () => setLoading(false)
      );
    } else {
      setLoading(false);
    }
  }, []);

  // Estilos por tema
  const themeStyles = {
    classic: {
      card: "flex flex-col items-center justify-center p-4 sm:p-6 rounded-2xl shadow-xl border border-[#e2e3e7] bg-gradient-to-br from-[#e9c46a22] to-[#fff] min-w-[150px] min-h-[170px] sm:min-w-[180px] sm:min-h-[190px] transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl cursor-pointer w-full h-full",
      cardStyle: {
        maxWidth: 400,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        display: "flex"
      },
      title: "font-semibold text-[#523A68]",
      temp: "text-4xl sm:text-5xl font-bold text-[#264653] drop-shadow",
      city: "text-base text-[#523A68] mt-1",
      details: "text-sm text-[#A9C5A0] mt-2",
      loading: "animate-pulse text-[#A9C5A0] mt-4",
      error: "text-[#A9C5A0] mt-4"
    },
    sunset: {
      card: "flex flex-col items-center justify-center p-5 sm:p-7 rounded-3xl border-2 border-[#FFD452] bg-gradient-to-br from-[#FFF5E1] to-[#FFD45233] min-w-[150px] min-h-[170px] sm:min-w-[180px] sm:min-h-[190px] transition-all duration-500 hover:scale-[1.04] hover:shadow-lg cursor-pointer w-full h-full shadow-none",
      cardStyle: {
        maxWidth: 400,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
        boxShadow: "0 4px 24px #FFD45222"
      },
      title: "font-bold text-[#A4508B] tracking-wide",
      temp: "text-5xl font-extrabold text-[#F76D77] drop-shadow-sm",
      city: "text-base text-[#A4508B] mt-1 font-medium",
      details: "text-xs text-[#A4508B] mt-2 font-semibold",
      loading: "animate-pulse text-[#F76D77] mt-4",
      error: "text-[#F76D77] mt-4"
    },
    ocean: {
      card: "flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl border border-[#B6E6F5] bg-[#F7FEFF] min-w-[150px] min-h-[170px] sm:min-w-[180px] sm:min-h-[190px] transition-all duration-500 hover:scale-[1.03] hover:shadow-xl cursor-pointer w-full h-full shadow-none",
      cardStyle: {
        maxWidth: 400,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
        boxShadow: "0 4px 24px #B6E6F522"
      },
      title: "font-semibold text-[#247BA0] tracking-wide",
      temp: "text-5xl font-bold text-[#247BA0] drop-shadow-none",
      city: "text-base text-[#155263] mt-1 font-medium",
      details: "text-xs text-[#97C1A9] mt-2 font-semibold",
      loading: "animate-pulse text-[#B6E6F5] mt-4",
      error: "text-[#B6E6F5] mt-4"
    }
  };

  const style = themeStyles[themeKey];

  function WeatherIcon() {
    if (!weather) return null;
    if (weather.weathercode === 0) {
      // Sol
      return (
        <span className="relative flex items-center justify-center">
          <span
            className={
              themeKey === "sunset"
                ? "block w-16 h-16 rounded-full bg-[#FFD452] shadow-lg"
                : themeKey === "ocean"
                ? "block w-14 h-14 rounded-full bg-[#B6E6F5] shadow"
                : "block w-16 h-16 rounded-full bg-[#ffe066] animate-spin-slow shadow-lg"
            }
            style={themeKey === "ocean" ? { border: "2px solid #97C1A9" } : undefined}
          />
          <span
            className="absolute text-5xl"
            style={{
              left: 0,
              right: 0,
              color:
                themeKey === "sunset"
                  ? "#F76D77"
                  : themeKey === "ocean"
                  ? "#247BA0"
                  : undefined,
              fontSize: themeKey === "ocean" ? "2.5rem" : undefined
            }}
          >
            ☀️
          </span>
        </span>
      );
    }
    if (weather.weathercode < 4) {
      // Parcialmente nublado
      return (
        <span className="relative flex items-center justify-center">
          <span
            className={
              themeKey === "sunset"
                ? "block w-16 h-16 rounded-full bg-[#FFD45299] shadow-lg"
                : themeKey === "ocean"
                ? "block w-14 h-14 rounded-full bg-[#E0FBFC] shadow"
                : "block w-16 h-16 rounded-full bg-[#b3e0ff] animate-pulse shadow-lg"
            }
            style={themeKey === "ocean" ? { border: "2px solid #B6E6F5" } : undefined}
          />
          <span
            className="absolute text-5xl"
            style={{
              left: 0,
              right: 0,
              color:
                themeKey === "sunset"
                  ? "#A4508B"
                  : themeKey === "ocean"
                  ? "#247BA0"
                  : undefined,
              fontSize: themeKey === "ocean" ? "2.5rem" : undefined
            }}
          >
            ⛅
          </span>
        </span>
      );
    }
    // Chuva
    return (
      <span className="relative flex items-center justify-center">
        <span
          className={
            themeKey === "sunset"
              ? "block w-16 h-16 rounded-full bg-[#F76D77] shadow-lg"
              : themeKey === "ocean"
              ? "block w-14 h-14 rounded-full bg-[#B6E6F5] shadow"
              : "block w-16 h-16 rounded-full bg-[#b3c6ff] animate-bounce shadow-lg"
          }
          style={themeKey === "ocean" ? { border: "2px solid #247BA0" } : undefined}
        />
        <span
          className="absolute text-5xl"
          style={{
            left: 0,
            right: 0,
            color:
              themeKey === "sunset"
                ? "#FFD452"
                : themeKey === "ocean"
                ? "#247BA0"
                : undefined,
            fontSize: themeKey === "ocean" ? "2.5rem" : undefined
          }}
        >
          🌧️
        </span>
      </span>
    );
  }

  return (
    <div
      className={style.card}
      style={style.cardStyle}
      title="Clima"
    >
      <div className="flex flex-col items-center gap-2 w-full">
        <span className={style.title}>Clima agora</span>
        {loading ? (
          <div className={style.loading}>Carregando...</div>
        ) : weather ? (
          <>
            <WeatherIcon />
            <span className={style.temp}>{Math.round(weather.temperature)}°C</span>
            <span className={style.city}>{city}</span>
            <div className={style.details}>
              <div>Vento: {Math.round(weather.windspeed)} km/h</div>
              <div>Direção: {weather.winddirection}°</div>
              <div>Atualizado: {new Date().toLocaleTimeString("pt-BR")}</div>
            </div>
          </>
        ) : (
          <div className={style.error}>Não foi possível obter o clima.</div>
        )}
      </div>
    </div>
  );
}