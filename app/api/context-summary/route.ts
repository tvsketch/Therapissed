import OpenAI from "openai";
import { NextResponse } from "next/server";

type IncomingMessage = {
  role: "user" | "assistant";
  content: string;
};

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
    if (!process.env.XAI_API_KEY) {
      return NextResponse.json({ error: "The Grok API key has not been configured yet." }, { status: 503 });
    }

    const body = (await request.json()) as { messages?: unknown };
    const messages = validMessages(body.messages);

    if (!messages) {
      return NextResponse.json({ error: "There is not enough valid session content to summarize." }, { status: 400 });
    }

    const client = new OpenAI({
      apiKey: process.env.XAI_API_KEY,
      baseURL: "https://api.x.ai/v1",
      timeout: 120_000,
    });

    const response = await client.responses.create({
      model: process.env.XAI_MODEL || "grok-4.3",
      input: [
        {
          role: "system",
          content: `Create a compact, editable context capsule for a user who may want to continue a future reflection session without re-explaining everything.

Rules:
- Use only facts and patterns actually present in the conversation.
- Do not diagnose anyone.
- Do not invent motives, identities, relationships, or history.
- Prefer durable context over one-off details.
- Include relevant people/roles only when needed to understand the situation.
- Include unresolved goals, recurring patterns, boundaries, preferences, or communication dynamics when supported.
- Avoid unnecessary sensitive detail.
- Write 4 to 8 concise bullet points.
- Keep it under 220 words.
- Write in plain language that the user can easily edit.
- Do not add a preamble or conclusion.`,
        },
        ...messages.map((message) => ({
          role: message.role,
          content: message.content,
        })),
      ],
      max_output_tokens: 450,
      store: false,
    });

    const summary = response.output_text?.trim();
    if (!summary) {
      return NextResponse.json({ error: "The context summary came back empty. Try again." }, { status: 502 });
    }

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Context summary API error:", error);
    return NextResponse.json({ error: "The context summary hit a server error. Try again in a moment." }, { status: 500 });
  }
}
