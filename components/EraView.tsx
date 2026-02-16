"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface EraViewProps {
  era: "past" | "future";
}

/* ===== PAST ERA DATA ===== */
const pastData = {
  title: "The Past",
  location: "Vatican Archive Node",
  year: "1432 AD",
  eraName: "Renaissance",
  status: "Anomalous Shift Detected",
  stability: 82,
  entries: [
    {
      id: "p1",
      title: "Parchment Fragment #802",
      text: '"The celestial bodies align in a manner unseen since the age of the Titans. The clockwork mechanisms of Rome falter as time itself bends..."',
    },
    {
      id: "p2",
      title: "Leonardo\'s Workshop Log",
      text: '"I have sketched a device most peculiar — gears within gears, each turning against the flow of an invisible river. The Hourglass whispers..."',
    },
    {
      id: "p3",
      title: "Medici Dispatch",
      text: '"A stranger appeared in the piazza today. They wore garments of no known tailor and spoke of events yet to unfold with unsettling certainty."',
    },
  ],
  artifacts: [
    { name: "Clockwork Fragment", age: "Est. 1430", risk: "Low" },
    { name: "Temporal Compass", age: "Unknown", risk: "High" },
    { name: "Da Vinci Codex Page 47", age: "1432", risk: "Medium" },
  ],
};

/* ===== FUTURE ERA DATA ===== */
const futureData = {
  title: "The Future",
  location: "Neo-Kyoto Skyline",
  year: "2847 AD",
  eraName: "Cyberpunk",
  status: "System Synchronized",
  techLevel: "Level 9",
  entries: [
    {
      id: "f1",
      title: "Neural Feed — Priority Alpha",
      text: "Temporal rift signature detected in Sector 7-G. Origin: Renaissance node. Deploying chrono-stabilizers.",
    },
    {
      id: "f2",
      title: "AI Overseer Report",
      text: "Population sentiment analysis shows 12% increase in temporal awareness. The Paradox Index is climbing. Recommend increased surveillance.",
    },
    {
      id: "f3",
      title: "Holo-Broadcast",
      text: "Citizens of Neo-Kyoto: Timeline branch B-7 is now the primary reality. Your memories will be updated within 6 hours.",
    },
  ],
  systems: [
    { name: "Neural Link", status: "Active", integrity: 98 },
    { name: "Global Defense", status: "STANDBY", integrity: 100 },
    { name: "Chrono Engine", status: "WARNING", integrity: 67 },
    { name: "Quantum Grid", status: "Active", integrity: 94 },
  ],
};

export default function EraView({ era }: EraViewProps) {
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);
  const isPast = era === "past";
  const data = isPast ? pastData : futureData;

  const accentColor = isPast ? "var(--neon-gold)" : "var(--neon-purple)";
  const dimColor = isPast ? "var(--past-gold)" : "var(--future-electric)";
  const bgGradient = isPast
    ? "linear-gradient(180deg, rgba(201,161,79,0.08) 0%, transparent 60%)"
    : "linear-gradient(180deg, rgba(124,77,255,0.08) 0%, transparent 60%)";

const [particles, setParticles] = useState<{ width: string; height: string; left: string; top: string; duration: number; delay: number }[]>([]);

  useEffect(() => {
    setParticles(
      [...Array(8)].map((_, i) => ({
        width: `${2 + Math.random() * 3}px`,
        height: `${2 + Math.random() * 3}px`,
        left: `${10 + i * 12}%`,
        top: `${20 + Math.random() * 60}%`,
        duration: 3 + i * 0.5,
        delay: i * 0.3,
      }))
    );
  }, []);

  return (
    <div className="flex flex-col h-full overflow-hidden relative" style={{ background: bgGradient }}>
      {/* Scan line effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ opacity: 0.3 }}>
        <motion.div
          animate={{ y: ["-100%", "200%"] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          style={{
            width: "100%",
            height: "2px",
            background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
          }}
        />
      </div>

      {/* Header */}
      <div className="px-4 py-3 border-b" style={{ borderColor: `${isPast ? "rgba(201,161,79,0.15)" : "rgba(124,77,255,0.15)"}` }}>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span style={{ fontSize: "16px" }}>{isPast ? "🏛" : "🚀"}</span>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "11px",
                letterSpacing: "3px",
                color: accentColor,
                textShadow: `0 0 10px ${accentColor}`,
              }}
            >
              {data.title.toUpperCase()}
            </span>
          </div>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "10px",
              color: "var(--text-muted)",
            }}
          >
            {data.year}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span style={{ fontSize: "13px", color: "var(--text-primary)", fontWeight: 500 }}>{data.location}</span>
          <span
            className="px-2 py-0.5 rounded-full"
            style={{
              fontSize: "9px",
              letterSpacing: "1px",
              color: accentColor,
              background: `${isPast ? "rgba(201,161,79,0.1)" : "rgba(124,77,255,0.1)"}`,
              border: `1px solid ${isPast ? "rgba(201,161,79,0.2)" : "rgba(124,77,255,0.2)"}`,
            }}
          >
            {data.status}
          </span>
        </div>
      </div>

      {/* Era Banner Visual */}
      <div
        className="mx-4 mt-3 rounded-xl overflow-hidden relative"
        style={{
          height: "120px",
          background: isPast
            ? "linear-gradient(135deg, #2d1b0e 0%, #4a2f1a 30%, #6b4423 60%, #3d2b1f 100%)"
            : "linear-gradient(135deg, #0a0020 0%, #1a0040 30%, #2d0060 60%, #0f0030 100%)",
        }}
      >
        {/* Grid overlay for future */}
        {!isPast && (
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(124,77,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(124,77,255,0.1) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
        )}
        {/* Decorative particles */}
        {particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            animate={{
              y: isPast ? [0, -20, 0] : [0, 20, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{ duration: p.duration, repeat: Infinity, delay: p.delay }}
            style={{
              width: p.width,
              height: p.height,
              left: p.left,
              top: p.top,
              background: accentColor,
              boxShadow: `0 0 4px ${accentColor}`,
            }}
          />
        ))}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "20px",
                fontWeight: 700,
                color: accentColor,
                textShadow: `0 0 20px ${accentColor}`,
                letterSpacing: "4px",
              }}
            >
              {data.eraName.toUpperCase()}
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "4px" }}>
              {isPast ? "Temporal Anchor: Active" : `Tech Level: ${futureData.techLevel}`}
            </div>
          </div>
        </div>
      </div>

      {/* Stability / Systems Bar */}
      {isPast ? (
        <div className="mx-4 mt-3 glass-panel-sm px-3 py-2">
          <div className="flex items-center justify-between mb-1">
            <span style={{ fontSize: "9px", letterSpacing: "1.5px", color: "var(--text-muted)" }}>HISTORICAL STABILITY</span>
            <span style={{ fontSize: "12px", fontFamily: "var(--font-display)", color: accentColor }}>{pastData.stability}%</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--chronos-deep)" }}>
            <motion.div
              className="h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${pastData.stability}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              style={{ background: `linear-gradient(90deg, ${dimColor}, ${accentColor})` }}
            />
          </div>
        </div>
      ) : (
        <div className="mx-4 mt-3 grid grid-cols-2 gap-2">
          {futureData.systems.map((sys) => (
            <div key={sys.name} className="glass-panel-sm px-3 py-2">
              <div className="flex items-center gap-1.5 mb-1">
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background:
                      sys.status === "Active"
                        ? "var(--neon-cyan)"
                        : sys.status === "STANDBY"
                          ? "var(--neon-gold)"
                          : "var(--neon-magenta)",
                    boxShadow: `0 0 4px ${sys.status === "Active" ? "var(--neon-cyan)" : sys.status === "STANDBY" ? "var(--neon-gold)" : "var(--neon-magenta)"}`,
                  }}
                />
                <span style={{ fontSize: "10px", color: "var(--text-secondary)" }}>{sys.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ fontSize: "9px", color: "var(--text-muted)" }}>{sys.status}</span>
                <span
                  style={{
                    fontSize: "11px",
                    fontFamily: "var(--font-display)",
                    color: sys.integrity > 90 ? "var(--neon-cyan)" : sys.integrity > 70 ? "var(--neon-gold)" : "var(--neon-magenta)",
                  }}
                >
                  {sys.integrity}%
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Scrollable Entries */}
      <div className="flex-1 overflow-y-auto px-4 mt-3 pb-3 space-y-2" style={{ scrollbarWidth: "thin" }}>
        {data.entries.map((entry, i) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.15 }}
            className="glass-panel-sm px-3 py-2.5 cursor-pointer transition-all"
            style={{
              borderColor: expandedEntry === entry.id ? accentColor : undefined,
            }}
            onClick={() => setExpandedEntry(expandedEntry === entry.id ? null : entry.id)}
          >
            <div className="flex items-center gap-2 mb-1">
              <div
                className="w-1 h-1 rounded-full"
                style={{ background: accentColor }}
              />
              <span style={{ fontSize: "11px", fontWeight: 600, color: accentColor }}>{entry.title}</span>
            </div>
            <motion.div
              initial={false}
              animate={{ height: expandedEntry === entry.id ? "auto" : "32px" }}
              className="overflow-hidden"
            >
              <p
                style={{
                  fontSize: "11px",
                  lineHeight: "1.5",
                  color: "var(--text-secondary)",
                  fontStyle: isPast ? "italic" : "normal",
                }}
              >
                {entry.text}
              </p>
            </motion.div>
          </motion.div>
        ))}

        {/* Artifacts / Data Items */}
        <div className="mt-2">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-1 rounded-full" style={{ background: accentColor }} />
            <span style={{ fontSize: "9px", letterSpacing: "2px", color: "var(--text-muted)" }}>
              {isPast ? "RECOVERED ARTIFACTS" : "HOLOGRAPHIC DATA TICKER"}
            </span>
          </div>
          {isPast
            ? pastData.artifacts.map((art) => (
                <div key={art.name} className="flex items-center justify-between py-1.5 border-b" style={{ borderColor: "rgba(201,161,79,0.08)" }}>
                  <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>{art.name}</span>
                  <div className="flex items-center gap-3">
                    <span style={{ fontSize: "9px", color: "var(--text-muted)" }}>{art.age}</span>
                    <span
                      className="px-1.5 py-0.5 rounded"
                      style={{
                        fontSize: "8px",
                        letterSpacing: "0.5px",
                        color: art.risk === "High" ? "var(--neon-magenta)" : art.risk === "Medium" ? "var(--neon-gold)" : "var(--neon-cyan)",
                        background:
                          art.risk === "High"
                            ? "rgba(244,63,133,0.1)"
                            : art.risk === "Medium"
                              ? "rgba(255,215,0,0.1)"
                              : "rgba(0,240,255,0.1)",
                      }}
                    >
                      {art.risk}
                    </span>
                  </div>
                </div>
              ))
            : (
              <div className="glass-panel-sm px-3 py-2 overflow-hidden">
                <motion.div
                  animate={{ x: [0, -400, 0] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="flex gap-6 whitespace-nowrap"
                  style={{ fontSize: "10px", color: "var(--neon-purple)" }}
                >
                  <span>▸ TEMPORAL FLUX: +4.2%</span>
                  <span>▸ CHRONO-CORE: ONLINE</span>
                  <span>▸ REALITY INDEX: 847.2</span>
                  <span>▸ BRANCH: B-7 PRIMARY</span>
                  <span>▸ SENTINELS: ACTIVE</span>
                  <span>▸ NEURAL NET: STABLE</span>
                </motion.div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
