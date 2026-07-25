import { notFound } from "next/navigation";
import SessionClient from "./session-client";
import { getSessionMode, sessionModes } from "@/lib/modes";

export function generateStaticParams() {
  return sessionModes.map((mode) => ({ mode: mode.slug }));
}

export default async function SessionPage({ params }: { params: Promise<{ mode: string }> }) {
  const { mode: slug } = await params;
  const mode = getSessionMode(slug);

  if (!mode) notFound();

  return <SessionClient mode={mode} />;
}
