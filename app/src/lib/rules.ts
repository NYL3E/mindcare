/**
 * Règles métier pures de MindCare.
 *
 * Ces fonctions concentrent la logique des cas d'usage (check-in, activités,
 * cercle social, chat Sarah) hors de tout composant React, afin d'être
 * testables unitairement (voir __tests__/rules.test.ts). Elles sont importées
 * par MindCareContext et useGrok : ce sont les règles réellement exécutées par
 * l'application, pas une copie.
 */

// ─── Types structurels (volontairement minimaux) ──────────────────────────────
export interface MoodLike {
  date: string; // "YYYY-MM-DD"
}
export interface ActivityLike {
  joined?: boolean;
  participants: number;
  maxParticipants: number;
}
export interface AILike {
  name: string;
  personality: string;
  tutoiement: boolean;
  decontracte: boolean;
}
export interface RequestLike {
  name: string;
  initial: string;
  gradientFrom: string;
  gradientTo: string;
}
export interface FriendLike {
  id: number;
  name: string;
  initial: string;
  online: boolean;
  moodIcon: string;
  gradientFrom: string;
  gradientTo: string;
}
export interface ChatTurn {
  role: string;
  content: string;
}

// ─── Check-in d'humeur (Pilier 1) ──────────────────────────────────────────────

/** Clé de date du jour (UTC) servant la règle « une humeur par jour ». */
export function moodDateKey(d: Date = new Date()): string {
  return d.toISOString().split("T")[0];
}

/**
 * Streak = nombre de jours consécutifs avec un check-in, en partant du jour le
 * plus récent. Réinitialisé si le dernier check-in ne date ni d'aujourd'hui ni
 * d'hier. `now` est injectable pour rendre la fonction déterministe en test.
 */
export function calculateStreak(moodHistory: MoodLike[], now: Date = new Date()): number {
  if (moodHistory.length === 0) return 0;
  const sorted = [...moodHistory].map((e) => e.date).sort().reverse();
  const today = new Date(now); today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
  const mostRecent = new Date(sorted[0]); mostRecent.setHours(0, 0, 0, 0);
  if (mostRecent.getTime() !== today.getTime() && mostRecent.getTime() !== yesterday.getTime()) return 0;
  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const cur = new Date(sorted[i]); cur.setHours(0, 0, 0, 0);
    const prev = new Date(sorted[i - 1]); prev.setHours(0, 0, 0, 0);
    const diff = (prev.getTime() - cur.getTime()) / (1000 * 60 * 60 * 24);
    if (diff === 1) streak++;
    else if (diff > 1) break;
  }
  return streak;
}

// ─── Activités (Pilier 3) ──────────────────────────────────────────────────────

/** Une activité est rejoignable si on ne l'a pas déjà rejointe et qu'elle n'est pas complète. */
export function canJoinActivity(a: ActivityLike): boolean {
  return !a.joined && a.participants < a.maxParticipants;
}

/** Rejoindre une activité : incrémente les participants et marque `joined`, sinon renvoie l'activité inchangée. */
export function joinActivity<T extends ActivityLike>(a: T): T {
  if (!canJoinActivity(a)) return a;
  return { ...a, joined: true, participants: a.participants + 1 };
}

// ─── Cercle social (Pilier 4) ──────────────────────────────────────────────────

/** Transforme une demande d'ami acceptée en entrée d'ami (logique de US-4.2). */
export function mapRequestToFriend(req: RequestLike, newId: number): FriendLike {
  return {
    id: newId,
    name: req.name,
    initial: req.initial,
    online: false,
    moodIcon: "smile",
    gradientFrom: req.gradientFrom,
    gradientTo: req.gradientTo,
  };
}

// ─── Chat Sarah (Pilier 2) ───────────────────────────────────────────────────────

/**
 * Fenêtre glissante envoyée à l'IA : on garde le message système (index 0) puis
 * les `max` derniers messages, pour borner coût et latence (US-2.4).
 */
export function windowChatHistory<T>(history: T[], max = 20): T[] {
  if (history.length <= max + 2) return history;
  return [history[0], ...history.slice(-max)];
}

/** Construit le system prompt de Sarah selon sa personnalité, sa forme d'adresse et le contexte d'humeur. */
export function buildSystemPrompt(ai: AILike, moodContext: string): string {
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
