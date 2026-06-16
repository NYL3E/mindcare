import { describe, it, expect } from "vitest";
import { getAIColors, AI_COLOR_OPTIONS } from "../aiColors";

describe("Personnalisation de Luna — couleurs (US-2.3)", () => {
  it("renvoie la palette correspondant à l'identifiant", () => {
    expect(getAIColors("violet")).toMatchObject({ id: "violet", from: "#9059ff" });
  });

  it("retombe sur la première palette pour un identifiant inconnu", () => {
    expect(getAIColors("inexistant")).toBe(AI_COLOR_OPTIONS[0]);
  });

  it("expose 6 palettes disponibles", () => {
    expect(AI_COLOR_OPTIONS).toHaveLength(6);
  });
});
