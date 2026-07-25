import Link from "next/link";
import { ArrowUpRight, Brain, MessageCircleMore, ShieldAlert } from "lucide-react";
import { sessionModes } from "@/lib/modes";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 pb-16 pt-6 sm:px-8">
      <header className="flex items-center justify-between border-b border-[var(--line)] pb-5">
        <Link href="/" className="text-xl font-black tracking-tight">
          Therapissed<span className="text-[var(--pink)]">.</span>
        </Link>
        <span className="rounded-full border border-[var(--line)] px-3 py-1 text-xs text-[var(--muted)]">
          No signup. No fake serenity.
        </span>
      </header>

      <section className="grid gap-10 py-14 lg:grid-cols-[1.15fr_.85fr] lg:items-end lg:py-24">
        <div>
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.22em] text-[var(--acid)]">
            Emotional clarity without the beige bullshit
          </p>
          <h1 className="max-w-4xl text-5xl font-black leading-[0.96] tracking-[-0.05em] sm:text-7xl">
            Get honest about what is actually going on.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)] sm:text-xl">
            Vent, decode a fight, check your reaction, or figure out what to say next. Therapissed helps you find the pattern without coddling you or turning every inconvenience into a diagnosis.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/session/solo"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--acid)] px-6 py-3 font-black text-black transition hover:translate-y-[-2px]"
            >
              Start a session <ArrowUpRight size={18} />
            </Link>
            <a
              href="#modes"
              className="inline-flex items-center rounded-full border border-[var(--line)] px-6 py-3 font-bold text-[var(--foreground)] transition hover:bg-[var(--surface)]"
            >
              Pick the right flavor of chaos
            </a>
          </div>
        </div>

        <aside className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6 shadow-2xl shadow-black/20">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-[var(--pink)]/15 p-3 text-[var(--pink)]">
              <Brain size={28} />
            </div>
            <div>
              <p className="font-black">What this is</p>
              <p className="mt-1 leading-7 text-[var(--muted)]">
                A reflection tool that asks better questions, spots patterns, and gives you a useful next move.
              </p>
            </div>
          </div>
          <div className="mt-6 flex items-start gap-4 border-t border-[var(--line)] pt-6">
            <div className="rounded-2xl bg-[var(--acid)]/10 p-3 text-[var(--acid)]">
              <ShieldAlert size={28} />
            </div>
            <div>
              <p className="font-black">What this is not</p>
              <p className="mt-1 leading-7 text-[var(--muted)]">
                A therapist, diagnosis machine, emergency service, or excuse generator.
              </p>
            </div>
          </div>
        </aside>
      </section>

      <section id="modes" className="scroll-mt-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--pink)]">Choose your problem</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">What kind of session is this?</h2>
          </div>
          <MessageCircleMore className="hidden text-[var(--muted)] sm:block" size={34} />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sessionModes.map((mode) => (
            <Link
              key={mode.slug}
              href={`/session/${mode.slug}`}
              className="group flex min-h-56 flex-col rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6 transition hover:-translate-y-1 hover:border-[var(--acid)]"
            >
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted)]">{mode.eyebrow}</p>
              <h3 className="mt-4 text-2xl font-black">{mode.title}</h3>
              <p className="mt-3 leading-7 text-[var(--muted)]">{mode.description}</p>
              <span className="mt-auto inline-flex items-center gap-2 pt-6 font-black text-[var(--acid)]">
                Open session <ArrowUpRight className="transition group-hover:translate-x-1" size={17} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <footer className="mt-16 border-t border-[var(--line)] pt-6 text-sm leading-6 text-[var(--muted)]">
        Therapissed is for reflection and emotional support, not professional medical care or crisis intervention. In an immediate emergency, contact local emergency services.
      </footer>
    </main>
  );
}
