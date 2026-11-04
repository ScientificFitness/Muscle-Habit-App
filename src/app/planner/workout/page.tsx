"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { useApp } from "@/context/AppContext";
import { isMissedRepDeloadRecommended } from "@/lib/adaptation";
import { todayISO } from "@/lib/formulas";
import type { LoggedExercise, LoggedSet, ProgramSession } from "@/lib/types";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

function buildLogs(session: ProgramSession): LoggedExercise[] {
  return session.exercises.map((ex) => ({
    exerciseId: ex.id,
    name: ex.name,
    linkedLift: ex.linkedLift,
    sets: Array.from({ length: ex.sets }, () => ({
      weightKg: 0,
      reps: ex.repRange[0],
      completed: false,
    })),
  }));
}

function useSession() {
  const { activeProgram, state } = useApp();
  const params = useSearchParams();
  const sessionId = params.get("session");
  return useMemo(() => {
    if (!activeProgram) return null;
    if (sessionId) {
      return (
        activeProgram.sessions.find((s) => s.id === sessionId) ??
        activeProgram.sessions[0]
      );
    }
    const count = state.workoutLogs.length;
    return activeProgram.sessions[count % activeProgram.sessions.length];
  }, [activeProgram, sessionId, state.workoutLogs.length]);
}

function WorkoutInner() {
  const { activeProgram, state, logWorkout, runEngine } = useApp();
  const session = useSession();

  const [logs, setLogs] = useState<LoggedExercise[]>([]);
  const [recovery, setRecovery] = useState(4);
  const [done, setDone] = useState(false);

  const deloadRecommended = useMemo(
    () => isMissedRepDeloadRecommended(activeProgram, state.workoutLogs),
    [activeProgram, state.workoutLogs]
  );

  useEffect(() => {
    if (session) setLogs(buildLogs(session));
  }, [session]);

  if (!activeProgram || !session) {
    return (
      <div className="mx-auto max-w-lg space-y-4">
        <h1 className="text-3xl uppercase tracking-wide">Train</h1>
        <p className="text-[var(--mid-slate)]">
          Activate a program first, then come back to log your session.
        </p>
        <Link href="/planner/programs">
          <Button>Browse programs</Button>
        </Link>
      </div>
    );
  }

  const updateSet = (
    exIdx: number,
    setIdx: number,
    patch: Partial<LoggedSet>
  ) => {
    setLogs((prev) =>
      prev.map((ex, i) =>
        i !== exIdx
          ? ex
          : {
              ...ex,
              sets: ex.sets.map((s, j) =>
                j === setIdx ? { ...s, ...patch } : s
              ),
            }
      )
    );
  };

  const finish = () => {
    logWorkout({
      date: todayISO(),
      sessionId: session.id,
      sessionName: session.name,
      exercises: logs,
      recoveryScore: recovery,
    });
    runEngine();
    setDone(true);
  };

  if (done) {
    return (
      <div className="mx-auto max-w-lg animate-fade-up space-y-4">
        <h1 className="text-3xl uppercase tracking-wide">Session logged</h1>
        <p className="text-[var(--mid-slate)]">
          Nice work. The adaptation engine reviewed your log — check the dashboard changelog.
        </p>
        <div className="flex gap-2">
          <Link href="/planner/dashboard">
            <Button>Dashboard</Button>
          </Link>
          <Link href="/planner/numbers">
            <Button variant="outline">My Numbers</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 animate-fade-up">
      <header>
        <p className="text-sm text-[var(--mid-slate)]">{activeProgram.name}</p>
        <div className="mt-1 flex flex-wrap items-center gap-3">
          <h1 className="text-3xl uppercase tracking-wide">{session.name}</h1>
          {deloadRecommended && (
            <span className="inline-flex items-center rounded-md bg-[var(--orange-soft)] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[var(--orange)] ring-1 ring-[var(--orange)]/30">
              Deload Recommended
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-[var(--mid-slate)]">
          ~{session.estimatedMinutes} min · mark sets complete as you go
          {deloadRecommended
            ? " · two missed-rep sessions → try ~5% lighter loads"
            : ""}
        </p>
      </header>

      {session.exercises.map((ex, exIdx) => (
        <section
          key={ex.id}
          className="rounded-md border border-[var(--navy)]/10 bg-white/80 p-4"
        >
          <div className="flex items-baseline justify-between gap-2">
            <h2 className="text-lg uppercase tracking-wide">{ex.name}</h2>
            <span className="text-xs text-[var(--mid-slate)]">
              Target {ex.repRange[0]}–{ex.repRange[1]}
            </span>
          </div>
          {ex.notes && (
            <p className="mt-1 text-xs text-[var(--mid-slate)]">{ex.notes}</p>
          )}
          <div className="mt-3 space-y-2">
            {logs[exIdx]?.sets.map((s, setIdx) => (
              <div
                key={setIdx}
                className="grid grid-cols-[auto_1fr_1fr_auto] items-end gap-2"
              >
                <span className="pb-2 text-xs font-bold text-[var(--mid-slate)]">
                  S{setIdx + 1}
                </span>
                <div>
                  <Label className="text-xs">kg</Label>
                  <Input
                    type="number"
                    min={0}
                    step={0.5}
                    value={s.weightKg || ""}
                    onChange={(e) =>
                      updateSet(exIdx, setIdx, {
                        weightKg: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <Label className="text-xs">reps</Label>
                  <Input
                    type="number"
                    min={0}
                    value={s.reps}
                    onChange={(e) =>
                      updateSet(exIdx, setIdx, {
                        reps: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant={s.completed ? "secondary" : "outline"}
                  className="mb-0.5"
                  onClick={() =>
                    updateSet(exIdx, setIdx, { completed: !s.completed })
                  }
                >
                  {s.completed ? "Done" : "Log"}
                </Button>
              </div>
            ))}
          </div>
        </section>
      ))}

      <section className="rounded-md border border-[var(--navy)]/10 bg-white/80 p-4">
        <Label>Recovery check-in (1 = wiped, 5 = fresh)</Label>
        <div className="mt-2 flex gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <Button
              key={n}
              size="sm"
              variant={recovery === n ? "primary" : "outline"}
              onClick={() => setRecovery(n)}
            >
              {n}
            </Button>
          ))}
        </div>
        <p className="mt-2 text-xs text-[var(--mid-slate)]">
          Sleep matters most. Low scores may trigger a suggested deload — that&apos;s strategy, not failure.
        </p>
      </section>

      <Button size="lg" className="w-full sm:w-auto" onClick={finish}>
        Finish &amp; celebrate
      </Button>
    </div>
  );
}

export default function WorkoutPage() {
  return (
    <Suspense
      fallback={
        <p className="font-heading text-xl uppercase animate-pulse">Loading session…</p>
      }
    >
      <WorkoutInner />
    </Suspense>
  );
}
