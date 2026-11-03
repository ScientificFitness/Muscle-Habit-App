"use client";

import { HabitStrength } from "@/components/dashboard/HabitStrength";
import { WeightPredictor } from "@/components/dashboard/WeightPredictor";
import { Button } from "@/components/ui/Button";
import { useApp } from "@/context/AppContext";
import { todayISO } from "@/lib/formulas";
import Link from "next/link";
import { useEffect, useMemo } from "react";

export default function DashboardPage() {
  const {
    welcomeMessage,
    activeProgram,
    state,
    pendingResearch,
    runEngine,
    markResearchSeen,
  } = useApp();

  useEffect(() => {
    // Run adaptive engine when dashboard opens with enough data
    if (state.workoutLogs.length > 0 && activeProgram) {
      runEngine();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const todaySession = useMemo(() => {
    if (!activeProgram) return null;
    const doneToday = state.workoutLogs.some((w) => w.date === todayISO());
    if (doneToday) return { session: null, done: true as const };
    const count = state.workoutLogs.filter((w) =>
      activeProgram.sessions.some((s) => s.id === w.sessionId || w.sessionName === s.name)
    ).length;
    const session =
      activeProgram.sessions[count % activeProgram.sessions.length];
    return { session, done: false };
  }, [activeProgram, state.workoutLogs]);

  const unseenResearch = pendingResearch.filter(
    (r) => !state.settings.researchNotificationsSeen.includes(r.id)
  )[0];

  return (
    <div className="mx-auto max-w-5xl space-y-6 animate-fade-up">
      <header>
        <p className="text-sm font-medium text-[var(--orange)]">Muscle Habit</p>
        <h1 className="mt-1 text-3xl uppercase tracking-wide md:text-4xl">
          {welcomeMessage}
        </h1>
      </header>

      {unseenResearch && (
        <div className="flex flex-col gap-3 rounded-md border border-[var(--orange)]/30 bg-[var(--orange-soft)] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-heading text-sm uppercase tracking-wide text-[var(--navy)]">
              New research suggestion
            </p>
            <p className="text-sm text-[var(--navy)] mt-1">{unseenResearch.title}</p>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => markResearchSeen(unseenResearch.id)}
            >
              Later
            </Button>
            <Link href="/planner/lab">
              <Button size="sm">Review in Habit Lab</Button>
            </Link>
          </div>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="rounded-md border border-[var(--navy)]/10 bg-white/80 p-4 md:p-5 lg:col-span-2">
          <h2 className="text-xl uppercase tracking-wide">Today&apos;s session</h2>
          {!activeProgram && (
            <div className="mt-4">
              <p className="text-[var(--mid-slate)] text-sm">
                No active program yet. Grab a template or build one with the coach.
              </p>
              <Link href="/planner/programs" className="mt-4 inline-block">
                <Button>Choose a program</Button>
              </Link>
            </div>
          )}
          {activeProgram && todaySession?.done && (
            <div className="mt-4">
              <p className="text-sm text-[var(--navy)]">
                Session logged for today. Recovery is part of the program — see you next time.
              </p>
              <Link href="/planner/numbers" className="mt-4 inline-block">
                <Button variant="outline">Update My Numbers</Button>
              </Link>
            </div>
          )}
          {activeProgram && todaySession?.session && (
            <div className="mt-4">
              <p className="font-heading text-2xl uppercase text-[var(--navy)]">
                {todaySession.session.name}
              </p>
              <p className="mt-1 text-sm text-[var(--mid-slate)]">
                {activeProgram.name} · ~{todaySession.session.estimatedMinutes}{" "}
                min · {todaySession.session.exercises.length} movements
              </p>
              <ul className="mt-4 space-y-2">
                {todaySession.session.exercises.map((ex) => (
                  <li
                    key={ex.id}
                    className="flex items-baseline justify-between gap-3 border-b border-[var(--navy)]/8 py-2 text-sm"
                  >
                    <span className="font-medium text-[var(--navy)]">{ex.name}</span>
                    <span className="text-[var(--mid-slate)] tabular-nums">
                      {ex.sets} × {ex.repRange[0]}–{ex.repRange[1]}
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                href={`/planner/workout?session=${todaySession.session.id}`}
                className="mt-5 inline-block"
              >
                <Button>Start session</Button>
              </Link>
            </div>
          )}
        </section>
        <HabitStrength />
      </div>

      <WeightPredictor />

      <section className="rounded-md border border-[var(--navy)]/10 bg-white/80 p-4 md:p-5">
        <h2 className="text-xl uppercase tracking-wide">Adaptation changelog</h2>
        <p className="mt-1 text-sm text-[var(--mid-slate)]">
          Every automatic tweak shows up here — transparent coaching.
        </p>
        {state.adaptations.length === 0 ? (
          <p className="mt-4 text-sm text-[var(--mid-slate)]">
            No adaptations yet. Log a few sessions and the engine will start adjusting.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {state.adaptations.slice(0, 8).map((a) => (
              <li key={a.id} className="border-l-2 border-[var(--orange)] pl-3">
                <p className="text-sm font-semibold text-[var(--navy)]">{a.summary}</p>
                <p className="text-sm text-[var(--mid-slate)]">{a.detail}</p>
                <p className="mt-1 text-xs text-[var(--mid-slate)]">{a.date}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
