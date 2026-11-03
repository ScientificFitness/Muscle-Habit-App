"use client";

import { Button } from "@/components/ui/Button";
import { useApp } from "@/context/AppContext";

export default function HabitLabPage() {
  const {
    research,
    state,
    applyResearch,
    dismissResearch,
    markResearchSeen,
  } = useApp();

  return (
    <div className="mx-auto max-w-3xl space-y-6 animate-fade-up">
      <header>
        <h1 className="text-3xl uppercase tracking-wide md:text-4xl">
          The Habit Lab
        </h1>
        <p className="mt-2 text-[var(--mid-slate)]">
          Curated research updates from your coach. Agree to apply a change — it lands in your
          program and the adaptation changelog. Edit{" "}
          <code className="text-[var(--navy)]">src/data/research.json</code> to add more; no
          code changes required.
        </p>
      </header>

      <ul className="space-y-4">
        {research.map((item) => {
          const applied = state.researchApplied.includes(item.id);
          const dismissed = state.researchDismissed.includes(item.id);
          return (
            <li
              key={item.id}
              className="rounded-md border border-[var(--navy)]/10 bg-white/80 p-4 md:p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--orange)]">
                    {item.ruleTarget.replace("_", " ")} · {item.date}
                  </p>
                  <h2 className="mt-1 text-xl uppercase tracking-wide">{item.title}</h2>
                </div>
                {applied && (
                  <span className="text-xs font-bold uppercase text-[var(--navy)]">
                    Applied
                  </span>
                )}
                {dismissed && !applied && (
                  <span className="text-xs font-bold uppercase text-[var(--mid-slate)]">
                    Passed
                  </span>
                )}
              </div>
              <p className="mt-3 text-sm text-[var(--navy)]">{item.summary}</p>
              <p className="mt-2 text-xs text-[var(--mid-slate)]">{item.source}</p>
              <div className="mt-4 rounded-md bg-[var(--cream)] p-3 text-sm">
                <p className="font-medium text-[var(--navy)]">Proposed change</p>
                <p className="mt-1 text-[var(--mid-slate)]">
                  <span className="text-[var(--navy)]">From:</span> {item.proposedChange.from}
                </p>
                <p className="text-[var(--mid-slate)]">
                  <span className="text-[var(--navy)]">To:</span> {item.proposedChange.to}
                </p>
                <p className="mt-2 text-[var(--navy)]">{item.proposedChange.explanation}</p>
              </div>
              {!applied && !dismissed && (
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    onClick={() => {
                      markResearchSeen(item.id);
                      applyResearch(item.id);
                    }}
                  >
                    Apply to my program
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => dismissResearch(item.id)}
                  >
                    Not now
                  </Button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
