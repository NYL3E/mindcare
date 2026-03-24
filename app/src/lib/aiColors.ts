export const AI_COLOR_OPTIONS = [
  { id: "pink",   from: "#ff90e8", to: "#f97ab8", label: "Rose" },
  { id: "violet", from: "#9059ff", to: "#7225e3", label: "Violet" },
  { id: "blue",   from: "#60a5fa", to: "#3b82f6", label: "Bleu" },
  { id: "mint",   from: "#6ee7b7", to: "#34d399", label: "Menthe" },
  { id: "coral",  from: "#f1a57a", to: "#ef8c5e", label: "Corail" },
  { id: "lemon",  from: "#fbbf24", to: "#f59e0b", label: "Citron" },
] as const;

export function getAIColors(colorId: string) {
  return AI_COLOR_OPTIONS.find((c) => c.id === colorId) ?? AI_COLOR_OPTIONS[0];
}
