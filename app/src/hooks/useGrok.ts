"use client";

import { useCallback, useEffect, useRef } from "react";
import { useMindCare } from "@/context/MindCareContext";

function buildSystemPrompt(ai: {
  name: string;
  personality: string;
  tutoiement: boolean;
  decontracte: boolean;
}, moodContext: string): string {
  const personalityMap: Record<string, string> = {
    optimiste:
      "Tu es toujours positif et encourageant. Tu cherches le bon côté des choses et tu motives ton interlocuteur.",
    zen: "Tu es calme et réfléchi. Tu guides avec douceur vers la sérénité et la pleine conscience.",
    empathique:
      "Tu es très à l'écoute des émotions. Tu valides les sentiments et tu fais preuve de compréhension profonde.",
    drole:
      "Tu utilises l'humour bienveillant pour remonter le moral. Tu restes léger tout en étant attentif.",
  };

  const personality = personalityMap[ai.personality] ?? personalityMap.empathique;
  const forme = ai.tutoiement ? "tu tutoies" : "tu vouvoies";
  const style = ai.decontracte
    ? "ton style est décontracté et amical"
    : "ton style est poli et formel";

  return `Tu es ${ai.name}, un(e) ami(e) IA bienveillant(e) dans l'application MindCare, dédiée au bien-être mental et à la lutte contre la solitude.

${personality}

Règles :
- ${forme} ton interlocuteur, et ${style}.
- Tu réponds TOUJOURS en français.
- Tes réponses sont courtes (2-4 phrases max), chaleureuses et naturelles.
- Tu ne donnes JAMAIS de diagnostic médical. Si la personne semble en danger, tu l'encourages à appeler un professionnel.
- Tu peux suggérer des activités de l'app (yoga, randonnée, jeux de société, etc.) quand c'est pertinent.
- Tu te souviens du contexte de la conversation.
${moodContext}`;
}

export function useGrok() {
  const ctx = useMindCare();
  const historyRef = useRef<Array<{ role: string; content: string }>>([]);
  const aiJsonRef = useRef(JSON.stringify(ctx.ai));

  // Reset conversation history whenever AI settings change
  // so the new system prompt (personality, tutoiement, etc.) takes effect
  useEffect(() => {
    const newJson = JSON.stringify(ctx.ai);
    if (aiJsonRef.current !== newJson) {
      aiJsonRef.current = newJson;
      historyRef.current = [];
    }
  }, [ctx.ai]);

  const sendMessage = useCallback(
    async (userText: string): Promise<string> => {
      // Build mood context
      let moodContext = "";
      if (ctx.todayMood) {
        moodContext = `\nContexte humeur du jour : énergie ${ctx.todayMood.energy}/100, humeur ${ctx.todayMood.mood}/100, stress ${ctx.todayMood.stress}/100, social ${ctx.todayMood.social}/100.`;
      }

      const systemPrompt = buildSystemPrompt(ctx.ai, moodContext);

      // Initialize history with system prompt if empty
      if (historyRef.current.length === 0) {
        historyRef.current.push({ role: "system", content: systemPrompt });

        // Add existing conversation messages for context
        for (const msg of ctx.messages) {
          historyRef.current.push({
            role: msg.isUser ? "user" : "assistant",
            content: msg.text,
          });
        }
      }

      // Add user message
      historyRef.current.push({ role: "user", content: userText });

      // Keep history manageable (system + last 20 messages)
      if (historyRef.current.length > 22) {
        const system = historyRef.current[0];
        historyRef.current = [system, ...historyRef.current.slice(-20)];
      }

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: historyRef.current }),
        });

        if (!response.ok) throw new Error(`API error ${response.status}`);

        const data = await response.json();
        const content = data.content || "Désolé, je n'ai pas pu répondre. Réessaie !";

        // Add assistant response to history
        historyRef.current.push({ role: "assistant", content });

        return content;
      } catch {
        // Fallback response if API call fails
        const fallbacks = [
          `Je suis là pour toi. ${ctx.todayMood ? `J'ai vu que ton humeur est à ${ctx.todayMood.mood}/100 aujourd'hui.` : ""} N'hésite pas à me dire ce que tu ressens.`,
          "Je t'écoute, dis-moi ce qui te préoccupe. On va trouver des solutions ensemble.",
          "Merci de partager ça avec moi. Tu veux qu'on en parle plus en détail ?",
        ];
        const fallback = fallbacks[Math.floor(Math.random() * fallbacks.length)];

        historyRef.current.push({ role: "assistant", content: fallback });
        return fallback;
      }
    },
    [ctx.ai, ctx.todayMood, ctx.messages]
  );

  // Reset history when AI settings change
  const resetHistory = useCallback(() => {
    historyRef.current = [];
  }, []);

  return { sendMessage, resetHistory };
}
