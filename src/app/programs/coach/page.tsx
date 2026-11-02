"use client";

import { Button } from "@/components/ui/Button";
import { useApp } from "@/context/AppContext";
import {
  advanceCoach,
  finalizeCoachProgram,
  initialCoachState,
  type CoachBuilderState,
} from "@/lib/coach";
import { validateProgramVolume } from "@/lib/programs";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CoachBuilderPage() {
  const { state, saveCustomProgram, setCoachDraft } = useApp();
  const [builder, setBuilder] = useState<CoachBuilderState | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);

  useEffect(() => {
    if (!state.profile) return;
    const init = initialCoachState(state.profile);
    setBuilder(init);
    setCoachDraft(init.messages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.profile]);

  if (!state.profile) {
    return (
      <p className="text-[var(--mid-slate)]">Complete onboarding first.</p>
    );
  }

  if (!builder) {
    return (
      <p className="font-heading text-xl uppercase text-[var(--navy)] animate-pulse">
        Coach warming up…
      </p>
    );
  }

  const onOption = (id: string, label: string) => {
    if (id === "save" || id === "rename_focus") {
      const name =
        id === "rename_focus" ? "Focus Block" : "My Program";
      const program = finalizeCoachProgram(builder, name);
      const validation = validateProgramVolume(program.sessions);
      // Soft validate — still save, surface warnings in description if needed
      if (!validation.ok) {
        program.description += ` Guardrails: ${validation.warnings[0]}`;
      }
      saveCustomProgram(program, true);
      setSavedId(program.id);
      const next = advanceCoach(builder, state.profile!, id, label);
      setBuilder(next);
      setCoachDraft(next.messages);
      return;
    }
    if (id === "done") return;
    const next = advanceCoach(builder, state.profile!, id, label);
    setBuilder(next);
    setCoachDraft(next.messages);
  };

  const last = builder.messages[builder.messages.length - 1];

  return (
    <div className="mx-auto max-w-2xl animate-fade-up">
      <header className="mb-6">
        <Link
          href="/programs"
          className="text-sm text-[var(--mid-slate)] hover:text-[var(--navy)]"
        >
          ← Programs
        </Link>
        <h1 className="mt-2 text-3xl uppercase tracking-wide">Coach Builder</h1>
        <p className="mt-2 text-[var(--mid-slate)]">
          Short questions. Clear proposals. You accept, tweak, or reject — we validate volume as we go.
        </p>
      </header>

      <div className="space-y-4 rounded-md border border-[var(--navy)]/10 bg-white/80 p-4 md:p-5">
        {builder.messages.map((m) => (
          <div
            key={m.id}
            className={
              m.role === "coach"
                ? "max-w-[95%] rounded-md bg-[var(--cream)] px-3 py-2.5 text-sm text-[var(--navy)]"
                : "ml-auto max-w-[85%] rounded-md bg-[var(--navy)] px-3 py-2.5 text-sm text-white"
            }
          >
            {m.role === "coach" && (
              <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-[var(--orange)]">
                Coach
              </p>
            )}
            {m.text}
          </div>
        ))}

        {last?.options && !savedId && last.options[0]?.id !== "done" && (
          <div className="flex flex-wrap gap-2 pt-2">
            {last.options.map((opt) => (
              <Button
                key={opt.id}
                size="sm"
                variant={
                  opt.id.startsWith("accept") ||
                  opt.id === "save" ||
                  opt.id === "keep_main" ||
                  opt.id === "keep"
                    ? "primary"
                    : "outline"
                }
                onClick={() => onOption(opt.id, opt.label)}
              >
                {opt.label}
              </Button>
            ))}
          </div>
        )}

        {savedId && (
          <div className="flex flex-wrap gap-2 pt-2">
            <Link href="/programs">
              <Button>View programs</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline">Dashboard</Button>
            </Link>
          </div>
        )}
      </div>

      {builder.sessions.length > 0 && (
        <aside className="mt-6 rounded-md border border-[var(--navy)]/10 bg-white/60 p-4">
          <h2 className="text-sm font-heading uppercase tracking-wide text-[var(--navy)]">
            Live draft
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            {builder.sessions.map((s) => (
              <li key={s.id}>
                <span className="font-medium text-[var(--navy)]">{s.name}</span>
                <span className="text-[var(--mid-slate)]">
                  {" "}
                  · {s.exercises.length} lifts · {s.estimatedMinutes}m
                </span>
              </li>
            ))}
          </ul>
        </aside>
      )}
    </div>
  );
}
