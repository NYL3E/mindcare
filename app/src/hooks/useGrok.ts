"use client";

import { useCallback, useEffect, useRef } from "react";
import { useMindCare } from "@/context/MindCareContext";
import { supabase } from "@/lib/supabase";

export function useGrok() {
  const ctx = useMindCare();
  // Historique = tours de conversation uniquement (user/assistant).
  // Le system prompt (cadre éthique) est désormais construit CÔTÉ SERVEUR.
  const historyRef = useRef<Array<{ role: string; content: string }>>([]);
  const aiJsonRef = useRef(JSON.stringify(ctx.ai));

  // Réinitialise l'historique si les réglages de l'IA changent.
  useEffect(() => {
    const newJson = JSON.stringify(ctx.ai);
    if (aiJsonRef.current !== newJson) {
      aiJsonRef.current = newJson;
      historyRef.current = [];
    }
  }, [ctx.ai]);

  const sendMessage = useCallback(
    async (userText: string): Promise<string> => {
      // Contexte d'humeur du jour (chiffres uniquement, aucune donnée nominative).
      let moodContext = "";
      if (ctx.todayMood) {
        moodContext = `\nContexte humeur du jour : énergie ${ctx.todayMood.energy}/100, humeur ${ctx.todayMood.mood}/100, stress ${ctx.todayMood.stress}/100, social ${ctx.todayMood.social}/100.`;
      }

      // Au premier message, on amorce l'historique avec la conversation existante.
      if (historyRef.current.length === 0) {
        for (const msg of ctx.messages) {
          historyRef.current.push({ role: msg.isUser ? "user" : "assistant", content: msg.text });
        }
      }
      historyRef.current.push({ role: "user", content: userText });

      try {
        // Jeton de session Supabase : la route /api/chat exige une session valide.
        const { data: { session } } = await supabase.auth.getSession();

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token ?? ""}`,
          },
          // Le system prompt n'est PAS envoyé par le client : le serveur le
          // reconstruit à partir de `ai` + `mood` (anti-injection de prompt).
          body: JSON.stringify({ messages: historyRef.current, ai: ctx.ai, mood: moodContext }),
        });

        if (!response.ok) throw new Error(`API error ${response.status}`);

        const data = await response.json();
        const content = data.content || "Désolé, je n'ai pas pu répondre. Réessaie !";
        historyRef.current.push({ role: "assistant", content });
        return content;
      } catch {
        // Réponse de repli si l'API échoue : l'utilisateur ne tombe jamais sur une erreur sèche.
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
    [ctx.ai, ctx.todayMood, ctx.messages],
  );

  const resetHistory = useCallback(() => {
    historyRef.current = [];
  }, []);

  return { sendMessage, resetHistory };
}
