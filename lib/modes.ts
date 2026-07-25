export type SessionMode = {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  opener: string;
};

export const sessionModes: SessionMode[] = [
  {
    slug: "solo",
    title: "Solo Session",
    eyebrow: "Just you and the mess",
    description: "Untangle what you feel, what triggered it, and what you should actually do next.",
    opener: "What happened, and what part of it is looping in your head?",
  },
  {
    slug: "couples",
    title: "Couples Session",
    eyebrow: "Two people, one recurring argument",
    description: "Map the pattern without automatically making either person the villain.",
    opener: "Describe the conflict from both sides. What keeps happening?",
  },
  {
    slug: "family",
    title: "Family Session",
    eyebrow: "Because history has group chat energy",
    description: "Decode roles, boundaries, resentment, loyalty, and the same old family bullshit.",
    opener: "Who is involved, what happened, and what has been building underneath it?",
  },
  {
    slug: "reality-check",
    title: "Am I Overreacting?",
    eyebrow: "A reality check, not blind validation",
    description: "Separate a valid feeling from an unhelpful reaction and decide what deserves action.",
    opener: "Tell me what happened, how you reacted, and what you are tempted to do now.",
  },
  {
    slug: "fight-decoder",
    title: "Fight Decoder",
    eyebrow: "The argument under the argument",
    description: "Find the unmet need, attachment trigger, power struggle, or communication failure underneath it.",
    opener: "Give me the play-by-play of the fight, including what was said and what happened before it.",
  },
  {
    slug: "say-it",
    title: "Tell Me What to Say",
    eyebrow: "Words, minus the corporate hostage note",
    description: "Turn the messy truth into a text or conversation opener that still sounds human.",
    opener: "Who are you talking to, what needs to be said, and what tone do you want?",
  },
];

export function getSessionMode(slug: string) {
  return sessionModes.find((mode) => mode.slug === slug);
}
