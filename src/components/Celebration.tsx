"use client";

import { useApp } from "@/context/AppContext";
import { useEffect } from "react";

export function Celebration() {
  const { celebration, clearCelebration } = useApp();

  useEffect(() => {
    if (!celebration) return;
    const t = setTimeout(clearCelebration, 4200);
    return () => clearTimeout(t);
  }, [celebration, clearCelebration]);

  if (!celebration) return null;

  return (
    <div
      role="status"
      className="fixed bottom-24 md:bottom-8 left-1/2 z-50 -translate-x-1/2 animate-celebrate"
    >
      <div className="relative overflow-hidden rounded-md bg-[var(--navy)] px-5 py-3 text-white shadow-lg">
        <div className="pointer-events-none absolute inset-0 celebrate-burst opacity-40" />
        <p className="relative text-sm font-medium tracking-wide">{celebration}</p>
      </div>
    </div>
  );
}
