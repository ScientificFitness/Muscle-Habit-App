"use client";

import { useApp } from "@/context/AppContext";
import { routes } from "@/lib/paths";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/** Entry point — send users to onboarding or dashboard. */
export default function PlannerIndexPage() {
  const { ready, state } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    router.replace(state.onboarded ? routes.dashboard : routes.onboarding);
  }, [ready, state.onboarded, router]);

  return (
    <div className="min-h-[40vh] grid place-items-center">
      <p className="font-heading text-xl uppercase tracking-widest text-[var(--navy)] animate-pulse">
        Opening planner…
      </p>
    </div>
  );
}
