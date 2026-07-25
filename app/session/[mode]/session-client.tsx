'use client';

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { ArrowLeft, Copy, RotateCcw, Send } from "lucide-react";
import type { SessionMode } from "@/lib/modes";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function SessionClient({ mode }: { mode: SessionMode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const canSend = useMemo(() => input.trim().length > 0 && !loading, [input, loading]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanInput = input.trim();
    if (!cleanInput || loading) return;

    const nextMessages: Message[] = [...messages, { role: "user", content: cleanInput }];
    setMessages(nextMessages);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: mode.slug, messages: nextMessages }),
      });

      const data = (await response.json()) as { message?: string; error?: string };
      if (!response.ok || !data.message) {
        throw new Error(data.error || "The session failed to respond.");
      }

      setMessages((current) => [...current, { role: "assistant", content: data.message! }]);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something broke. Try again.");
    } finally {
      setLoading(false);
    }
  }

  async function copyLastResponse() {
    const last = [...messages].reverse().find((message) => message.role === "assistant");
    if (last) await navigator.clipboard.writeText(last.content);
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-4 py-5 sm:px-7">
      <header className="flex items-center justify-between gap-4 border-b border-[var(--line)] pb-5">
        <Link href="/" className="inline-flex items-center gap-2 font-bold text-[var(--muted)] hover:text-white">
          <ArrowLeft size={18} /> Home
        </Link>
        <button
          type="button"
          onClick={() => {
            setMessages([]);
            setInput("");
            setError("");
          }}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] px-3 py-2 text-sm font-bold hover:bg-[var(--surface)]"
        >
          <RotateCcw size={15} /> New session
        </button>
      </header>

      <section className="py-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--pink)]">{mode.eyebrow}</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">{mode.title}</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-[var(--muted)]">{mode.description}</p>
      </section>

      <section className="flex min-h-[58vh] flex-1 flex-col rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-4 sm:p-6">
        <div className="flex-1 space-y-4 overflow-y-auto pb-6">
          {messages.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[var(--line)] bg-black/10 p-5">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-[var(--acid)]">Start here</p>
              <p className="mt-3 text-lg leading-8">{mode.opener}</p>
              <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
                Include actual details. Vague input gets vague advice, and nobody has time for fortune-cookie therapy.
              </p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[88%] whitespace-pre-wrap rounded-2xl px-4 py-3 leading-7 sm:max-w-[78%] ${
                    message.role === "user"
                      ? "bg-[var(--acid)] text-black"
                      : "border border-[var(--line)] bg-[var(--surface-soft)] text-[var(--foreground)]"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))
          )}

          {loading && (
            <div className="flex justify-start">
              <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface-soft)] px-4 py-3 text-[var(--muted)]">
                Untangling the bullshit…
              </div>
            </div>
          )}
        </div>

        {error && <p className="mb-3 rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}

        <form onSubmit={submit} className="border-t border-[var(--line)] pt-4">
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={mode.opener}
            rows={4}
            maxLength={5000}
            className="w-full resize-none rounded-2xl border border-[var(--line)] bg-black/20 p-4 leading-7 text-white outline-none placeholder:text-[var(--muted)] focus:border-[var(--acid)]"
          />
          <div className="mt-3 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={copyLastResponse}
              disabled={!messages.some((message) => message.role === "assistant")}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] px-4 py-2 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-30"
            >
              <Copy size={15} /> Copy response
            </button>
            <button
              type="submit"
              disabled={!canSend}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--pink)] px-5 py-2.5 font-black text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              Send <Send size={16} />
            </button>
          </div>
        </form>
      </section>

      <p className="py-5 text-center text-xs leading-5 text-[var(--muted)]">
        Reflection tool, not therapy or emergency care. Do not include identifying information you do not want processed by the AI provider.
      </p>
    </main>
  );
}
