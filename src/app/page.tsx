import { BrandLogo } from "@/components/BrandLogo";
import { EmailCapture } from "@/components/marketing/EmailCapture";
import { LandingNav } from "@/components/marketing/LandingNav";
import { routes } from "@/lib/paths";
import { Beaker, Dumbbell, LineChart, Play, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Muscle Habit — Build Sustainable Strength Through Daily Habits",
  description:
    "Evidence-based lifting splits, adaptive progression, and nutrition protocols designed for real-world consistency. Launch the free workout planner.",
};

const YOUTUBE = "https://www.youtube.com/@MuscleHabit";

const features = [
  {
    icon: Dumbbell,
    title: "Coach Builder",
    body: "4 ready templates including Time-Crunch routines — or build a custom block with the interactive coach.",
  },
  {
    icon: Sparkles,
    title: "Adaptive Engine",
    body: "Automatic double progression, volume guardrails, plateau fixes, and scheduled deload rules that show up in a visible changelog.",
  },
  {
    icon: Beaker,
    title: "Habit Lab",
    body: "10 research-backed lifestyle protocols you can apply to your program without rewriting a line of code.",
  },
];

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100">
      <LandingNav />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          aria-hidden
          style={{
            background:
              "radial-gradient(900px 480px at 15% -10%, rgba(13,148,136,0.28), transparent 55%), radial-gradient(700px 420px at 90% 10%, rgba(249,115,22,0.18), transparent 50%)",
          }}
        />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:pb-24 lg:pt-20">
          <div>
            <div className="mb-6 inline-flex rounded-md bg-white px-3 py-2 shadow-lg shadow-black/30">
              <BrandLogo size="lg" priority />
            </div>
            <h1 className="font-heading text-4xl uppercase leading-[1.05] tracking-wide text-white sm:text-5xl lg:text-6xl">
              Build Sustainable Strength Through Daily Habits
            </h1>
            <p className="mt-5 max-w-xl text-base text-slate-300 sm:text-lg">
              Evidence-based lifting splits, adaptive progression, and nutrition
              protocols designed for real-world consistency.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href={routes.planner}
                className="inline-flex h-12 items-center justify-center rounded-md bg-[#F97316] px-6 text-sm font-semibold text-white transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D9488]"
              >
                Launch Free Workout Planner
              </Link>
              <a
                href="#video"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-white/15 bg-white/5 px-6 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D9488]"
              >
                <Play className="h-4 w-4 text-[#0D9488]" aria-hidden />
                Watch the Video Breakdown
              </a>
            </div>
          </div>

          {/* Interactive preview card */}
          <Link
            href={routes.planner}
            className="group relative block overflow-hidden rounded-xl border border-white/10 bg-[#1E293B] p-5 shadow-2xl shadow-black/40 transition hover:border-[#0D9488]/50 sm:p-6"
          >
            <span className="absolute right-4 top-4 rounded-full bg-[#0D9488] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
              Open Tool
            </span>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#0D9488]">
              Planner preview
            </p>
            <h2 className="mt-3 font-heading text-2xl uppercase tracking-wide text-white">
              Coach Builder + 12-Week Predictor
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Build a program in a coaching dialogue, then watch Mifflin–St Jeor
              projections adapt as you log weigh-ins.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-[#0F172A]/80 p-4">
                <Dumbbell className="h-5 w-5 text-[#F97316]" aria-hidden />
                <p className="mt-2 text-sm font-semibold text-white">Coach Builder</p>
                <p className="mt-1 text-xs text-slate-400">
                  Accept, tweak, or reject each piece — volume guardrails included.
                </p>
              </div>
              <div className="rounded-lg bg-[#0F172A]/80 p-4">
                <LineChart className="h-5 w-5 text-[#0D9488]" aria-hidden />
                <p className="mt-2 text-sm font-semibold text-white">Weight path</p>
                <p className="mt-1 text-xs text-slate-400">
                  12-week projection with confidence band and actuals overlay.
                </p>
                <div className="mt-3 h-16 w-full rounded bg-gradient-to-r from-[#0D9488]/40 via-[#F97316]/30 to-transparent opacity-80" />
              </div>
            </div>
            <p className="mt-5 text-sm font-medium text-[#0D9488] transition group-hover:text-[#2dd4bf]">
              Open the free planner →
            </p>
          </Link>
        </div>
      </section>

      {/* Lead magnet */}
      <section className="border-y border-white/5 bg-[#1E293B]/40">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="rounded-xl border border-white/10 bg-[#1E293B] p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F97316]">
              Free lead magnet
            </p>
            <h2 className="mt-3 max-w-2xl font-heading text-3xl uppercase tracking-wide text-white sm:text-4xl">
              Get The 12-Hour Eating Window &amp; Lifting Quickstart Guide
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-slate-300 sm:text-base">
              Based on the 2026 Frontiers in Nutrition meta-analysis. Keep lifting,
              protect muscle, and cut fat without extreme 16-hour fasting.
            </p>
            <div className="mt-6 max-w-xl">
              <EmailCapture />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="font-heading text-3xl uppercase tracking-wide text-white">
          Built for consistency
        </h2>
        <p className="mt-2 max-w-xl text-slate-400">
          Everything that ships in the free planner — no account required.
        </p>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {features.map(({ icon: Icon, title, body }) => (
            <article
              key={title}
              className="rounded-xl border border-white/10 bg-[#1E293B] p-6"
            >
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-[#0D9488]/15 text-[#0D9488]">
                <Icon className="h-5 w-5" aria-hidden />
              </div>
              <h3 className="mt-4 font-heading text-xl uppercase tracking-wide text-white">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Video anchor */}
      <section id="video" className="scroll-mt-24 border-t border-white/5 bg-[#1E293B]/30">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="font-heading text-3xl uppercase tracking-wide text-white">
            Video breakdown
          </h2>
          <p className="mt-2 max-w-xl text-slate-400">
            Walk through Coach Builder, the adaptive engine, and the weight-path
            predictor on the Muscle Habit channel.
          </p>
          <a
            href={YOUTUBE}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 flex min-h-[220px] items-center justify-center rounded-xl border border-dashed border-white/20 bg-[#0F172A] transition hover:border-[#0D9488]/60"
          >
            <span className="inline-flex items-center gap-3 text-sm font-semibold text-white">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-[#F97316] text-white shadow-lg shadow-orange-900/40">
                <Play className="h-6 w-6 translate-x-0.5" aria-hidden />
              </span>
              Watch on YouTube · @MuscleHabit
            </span>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="inline-flex w-fit rounded-md bg-white px-2 py-1">
            <BrandLogo size="sm" />
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-400">
            <a
              href={YOUTUBE}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              YouTube · @MuscleHabit
            </a>
            <Link href={routes.settings} className="hover:text-white">
              App settings
            </Link>
            <Link href={routes.planner} className="hover:text-white">
              Open planner
            </Link>
            <span>© {new Date().getFullYear()} Muscle Habit</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
