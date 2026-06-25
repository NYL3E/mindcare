// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import MoodGauge from "../MoodGauge";

describe("MoodGauge (composant)", () => {
  it("affiche le label et la valeur de la jauge", () => {
    render(<MoodGauge label="Énergie" value={66} onChange={vi.fn()} color="#9059ff" emoji="⚡" />);
    expect(screen.getByText("Énergie")).toBeInTheDocument();
    expect(screen.getByText("66")).toBeInTheDocument();
  });
  it("affiche l'emoji fourni à côté du label", () => {
    render(<MoodGauge label="Humeur" value={82} onChange={vi.fn()} color="#ff90e8" emoji="😊" />);
    expect(screen.getByText("😊")).toBeInTheDocument();
    expect(screen.getByText("82")).toBeInTheDocument();
  });
});
