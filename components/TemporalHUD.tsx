"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface TimelineNode {
  id: string;
  year: number;
  era: string;
  label: string;
  status: "stable" | "shifting" | "paradox";
  x: number;
  y: number;
}

interface Branch {
  from: string;
  to: string;
  type: "primary" | "alternate" | "paradox";
}

const TIMELINE_NODES: TimelineNode[] = [
  { id: "n1", year: 800, era: "Dark Ages", label: "The Awakening", status: "stable", x: 80, y: 200 },
  { id: "n2", year: 1200, era: "Medieval", label: "Castle Siege", status: "stable", x: 200, y: 140 },
  { id: "n3", year: 1400, era: "Renaissance", label: "Leonardo's Workshop", status: "shifting", x: 320, y: 180 },
  { id: "n4", year: 1750, era: "Enlightenment", label: "The Invention", status: "stable", x: 440, y: 120 },
  { id: "n5", year: 1900, era: "Industrial", label: "The Machine", status: "stable", x: 560, y: 200 },
  { id: "n6", year: 2024, era: "Digital", label: "The Singularity", status: "shifting", x: 680, y: 160 },
  { id: "n7", year: 2200, era: "Neo Age", label: "First Colony", status: "stable", x: 800, y: 100 },
  { id: "n8", year: 2847, era: "Cyberpunk", label: "Neo-Kyoto", status: "paradox", x: 920, y: 200 },
];

const BRANCHES: Branch[] = [
  { from: "n1", to: "n2", type: "primary" },
  { from: "n2", to: "n3", type: "primary" },
  { from: "n3", to: "n4", type: "primary" },
  { from: "n3", to: "n5", type: "alternate" },
  { from: "n4", to: "n5", type: "primary" },
  { from: "n5", to: "n6", type: "primary" },
  { from: "n6", to: "n7", type: "primary" },
  { from: "n6", to: "n8", type: "alternate" },
  { from: "n7", to: "n8", type: "primary" },
];

export default function TemporalHUD() {
  const [paradoxIndex, setParadoxIndex] = useState(73);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [echoMessages, setEchoMessages] = useState<string[]>([]);
  const [thought, setThought] = useState("");
  const [waveform, setWaveform] = useState<{ duration: number; delay: number; height: number[] }[]>([]);

  useEffect(() => {
    setWaveform(
      [...Array(12)].map((_, i) => ({
        duration: 0.5 + Math.random() * 0.5,
        delay: i * 0.05,
        height: [4, 12 + Math.random() * 8, 4],
      }))
    );
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setParadoxIndex((prev) => {
        const delta = (Math.random() - 0.5) * 4;
        return Math.max(0, Math.min(100, prev + delta));
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const messages = [
      "Scanning temporal harmonics...",
      "Butterfly cascade detected in 1432 AD",
      "Quantum entanglement stable across 6 nodes",
      "Paradox risk: LOW — no causal loops found",
      "Future branch probability shifting +4.2%",
      "Renaissance anchor point holding steady",
      "Neo-Kyoto timeline: 3 variant outcomes detected",
    ];
    let idx = 0;
    const interval = setInterval(() => {
      setEchoMessages((prev) => [...prev.slice(-4), messages[idx % messages.length]]);
      idx++;
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const handleNodeClick = (node: TimelineNode) => {
    setActiveNode(node.id);
    setIsRecalculating(true);
    setEchoMessages((prev) => [
      ...prev.slice(-4),
      `Analyzing anchor point: ${node.label} (${node.year} AD)...`,
    ]);
    setTimeout(() => {
      setIsRecalculating(false);
      setEchoMessages((prev) => [
        ...prev.slice(-4),
        `Causality chain verified for ${node.era} era. ${node.status === "paradox" ? "⚠ PARADOX WARNING" : "✓ Stable"}`,
      ]);
    }, 2000);
  };

  const getNodeColor = (status: string) => {
    switch (status) {
      case "stable": return "var(--neon-cyan)";
      case "shifting": return "var(--neon-gold)";
      case "paradox": return "var(--neon-magenta)";
      default: return "var(--neon-cyan)";
    }
  };

  const getBranchColor = (type: string) => {
    switch (type) {
      case "primary": return "rgba(0, 240, 255, 0.4)";
      case "alternate": return "rgba(168, 85, 247, 0.3)";
      case "paradox": return "rgba(244, 63, 133, 0.4)";
      default: return "rgba(0, 240, 255, 0.3)";
    }
  };

  const getNode = (id: string) => TIMELINE_NODES.find((n) => n.id === id)!;

  return (
    <div className="flex flex-col h-full relative">
      {/* Shimmer overlay when recalculating */}
      <AnimatePresence>
        {isRecalculating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(0,240,255,0.05) 25%, rgba(168,85,247,0.08) 50%, rgba(0,240,255,0.05) 75%, transparent 100%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 1.5s linear infinite",
            }}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: "var(--glass-border)" }}>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full" style={{ background: "var(--neon-cyan)", boxShadow: "0 0 8px var(--neon-cyan)" }} />
          <span style={{ fontFamily: "var(--font-display)", fontSize: "11px", letterSpacing: "3px", color: "var(--neon-cyan)" }}>
            TEMPORAL HUD
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span style={{ fontSize: "10px", color: "var(--text-muted)", letterSpacing: "1px" }}>BUTTERFLY INDEX</span>
          <motion.span
            key={Math.round(paradoxIndex)}
            initial={{ scale: 1.2, color: "var(--neon-gold)" }}
            animate={{ scale: 1, color: paradoxIndex > 80 ? "var(--neon-magenta)" : "var(--neon-cyan)" }}
            style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: 700 }}
          >
            {Math.round(paradoxIndex)}%
          </motion.span>
        </div>
      </div>

      {/* Paradox Meter */}
      <div className="px-5 py-3">
        <div className="relative h-2 rounded-full overflow-hidden" style={{ background: "var(--chronos-deep)" }}>
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full"
            animate={{ width: `${paradoxIndex}%` }}
            transition={{ type: "spring", stiffness: 100 }}
            style={{
              background: `linear-gradient(90deg, var(--neon-cyan), ${paradoxIndex > 80 ? "var(--neon-magenta)" : "var(--neon-purple)"})`,
              boxShadow: `0 0 10px ${paradoxIndex > 80 ? "var(--neon-magenta)" : "var(--neon-cyan)"}`,
            }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span style={{ fontSize: "9px", color: "var(--text-muted)" }}>STABLE</span>
          <span style={{ fontSize: "9px", color: "var(--text-muted)" }}>CRITICAL</span>
        </div>
      </div>

      {/* Timeline Visualization */}
      <div className="flex-1 relative overflow-hidden px-2">
        <svg width="100%" height="100%" viewBox="0 0 1000 300" preserveAspectRatio="xMidYMid meet">
          {/* Grid lines */}
          {[50, 100, 150, 200, 250].map((y) => (
            <line key={y} x1="40" y1={y} x2="960" y2={y} stroke="rgba(0,240,255,0.05)" strokeWidth="0.5" />
          ))}

          {/* Branches */}
          {BRANCHES.map((branch, i) => {
            const from = getNode(branch.from);
            const to = getNode(branch.to);
            const midX = (from.x + to.x) / 2;
            const midY = (from.y + to.y) / 2 - 30;
            return (
              <motion.path
                key={i}
                d={`M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`}
                fill="none"
                stroke={getBranchColor(branch.type)}
                strokeWidth={branch.type === "primary" ? 2 : 1.5}
                strokeDasharray={branch.type === "alternate" ? "6 4" : "none"}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, delay: i * 0.15 }}
              />
            );
          })}

          {/* Nodes */}
          {TIMELINE_NODES.map((node) => {
            const color = getNodeColor(node.status);
            const isActive = activeNode === node.id;
            return (
              <g key={node.id} onClick={() => handleNodeClick(node)} style={{ cursor: "pointer" }}>
                {/* Glow */}
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r={isActive ? 20 : 14}
                  fill="none"
                  stroke={color}
                  strokeWidth="0.5"
                  opacity={0.3}
                  animate={{
                    r: isActive ? [20, 25, 20] : [14, 18, 14],
                    opacity: [0.2, 0.5, 0.2],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                {/* Core */}
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r={isActive ? 8 : 5}
                  fill={color}
                  style={{ filter: `drop-shadow(0 0 6px ${color})` }}
                  whileHover={{ scale: 1.5 }}
                />
                {/* Year label */}
                <text
                  x={node.x}
                  y={node.y + 28}
                  textAnchor="middle"
                  fill="var(--text-secondary)"
                  fontSize="10"
                  fontFamily="var(--font-display)"
                >
                  {node.year}
                </text>
                {/* Name label */}
                <text
                  x={node.x}
                  y={node.y - 20}
                  textAnchor="middle"
                  fill={isActive ? color : "var(--text-muted)"}
                  fontSize="9"
                  fontFamily="var(--font-body)"
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Chronos Echo Feed */}
      <div
        className="px-4 py-3 border-t overflow-hidden"
        style={{ borderColor: "var(--glass-border)", maxHeight: "120px" }}
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--neon-purple)", animation: "pulse-glow 2s infinite" }} />
          <span style={{ fontSize: "9px", letterSpacing: "2px", color: "var(--neon-purple)", fontFamily: "var(--font-display)" }}>
            CHRONOS ECHO
          </span>
        </div>
        <div className="space-y-1">
          <AnimatePresence mode="popLayout">
            {echoMessages.slice(-4).map((msg, i) => (
              <motion.div
                key={msg + i}
                initial={{ opacity: 0, x: -10, height: 0 }}
                animate={{ opacity: 1, x: 0, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                style={{ fontSize: "11px", color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}
              >
                <span style={{ color: "var(--neon-cyan)", marginRight: "6px" }}>›</span>
                {msg}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Voice Command Input */}
      <div className="px-4 py-3 border-t" style={{ borderColor: "var(--glass-border)" }}>
        <div className="flex items-center gap-3 glass-panel-sm px-4 py-2.5">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: thought ? "var(--neon-cyan)" : "var(--neon-cyan-dim)",
              boxShadow: thought ? "0 0 8px var(--neon-cyan)" : "none",
            }}
          />
          <input
            type="text"
            placeholder="Issue temporal command..."
            value={thought}
            onChange={(e) => setThought(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && thought.trim()) {
                setIsRecalculating(true);
                setEchoMessages((prev) => [...prev.slice(-4), `Processing command: "${thought}"`]);
                setThought("");
                setTimeout(() => {
                  setIsRecalculating(false);
                  setParadoxIndex((prev) => Math.min(100, prev + Math.random() * 10));
                  setEchoMessages((prev) => [...prev.slice(-4), "Command processed. Timeline updated."]);
                }, 2500);
              }
            }}
            className="flex-1 bg-transparent border-none outline-none"
            style={{ fontSize: "12px", color: "var(--text-primary)", fontFamily: "var(--font-body)" }}
          />
          {/* Waveform visual */}

  // ... (rest of the component)
          {/* Waveform visual */}
          <div className="flex items-center gap-0.5">
            {waveform.length > 0 ? waveform.map((bar, i) => (
              <motion.div
                key={i}
                animate={{
                  height: thought ? bar.height : [2, 4, 2],
                }}
                transition={{ duration: bar.duration, repeat: Infinity, delay: bar.delay }}
                style={{
                  width: "2px",
                  borderRadius: "1px",
                  background: thought ? "var(--neon-cyan)" : "var(--neon-cyan-dim)",
                }}
              />
            )) : (
               // Static initial state for server/first render to match structure
               [...Array(12)].map((_, i) => (
                 <div
                   key={i}
                   style={{
                     width: "2px",
                     height: "2px",
                     borderRadius: "1px",
                     background: "var(--neon-cyan-dim)",
                   }}
                 />
               ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
