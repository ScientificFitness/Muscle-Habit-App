import { BrandLogo } from "@/components/BrandLogo";
import { LandingNav } from "@/components/marketing/LandingNav";
import { LIBRARY_VIDEOS } from "@/data/videos";
import { CONTACT_EMAIL, YOUTUBE_CHANNEL } from "@/lib/contact";
import { routes } from "@/lib/paths";
import { ExternalLink, Play } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Training Videos — Muscle Habit Evidence Library",
  description:
    "Muscle Habit Training & Evidence Library — eating windows, hypertrophy rules, recovery, and habit stacking. Subscribe on YouTube @MuscleHabit.",
};

export default function VideosPage() {
  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100">
      <LandingNav />

      <section className="relative overflow-hidden border-b border-white/5">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          aria-hidden
          style={{
            background:
              "radial-gradient(800px 400px at 20% -10%, rgba(13,148,136,0.25), transparent 55%), radial-gradient(600px 360px at 90% 0%, rgba(249,115,22,0.16), transparent 50%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
          <div className="mb-6 inline-flex rounded-md bg-white px-3 py-2 shadow-lg shadow-black/30">
            <BrandLogo size="md" priority />
          </div>
          <a
            href={YOUTUBE_CHANNEL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2"
          >
            <h1 className="font-heading text-3xl uppercase tracking-wide text-white sm:text-5xl">
              Muscle Habit Training &amp; Evidence Library
            </h1>
            <ExternalLink
              className="h-5 w-5 shrink-0 text-[#0D9488] opacity-80 transition group-hover:opacity-100"
              aria-hidden
            />
          </a>
          <p className="mt-4 max-w-2xl text-slate-300">
            Curated fitness and nutrition breakdowns for busy lifters. Watch here,
            then dive deeper on{" "}
            <a
              href={YOUTUBE_CHANNEL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#0D9488] hover:underline"
            >
              youtube.com/@MuscleHabit
            </a>
            .
          </p>
          <a
            href={YOUTUBE_CHANNEL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex h-12 items-center gap-2 rounded-md bg-[#F97316] px-6 text-sm font-semibold text-white transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D9488]"
          >
            <Play className="h-5 w-5" aria-hidden />
            Subscribe to @MuscleHabit on YouTube
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-8 md:grid-cols-2">
          {LIBRARY_VIDEOS.map((video) => (
            <article
              key={video.id}
              className="overflow-hidden rounded-xl border border-white/10 bg-[#1E293B] shadow-xl shadow-black/20"
            >
              <div className="relative aspect-video w-full bg-[#0F172A]">
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>
              <div className="p-5 sm:p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#0D9488]/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#0D9488]">
                    {video.topic}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                    <Play className="h-3 w-3 text-[#F97316]" aria-hidden />
                    {video.runtime}
                  </span>
                </div>
                <h2 className="mt-3 font-heading text-xl uppercase tracking-wide text-white">
                  {video.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {video.description}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 rounded-xl border border-[#0D9488]/30 bg-[#1E293B] p-6 text-center sm:p-8">
          <p className="font-heading text-2xl uppercase tracking-wide text-white">
            More on the channel
          </p>
          <p className="mx-auto mt-2 max-w-xl text-sm text-slate-400">
            New evidence briefs and habit walkthroughs drop on YouTube. Questions?
            Email{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-semibold text-[#0D9488] hover:underline"
            >
              {CONTACT_EMAIL}
            </a>
            .
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href={YOUTUBE_CHANNEL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center gap-2 rounded-md bg-[#F97316] px-5 text-sm font-semibold text-white hover:brightness-110"
            >
              <Play className="h-4 w-4" aria-hidden />
              Open @MuscleHabit
            </a>
            <Link
              href={routes.planner}
              className="inline-flex h-11 items-center rounded-md border border-white/15 px-5 text-sm font-semibold text-white hover:border-[#0D9488]/50"
            >
              Start Building Your Routine
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <Link href={routes.home} className="inline-flex w-fit rounded-md bg-white px-2 py-1">
            <BrandLogo size="sm" />
          </Link>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-400">
            <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-[#0D9488]">
              {CONTACT_EMAIL}
            </a>
            <Link href={routes.home} className="hover:text-[#0D9488]">
              Home
            </Link>
            <Link href={routes.planner} className="hover:text-[#F97316]">
              Planner
            </Link>
            <span>© {new Date().getFullYear()} Muscle Habit</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
