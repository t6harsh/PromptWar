/**
 * Tests for GameHUD component.
 * Validates rendering of HP/energy bars, era info, and ARIA accessibility.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";

// Mock the context
const mockContext = {
  playerHP: 75,
  maxHP: 100,
  temporalEnergy: 60,
  maxEnergy: 100,
  currentScene: { name: "Leonardo's Workshop", year: 1432, id: "renaissance", background: "", description: "", npcs: [], hotspots: [], ambience: "warm" as const },
  butterflyIndex: 42,
  totalActions: 5,
  inventory: [{ id: "1", name: "Shard", description: "t", era: "r", icon: "💎" }],
  backendOnline: true,
  currentEra: "renaissance",
  isTransitioning: false,
  dialogueQueue: [],
  currentDialogue: null,
  isDialogueActive: false,
  isRecalculating: false,
  isParadoxEvent: false,
  affectedEras: [],
  timelineNodes: [],
  echoMessages: [],
  travelToEra: vi.fn(),
  performAction: vi.fn(),
  advanceDialogue: vi.fn(),
  selectChoice: vi.fn(),
  interactWithNPC: vi.fn(),
  interactWithHotspot: vi.fn(),
};

vi.mock("../../context/ChronosContext", () => ({
  useChronos: () => mockContext,
}));

// Import after mocking
import GameHUD from "../../components/GameHUD";

describe("GameHUD", () => {
  it("renders with banner role", () => {
    render(<GameHUD />);
    expect(screen.getByRole("banner")).toBeDefined();
  });

  it("displays HP progress bar with correct values", () => {
    render(<GameHUD />);
    const hpBar = screen.getByRole("progressbar", { name: /player health/i });
    expect(hpBar).toBeDefined();
    expect(hpBar.getAttribute("aria-valuenow")).toBe("75");
  });

  it("displays energy progress bar with correct values", () => {
    render(<GameHUD />);
    const energyBar = screen.getByRole("progressbar", { name: /temporal energy/i });
    expect(energyBar).toBeDefined();
    expect(energyBar.getAttribute("aria-valuenow")).toBe("60");
  });

  it("shows current era name", () => {
    render(<GameHUD />);
    expect(screen.getByText("LEONARDO'S WORKSHOP")).toBeDefined();
  });

  it("shows butterfly index percentage", () => {
    render(<GameHUD />);
    expect(screen.getByText("42%")).toBeDefined();
  });

  it("shows inventory count", () => {
    render(<GameHUD />);
    expect(screen.getByText("1")).toBeDefined();
  });

  it("shows backend status", () => {
    render(<GameHUD />);
    expect(screen.getByRole("status", { name: /backend online/i })).toBeDefined();
  });
});
