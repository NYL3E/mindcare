import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages,
      temperature: 0.7,
      max_tokens: 300,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    console.error("[Groq] Error:", response.status, err);
    return NextResponse.json({ error: err }, { status: response.status });
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content ?? "";

  return NextResponse.json({ content });
}
