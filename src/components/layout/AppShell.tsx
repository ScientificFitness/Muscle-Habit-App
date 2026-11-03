"use client";

import { Celebration } from "@/components/Celebration";
import { MobileNav, Sidebar, TopBar } from "@/components/layout/Nav";
import { useApp } from "@/context/AppContext";
import { routes } from "@/lib/paths";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { ready, state } = useApp();
  const pathname = usePathname();
  const router = useRouter();
  const isPlanner = pathname.startsWith(routes.planner);
  const isOnboarding = pathname.startsWith(routes.onboarding);

  useEffect(() => {
    if (!ready || !isPlanner) return;
    if (!state.onboarded && !isOnboarding) {
      router.replace(routes.onboarding);
    } else if (
      state.onboarded &&
      (pathname === routes.planner || isOnboarding)
    ) {
      router.replace(routes.dashboard);
    }
  }, [ready, state.onboarded, isOnboarding, isPlanner, pathname, router]);

  // Marketing (and any non-planner) routes: no planner chrome
  if (!isPlanner) {
    return <>{children}</>;
  }

  if (!ready) {
    return (
      <div className="min-h-screen grid place-items-center bg-[var(--cream)]">
        <p className="font-heading text-2xl uppercase tracking-widest text-[var(--navy)] animate-pulse">
          Muscle Habit
        </p>
      </div>
    );
  }

  if (isOnboarding || !state.onboarded) {
    return (
      <>
        {children}
        <Celebration />
      </>
    );
  }

  return (
    <div className="min-h-screen md:flex">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <TopBar />
        <main className="flex-1 px-4 py-6 pb-24 md:px-8 md:pb-8">{children}</main>
        <MobileNav />
      </div>
      <Celebration />
    </div>
  );
}
