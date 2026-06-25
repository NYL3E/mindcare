// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ChatBubble from "../ChatBubble";

describe("ChatBubble (composant)", () => {
  it("affiche le texte d'un message utilisateur", () => {
    render(<ChatBubble message="Bonjour Sarah" isUser />);
    expect(screen.getByText("Bonjour Sarah")).toBeInTheDocument();
  });
  it("n'affiche pas le texte mais l'animation de saisie quand isTyping", () => {
    render(<ChatBubble message="ne doit pas apparaître" isUser isTyping />);
    expect(screen.queryByText("ne doit pas apparaître")).not.toBeInTheDocument();
  });
});
