import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SessionClient from "./session-client";
import { getSessionMode, sessionModes } from "@/lib/modes";

const seoByMode: Record<string, { title: string; description: string }> = {
  solo: {
    title: "Emotional Clarity Tool for Personal Reflection",
    description:
      "Untangle what you feel, identify what triggered it, spot the pattern, and decide what to do next with a blunt personal reflection tool.",
  },
  couples: {
    title: "Couples Communication Tool for Recurring Arguments",
    description:
      "Decode recurring relationship arguments, understand both sides of the pattern, and find a more useful way to communicate without automatically making either person the villain.",
  },
  family: {
    title: "Family Conflict Reflection Tool",
    description:
      "Understand family conflict, boundaries, resentment, loyalty, and recurring roles with a practical reflection tool built for complicated family dynamics.",
  },
  "reality-check": {
    title: "Am I Overreacting? Reality Check Tool",
    description:
      "Reality-check a reaction without dismissing the feeling behind it. Separate what is valid, what is unhelpful, and what actually deserves action.",
  },
  "fight-decoder": {
    title: "Fight Decoder for Relationship Arguments",
    description:
      "Decode what an argument is really about by identifying unmet needs, triggers, power struggles, and communication breakdowns underneath the fight.",
  },
  "say-it": {
    title: "What Should I Say? Message & Conversation Help",
    description:
      "Turn messy thoughts into a clear text, boundary, apology, or conversation opener that sounds human instead of like a corporate hostage note.",
  },
};

export function generateStaticParams() {
  return sessionModes.map((mode) => ({ mode: mode.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ mode: string }>;
}): Promise<Metadata> {
  const { mode: slug } = await params;
  const mode = getSessionMode(slug);

  if (!mode) {
    return {
      title: "Session Not Found",
      robots: { index: false, follow: false },
    };
  }

  const seo = seoByMode[slug] ?? {
    title: mode.title,
    description: mode.description,
  };
  const canonicalPath = `/session/${slug}`;

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      type: "website",
      url: canonicalPath,
      title: `${seo.title} | Therapissed`,
      description: seo.description,
      siteName: "Therapissed",
    },
    twitter: {
      card: "summary",
      title: `${seo.title} | Therapissed`,
      description: seo.description,
    },
  };
}

export default async function SessionPage({
  params,
}: {
  params: Promise<{ mode: string }>;
}) {
  const { mode: slug } = await params;
  const mode = getSessionMode(slug);

  if (!mode) notFound();

  return <SessionClient mode={mode} />;
}
