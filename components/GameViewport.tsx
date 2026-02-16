"use client";

import React, { useState, useMemo, useCallback } from "react";
import { m as motion, AnimatePresence } from "framer-motion";
import { useChronos } from "../context/ChronosContext";
import Image from "next/image";

/** Deterministic particle sizes (avoids Math.random SSR hydration mismatch) */
const PARTICLE_SIZES = [5, 2, 3, 4, 3, 5];

/**
 * GameViewport renders the main game scene with pixel art backgrounds,
 * hero sprite, interactive NPCs and hotspots, ambient particles,
 * and visual effects for transitions and paradox events.
 */
function GameViewport() {
  const {
    currentScene,
    isTransitioning,
    isParadoxEvent,
    isRecalculating,
    interactWithNPC,
    interactWithHotspot,
    isDialogueActive,
  } = useChronos();

  const [hoveredHotspot, setHoveredHotspot] = useState<string | null>(null);
  const [hoveredNPC, setHoveredNPC] = useState<string | null>(null);

  /** Memoize particle config to avoid recalculation */
  const particles = useMemo(() =>
    PARTICLE_SIZES.map((size, i) => ({
      size,
      left: `${15 + i * 14}%`,
      top: `${40 + (i % 3) * 15}%`,
      duration: 3 + i * 0.5,
      delay: i * 0.8,
      xDir: i % 2 ? 10 : -10,
    })),
    []
  );

  const handleNPCClick = useCallback(
    (npcId: string) => { if (!isDialogueActive) interactWithNPC(npcId); },
    [isDialogueActive, interactWithNPC]
  );

  const handleHotspotClick = useCallback(
    (hotspotId: string) => { if (!isDialogueActive) interactWithHotspot(hotspotId); },
    [isDialogueActive, interactWithHotspot]
  );

  return (
    <div
      className="relative w-full h-full overflow-hidden rounded-xl"
      style={{ background: "var(--chronos-void)" }}
      role="main"
      aria-label={`Game scene: ${currentScene.name}, year ${currentScene.year}`}
    >
      {/* Scene transition overlay */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 z-50"
            style={{
              background: "radial-gradient(circle, rgba(0,240,255,0.8) 0%, rgba(168,85,247,0.6) 40%, white 100%)",
            }}
            role="alert"
            aria-label="Traveling through time..."
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360, scale: [1, 1.5, 1] }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                style={{
                  width: 80, height: 80,
                  border: "3px solid rgba(255,255,255,0.8)",
                  borderTop: "3px solid transparent",
                  borderRadius: "50%",
                }}
                aria-hidden="true"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Paradox glitch overlay */}
      <AnimatePresence>
        {isParadoxEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 pointer-events-none"
            style={{ animation: "paradox-fracture 0.15s infinite" }}
            role="alert"
            aria-label="Paradox event in progress"
          >
            <div className="absolute inset-0" style={{ background: "rgba(244,63,133,0.12)", mixBlendMode: "screen" }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recalculating shimmer */}
      <AnimatePresence>
        {isRecalculating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-35 pointer-events-none"
            style={{
              background: "linear-gradient(90deg, transparent 0%, rgba(0,240,255,0.06) 50%, transparent 100%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 1.5s linear infinite",
            }}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Background Image */}
      <motion.div
        key={currentScene.id}
        initial={{ scale: 1.05, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0"
      >
        <Image
          src={currentScene.background}
          alt={`${currentScene.name} — ${currentScene.description}`}
          fill
          priority
          style={{ objectFit: "cover" }}
          sizes="(max-width: 1200px) 100vw, 70vw"
        />
        {/* Dark gradient overlay at bottom for readability */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, transparent 40%, rgba(5,5,16,0.4) 70%, rgba(5,5,16,0.8) 100%)",
          }}
          aria-hidden="true"
        />
      </motion.div>

      {/* Ambient particles */}
      <div className="absolute inset-0 pointer-events-none z-10" aria-hidden="true">
        {particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            animate={{
              y: [0, -30, 0],
              x: [0, p.xDir, 0],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
            }}
            style={{
              width: `${p.size}px`,
              height: `${p.size}px`,
              left: p.left,
              top: p.top,
              background: currentScene.ambience === "neon" ? "var(--neon-purple)" : "var(--neon-gold)",
              boxShadow: `0 0 6px ${currentScene.ambience === "neon" ? "var(--neon-purple)" : "var(--neon-gold)"}`,
            }}
          />
        ))}
      </div>

      {/* Clickable Hotspots */}
      {currentScene.hotspots.map((hotspot) => (
        <motion.div
          key={hotspot.id}
          className="absolute z-20 cursor-pointer"
          style={{
            left: `${hotspot.x}%`,
            top: `${hotspot.y}%`,
            width: `${hotspot.width}%`,
            height: `${hotspot.height}%`,
          }}
          onMouseEnter={() => setHoveredHotspot(hotspot.id)}
          onMouseLeave={() => setHoveredHotspot(null)}
          onClick={() => handleHotspotClick(hotspot.id)}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleHotspotClick(hotspot.id); } }}
          whileHover={{ scale: 1.02 }}
          role="button"
          tabIndex={isDialogueActive ? -1 : 0}
          aria-label={`Examine ${hotspot.label}`}
        >
          {/* Hotspot highlight border */}
          <motion.div
            className="absolute inset-0 rounded-lg"
            animate={hoveredHotspot === hotspot.id ? { opacity: 1 } : { opacity: 0 }}
            style={{
              border: "2px solid rgba(0,240,255,0.5)",
              background: "rgba(0,240,255,0.08)",
              boxShadow: "0 0 15px rgba(0,240,255,0.2)",
            }}
            aria-hidden="true"
          />
          {/* Label tooltip */}
          <AnimatePresence>
            {hoveredHotspot === hotspot.id && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 rounded-full"
                style={{
                  background: "rgba(5,5,16,0.9)",
                  border: "1px solid var(--neon-cyan)",
                  fontSize: "11px",
                  color: "var(--neon-cyan)",
                  fontFamily: "var(--font-body)",
                  boxShadow: "0 0 10px rgba(0,240,255,0.3)",
                }}
                role="tooltip"
                aria-hidden="true"
              >
                {hotspot.label}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}

      {/* NPCs */}
      {currentScene.npcs.map((npc) => (
        <motion.div
          key={npc.id}
          className="absolute z-20 cursor-pointer"
          style={{
            left: `${npc.x}%`,
            top: `${npc.y}%`,
            transform: "translate(-50%, -50%)",
          }}
          onMouseEnter={() => setHoveredNPC(npc.id)}
          onMouseLeave={() => setHoveredNPC(null)}
          onClick={() => handleNPCClick(npc.id)}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleNPCClick(npc.id); } }}
          role="button"
          tabIndex={isDialogueActive ? -1 : 0}
          aria-label={`Talk to ${npc.name}`}
        >
          {/* NPC indicator */}
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center"
          >
            <motion.div
              className="w-6 h-6 rounded-full flex items-center justify-center"
              animate={hoveredNPC === npc.id ? { scale: 1.2, boxShadow: "0 0 15px var(--neon-cyan)" } : {}}
              style={{
                background: "rgba(0,240,255,0.2)",
                border: "2px solid var(--neon-cyan)",
                boxShadow: "0 0 8px rgba(0,240,255,0.3)",
              }}
            >
              <span style={{ fontSize: "10px" }} aria-hidden="true">💬</span>
            </motion.div>
            <AnimatePresence>
              {hoveredNPC === npc.id && (
                <motion.span
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-1 px-2 py-0.5 rounded"
                  style={{
                    background: "rgba(5,5,16,0.9)",
                    border: "1px solid var(--neon-cyan)",
                    fontSize: "10px",
                    color: "var(--neon-cyan)",
                    whiteSpace: "nowrap",
                  }}
                  role="tooltip"
                  aria-hidden="true"
                >
                  {npc.name}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      ))}

      {/* Hero sprite */}
      <motion.div
        className="absolute z-15"
        style={{
          bottom: "15%",
          left: "25%",
          width: "80px",
          height: "100px",
        }}
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      >
        <Image
          src="/game/hero.png"
          alt="Time traveler hero character"
          width={80}
          height={100}
          style={{ objectFit: "contain", filter: "drop-shadow(0 0 8px rgba(0,240,255,0.4))" }}
          priority
        />
      </motion.div>

      {/* Scene name badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute top-4 left-1/2 -translate-x-1/2 z-20 px-4 py-1.5 rounded-full"
        style={{
          background: "rgba(5,5,16,0.8)",
          border: "1px solid var(--glass-border)",
          backdropFilter: "blur(10px)",
        }}
        aria-hidden="true"
      >
        <span style={{ fontFamily: "var(--font-display)", fontSize: "11px", letterSpacing: "3px", color: "var(--neon-cyan)" }}>
          {currentScene.name.toUpperCase()}
        </span>
        <span style={{ fontSize: "10px", color: "var(--text-muted)", marginLeft: "8px" }}>
          {currentScene.year} AD
        </span>
      </motion.div>
    </div>
  );
}

export default React.memo(GameViewport);
