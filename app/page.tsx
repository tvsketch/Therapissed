import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Brain, MessageCircleMore, ShieldAlert } from "lucide-react";
import { sessionModes } from "@/lib/modes";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 pb-16 pt-6 sm:px-8">
      <header className="flex items-center justify-between border-b border-[var(--line)] pb-5">
        <Link href="/" className="text-xl font-black tracking-tight lowercase">
          therapissed<span className="text-[var(--pink)]">.</span>
        </Link>
        <span className="rounded-full border border-[var(--line)] px-3 py-1 text-xs text-[var(--muted)]">
          No fake serenity.
        </span>
      </header>

      <section className="py-16 lg:py-28">
        <p className="mb-4 text-sm font-bold uppercase tracking-[0.22em] text-[var(--acid)]">
          Emotional clarity without the beige bullshit
        </p>
        <h1 className="max-w-5xl text-5xl font-black leading-[0.96] tracking-[-0.05em] sm:text-7xl lg:text-8xl">
          Get honest about what is actually going on.
        </h1>
        <p className="mt-7 max-w-3xl text-lg leading-8 text-[var(--muted)] sm:text-xl">
          Vent, decode a fight, check your reaction, or figure out what to say next. Therapissed helps you find the pattern without coddling you or turning every inconvenience into a diagnosis.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Link href="/session/solo" className="inline-flex items-center gap-2 rounded-full bg-[var(--acid)] px-6 py-3 font-black text-black transition hover:-translate-y-0.5">
            Start a session <ArrowUpRight size={18} />
          </Link>
          <a href="#modes" className="inline-flex items-center rounded-full border border-[var(--line)] px-6 py-3 font-bold text-[var(--foreground)] transition hover:bg-[var(--surface)]">
            Pick the right flavor of chaos
          </a>
        </div>
      </section>

      <section className="grid gap-4 pb-14 md:grid-cols-2">
        <div className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-[var(--pink)]/15 p-3 text-[var(--pink)]"><Brain size={28} /></div>
            <div><p className="font-black">What this is</p><p className="mt-1 leading-7 text-[var(--muted)]">A reflection tool that asks better questions, spots patterns, and gives you a useful next move.</p></div>
          </div>
        </div>
        <div className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-[var(--acid)]/10 p-3 text-[var(--acid)]"><ShieldAlert size={28} /></div>
            <div><p className="font-black">What this is not</p><p className="mt-1 leading-7 text-[var(--muted)]">A therapist, diagnosis machine, emergency service, or excuse generator.</p></div>
          </div>
        </div>
      </section>

      <section id="modes" className="scroll-mt-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div><p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--pink)]">Choose your problem</p><h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">What kind of session is this?</h2></div>
          <MessageCircleMore className="hidden text-[var(--muted)] sm:block" size={34} />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sessionModes.map((mode) => (
            <Link key={mode.slug} href={`/session/${mode.slug}`} className="group flex min-h-56 flex-col rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6 transition hover:-translate-y-1 hover:border-[var(--acid)]">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted)]">{mode.eyebrow}</p>
              <h3 className="mt-4 text-2xl font-black">{mode.title}</h3>
              <p className="mt-3 leading-7 text-[var(--muted)]">{mode.description}</p>
              <span className="mt-auto inline-flex items-center gap-2 pt-6 font-black text-[var(--acid)]">Open session <ArrowUpRight className="transition group-hover:translate-x-1" size={17} /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-20 grid overflow-hidden rounded-[2rem] border border-[var(--line)] bg-[var(--surface)] md:grid-cols-[260px_1fr]">
        <div className="relative min-h-80 md:min-h-full">
          <Image
            src="/tori-hero.webp"
            alt="Therapissed creator smiling in a mirror selfie"
            fill
            sizes="(max-width: 768px) 100vw, 260px"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent md:bg-gradient-to-r" />
        </div>
        <div className="flex flex-col justify-center p-7 sm:p-10">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--pink)]">Built by an actual human</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            Hi, I’m Tori. I got tired of advice that sounded like a scented candle.
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--muted)]">
            Therapissed exists for people who want emotional insight without the corporate wellness voice, blind validation, or being told to “just breathe” like that fixes the entire damn situation.
          </p>
        </div>
      </section>

      <footer className="mt-16 border-t border-[var(--line)] pt-6 text-sm leading-6 text-[var(--muted)]">
        therapissed. is for reflection and emotional support, not professional medical care or crisis intervention. In an immediate emergency, contact local emergency services.
      </footer>
    </main>
  );
}
