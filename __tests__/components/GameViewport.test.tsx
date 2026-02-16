/**
 * Tests for GameViewport component.
 * Validates scene rendering, ARIA roles, and interactive elements.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";

const mockContext = {
  currentScene: {
    id: "renaissance",
    name: "Leonardo's Workshop",
    year: 1432,
    background: "/game/renaissance.png",
    description: "The air smells of oil paint.",
    ambience: "warm" as const,
    npcs: [{ id: "leonardo", name: "Leonardo", x: 75, y: 25, dialogue: [] }],
    hotspots: [{ id: "hourglass", label: "Temporal Hourglass", x: 42, y: 40, width: 16, height: 30, action: "examine_hourglass", description: "A mysterious hourglass" }],
  },
  isTransitioning: false,
  isParadoxEvent: false,
  isRecalculating: false,
  interactWithNPC: vi.fn(),
  interactWithHotspot: vi.fn(),
  isDialogueActive: false,
  playerHP: 100,
  maxHP: 100,
  temporalEnergy: 80,
  maxEnergy: 100,
  currentEra: "renaissance",
  butterflyIndex: 42,
  totalActions: 0,
  inventory: [],
  backendOnline: false,
  dialogueQueue: [],
  currentDialogue: null,
  affectedEras: [],
  timelineNodes: [],
  echoMessages: [],
  travelToEra: vi.fn(),
  performAction: vi.fn(),
  advanceDialogue: vi.fn(),
  selectChoice: vi.fn(),
};

vi.mock("../../context/ChronosContext", () => ({
  useChronos: () => mockContext,
}));

import GameViewport from "../../components/GameViewport";

describe("GameViewport", () => {
  it("renders with main role", () => {
    render(<GameViewport />);
    expect(screen.getByRole("main")).toBeDefined();
  });

  it("has aria-label with scene name", () => {
    render(<GameViewport />);
    const main = screen.getByRole("main");
    expect(main.getAttribute("aria-label")).toContain("Leonardo's Workshop");
  });

  it("renders hotspot buttons", () => {
    render(<GameViewport />);
    const hotspotBtn = screen.getByRole("button", { name: /temporal hourglass/i });
    expect(hotspotBtn).toBeDefined();
  });

  it("renders NPC buttons", () => {
    render(<GameViewport />);
    const npcBtn = screen.getByRole("button", { name: /talk to leonardo/i });
    expect(npcBtn).toBeDefined();
  });

  it("renders hero image with alt text", () => {
    render(<GameViewport />);
    const heroImg = screen.getByAltText(/time traveler hero/i);
    expect(heroImg).toBeDefined();
  });

  it("renders scene background with descriptive alt", () => {
    render(<GameViewport />);
    const bgImg = screen.getByAltText(/leonardo's workshop/i);
    expect(bgImg).toBeDefined();
  });
});
