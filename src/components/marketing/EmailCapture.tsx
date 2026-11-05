"use client";

import { CONTACT_EMAIL, submitLeadForm } from "@/lib/contact";
import { useState } from "react";

const STORAGE_KEY = "muscle-habit-leads";
const PROTOCOL_PDF = "/muscle-habit-protocol.pdf";
const SUCCESS_TOAST =
  "Your Kickstart Guide has started downloading! We've also logged your access.";

function triggerProtocolDownload() {
  const a = document.createElement("a");
  a.href = PROTOCOL_PDF;
  a.download = "muscle-habit-protocol.pdf";
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export function EmailCapture() {
  const [email, setEmail] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setToast("Enter a valid email to get the Kickstart Guide.");
      return;
    }
    setBusy(true);
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const list: { email: string; at: string }[] = raw ? JSON.parse(raw) : [];
      if (!list.some((x) => x.email === trimmed)) {
        list.push({ email: trimmed, at: new Date().toISOString() });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      }

      // Fire lead to inbox (Formspree / FormSubmit) — don't block the download
      void submitLeadForm({
        email: trimmed,
        form: "kickstart-guide",
        _replyto: trimmed,
        _subject: "Muscle Habit Kickstart Guide download",
        message: `New Kickstart Guide lead for ${CONTACT_EMAIL}`,
      });

      triggerProtocolDownload();
      setEmail("");
      setToast(SUCCESS_TOAST);
    } catch {
      triggerProtocolDownload();
      setToast(SUCCESS_TOAST);
    } finally {
      setBusy(false);
      setTimeout(() => setToast(null), 5200);
    }
  };

  return (
    <div className="relative">
      {/* Netlify Forms honeypot-compatible markup for static hosts */}
      <form
        name="kickstart-guide"
        method="POST"
        data-netlify="true"
        netlify-honeypot="bot-field"
        onSubmit={submit}
        className="flex flex-col gap-3 sm:flex-row sm:items-stretch"
      >
        <input type="hidden" name="form-name" value="kickstart-guide" />
        <p className="hidden">
          <label>
            Don’t fill this out: <input name="bot-field" />
          </label>
        </p>
        <label className="sr-only" htmlFor="lead-email">
          Email
        </label>
        <input
          id="lead-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-12 flex-1 rounded-md border border-white/10 bg-[#0F172A] px-4 text-white placeholder:text-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D9488]"
        />
        <button
          type="submit"
          disabled={busy}
          className="h-12 shrink-0 rounded-md bg-[#0D9488] px-5 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F97316]"
        >
          {busy ? "Sending…" : "Download Kickstart Guide"}
        </button>
      </form>
      {toast && (
        <p
          role="status"
          className="absolute left-0 right-0 top-[calc(100%+0.75rem)] z-10 rounded-md bg-[#0D9488] px-4 py-3 text-sm font-medium text-white shadow-lg animate-[fade-up_0.35s_ease-out]"
        >
          {toast}
        </p>
      )}
    </div>
  );
}
