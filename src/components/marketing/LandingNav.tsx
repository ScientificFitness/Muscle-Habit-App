"use client";

import { BrandLogo } from "@/components/BrandLogo";
import { YOUTUBE_CHANNEL } from "@/lib/contact";
import { routes } from "@/lib/paths";
import Link from "next/link";

export function LandingNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0F172A]/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href={routes.home}
          className="flex items-center rounded-md bg-white px-2 py-1 shadow-sm"
          aria-label="Muscle Habit home"
        >
          <BrandLogo size="sm" priority />
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href={routes.videos}
            className="hidden text-sm font-medium text-slate-300 transition hover:text-white sm:inline"
          >
            Training Videos
          </Link>
          <a
            href={YOUTUBE_CHANNEL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden text-sm font-medium text-slate-300 transition hover:text-white md:inline"
          >
            YouTube Channel
          </a>
          <Link
            href={routes.planner}
            className="inline-flex h-10 items-center rounded-md bg-[#F97316] px-4 text-sm font-semibold text-white transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D9488]"
          >
            Start Building Your Routine
          </Link>
        </div>
      </div>
    </header>
  );
}
