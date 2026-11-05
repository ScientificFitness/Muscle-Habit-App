import { BrandLogo } from "@/components/BrandLogo";
import { EmailCapture } from "@/components/marketing/EmailCapture";
import { EnquiryForm } from "@/components/marketing/EnquiryForm";
import { LandingNav } from "@/components/marketing/LandingNav";
import { CONTACT_EMAIL, YOUTUBE_CHANNEL } from "@/lib/contact";
import { routes } from "@/lib/paths";
import { Beaker, Dumbbell, LineChart, Play, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Muscle Habit — Build Sustainable Strength Through Daily Habits",
  description:
    "Evidence-based lifting splits, adaptive progression, and nutrition protocols designed for real-world consistency. Launch the free workout planner.",
};

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

      {/* Hero banner */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          aria-hidden
          style={{
            background:
              "radial-gradient(900px 480px at 15% -10%, rgba(13,148,136,0.28), transparent 55%), radial-gradient(700px 420px at 90% 10%, rgba(249,115,22,0.18), transparent 50%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 pb-12 pt-12 sm:px-6 lg:pb-16 lg:pt-20">
          <div className="max-w-3xl">
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
                Start Building Your Routine
              </Link>
              <a
                href="#video"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-white/15 bg-white/5 px-6 text-sm font-semibold text-white transition hover:border-[#0D9488]/50 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D9488]"
              >
                <Play className="h-4 w-4 text-[#0D9488]" aria-hidden />
                Watch the Video Breakdown
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Embedded Workout Planner teaser — directly below hero */}
      <section
        id="planner-teaser"
        className="border-y border-[#0D9488]/25 bg-[#1E293B]"
      >
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#0D9488]">
                Interactive preview
              </p>
              <h2 className="mt-2 font-heading text-3xl uppercase tracking-wide text-white sm:text-4xl">
                Workout Planner teaser
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-300 sm:text-base">
                Peek at Coach Builder and the 12-week Mifflin–St Jeor weight path —
                then open the full free tool in your browser.
              </p>
            </div>
            <Link
              href={routes.planner}
              className="inline-flex h-11 items-center rounded-md bg-[#F97316] px-5 text-sm font-semibold text-white transition hover:brightness-110"
            >
              Start Building Your Routine
            </Link>
          </div>

          <div className="overflow-hidden rounded-xl border border-[#0D9488]/35 bg-[#0F172A] shadow-2xl shadow-black/40">
            <div className="flex items-center gap-2 border-b border-white/10 bg-[#1E293B] px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-[#F97316]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#0D9488]" />
              <span className="h-2.5 w-2.5 rounded-full bg-slate-500" />
              <span className="ml-3 text-xs font-medium text-slate-400">
                musclehabit.app/planner
              </span>
              <span className="ml-auto rounded-full bg-[#0D9488] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                Open Tool
              </span>
            </div>
            <div className="grid gap-0 lg:grid-cols-2">
              <div className="border-b border-white/10 p-5 sm:p-6 lg:border-b-0 lg:border-r">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#F97316]">
                  Coach Builder
                </p>
                <div className="mt-4 space-y-3">
                  <div className="max-w-[92%] rounded-md bg-[#1E293B] px-3 py-2.5 text-sm text-slate-200">
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-[#0D9488]">
                      Coach
                    </p>
                    Based on your profile I&apos;m thinking 3 full-body days, 45
                    minutes. What should this block emphasize?
                  </div>
                  <div className="ml-auto max-w-[75%] rounded-md bg-[#0D9488] px-3 py-2 text-sm font-medium text-white">
                    Build muscle
                  </div>
                  <div className="max-w-[92%] rounded-md bg-[#1E293B] px-3 py-2.5 text-sm text-slate-200">
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-[#0D9488]">
                      Coach
                    </p>
                    Building season. Any lagging body part for extra volume?
                  </div>
                </div>
                <Link
                  href={routes.coach}
                  className="mt-5 inline-flex text-sm font-semibold text-[#0D9488] hover:text-[#2dd4bf]"
                >
                  Open Coach Builder →
                </Link>
              </div>
              <div className="p-5 sm:p-6">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0D9488]">
                  12-week weight path
                </p>
                <p className="mt-2 text-sm text-slate-400">
                  Mifflin–St Jeor projection with confidence band — overlays your
                  real weigh-ins as you log them.
                </p>
                <div className="relative mt-5 h-40 overflow-hidden rounded-lg border border-white/10 bg-[#1E293B] p-3">
                  <svg
                    viewBox="0 0 320 120"
                    className="h-full w-full"
                    aria-hidden
                  >
                    <path
                      d="M10 30 C 80 34, 140 48, 200 70 S 290 95, 310 100"
                      fill="none"
                      stroke="#0D9488"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <path
                      d="M10 18 C 80 22, 140 36, 200 58 S 290 82, 310 88"
                      fill="none"
                      stroke="#F97316"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                      opacity="0.7"
                    />
                    <path
                      d="M10 42 C 80 46, 140 60, 200 82 S 290 108, 310 112"
                      fill="none"
                      stroke="#F97316"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                      opacity="0.7"
                    />
                    <circle cx="24" cy="32" r="4" fill="#F97316" />
                  </svg>
                  <div className="absolute bottom-3 left-3 flex gap-3 text-[10px] uppercase tracking-wider text-slate-400">
                    <span className="inline-flex items-center gap-1">
                      <span className="h-1.5 w-3 rounded bg-[#0D9488]" /> Projected
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <span className="h-1.5 w-3 rounded bg-[#F97316]/70" /> Band
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm text-slate-300">
                  <LineChart className="h-4 w-4 text-[#0D9488]" aria-hidden />
                  Adaptive engine keeps the path honest as habits stack.
                </div>
              </div>
            </div>
            <div className="border-t border-white/10 bg-[#1E293B]/80 px-5 py-4 sm:px-6">
              <Link
                href={routes.planner}
                className="group flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
              >
                <p className="text-sm text-slate-300">
                  Full planner: templates, e1RM tracking, Habit Lab, and local-only
                  progress — no account required.
                </p>
                <span className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-[#F97316] group-hover:brightness-110">
                  <Dumbbell className="h-4 w-4" aria-hidden />
                  Start Building Your Routine
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Lead magnet */}
      <section className="border-b border-white/5 bg-[#0F172A]">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="rounded-xl border border-[#0D9488]/30 bg-[#1E293B] p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F97316]">
              Free Kickstart Guide
            </p>
            <h2 className="mt-3 max-w-2xl font-heading text-3xl uppercase tracking-wide text-white sm:text-4xl">
              Get The 12-Hour Eating Window &amp; Lifting Kickstart Guide
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
            Training videos
          </h2>
          <p className="mt-2 max-w-xl text-slate-400">
            Evidence library for eating windows, hypertrophy rules, recovery, and
            habit stacking — curated for busy lifters.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href={routes.videos}
              className="flex min-h-[160px] flex-1 items-center justify-center rounded-xl border border-[#0D9488]/40 bg-[#0F172A] transition hover:border-[#0D9488]"
            >
              <span className="inline-flex items-center gap-3 text-sm font-semibold text-white">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-[#F97316] text-white shadow-lg shadow-orange-900/40">
                  <Play className="h-6 w-6 translate-x-0.5" aria-hidden />
                </span>
                Open Training Videos library
              </span>
            </Link>
            <a
              href={YOUTUBE_CHANNEL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center rounded-md border border-white/15 px-5 text-sm font-semibold text-white hover:border-[#0D9488]/50"
            >
              YouTube · @MuscleHabit
            </a>
          </div>
        </div>
      </section>

      {/* Enquiry */}
      <section id="contact" className="scroll-mt-24 border-t border-white/5 bg-[#0F172A]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F97316]">
                Contact
              </p>
              <h2 className="mt-3 font-heading text-3xl uppercase tracking-wide text-white sm:text-4xl">
                Enquire with Muscle Habit
              </h2>
              <p className="mt-3 text-slate-400">
                General questions or online personal coaching applications —
                messages go straight to{" "}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="font-semibold text-[#0D9488] hover:underline"
                >
                  {CONTACT_EMAIL}
                </a>
                .
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-[#1E293B] p-6 sm:p-8">
              <EnquiryForm />
            </div>
          </div>
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
              href={`mailto:${CONTACT_EMAIL}`}
              className="hover:text-[#0D9488]"
            >
              {CONTACT_EMAIL}
            </a>
            <Link href={routes.videos} className="hover:text-[#0D9488]">
              Training Videos
            </Link>
            <a
              href={YOUTUBE_CHANNEL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#0D9488]"
            >
              YouTube · @MuscleHabit
            </a>
            <Link href="#contact" className="hover:text-[#0D9488]">
              Enquire
            </Link>
            <Link href={routes.planner} className="hover:text-[#F97316]">
              Start Building Your Routine
            </Link>
            <span>© {new Date().getFullYear()} Muscle Habit</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
