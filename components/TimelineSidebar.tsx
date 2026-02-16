"use client";

import React, { useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChronos } from "../context/ChronosContext";

/** Mapping from timeline node era names to scene IDs */
const eraToSceneId: Record<string, string> = {
  "Renaissance": "renaissance",
  "Cyberpunk": "cyberpunk",
};

/**
 * Color mapping for timeline node status indicators.
 * @param status - Node status (stable, shifting, paradox)
 * @returns CSS color string
 */
function getNodeColor(status: string): string {
  switch (status) {
    case "stable": return "var(--neon-cyan)";
    case "shifting": return "var(--neon-gold)";
    case "paradox": return "var(--neon-pink)";
    default: return "var(--text-muted)";
  }
}

/**
 * TimelineSidebar displays a compact vertical timeline with clickable era nodes,
 * a butterfly paradox meter, and a scrolling echo log.
 * Supports keyboard navigation for era travel.
 */
function TimelineSidebar() {
  const {
    timelineNodes,
    currentEra,
    butterflyIndex,
    echoMessages,
    travelToEra,
  } = useChronos();

  /**
   * Check if a timeline node era matches the current scene era.
   * @param nodeEra - Era name from timeline node
   */
  const isCurrentEra = useCallback(
    (nodeEra: string) => eraToSceneId[nodeEra] === currentEra,
    [currentEra]
  );

  /** Memoize butterfly bar color */
  const butterflyColor = useMemo(() =>
    butterflyIndex > 70 ? "var(--neon-pink)" : butterflyIndex > 40 ? "var(--neon-gold)" : "var(--neon-cyan)",
    [butterflyIndex]
  );

  return (
    <aside
      className="flex flex-col h-full"
      style={{
        width: "220px",
        background: "rgba(5,5,16,0.85)",
        borderRight: "1px solid var(--glass-border)",
        backdropFilter: "blur(12px)",
        overflow: "hidden",
      }}
      role="navigation"
      aria-label="Timeline navigation"
    >
      {/* Header */}
      <div className="px-3 py-2" style={{ borderBottom: "1px solid var(--glass-border)" }}>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "10px",
            letterSpacing: "3px",
            color: "var(--neon-cyan)",
            margin: 0,
          }}
        >
          TIMELINE
        </h2>
      </div>

      {/* Timeline nodes */}
      <div className="flex-1 overflow-y-auto px-3 py-2" style={{ scrollbarWidth: "thin" }} role="list" aria-label="Era timeline nodes">
        <div className="relative">
          {/* Connecting line */}
          <div
            className="absolute left-[9px] top-0 bottom-0 w-px"
            style={{ background: "var(--glass-border)" }}
            aria-hidden="true"
          />

          {timelineNodes.map((node, i) => {
            const color = getNodeColor(node.status);
            const isCurrent = isCurrentEra(node.era);
            const canTravel = node.unlocked && eraToSceneId[node.era] && !isCurrent;

            return (
              <motion.div
                key={node.id}
                className="relative flex items-start gap-2 py-1.5"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => canTravel && travelToEra(eraToSceneId[node.era])}
                onKeyDown={(e) => { if ((e.key === "Enter" || e.key === " ") && canTravel) { e.preventDefault(); travelToEra(eraToSceneId[node.era]); } }}
                style={{ cursor: canTravel ? "pointer" : "default" }}
                role="listitem"
                tabIndex={canTravel ? 0 : -1}
                aria-label={`${node.label}, ${node.year} AD, ${node.era}. Status: ${node.status}. ${isCurrent ? "Current location." : ""} ${canTravel ? "Press Enter to travel." : node.unlocked ? "" : "Locked."}`}
                aria-current={isCurrent ? "location" : undefined}
              >
                {/* Node dot */}
                <motion.div
                  className="relative z-10 flex-shrink-0"
                  animate={isCurrent ? { scale: [1, 1.3, 1], boxShadow: [`0 0 0px ${color}`, `0 0 12px ${color}`, `0 0 0px ${color}`] } : {}}
                  transition={isCurrent ? { duration: 2, repeat: Infinity } : {}}
                >
                  <div
                    className="w-[18px] h-[18px] rounded-full flex items-center justify-center"
                    style={{
                      background: isCurrent ? color : "var(--chronos-deep)",
                      border: `2px solid ${color}`,
                      boxShadow: `0 0 6px ${color}40`,
                    }}
                    aria-hidden="true"
                  >
                    {!node.unlocked && (
                      <span style={{ fontSize: "8px" }}>🔒</span>
                    )}
                  </div>
                </motion.div>

                {/* Node info */}
                <div className="flex-1 min-w-0">
                  <div
                    style={{
                      fontSize: "10px",
                      fontFamily: "var(--font-body)",
                      color: isCurrent ? color : node.unlocked ? "var(--text-primary)" : "var(--text-muted)",
                      fontWeight: isCurrent ? 600 : 400,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {node.label}
                  </div>
                  <div style={{ fontSize: "8px", color: "var(--text-muted)", letterSpacing: "1px" }}>
                    {node.year} AD • {node.era}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Butterfly Meter */}
      <div className="px-3 py-2" style={{ borderTop: "1px solid var(--glass-border)" }}>
        <div className="flex items-center justify-between mb-1">
          <span style={{ fontSize: "9px", color: "var(--text-muted)", letterSpacing: "1px" }}>PARADOX INDEX</span>
          <span style={{ fontSize: "9px", fontFamily: "var(--font-display)", color: butterflyColor }}>
            {Math.round(butterflyIndex)}%
          </span>
        </div>
        <div
          className="relative w-full h-1.5 rounded-full overflow-hidden"
          style={{ background: "var(--chronos-deep)" }}
          role="progressbar"
          aria-label="Paradox index"
          aria-valuenow={Math.round(butterflyIndex)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full"
            animate={{ width: `${butterflyIndex}%` }}
            transition={{ type: "spring", stiffness: 100 }}
            style={{ background: butterflyColor }}
          />
        </div>
      </div>

      {/* Echo Log */}
      <div
        className="px-3 py-2"
        style={{ borderTop: "1px solid var(--glass-border)", maxHeight: "120px", overflowY: "auto", scrollbarWidth: "thin" }}
        role="log"
        aria-label="Game event log"
        aria-live="polite"
      >
        <div style={{ fontSize: "9px", color: "var(--text-muted)", letterSpacing: "1px", marginBottom: "4px" }}>ECHO LOG</div>
        <AnimatePresence mode="popLayout">
          {echoMessages.map((msg, i) => (
            <motion.div
              key={`${i}-${msg.slice(0, 20)}`}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: i === echoMessages.length - 1 ? 1 : 0.5, y: 0 }}
              style={{
                fontSize: "9px",
                color: "var(--text-muted)",
                fontFamily: "var(--font-body)",
                padding: "1px 0",
                lineHeight: "1.3",
              }}
            >
              {msg}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </aside>
  );
}

export default React.memo(TimelineSidebar);
