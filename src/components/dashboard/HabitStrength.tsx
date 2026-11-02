"use client";

import { useApp } from "@/context/AppContext";

export function HabitStrength() {
  const { state, streakPhrase } = useApp();
  const score = state.habitStrength;

  return (
    <section className="rounded-md border border-[var(--navy)]/10 bg-white/80 p-4 md:p-5">
      <h2 className="text-xl uppercase tracking-wide">Habit Strength</h2>
      <p className="mt-1 text-sm text-[var(--mid-slate)]">{streakPhrase}</p>
      <div className="mt-4 flex items-end gap-3">
        <span className="font-heading text-4xl text-[var(--navy)] tabular-nums">
          {score}
        </span>
        <span className="mb-1 text-sm text-[var(--mid-slate)]">/ 100</span>
      </div>
      <div className="habit-bar mt-3 h-2 overflow-hidden rounded-full bg-[var(--cream-2)]">
        <span
          className="block h-full rounded-full bg-[var(--orange)] transition-all duration-500"
          style={{ width: `${score}%` }}
        />
      </div>
      <p className="mt-3 text-xs text-[var(--mid-slate)]">
        Grows with logged sessions. Decays gently if you go quiet — never a punishment meter.
      </p>
    </section>
  );
}
