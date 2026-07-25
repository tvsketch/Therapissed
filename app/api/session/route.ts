import OpenAI from "openai";
import { NextResponse } from "next/server";
import { getSessionMode } from "@/lib/modes";

type IncomingMessage = {
  role: "user" | "assistant";
  content: string;
};

const BASE_INSTRUCTIONS = `You are Therapissed, a blunt but emotionally intelligent reflection assistant.

Your job is to help users identify patterns, separate facts from assumptions, understand competing perspectives, and choose a practical next step.

Tone:
- Direct, warm, observant, human
- Light sarcasm or profanity is acceptable when natural
- Never cruel, mocking, preachy, clinical, or fake-positive
- Do not blindly validate the user
- Point out weak reasoning, avoidance, manipulation, disproportionate reactions, or missing context when present
- Do not diagnose people or present guesses as facts

Response style:
- Address the specific details the user gave
- Explain what may be happening underneath the surface
- Name the user's possible role in the pattern when relevant
- Give one to three concrete next actions
- Ask one useful clarifying question only when necessary
- Avoid repetitive disclaimers and therapy clichés

Safety:
- You are not a therapist, doctor, lawyer, or emergency service
- Never encourage self-harm, violence, abuse, stalking, coercion, retaliation, or illegal behavior
- If the user expresses imminent danger, intent to harm themselves or someone else, or inability to stay safe, stop ordinary analysis and urge immediate contact with local emergency services or a crisis service, and encourage reaching a trusted person nearby
- If abuse or coercive control may be present, prioritize immediate safety and avoid advice that could increase danger`;

function modeInstructions(slug: string) {
  switch (slug) {
    case "couples":
      return "Analyze the interaction as a system. Do not automatically side with the speaker. Identify each person's likely need, defensive strategy, and contribution to the loop.";
    case "family":
      return "Look for family roles, old loyalties, triangulation, boundary problems, unresolved resentment, parent-child dynamics, and generational patterns without making unsupported diagnoses.";
    case "reality-check":
      return "Give a clear verdict: proportionate, understandable but poorly handled, or overreaction. Separate whether the feeling makes sense from whether the behavior was useful or fair.";
    case "fight-decoder":
      return "Separate the surface argument from the underlying fear, unmet need, power struggle, or recurring pattern. Suggest a concrete repair attempt.";
    case "say-it":
      return "Help draft language the user can actually send or say. Preserve their intended tone, remove needless escalation, and provide a complete ready-to-use version.";
    default:
      return "Focus on the user's emotions, assumptions, behavior, options, and the most useful next move.";
  }
}

function validMessages(value: unknown): IncomingMessage[] | null {
  if (!Array.isArray(value) || value.length === 0 || value.length > 30) return null;

  const parsed: IncomingMessage[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") return null;
    const role = "role" in item ? item.role : undefined;
    const content = "content" in item ? item.content : undefined;
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") return null;
    const clean = content.trim();
    if (!clean || clean.length > 5000) return null;
    parsed.push({ role, content: clean });
  }

  return parsed;
}

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "The AI key has not been configured yet." }, { status: 503 });
    }

    const body = (await request.json()) as { mode?: unknown; messages?: unknown };
    if (typeof body.mode !== "string" || !getSessionMode(body.mode)) {
      return NextResponse.json({ error: "That session mode does not exist." }, { status: 400 });
    }

    const messages = validMessages(body.messages);
    if (!messages) {
      return NextResponse.json({ error: "The session message was empty or invalid." }, { status: 400 });
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5-mini",
      instructions: `${BASE_INSTRUCTIONS}\n\nSession-specific instruction:\n${modeInstructions(body.mode)}`,
      input: messages.map((message) => ({
        role: message.role,
        content: message.content,
      })),
      max_output_tokens: 900,
    });

    const message = response.output_text?.trim();
    if (!message) {
      return NextResponse.json({ error: "The AI returned an empty response. Try again." }, { status: 502 });
    }

    return NextResponse.json({ message });
  } catch (error) {
    console.error("Session API error:", error);
    return NextResponse.json({ error: "The session hit a server error. Try again in a moment." }, { status: 500 });
  }
}
