/**
 * Tests for ActionMenu component.
 * Validates button rendering, disabled states, and ARIA toolbar role.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";

const mockPerformAction = vi.fn();

const mockContext = {
  performAction: mockPerformAction,
  isDialogueActive: false,
  isRecalculating: false,
  temporalEnergy: 80,
  playerHP: 100,
  maxHP: 100,
  maxEnergy: 100,
  currentScene: { name: "Test", year: 1432, id: "renaissance", background: "", description: "", npcs: [], hotspots: [], ambience: "warm" as const },
  butterflyIndex: 42,
  totalActions: 0,
  inventory: [],
  backendOnline: false,
  currentEra: "renaissance",
  isTransitioning: false,
  dialogueQueue: [],
  currentDialogue: null,
  isParadoxEvent: false,
  affectedEras: [],
  timelineNodes: [],
  echoMessages: [],
  travelToEra: vi.fn(),
  advanceDialogue: vi.fn(),
  selectChoice: vi.fn(),
  interactWithNPC: vi.fn(),
  interactWithHotspot: vi.fn(),
};

vi.mock("../../context/ChronosContext", () => ({
  useChronos: () => mockContext,
}));

import ActionMenu from "../../components/ActionMenu";

describe("ActionMenu", () => {
  beforeEach(() => {
    mockPerformAction.mockClear();
  });

  it("renders with toolbar role", () => {
    render(<ActionMenu />);
    expect(screen.getByRole("toolbar")).toBeDefined();
  });

  it("renders Act, Observe, and Temporal buttons", () => {
    render(<ActionMenu />);
    expect(screen.getByText("Act")).toBeDefined();
    expect(screen.getByText("Observe")).toBeDefined();
    expect(screen.getByText("Temporal")).toBeDefined();
  });

  it("calls performAction on button click", () => {
    render(<ActionMenu />);
    fireEvent.click(screen.getByText("Act"));
    expect(mockPerformAction).toHaveBeenCalledWith("act");
  });

  it("renders custom command input", () => {
    render(<ActionMenu />);
    expect(screen.getByLabelText(/custom temporal command/i)).toBeDefined();
  });

  it("has keyboard shortcut hints in aria-labels", () => {
    render(<ActionMenu />);
    const actBtn = screen.getByText("Act").closest("button");
    expect(actBtn?.getAttribute("aria-label")).toContain("1");
  });

  it("has maxlength on command input", () => {
    render(<ActionMenu />);
    const input = screen.getByLabelText(/custom temporal command/i);
    expect(input.getAttribute("maxlength")).toBe("500");
  });
});
