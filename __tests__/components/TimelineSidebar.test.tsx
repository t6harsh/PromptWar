/**
 * Tests for TimelineSidebar component.
 * Validates navigation role, era nodes, paradox meter, and echo log.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";

const mockTravelToEra = vi.fn();

const mockContext = {
  timelineNodes: [
    { id: "n1", year: 800, era: "Dark Ages", label: "The Awakening", status: "stable", unlocked: false },
    { id: "n3", year: 1432, era: "Renaissance", label: "Leonardo's Workshop", status: "shifting", unlocked: true },
    { id: "n6", year: 2847, era: "Cyberpunk", label: "Neo-Kyoto", status: "paradox", unlocked: true },
  ],
  currentEra: "renaissance",
  butterflyIndex: 55,
  echoMessages: ["Engine initialized", "Awaiting command"],
  travelToEra: mockTravelToEra,
  playerHP: 100,
  maxHP: 100,
  temporalEnergy: 80,
  maxEnergy: 100,
  currentScene: { name: "Test", year: 1432, id: "renaissance", background: "", description: "", npcs: [], hotspots: [], ambience: "warm" as const },
  totalActions: 0,
  inventory: [],
  backendOnline: false,
  isTransitioning: false,
  dialogueQueue: [],
  currentDialogue: null,
  isDialogueActive: false,
  isRecalculating: false,
  isParadoxEvent: false,
  affectedEras: [],
  performAction: vi.fn(),
  advanceDialogue: vi.fn(),
  selectChoice: vi.fn(),
  interactWithNPC: vi.fn(),
  interactWithHotspot: vi.fn(),
};

vi.mock("../../context/ChronosContext", () => ({
  useChronos: () => mockContext,
}));

import TimelineSidebar from "../../components/TimelineSidebar";

describe("TimelineSidebar", () => {
  it("renders with navigation role", () => {
    render(<TimelineSidebar />);
    expect(screen.getByRole("navigation")).toBeDefined();
  });

  it("displays TIMELINE header", () => {
    render(<TimelineSidebar />);
    expect(screen.getByText("TIMELINE")).toBeDefined();
  });

  it("renders era nodes", () => {
    render(<TimelineSidebar />);
    expect(screen.getByText("The Awakening")).toBeDefined();
    expect(screen.getByText("Leonardo's Workshop")).toBeDefined();
    expect(screen.getByText("Neo-Kyoto")).toBeDefined();
  });

  it("has paradox index progressbar", () => {
    render(<TimelineSidebar />);
    const bar = screen.getByRole("progressbar", { name: /paradox index/i });
    expect(bar).toBeDefined();
    expect(bar.getAttribute("aria-valuenow")).toBe("55");
  });

  it("renders echo log with log role", () => {
    render(<TimelineSidebar />);
    expect(screen.getByRole("log")).toBeDefined();
  });

  it("shows echo messages", () => {
    render(<TimelineSidebar />);
    expect(screen.getByText("Engine initialized")).toBeDefined();
    expect(screen.getByText("Awaiting command")).toBeDefined();
  });

  it("has list role for timeline nodes", () => {
    render(<TimelineSidebar />);
    expect(screen.getByRole("list")).toBeDefined();
  });
});
