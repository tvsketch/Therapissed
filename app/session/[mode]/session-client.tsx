'use client';

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Copy, Download, RotateCcw, Send, Share2, Sparkles, Trash2 } from "lucide-react";
import type { SessionMode } from "@/lib/modes";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type Persona = "blunt" | "gentle";

type StoredSession = {
  messages: Message[];
  persona: Persona;
  contextEnabled?: boolean;
};

const CONTEXT_KEY = "therapissed:reflection-context";

export default function SessionClient({ mode }: { mode: SessionMode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [persona, setPersona] = useState<Persona>("blunt");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [summarizing, setSummarizing] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const [contextEnabled, setContextEnabled] = useState(false);
  const [contextText, setContextText] = useState("");
  const [showContext, setShowContext] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  const storageKey = useMemo(() => `therapissed:session:${mode.slug}`, [mode.slug]);
  const canSend = useMemo(() => input.trim().length > 0 && !loading, [input, loading]);
  const hasMessages = messages.length > 0;

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<StoredSession>;
        if (Array.isArray(parsed.messages)) {
          setMessages(
            parsed.messages.filter(
              (message): message is Message =>
                Boolean(message) &&
                (message.role === "user" || message.role === "assistant") &&
                typeof message.content === "string",
            ),
          );
        }
        if (parsed.persona === "blunt" || parsed.persona === "gentle") {
          setPersona(parsed.persona);
        }
        if (typeof parsed.contextEnabled === "boolean") {
          setContextEnabled(parsed.contextEnabled);
        }
      }

      const savedContext = window.localStorage.getItem(CONTEXT_KEY);
      if (savedContext) setContextText(savedContext);
    } catch {
      window.localStorage.removeItem(storageKey);
    } finally {
      setHydrated(true);
    }
  }, [storageKey]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(
      storageKey,
      JSON.stringify({ messages, persona, contextEnabled } satisfies StoredSession),
    );
  }, [hydrated, messages, persona, contextEnabled, storageKey]);

  useEffect(() => {
    if (!hydrated) return;
    if (contextText.trim()) {
      window.localStorage.setItem(CONTEXT_KEY, contextText);
    } else {
      window.localStorage.removeItem(CONTEXT_KEY);
    }
  }, [hydrated, contextText]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanInput = input.trim();
    if (!cleanInput || loading) return;

    const nextMessages: Message[] = [...messages, { role: "user", content: cleanInput }];
    setMessages(nextMessages);
    setInput("");
    setError("");
    setNotice("");
    setLoading(true);

    try {
      const response = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: mode.slug,
          persona,
          messages: nextMessages,
          context: contextEnabled ? contextText.trim() : "",
        }),
      });

      const data = (await response.json()) as { message?: string; error?: string };
      if (!response.ok || !data.message) throw new Error(data.error || "The session failed to respond.");
      setMessages((current) => [...current, { role: "assistant", content: data.message! }]);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something broke. Try again.");
    } finally {
      setLoading(false);
    }
  }

  function buildExportText() {
    const transcript = messages
      .map((message) => `${message.role === "user" ? "You" : "Therapissed"}:\n${message.content}`)
      .join("\n\n");

    const contextBlock =
      contextEnabled && contextText.trim()
        ? `\n\nSaved context used in this session:\n${contextText.trim()}`
        : "";

    return `Therapissed — ${mode.title}\nExported ${new Date().toLocaleString()}${contextBlock}\n\n${transcript}`;
  }

  async function copyLastResponse() {
    const last = [...messages].reverse().find((message) => message.role === "assistant");
    if (!last) return;
    await navigator.clipboard.writeText(last.content);
    setNotice("Last response copied.");
  }

  async function shareSession() {
    if (!hasMessages) return;
    const text = buildExportText();

    try {
      if (navigator.share) {
        await navigator.share({
          title: `Therapissed — ${mode.title}`,
          text,
        });
        setNotice("Shared from your device.");
      } else {
        await navigator.clipboard.writeText(text);
        setNotice("Sharing is not supported here, so the full session was copied instead.");
      }
    } catch (caught) {
      if (caught instanceof Error && caught.name === "AbortError") return;
      setError("Could not open the share sheet. Try Download .txt instead.");
    }
  }

  function downloadSession() {
    if (!hasMessages) return;
    const blob = new Blob([buildExportText()], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    const date = new Date().toISOString().slice(0, 10);

    anchor.href = url;
    anchor.download = `therapissed-${mode.slug}-${date}.txt`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    setNotice("Session exported as a text file.");
  }

  async function createContextSummary() {
    if (!hasMessages || summarizing) return;

    setSummarizing(true);
    setError("");
    setNotice("");

    try {
      const response = await fetch("/api/context-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }),
      });

      const data = (await response.json()) as { summary?: string; error?: string };
      if (!response.ok || !data.summary) {
        throw new Error(data.error || "Could not build the context capsule.");
      }

      setContextText(data.summary);
      setContextEnabled(true);
      setShowContext(true);
      setNotice("Context capsule built. Edit anything you want before using it elsewhere.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not build the context capsule.");
    } finally {
      setSummarizing(false);
    }
  }

  function startNewSession() {
    setMessages([]);
    setInput("");
    setError("");
    setNotice("");
    window.localStorage.removeItem(storageKey);
  }

  function startClean() {
    if (hasMessages && !window.confirm("Clear this session and continue without saved context?")) return;
    setMessages([]);
    setInput("");
    setError("");
    setNotice("Clean slate started. Your saved context still exists, but it is turned off.");
    setContextEnabled(false);
    window.localStorage.removeItem(storageKey);
  }

  function deleteSavedContext() {
    if (!contextText.trim()) return;
    if (!window.confirm("Delete your saved context capsule from this browser?")) return;
    setContextText("");
    setContextEnabled(false);
    setShowContext(false);
    window.localStorage.removeItem(CONTEXT_KEY);
    setNotice("Saved context deleted from this browser.");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-4 py-5 sm:px-7">
      <header className="flex items-center justify-between gap-4 border-b border-[var(--line)] pb-5">
        <Link href="/" className="inline-flex items-center gap-2 font-bold text-[var(--muted)] hover:text-white">
          <ArrowLeft size={18} /> Home
        </Link>
        <button
          type="button"
          onClick={startNewSession}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] px-3 py-2 text-sm font-bold hover:bg-[var(--surface)]"
        >
          <RotateCcw size={15} /> New session
        </button>
      </header>

      <section className="py-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--pink)]">{mode.eyebrow}</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">{mode.title}</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-[var(--muted)]">{mode.description}</p>

        <div className="mt-6 inline-flex rounded-full border border-[var(--line)] bg-[var(--surface)] p-1" role="group" aria-label="Response style">
          <button
            type="button"
            onClick={() => setPersona("blunt")}
            aria-pressed={persona === "blunt"}
            className={`rounded-full px-4 py-2 text-sm font-black transition ${persona === "blunt" ? "bg-[var(--acid)] text-black" : "text-[var(--muted)] hover:text-white"}`}
          >
            Blunt
          </button>
          <button
            type="button"
            onClick={() => setPersona("gentle")}
            aria-pressed={persona === "gentle"}
            className={`rounded-full px-4 py-2 text-sm font-black transition ${persona === "gentle" ? "bg-[var(--pink)] text-white" : "text-[var(--muted)] hover:text-white"}`}
          >
            Gentle
          </button>
        </div>
        <p className="mt-3 text-sm text-[var(--muted)]">
          {persona === "blunt" ? "Straight answer, sharper wording, no coddling." : "Same honesty, softer delivery, less verbal sandpaper."}
        </p>
      </section>

      <section className="mb-5 rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--acid)]">Optional memory, controlled by you</p>
            <h2 className="mt-2 text-xl font-black">Carry context forward without retelling your whole life.</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              Your context capsule is saved only in this browser. You can edit it, use it across session types, turn it off, or delete it.
            </p>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-black ${contextEnabled && contextText.trim() ? "bg-[var(--acid)] text-black" : "border border-[var(--line)] text-[var(--muted)]"}`}>
            {contextEnabled && contextText.trim() ? "Context on" : "Context off"}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              if (!contextText.trim()) setShowContext(true);
              setContextEnabled(true);
            }}
            className="rounded-full bg-[var(--acid)] px-4 py-2 text-sm font-black text-black"
          >
            Use saved context
          </button>
          <button
            type="button"
            onClick={startClean}
            className="rounded-full border border-[var(--line)] px-4 py-2 text-sm font-bold hover:bg-[var(--surface-soft)]"
          >
            Start clean
          </button>
          <button
            type="button"
            onClick={() => setShowContext((current) => !current)}
            className="rounded-full border border-[var(--line)] px-4 py-2 text-sm font-bold hover:bg-[var(--surface-soft)]"
          >
            {showContext ? "Hide context" : contextText.trim() ? "Edit context" : "Add context"}
          </button>
          <button
            type="button"
            onClick={createContextSummary}
            disabled={!hasMessages || summarizing}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] px-4 py-2 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-30"
          >
            <Sparkles size={15} /> {summarizing ? "Building…" : "Build from this chat"}
          </button>
        </div>

        {showContext && (
          <div className="mt-4">
            <textarea
              value={contextText}
              onChange={(event) => setContextText(event.target.value)}
              rows={7}
              maxLength={3000}
              placeholder="Add the background you do not want to explain every time. Keep only what is actually useful."
              className="w-full resize-y rounded-2xl border border-[var(--line)] bg-black/20 p-4 text-sm leading-6 text-white outline-none placeholder:text-[var(--muted)] focus:border-[var(--acid)]"
            />
            <div className="mt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-[var(--muted)]">
              <span>{contextText.length}/3000 · Saved automatically in this browser.</span>
              {contextText.trim() && (
                <button type="button" onClick={deleteSavedContext} className="inline-flex items-center gap-1.5 font-bold text-red-300 hover:text-red-200">
                  <Trash2 size={13} /> Delete saved context
                </button>
              )}
            </div>
          </div>
        )}
      </section>

      <section className="flex flex-col rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-4 sm:p-6">
        <div className="max-h-[60vh] min-h-[170px] space-y-4 overflow-y-auto pb-6">
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
                  className={`max-w-[88%] whitespace-pre-wrap rounded-2xl px-4 py-3 leading-7 sm:max-w-[78%] ${message.role === "user" ? "bg-[var(--acid)] text-black" : "border border-[var(--line)] bg-[var(--surface-soft)] text-[var(--foreground)]"}`}
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
          <div ref={endRef} />
        </div>

        {error && <p className="mb-3 rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}
        {notice && <p className="mb-3 rounded-xl border border-[var(--line)] bg-black/10 p-3 text-sm text-[var(--muted)]">{notice}</p>}

        <form onSubmit={submit} className="border-t border-[var(--line)] pt-4">
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={mode.opener}
            rows={4}
            maxLength={5000}
            className="w-full resize-none rounded-2xl border border-[var(--line)] bg-black/20 p-4 leading-7 text-white outline-none placeholder:text-[var(--muted)] focus:border-[var(--acid)]"
          />
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={copyLastResponse}
                disabled={!messages.some((message) => message.role === "assistant")}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] px-3 py-2 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-30"
              >
                <Copy size={15} /> Copy last
              </button>
              <button
                type="button"
                onClick={shareSession}
                disabled={!hasMessages}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] px-3 py-2 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-30"
              >
                <Share2 size={15} /> Share / export
              </button>
              <button
                type="button"
                onClick={downloadSession}
                disabled={!hasMessages}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] px-3 py-2 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-30"
              >
                <Download size={15} /> .txt
              </button>
            </div>
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

      <div className="py-5 text-center text-xs leading-5 text-[var(--muted)]">
        <p>This conversation is saved on this device. Reflection tool, not therapy or emergency care.</p>
        <Link href="/privacy" className="mt-1 inline-block font-bold text-[var(--foreground)] underline decoration-[var(--line)] underline-offset-4">
          Privacy & data
        </Link>
      </div>
    </main>
  );
}
