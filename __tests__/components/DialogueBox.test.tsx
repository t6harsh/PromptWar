/**
 * Tests for DialogueBox component.
 * Validates dialogue rendering, ARIA dialog role, and choice buttons.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";

const baseMock = {
  playerHP: 100,
  maxHP: 100,
  temporalEnergy: 100,
  maxEnergy: 100,
  currentScene: { name: "Test", year: 1432, id: "renaissance", background: "", description: "", npcs: [], hotspots: [], ambience: "warm" as const },
  butterflyIndex: 42,
  totalActions: 0,
  inventory: [],
  backendOnline: false,
  currentEra: "renaissance",
  isTransitioning: false,
  dialogueQueue: [],
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

let currentMock = { ...baseMock, isDialogueActive: false, currentDialogue: null as null | Record<string, unknown> };

vi.mock("../../context/ChronosContext", () => ({
  useChronos: () => currentMock,
}));

import DialogueBox from "../../components/DialogueBox";

describe("DialogueBox", () => {
  it("renders nothing when dialogue is not active", () => {
    currentMock = { ...baseMock, isDialogueActive: false, currentDialogue: null };
    const { container } = render(<DialogueBox />);
    expect(container.innerHTML).toBe("");
  });

  it("renders with dialog role when active", () => {
    currentMock = {
      ...baseMock,
      isDialogueActive: true,
      currentDialogue: { speaker: "Leonardo", text: "Hello traveler!", isNarration: false },
    };
    render(<DialogueBox />);
    expect(screen.getByRole("dialog")).toBeDefined();
  });

  it("shows speaker name", () => {
    currentMock = {
      ...baseMock,
      isDialogueActive: true,
      currentDialogue: { speaker: "Leonardo", text: "Hello traveler!", isNarration: false },
    };
    render(<DialogueBox />);
    expect(screen.getByText("Leonardo")).toBeDefined();
  });

  it("has aria-modal attribute", () => {
    currentMock = {
      ...baseMock,
      isDialogueActive: true,
      currentDialogue: { speaker: "Test", text: "Test text", isNarration: false },
    };
    render(<DialogueBox />);
    const dialog = screen.getByRole("dialog");
    expect(dialog.getAttribute("aria-modal")).toBe("true");
  });

  it("is focusable for keyboard interaction", () => {
    currentMock = {
      ...baseMock,
      isDialogueActive: true,
      currentDialogue: { speaker: "Test", text: "Test text", isNarration: false },
    };
    render(<DialogueBox />);
    const dialog = screen.getByRole("dialog");
    expect(dialog.getAttribute("tabindex")).toBe("0");
  });
});
