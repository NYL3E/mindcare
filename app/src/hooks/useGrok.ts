"use client";

import { useCallback, useEffect, useRef } from "react";
import { useMindCare } from "@/context/MindCareContext";
import { buildSystemPrompt, windowChatHistory } from "@/lib/rules";

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
      historyRef.current = windowChatHistory(historyRef.current);

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
