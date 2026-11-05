"use client";

import { CONTACT_EMAIL, submitLeadForm } from "@/lib/contact";
import { useState } from "react";

const INQUIRY_TYPES = [
  "General Question",
  "Online Personal Coaching Application",
] as const;

type InquiryType = (typeof INQUIRY_TYPES)[number];

export function EnquiryForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [inquiryType, setInquiryType] = useState<InquiryType>("General Question");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedMessage = message.trim();

    if (!trimmedName) {
      setError("Please enter your name.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!trimmedMessage || trimmedMessage.length < 10) {
      setError("Please add a short message (at least 10 characters).");
      return;
    }

    setBusy(true);
    const result = await submitLeadForm({
      name: trimmedName,
      email: trimmedEmail,
      inquiryType,
      message: trimmedMessage,
      form: "enquiry",
      _replyto: trimmedEmail,
      _subject: `Muscle Habit enquiry: ${inquiryType}`,
      destination: CONTACT_EMAIL,
    });
    setBusy(false);

    if (!result.ok) {
      setError(
        "We couldn't send that just now. Email us directly at klimgym@hotmail.com."
      );
      return;
    }

    setDone(true);
    setName("");
    setEmail("");
    setInquiryType("General Question");
    setMessage("");
  };

  if (done) {
    return (
      <div
        role="status"
        className="rounded-xl border border-[#0D9488]/40 bg-[#0D9488]/15 p-6 text-center"
      >
        <p className="font-heading text-2xl uppercase tracking-wide text-white">
          Message sent
        </p>
        <p className="mt-2 text-sm text-slate-300">
          Thanks — we&apos;ll get back to you at the email you provided. Prefer
          inbox? Reach us at{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="font-semibold text-[#0D9488] hover:underline"
          >
            {CONTACT_EMAIL}
          </a>
          .
        </p>
        <button
          type="button"
          onClick={() => setDone(false)}
          className="mt-5 inline-flex h-10 items-center rounded-md border border-white/15 px-4 text-sm font-semibold text-white hover:bg-white/5"
        >
          Send another message
        </button>
      </div>
    );
  }

  const fieldClass =
    "h-12 w-full rounded-md border border-white/10 bg-[#0F172A] px-4 text-white placeholder:text-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D9488]";

  return (
    <form
      name="enquiry"
      method="POST"
      data-netlify="true"
      netlify-honeypot="bot-field"
      onSubmit={submit}
      className="space-y-4"
      noValidate
    >
      <input type="hidden" name="form-name" value="enquiry" />
      <p className="hidden">
        <label>
          Don’t fill this out: <input name="bot-field" />
        </label>
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="enquiry-name" className="mb-1.5 block text-sm font-medium text-slate-200">
            Name <span className="text-[#F97316]">*</span>
          </label>
          <input
            id="enquiry-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={fieldClass}
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="enquiry-email" className="mb-1.5 block text-sm font-medium text-slate-200">
            Email <span className="text-[#F97316]">*</span>
          </label>
          <input
            id="enquiry-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={fieldClass}
            placeholder="you@email.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="enquiry-type" className="mb-1.5 block text-sm font-medium text-slate-200">
          Inquiry Type <span className="text-[#F97316]">*</span>
        </label>
        <select
          id="enquiry-type"
          name="inquiryType"
          required
          value={inquiryType}
          onChange={(e) => setInquiryType(e.target.value as InquiryType)}
          className={fieldClass}
        >
          {INQUIRY_TYPES.map((t) => (
            <option key={t} value={t} className="bg-[#0F172A] text-white">
              {t}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="enquiry-message" className="mb-1.5 block text-sm font-medium text-slate-200">
          Message <span className="text-[#F97316]">*</span>
        </label>
        <textarea
          id="enquiry-message"
          name="message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full rounded-md border border-white/10 bg-[#0F172A] px-4 py-3 text-white placeholder:text-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D9488]"
          placeholder="How can we help?"
        />
      </div>

      {error && (
        <p role="alert" className="text-sm font-medium text-[#F97316]">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="inline-flex h-12 items-center justify-center rounded-md bg-[#F97316] px-6 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D9488]"
      >
        {busy ? "Sending…" : "Send enquiry"}
      </button>
      <p className="text-xs text-slate-500">
        Submissions go to{" "}
        <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#0D9488] hover:underline">
          {CONTACT_EMAIL}
        </a>
        .
      </p>
    </form>
  );
}
