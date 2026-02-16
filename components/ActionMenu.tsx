"use client";

import React, { useState, useCallback, useRef } from "react";
import { m as motion } from "framer-motion";
import { useChronos } from "../context/ChronosContext";

/** Action configuration for menu buttons */
interface ActionConfig {
  type: "act" | "observe" | "temporal";
  icon: string;
  label: string;
  color: string;
  desc: string;
  shortcut: string;
}

/**
 * ActionMenu renders the game's action buttons (Act, Observe, Temporal)
 * and a custom command input. Supports keyboard shortcuts (1/2/3)
 * and disables during active dialogue or recalculation.
 */
function ActionMenu() {
  const { performAction, isDialogueActive, isRecalculating, temporalEnergy } = useChronos();
  const [customCmd, setCustomCmd] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const disabled = isDialogueActive || isRecalculating;

  const actions: ActionConfig[] = [
    { type: "act", icon: "⚔", label: "Act", color: "var(--neon-gold)", desc: "Take action in this era", shortcut: "1" },
    { type: "observe", icon: "👁", label: "Observe", color: "var(--neon-cyan)", desc: "Study your surroundings", shortcut: "2" },
    { type: "temporal", icon: "🔮", label: "Temporal", color: "var(--neon-purple)", desc: `Use time powers (${temporalEnergy < 15 ? "LOW" : "Ready"})`, shortcut: "3" },
  ];

  /** Handle custom command submission */
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (customCmd.trim() && !disabled) {
      performAction("custom", customCmd.trim());
      setCustomCmd("");
    }
  }, [customCmd, disabled, performAction]);

  return (
    <nav
      className="flex items-center gap-2 px-3 py-2"
      role="toolbar"
      aria-label="Game actions"
      style={{
        background: "rgba(5,5,16,0.85)",
        borderTop: "1px solid var(--glass-border)",
        backdropFilter: "blur(10px)",
      }}
    >
      {/* Action buttons */}
      {actions.map((action) => (
        <motion.button
          key={action.type}
          disabled={disabled || (action.type === "temporal" && temporalEnergy < 15)}
          onClick={() => performAction(action.type)}
          whileHover={!disabled ? { scale: 1.05, y: -1 } : {}}
          whileTap={!disabled ? { scale: 0.95 } : {}}
          className="action-btn"
          role="button"
          aria-label={`${action.label}: ${action.desc}. Press ${action.shortcut}`}
          aria-disabled={disabled || (action.type === "temporal" && temporalEnergy < 15)}
          title={`${action.desc} [${action.shortcut}]`}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 14px",
            background: "rgba(255,255,255,0.04)",
            border: `1px solid ${disabled ? "rgba(255,255,255,0.08)" : action.color}40`,
            borderRadius: "8px",
            color: disabled ? "var(--text-muted)" : action.color,
            fontFamily: "var(--font-body)",
            fontSize: "12px",
            cursor: disabled ? "not-allowed" : "pointer",
            opacity: disabled ? 0.5 : 1,
            transition: "all 0.2s",
          }}
        >
          <span style={{ fontSize: "16px" }} aria-hidden="true">{action.icon}</span>
          <span className="action-label">{action.label}</span>
        </motion.button>
      ))}

      {/* Divider */}
      <div style={{ width: "1px", height: "24px", background: "var(--glass-border)", margin: "0 4px" }} aria-hidden="true" />

      {/* Custom command */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 flex-1" role="search" aria-label="Custom command">
        <input
          ref={inputRef}
          type="text"
          value={customCmd}
          onChange={(e) => setCustomCmd(e.target.value)}
          placeholder="Custom command..."
          disabled={disabled}
          aria-label="Enter a custom temporal command"
          maxLength={500}
          autoComplete="off"
          style={{
            flex: 1,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid var(--glass-border)",
            borderRadius: "6px",
            padding: "5px 10px",
            color: "var(--text-primary)",
            fontFamily: "var(--font-body)",
            fontSize: "12px",
            outline: "none",
          }}
        />
        <motion.button
          type="submit"
          disabled={disabled || !customCmd.trim()}
          whileHover={!disabled ? { scale: 1.05 } : {}}
          aria-label="Submit custom command"
          style={{
            padding: "5px 12px",
            background: "rgba(0,240,255,0.1)",
            border: "1px solid var(--neon-cyan)40",
            borderRadius: "6px",
            color: "var(--neon-cyan)",
            fontSize: "12px",
            cursor: disabled ? "not-allowed" : "pointer",
            opacity: disabled || !customCmd.trim() ? 0.5 : 1,
          }}
        >
          ⏎
        </motion.button>
      </form>
    </nav>
  );
}

export default React.memo(ActionMenu);
