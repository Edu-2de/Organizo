"use client";
import React, { useEffect, useState } from "react";

export default function WeatherWidget() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState<string>("");

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

  function WeatherIcon() {
    if (!weather) return null;
    if (weather.weathercode === 0) {
      return (
        <span className="relative flex items-center justify-center">
          <span className="block w-16 h-16 rounded-full bg-[#ffe066] animate-spin-slow shadow-lg" />
          <span className="absolute text-5xl" style={{ left: 0, right: 0 }}>☀️</span>
        </span>
      );
    }
    if (weather.weathercode < 4) {
      return (
        <span className="relative flex items-center justify-center">
          <span className="block w-16 h-16 rounded-full bg-[#b3e0ff] animate-pulse shadow-lg" />
          <span className="absolute text-5xl" style={{ left: 0, right: 0 }}>⛅</span>
        </span>
      );
    }
    return (
      <span className="relative flex items-center justify-center">
        <span className="block w-16 h-16 rounded-full bg-[#b3c6ff] animate-bounce shadow-lg" />
        <span className="absolute text-5xl" style={{ left: 0, right: 0 }}>🌧️</span>
      </span>
    );
  }

  return (
    <div
      className={`
        flex flex-col items-center justify-center p-4 sm:p-6 rounded-2xl shadow-xl border border-[#e2e3e7]
        bg-gradient-to-br from-[#e9c46a22] to-[#fff] min-w-[150px] min-h-[170px] sm:min-w-[180px] sm:min-h-[190px]
        transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl cursor-pointer
        w-full h-full
      `}
      style={{
        maxWidth: 400,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        display: "flex"
      }}
      title="Clima"
    >
      <div className="flex flex-col items-center gap-2 w-full">
        <span className="font-semibold text-[#523A68]">Clima agora</span>
        {loading ? (
          <div className="animate-pulse text-[#A9C5A0] mt-4">Carregando...</div>
        ) : weather ? (
          <>
            <WeatherIcon />
            <span className="text-4xl sm:text-5xl font-bold text-[#264653] drop-shadow">{Math.round(weather.temperature)}°C</span>
            <span className="text-base text-[#523A68] mt-1">{city}</span>
            <div className="text-sm text-[#A9C5A0] mt-2">
              <div>Vento: {Math.round(weather.windspeed)} km/h</div>
              <div>Direção: {weather.winddirection}°</div>
              <div>Atualizado: {new Date().toLocaleTimeString("pt-BR")}</div>
            </div>
          </>
        ) : (
          <div className="text-[#A9C5A0] mt-4">Não foi possível obter o clima.</div>
        )}
      </div>
    </div>
  );
}