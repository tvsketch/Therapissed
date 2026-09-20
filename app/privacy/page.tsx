import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Database, Download, EyeOff, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy & Data",
  description:
    "How Therapissed handles session history, optional context, model processing, analytics, exports, and deletion.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-5 py-6 sm:px-8">
      <header className="border-b border-[var(--line)] pb-5">
        <Link href="/" className="inline-flex items-center gap-2 font-bold text-[var(--muted)] hover:text-white">
          <ArrowLeft size={18} /> Home
        </Link>
      </header>

      <section className="py-12">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--acid)]">Privacy without mystery meat</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-6xl">Your data should not require detective work.</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-[var(--muted)]">
          Therapissed is built to keep long-term control in your hands. Here is what is saved, what leaves your device,
          and how to wipe it when you want a clean slate.
        </p>
        <p className="mt-3 text-sm text-[var(--muted)]">Last updated September 20, 2026.</p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6">
          <Database className="text-[var(--acid)]" size={28} />
          <h2 className="mt-4 text-xl font-black">What stays in your browser</h2>
          <p className="mt-3 leading-7 text-[var(--muted)]">
            Your session history, response-style choice, and optional context capsule are saved in this browser's local
            storage so you can come back without making an account.
          </p>
          <p className="mt-3 leading-7 text-[var(--muted)]">
            That data is tied to this browser/device profile. Therapissed does not use an account database to sync it
            between devices.
          </p>
        </div>

        <div className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6">
          <ShieldCheck className="text-[var(--pink)]" size={28} />
          <h2 className="mt-4 text-xl font-black">What gets sent when you hit Send</h2>
          <p className="mt-3 leading-7 text-[var(--muted)]">
            The text needed for your current response is sent over HTTPS to Therapissed's server route and then to
            xAI's model API so the response can be generated.
          </p>
          <p className="mt-3 leading-7 text-[var(--muted)]">
            Therapissed sends API requests with <code className="rounded bg-black/20 px-1.5 py-0.5">store: false</code>.
            xAI still has to process the request to answer it, and provider-side handling is governed by xAI's own
            terms and policies.
          </p>
        </div>

        <div className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6">
          <EyeOff className="text-[var(--acid)]" size={28} />
          <h2 className="mt-4 text-xl font-black">Analytics are separate from your session text</h2>
          <p className="mt-3 leading-7 text-[var(--muted)]">
            Therapissed uses Vercel Web Analytics to understand basic site usage and traffic. The session text you type
            into the reflection box is not intentionally sent to Vercel Analytics as an analytics event.
          </p>
          <p className="mt-3 leading-7 text-[var(--muted)]">
            Therapissed does not sell your session content.
          </p>
        </div>

        <div className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6">
          <Download className="text-[var(--pink)]" size={28} />
          <h2 className="mt-4 text-xl font-black">Export belongs to you</h2>
          <p className="mt-3 leading-7 text-[var(--muted)]">
            Session pages can open your device's native share sheet or export a plain-text file. That lets you send a
            reflection to apps such as Google Keep, Docs, Drive, Notes, or whatever your device supports.
          </p>
          <p className="mt-3 leading-7 text-[var(--muted)]">
            Therapissed does not choose the destination and does not receive a copy just because you export it.
          </p>
        </div>
      </section>

      <section className="mt-6 rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6 sm:p-8">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--pink)]">Your controls</p>
        <h2 className="mt-2 text-2xl font-black">Continue with context or burn the map.</h2>
        <div className="mt-5 space-y-4 leading-7 text-[var(--muted)]">
          <p>
            <strong className="text-[var(--foreground)]">New session</strong> clears the current mode's conversation.
          </p>
          <p>
            <strong className="text-[var(--foreground)]">Start clean</strong> clears the current conversation and turns
            saved context off without deleting the context capsule itself.
          </p>
          <p>
            <strong className="text-[var(--foreground)]">Delete saved context</strong> permanently removes the context
            capsule from this browser.
          </p>
          <p>
            Clearing site data for Therapissed in your browser also removes locally saved sessions and context.
          </p>
        </div>
      </section>

      <section className="mt-6 rounded-3xl border border-[var(--line)] bg-black/10 p-6">
        <h2 className="text-xl font-black">Important boring-but-real bit</h2>
        <p className="mt-3 leading-7 text-[var(--muted)]">
          Therapissed is a reflection tool, not medical care, therapy, diagnosis, legal advice, or an emergency
          service. Do not put information here that you would be uncomfortable sending to an AI provider for
          processing.
        </p>
      </section>

      <footer className="py-10 text-center text-sm text-[var(--muted)]">
        <Link href="/" className="font-bold text-[var(--foreground)] underline decoration-[var(--line)] underline-offset-4">
          Back to Therapissed
        </Link>
      </footer>
    </main>
  );
}
