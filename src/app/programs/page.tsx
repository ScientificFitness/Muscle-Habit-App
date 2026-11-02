"use client";

import { Button } from "@/components/ui/Button";
import { useApp } from "@/context/AppContext";
import { getTemplatePrograms, recommendTemplates } from "@/lib/programs";
import type { Program } from "@/lib/types";
import Link from "next/link";
import { useMemo } from "react";

function ProgramCard({
  program,
  recommended,
  active,
  onActivate,
}: {
  program: Program;
  recommended?: boolean;
  active?: boolean;
  onActivate: () => void;
}) {
  return (
    <article className="flex flex-col rounded-md border border-[var(--navy)]/10 bg-white/80 p-4 transition-shadow duration-200 hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-lg uppercase tracking-wide">{program.name}</h3>
        {recommended && (
          <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-[var(--orange)]">
            Fit
          </span>
        )}
        {active && (
          <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-[var(--navy)]">
            Active
          </span>
        )}
      </div>
      <p className="mt-2 flex-1 text-sm text-[var(--mid-slate)]">{program.description}</p>
      <p className="mt-3 text-xs text-[var(--mid-slate)]">
        {program.weeks} weeks · {program.daysPerWeek} days ·{" "}
        {program.equipment.replace("_", " ")}
        {program.isCustom ? " · Custom" : ""}
      </p>
      <ul className="mt-3 space-y-1 text-sm text-[var(--navy)]">
        {program.sessions.map((s) => (
          <li key={s.id} className="flex justify-between gap-2">
            <span>{s.name}</span>
            <span className="text-[var(--mid-slate)]">{s.estimatedMinutes}m</span>
          </li>
        ))}
      </ul>
      <Button
        className="mt-4"
        variant={active ? "outline" : "primary"}
        onClick={onActivate}
        disabled={active}
      >
        {active ? "Currently active" : "Use this program"}
      </Button>
    </article>
  );
}

export default function ProgramsPage() {
  const { state, setActiveProgram, activeProgram } = useApp();
  const templates = getTemplatePrograms();
  const recommendedIds = useMemo(() => {
    if (!state.profile) return new Set<string>();
    return new Set(recommendTemplates(state.profile).slice(0, 2).map((p) => p.id));
  }, [state.profile]);

  return (
    <div className="mx-auto max-w-5xl space-y-8 animate-fade-up">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl uppercase tracking-wide md:text-4xl">Programs</h1>
          <p className="mt-2 max-w-xl text-[var(--mid-slate)]">
            Pick a ready 12-week template, or build one with the coach — both are first-class.
          </p>
        </div>
        <Link href="/programs/coach">
          <Button>Build with Coach</Button>
        </Link>
      </header>

      {state.customPrograms.length > 0 && (
        <section>
          <h2 className="text-xl uppercase tracking-wide">My programs</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {state.customPrograms.map((p) => (
              <ProgramCard
                key={p.id}
                program={p}
                active={activeProgram?.id === p.id}
                onActivate={() => setActiveProgram(p.id)}
              />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-xl uppercase tracking-wide">Template library</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {templates.map((p) => (
            <ProgramCard
              key={p.id}
              program={p}
              recommended={recommendedIds.has(p.id)}
              active={activeProgram?.id === p.id}
              onActivate={() => setActiveProgram(p.id)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
