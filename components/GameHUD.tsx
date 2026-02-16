"use client";

import React, { useMemo } from "react";
import { m as motion } from "framer-motion";
import { useChronos } from "../context/ChronosContext";

/**
 * GameHUD displays the top bar with player stats, era info, and inventory.
 * Shows animated HP and Temporal Energy bars, current location/year,
 * Butterfly Index percentage, and inventory count.
 */
function GameHUD() {
  const {
    playerHP,
    maxHP,
    temporalEnergy,
    maxEnergy,
    currentScene,
    butterflyIndex,
    totalActions,
    inventory,
    backendOnline,
  } = useChronos();

  const hpPercent = useMemo(() => Math.round((playerHP / maxHP) * 100), [playerHP, maxHP]);
  const energyPercent = useMemo(() => Math.round((temporalEnergy / maxEnergy) * 100), [temporalEnergy, maxEnergy]);
  const hpColor = useMemo(() =>
    hpPercent > 60 ? "#39d98a" : hpPercent > 30 ? "#fdcb6e" : "#f43f85",
    [hpPercent]
  );

  return (
    <header
      role="banner"
      aria-label="Game status bar"
      className="flex items-center justify-between px-4 py-2"
      style={{
        background: "rgba(5,5,16,0.85)",
        borderBottom: "1px solid var(--glass-border)",
        backdropFilter: "blur(12px)",
        minHeight: 42,
      }}
    >
      {/* Left: HP + Energy */}
      <div className="flex items-center gap-4" role="group" aria-label="Player stats">
        {/* HP Bar */}
        <div className="flex items-center gap-2">
          <span style={{ fontSize: "11px", color: "var(--text-muted)" }} aria-hidden="true">❤</span>
          <div
            className="relative"
            style={{ width: "80px", height: "8px" }}
            role="progressbar"
            aria-label="Player health"
            aria-valuenow={hpPercent}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div className="absolute inset-0 rounded-full" style={{ background: "var(--chronos-deep)" }} />
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              animate={{ width: `${hpPercent}%` }}
              transition={{ type: "spring", stiffness: 120 }}
              style={{
                background: `linear-gradient(90deg, ${hpColor}, ${hpColor})`,
              }}
            />
          </div>
          <span style={{ fontSize: "10px", color: "var(--text-muted)", fontFamily: "var(--font-body)", minWidth: "28px" }}>
            {playerHP}
          </span>
        </div>

        {/* Energy Bar */}
        <div className="flex items-center gap-2">
          <span style={{ fontSize: "11px", color: "var(--text-muted)" }} aria-hidden="true">⚡</span>
          <div
            className="relative"
            style={{ width: "80px", height: "8px" }}
            role="progressbar"
            aria-label="Temporal energy"
            aria-valuenow={energyPercent}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div className="absolute inset-0 rounded-full" style={{ background: "var(--chronos-deep)" }} />
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              animate={{ width: `${energyPercent}%` }}
              transition={{ type: "spring", stiffness: 120 }}
              style={{
                background: "linear-gradient(90deg, var(--neon-cyan), var(--neon-purple))",
              }}
            />
          </div>
          <span style={{ fontSize: "10px", color: "var(--text-muted)", fontFamily: "var(--font-body)", minWidth: "28px" }}>
            {temporalEnergy}
          </span>
        </div>
      </div>

      {/* Center: Era + Location */}
      <div className="flex items-center gap-3" role="group" aria-label="Current location">
        {/* Backend status indicator */}
        <div
          className="w-2 h-2 rounded-full"
          style={{
            background: backendOnline ? "#39d98a" : "#f43f85",
            boxShadow: `0 0 6px ${backendOnline ? "#39d98a" : "#f43f85"}`,
          }}
          role="status"
          aria-label={backendOnline ? "Backend online" : "Backend offline — using local mode"}
          title={backendOnline ? "Backend online" : "Offline mode"}
        />
        <div className="text-center">
          <div style={{ fontFamily: "var(--font-display)", fontSize: "11px", letterSpacing: "3px", color: "var(--neon-cyan)" }}>
            {currentScene.name.toUpperCase()}
          </div>
          <div style={{ fontSize: "9px", color: "var(--text-muted)", letterSpacing: "1px" }}>
            {currentScene.year} AD • ACTIONS: {totalActions}
          </div>
        </div>
      </div>

      {/* Right: Butterfly Index + Inventory */}
      <div className="flex items-center gap-4" role="group" aria-label="Game metrics">
        {/* Butterfly Index */}
        <div className="flex items-center gap-2">
          <span style={{ fontSize: "11px" }} aria-hidden="true">🦋</span>
          <div className="text-right">
            <div
              style={{ fontSize: "11px", fontFamily: "var(--font-display)", color: "var(--neon-purple)", letterSpacing: "1px" }}
              aria-label={`Butterfly index ${Math.round(butterflyIndex)} percent`}
            >
              {Math.round(butterflyIndex)}%
            </div>
            <div style={{ fontSize: "8px", color: "var(--text-muted)", letterSpacing: "1px" }}>PARADOX</div>
          </div>
        </div>

        {/* Inventory */}
        <div
          className="flex items-center gap-1 px-2 py-1 rounded-lg"
          style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.2)" }}
          aria-label={`Inventory: ${inventory.length} items`}
        >
          <span style={{ fontSize: "11px" }} aria-hidden="true">🎒</span>
          <span style={{ fontSize: "10px", color: "var(--neon-purple)", fontFamily: "var(--font-body)" }}>
            {inventory.length}
          </span>
        </div>
      </div>
    </header>
  );
}

export default React.memo(GameHUD);
