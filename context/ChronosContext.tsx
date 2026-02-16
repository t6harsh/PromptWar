"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { temporalAgent, type TemporalCommandResult } from "../agents/temporalAgent";

// ─── Types ───

export interface DialogueLine {
  speaker: string;
  text: string;
  isNarration?: boolean;
  choices?: { label: string; action: string }[];
}

export interface SceneNPC {
  id: string;
  name: string;
  x: number; // percentage position
  y: number;
  dialogue: DialogueLine[];
}

export interface SceneHotspot {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  action: string;
  description: string;
}

export interface EraScene {
  id: string;
  name: string;
  year: number;
  background: string;
  description: string;
  npcs: SceneNPC[];
  hotspots: SceneHotspot[];
  ambience: "warm" | "neon" | "dark" | "mystical";
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  era: string;
  icon: string;
}

export interface TimelineNode {
  id: string;
  year: number;
  era: string;
  label: string;
  status: "stable" | "shifting" | "paradox";
  unlocked: boolean;
}

export interface GameState {
  // Player stats
  playerHP: number;
  maxHP: number;
  temporalEnergy: number;
  maxEnergy: number;

  // Scene
  currentEra: string;
  currentScene: EraScene;
  isTransitioning: boolean;

  // Dialogue
  dialogueQueue: DialogueLine[];
  currentDialogue: DialogueLine | null;
  isDialogueActive: boolean;

  // Butterfly / Temporal
  butterflyIndex: number;
  isRecalculating: boolean;
  isParadoxEvent: boolean;
  affectedEras: string[];

  // Timeline
  timelineNodes: TimelineNode[];
  totalActions: number;

  // Echo / Log
  echoMessages: string[];

  // Inventory
  inventory: InventoryItem[];

  // Backend
  backendOnline: boolean;

  // Actions
  travelToEra: (eraId: string) => void;
  performAction: (type: "act" | "observe" | "temporal" | "custom", customCommand?: string) => Promise<void>;
  advanceDialogue: () => void;
  selectChoice: (action: string) => void;
  interactWithNPC: (npcId: string) => void;
  interactWithHotspot: (hotspotId: string) => void;
}

// ─── Scene Data ───

const SCENES: Record<string, EraScene> = {
  renaissance: {
    id: "renaissance",
    name: "Leonardo's Workshop",
    year: 1432,
    background: "/game/renaissance.png",
    description: "The air smells of oil paint and sawdust. Candlelight flickers across scattered blueprints.",
    ambience: "warm",
    npcs: [
      {
        id: "leonardo",
        name: "Leonardo",
        x: 75,
        y: 25,
        dialogue: [
          { speaker: "Leonardo", text: "Ah, another visitor from beyond the veil of time. I have been expecting you." },
          { speaker: "Leonardo", text: "This hourglass... it speaks to me in dreams. It shows me futures that should not exist." },
          {
            speaker: "Leonardo", text: "Will you help me protect it from those who seek to shatter the timeline?",
            choices: [
              { label: "I will protect the hourglass", action: "protect_hourglass" },
              { label: "Tell me more about the visions", action: "ask_visions" },
              { label: "I need to observe first", action: "observe_workshop" },
            ],
          },
        ],
      },
    ],
    hotspots: [
      { id: "hourglass", label: "Temporal Hourglass", x: 42, y: 40, width: 16, height: 30, action: "examine_hourglass", description: "A mysterious hourglass pulses with ethereal blue light. Sand flows upward." },
      { id: "clock", label: "Ornate Clock", x: 10, y: 20, width: 20, height: 35, action: "examine_clock", description: "An impossibly complex clockwork device. Its gears seem to turn in patterns that defy logic." },
      { id: "blueprints", label: "Scattered Blueprints", x: 30, y: 65, width: 30, height: 20, action: "examine_blueprints", description: "Detailed schematics of machines centuries ahead of their time. One diagram shows a temporal displacement device." },
    ],
  },
  cyberpunk: {
    id: "cyberpunk",
    name: "Neo-Kyoto Streets",
    year: 2847,
    background: "/game/cyberpunk.png",
    description: "Neon rain paints the streets in electric purple. A temporal rift swirls in the sky above.",
    ambience: "neon",
    npcs: [
      {
        id: "aria",
        name: "ARIA-7",
        x: 60,
        y: 50,
        dialogue: [
          { speaker: "ARIA-7", text: "Temporal anomaly confirmed. You are the traveler from the Renaissance anchor point." },
          { speaker: "ARIA-7", text: "The Chrono Engine is failing. Every paradox you create weakens the fabric of our reality." },
          {
            speaker: "ARIA-7", text: "We need your help. The rift above the city grows with each timeline fracture.",
            choices: [
              { label: "How do I stabilize the rift?", action: "ask_rift" },
              { label: "What happens if the engine fails?", action: "ask_engine" },
              { label: "I need to return to the past", action: "return_past" },
            ],
          },
        ],
      },
    ],
    hotspots: [
      { id: "rift", label: "Temporal Rift", x: 35, y: 5, width: 30, height: 25, action: "examine_rift", description: "A massive spiraling vortex tears through the sky. Fragments of other timelines flicker within." },
      { id: "terminal", label: "Data Terminal", x: 5, y: 60, width: 15, height: 20, action: "use_terminal", description: "A public access terminal. You could hack into the Chrono Engine mainframe from here." },
      { id: "billboard", label: "Holographic Billboard", x: 70, y: 15, width: 15, height: 20, action: "examine_billboard", description: "A holographic ad flickers: 'TEMPORAL TOURISM — See the past! Paradox-free guaranteed!'" },
    ],
  },
};

const DEFAULT_NODES: TimelineNode[] = [
  { id: "n1", year: 800, era: "Dark Ages", label: "The Awakening", status: "stable", unlocked: false },
  { id: "n2", year: 1200, era: "Medieval", label: "Castle Siege", status: "stable", unlocked: false },
  { id: "n3", year: 1432, era: "Renaissance", label: "Leonardo's Workshop", status: "shifting", unlocked: true },
  { id: "n4", year: 1750, era: "Enlightenment", label: "The Invention", status: "stable", unlocked: false },
  { id: "n5", year: 2024, era: "Digital", label: "The Singularity", status: "stable", unlocked: false },
  { id: "n6", year: 2847, era: "Cyberpunk", label: "Neo-Kyoto", status: "paradox", unlocked: true },
];

const ACT_DIALOGUES: Record<string, DialogueLine[]> = {
  renaissance: [
    { speaker: "", text: "You focus your temporal senses. The workshop hums with displaced chronon particles.", isNarration: true },
    {
      speaker: "", text: "You could intervene in the timeline here. What will you do?", isNarration: true,
      choices: [
        { label: "Save Leonardo from the saboteur", action: "cmd:Save Leonardo from the sabotage" },
        { label: "Send blueprints to the future", action: "cmd:Send the blueprints to the future" },
        { label: "Guard the temporal hourglass", action: "cmd:Protect the temporal hourglass" },
      ],
    },
  ],
  cyberpunk: [
    { speaker: "", text: "The neon-lit streets pulse with temporal energy. The rift above crackles ominously.", isNarration: true },
    {
      speaker: "", text: "The future trembles. What action will you take?", isNarration: true,
      choices: [
        { label: "Stabilize the Chrono Engine", action: "cmd:Stabilize the Chrono Engine core" },
        { label: "Hack the temporal grid", action: "cmd:Hack into the temporal defense grid" },
        { label: "Seal the rift", action: "cmd:Attempt to seal the temporal rift" },
      ],
    },
  ],
};

const OBSERVE_DIALOGUES: Record<string, DialogueLine[]> = {
  renaissance: [
    { speaker: "", text: "You quietly observe the workshop. Leonardo mutters to himself, sketching furiously.", isNarration: true },
    { speaker: "", text: "The hourglass on the pedestal flickers — sand flowing briefly upward before returning to normal.", isNarration: true },
    { speaker: "", text: "In the corner, you notice scratch marks on the floor. Someone has been moving the pedestal recently.", isNarration: true },
  ],
  cyberpunk: [
    { speaker: "", text: "You scan the Neo-Kyoto skyline. Holographic advertisements flicker between timelines.", isNarration: true },
    { speaker: "", text: "The temporal rift above pulses rhythmically — like a heartbeat of fractured spacetime.", isNarration: true },
    { speaker: "", text: "Citizens walk past you, some glitching momentarily as their timelines shift beneath them.", isNarration: true },
  ],
};

const TEMPORAL_DIALOGUES: DialogueLine[] = [
  { speaker: "", text: "You channel temporal energy through the hourglass device on your belt...", isNarration: true },
  { speaker: "", text: "Time slows around you. You can feel the threads of causality stretching, ready to be rewoven.", isNarration: true },
];

// ─── Context ───

const ChronosContext = createContext<GameState | null>(null);

export function useChronos(): GameState {
  const ctx = useContext(ChronosContext);
  if (!ctx) throw new Error("useChronos must be used within ChronosProvider");
  return ctx;
}

// ─── Provider ───

export function ChronosProvider({ children }: { children: React.ReactNode }) {
  // Player
  const [playerHP, setPlayerHP] = useState(100);
  const [temporalEnergy, setTemporalEnergy] = useState(100);

  // Scene
  const [currentEra, setCurrentEra] = useState("renaissance");
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Dialogue
  const [dialogueQueue, setDialogueQueue] = useState<DialogueLine[]>([]);
  const [currentDialogue, setCurrentDialogue] = useState<DialogueLine | null>(null);
  const [isDialogueActive, setIsDialogueActive] = useState(false);

  // Temporal
  const [butterflyIndex, setButterflyIndex] = useState(42);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [isParadoxEvent, setIsParadoxEvent] = useState(false);
  const [affectedEras, setAffectedEras] = useState<string[]>([]);

  // Timeline
  const [timelineNodes, setTimelineNodes] = useState<TimelineNode[]>(DEFAULT_NODES);
  const [totalActions, setTotalActions] = useState(0);

  // Echo
  const [echoMessages, setEchoMessages] = useState<string[]>([
    "Chronos Engine initialized...",
    "Temporal anchor locked: Renaissance, 1432 AD",
    "Awaiting traveler command.",
  ]);

  // Inventory
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  // Backend
  const [backendOnline, setBackendOnline] = useState(false);

  const paradoxTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentScene = SCENES[currentEra] || SCENES.renaissance;

  useEffect(() => {
    temporalAgent.checkHealth().then((h) => setBackendOnline(h.online));
  }, []);

  // Energy regen
  useEffect(() => {
    const timer = setInterval(() => {
      setTemporalEnergy((e) => Math.min(100, e + 2));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Scene intro dialogue on era change
  useEffect(() => {
    const scene = SCENES[currentEra];
    if (scene) {
      startDialogue([
        { speaker: "", text: `— ${scene.name}, ${scene.year} AD —`, isNarration: true },
        { speaker: "", text: scene.description, isNarration: true },
      ]);
    }
  }, [currentEra]);

  const pushEcho = useCallback((msg: string) => {
    setEchoMessages((prev) => [...prev.slice(-7), msg]);
  }, []);

  // ─── Dialogue System ───

  const startDialogue = useCallback((lines: DialogueLine[]) => {
    if (lines.length === 0) return;
    setDialogueQueue(lines.slice(1));
    setCurrentDialogue(lines[0]);
    setIsDialogueActive(true);
  }, []);

  const advanceDialogue = useCallback(() => {
    if (dialogueQueue.length > 0) {
      setCurrentDialogue(dialogueQueue[0]);
      setDialogueQueue((q) => q.slice(1));
    } else {
      setCurrentDialogue(null);
      setIsDialogueActive(false);
    }
  }, [dialogueQueue]);

  const selectChoice = useCallback((action: string) => {
    // If action starts with "cmd:", it's a temporal command
    if (action.startsWith("cmd:")) {
      const cmd = action.slice(4);
      setCurrentDialogue(null);
      setIsDialogueActive(false);
      setDialogueQueue([]);
      // Fire the command
      processCommand(cmd);
    } else {
      // Handle narrative choices
      const narrativeResponses: Record<string, DialogueLine[]> = {
        protect_hourglass: [
          { speaker: "Leonardo", text: "Bravissimo! Then we must act quickly. The saboteurs come at midnight." },
          { speaker: "", text: "Leonardo hands you a key to the hidden vault beneath the workshop.", isNarration: true },
        ],
        ask_visions: [
          { speaker: "Leonardo", text: "I see a city of impossible lights... towers piercing clouds of violet lightning." },
          { speaker: "Leonardo", text: "And a great spiral in the sky — a wound in time itself. Your arrival was foretold in those visions." },
        ],
        observe_workshop: [
          { speaker: "", text: "You take a moment to study the workshop carefully. Leonardo nods approvingly.", isNarration: true },
        ],
        ask_rift: [
          { speaker: "ARIA-7", text: "The rift feeds on paradox energy. Reduce the Butterfly Index below 30 to stabilize it." },
          { speaker: "ARIA-7", text: "But be warned — every timeline alteration either heals or worsens the fracture." },
        ],
        ask_engine: [
          { speaker: "ARIA-7", text: "If the Chrono Engine fails... all timelines collapse into a single, broken reality." },
          { speaker: "ARIA-7", text: "Every era, every person, every moment — merged into temporal chaos." },
        ],
        return_past: [
          { speaker: "ARIA-7", text: "The Renaissance anchor is still active. But be careful — each jump costs temporal energy." },
        ],
      };

      const response = narrativeResponses[action] || [
        { speaker: "", text: "You consider your options carefully.", isNarration: true },
      ];

      setDialogueQueue(response.slice(1));
      setCurrentDialogue(response[0]);
    }
  }, []);

  // ─── Process Backend Command ───

  const processCommand = useCallback(async (command: string) => {
    setIsRecalculating(true);
    pushEcho(`› ${command}`);

    const result = await temporalAgent.sendCommand(command, currentScene.name);
    setTotalActions((n) => n + 1);

    if (result.blocked) {
      startDialogue([
        { speaker: "", text: "⛔ The Temporal Ethics Board has blocked this action.", isNarration: true },
        { speaker: "", text: result.reason || "This action would cause an irreversible paradox.", isNarration: true },
      ]);
      setIsRecalculating(false);
      return;
    }

    setButterflyIndex(result.butterfly_index);

    const risk = result.butterfly_effect.paradox_risk;
    const paradox = result.is_paradox || risk > 0.65;

    // HP damage on paradox
    if (paradox) {
      setPlayerHP((hp) => Math.max(0, hp - 15));
    } else if (risk > 0.3) {
      setPlayerHP((hp) => Math.max(0, hp - 5));
    }

    // Echo
    for (const msg of result.echo_messages) {
      pushEcho(msg);
    }

    // Paradox effect
    setIsParadoxEvent(paradox);
    setAffectedEras(result.butterfly_effect?.affected_eras || []);
    if (paradoxTimerRef.current) clearTimeout(paradoxTimerRef.current);
    paradoxTimerRef.current = setTimeout(() => {
      setIsParadoxEvent(false);
      setAffectedEras([]);
    }, 3000);

    // Update timeline
    setTimelineNodes((nodes) =>
      nodes.map((node) => {
        if ((result.butterfly_effect?.affected_eras || []).includes(node.era)) {
          if (paradox) return { ...node, status: "paradox" as const };
          if (risk > 0.4) return { ...node, status: "shifting" as const };
          return { ...node, status: "stable" as const };
        }
        return node;
      })
    );

    // Result dialogue
    const narratives = result.butterfly_effect?.narrative_changes || [];
    const resultDialogue: DialogueLine[] = [];

    if (paradox) {
      resultDialogue.push({ speaker: "", text: "⚠ PARADOX EVENT — The timeline shudders violently!", isNarration: true });
    }

    for (const n of narratives) {
      resultDialogue.push({ speaker: "", text: n, isNarration: true });
    }

    resultDialogue.push({
      speaker: "", text: `Butterfly Index: ${Math.round(result.butterfly_index)}% | Risk: ${Math.round(risk * 100)}%`, isNarration: true,
    });

    if (resultDialogue.length > 0) {
      startDialogue(resultDialogue);
    }

    // Chance to find an item
    if (Math.random() < 0.3 && !paradox) {
      const items: InventoryItem[] = [
        { id: `item_${Date.now()}`, name: "Chronon Shard", description: "A fragment of crystallized time", era: currentEra, icon: "💎" },
        { id: `item_${Date.now()}`, name: "Temporal Compass", description: "Points toward timeline anomalies", era: currentEra, icon: "🧭" },
        { id: `item_${Date.now()}`, name: "Memory Fragment", description: "An echo from another timeline", era: currentEra, icon: "🔮" },
      ];
      const item = items[Math.floor(Math.random() * items.length)];
      setInventory((inv) => [...inv, item]);
      pushEcho(`Found: ${item.icon} ${item.name}`);
    }

    setIsRecalculating(false);
  }, [currentEra, currentScene, pushEcho, startDialogue]);

  // ─── Travel ───

  const travelToEra = useCallback((eraId: string) => {
    if (eraId === currentEra) return;
    if (!SCENES[eraId]) return;

    if (temporalEnergy < 20) {
      startDialogue([
        { speaker: "", text: "Not enough Temporal Energy to travel. Wait for it to recharge.", isNarration: true },
      ]);
      return;
    }

    setIsTransitioning(true);
    setTemporalEnergy((e) => Math.max(0, e - 20));
    pushEcho(`Initiating temporal jump to ${SCENES[eraId].name}...`);

    setTimeout(() => {
      setCurrentEra(eraId);
      setIsTransitioning(false);
    }, 1500);
  }, [currentEra, temporalEnergy, pushEcho, startDialogue]);

  // ─── Actions ───

  const performAction = useCallback(async (type: "act" | "observe" | "temporal" | "custom", customCommand?: string) => {
    if (isDialogueActive || isRecalculating) return;

    switch (type) {
      case "act": {
        const actLines = ACT_DIALOGUES[currentEra] || ACT_DIALOGUES.renaissance;
        startDialogue(actLines);
        break;
      }
      case "observe": {
        const obsLines = OBSERVE_DIALOGUES[currentEra] || OBSERVE_DIALOGUES.renaissance;
        startDialogue(obsLines);
        break;
      }
      case "temporal": {
        if (temporalEnergy < 15) {
          startDialogue([{ speaker: "", text: "Not enough Temporal Energy. Wait for it to recharge.", isNarration: true }]);
          return;
        }
        setTemporalEnergy((e) => Math.max(0, e - 15));
        startDialogue([
          ...TEMPORAL_DIALOGUES,
          {
            speaker: "", text: "How will you reshape time?", isNarration: true,
            choices: [
              { label: "Rewind recent events", action: "cmd:Rewind the most recent temporal event" },
              { label: "Scan for anomalies", action: "cmd:Scan for temporal anomalies in this era" },
              { label: "Strengthen the timeline", action: "cmd:Reinforce the causal anchor in this era" },
            ],
          },
        ]);
        break;
      }
      case "custom": {
        if (customCommand) {
          await processCommand(customCommand);
        }
        break;
      }
    }
  }, [currentEra, temporalEnergy, isDialogueActive, isRecalculating, startDialogue, processCommand]);

  // ─── NPC / Hotspot Interaction ───

  const interactWithNPC = useCallback((npcId: string) => {
    if (isDialogueActive) return;
    const npc = currentScene.npcs.find((n) => n.id === npcId);
    if (npc) {
      startDialogue(npc.dialogue);
    }
  }, [currentScene, isDialogueActive, startDialogue]);

  const interactWithHotspot = useCallback((hotspotId: string) => {
    if (isDialogueActive) return;
    const hotspot = currentScene.hotspots.find((h) => h.id === hotspotId);
    if (hotspot) {
      startDialogue([
        { speaker: "", text: hotspot.description, isNarration: true },
      ]);
      pushEcho(`Examined: ${hotspot.label}`);
    }
  }, [currentScene, isDialogueActive, startDialogue, pushEcho]);

  // ─── Value ───

  const value: GameState = {
    playerHP,
    maxHP: 100,
    temporalEnergy,
    maxEnergy: 100,
    currentEra,
    currentScene,
    isTransitioning,
    dialogueQueue,
    currentDialogue,
    isDialogueActive,
    butterflyIndex,
    isRecalculating,
    isParadoxEvent,
    affectedEras,
    timelineNodes,
    totalActions,
    echoMessages,
    inventory,
    backendOnline,
    travelToEra,
    performAction,
    advanceDialogue,
    selectChoice,
    interactWithNPC,
    interactWithHotspot,
  };

  return <ChronosContext.Provider value={value}>{children}</ChronosContext.Provider>;
}
