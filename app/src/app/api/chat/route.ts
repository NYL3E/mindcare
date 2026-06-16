import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { buildChatPayload } from "@/lib/rules";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function POST(req: NextRequest) {
  // 1. Authentification : une session Supabase valide est exigée.
  //    Empêche l'appel anonyme en boucle de l'API (protection du quota Groq).
  const token = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "").trim();
  if (!token) {
    return NextResponse.json({ error: "Authentification requise" }, { status: 401 });
  }
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) {
    return NextResponse.json({ error: "Session invalide" }, { status: 401 });
  }

  // 2. Charge utile construite CÔTÉ SERVEUR : le system prompt (cadre éthique)
  //    est reconstruit ici et tout message "system" envoyé par le client est
  //    ignoré (anti-injection de prompt).
  const { messages, ai, mood } = await req.json();
  const payload = buildChatPayload(messages, ai, mood);

  const response = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: payload,
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
