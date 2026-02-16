"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChronos } from "../context/ChronosContext";

/**
 * DialogueBox renders JRPG-style dialogue with typewriter text effect,
 * speaker names, narration style, and branching choice selection.
 * Supports keyboard navigation: Enter/Space to advance, 1-3 to select choices.
 */
function DialogueBox() {
  const { currentDialogue, isDialogueActive, advanceDialogue, selectChoice } = useChronos();
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showFull, setShowFull] = useState(false);

  const text = currentDialogue?.text || "";
  const isNarration = currentDialogue?.isNarration || false;

  // Typewriter effect
  useEffect(() => {
    if (!text) return;
    setDisplayedText("");
    setIsTyping(true);
    setShowFull(false);

    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayedText(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setIsTyping(false);
        setShowFull(true);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [text]);

  /** Handle click to either complete text instantly or advance dialogue */
  const handleClick = useCallback(() => {
    if (isTyping) {
      setDisplayedText(text);
      setIsTyping(false);
      setShowFull(true);
    } else if (!currentDialogue?.choices) {
      advanceDialogue();
    }
  }, [isTyping, text, currentDialogue?.choices, advanceDialogue]);

  /** Handle keyboard navigation */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleClick();
      }
      // Number keys for choices
      if (showFull && currentDialogue?.choices) {
        const num = parseInt(e.key);
        if (num >= 1 && num <= currentDialogue.choices.length) {
          e.preventDefault();
          selectChoice(currentDialogue.choices[num - 1].action);
        }
      }
    },
    [handleClick, showFull, currentDialogue, selectChoice]
  );

  if (!isDialogueActive || !currentDialogue) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        className="dialogue-box"
        role="dialog"
        aria-modal="true"
        aria-label="Game dialogue"
        aria-live="polite"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        style={{
          position: "absolute",
          bottom: "60px",
          left: "5%",
          right: "5%",
          background: "rgba(5,5,16,0.92)",
          border: "1px solid var(--glass-border)",
          borderRadius: "12px",
          padding: "16px 20px",
          backdropFilter: "blur(12px)",
          cursor: "pointer",
          zIndex: 30,
        }}
      >
        {/* Speaker name */}
        {currentDialogue.speaker && (
          <div
            className="dialogue-speaker"
            aria-label={`${currentDialogue.speaker} says`}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "11px",
              letterSpacing: "2px",
              color: "var(--neon-cyan)",
              marginBottom: "6px",
              textTransform: "uppercase",
            }}
          >
            {currentDialogue.speaker}
          </div>
        )}

        {/* Text content */}
        <div
          className="dialogue-text"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "14px",
            lineHeight: 1.6,
            fontStyle: isNarration ? "italic" : "normal",
            color: isNarration ? "var(--text-secondary)" : "var(--text-primary)",
          }}
        >
          {displayedText}
          {isTyping && (
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              aria-hidden="true"
            >
              ▌
            </motion.span>
          )}
        </div>

        {/* Choices */}
        {showFull && currentDialogue.choices && (
          <motion.div
            className="dialogue-choices"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            role="group"
            aria-label="Dialogue choices"
            style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "6px" }}
          >
            {currentDialogue.choices.map((choice, i) => (
              <motion.button
                key={i}
                whileHover={{ x: 4, color: "#00f0ff" }}
                onClick={(e) => {
                  e.stopPropagation();
                  selectChoice(choice.action);
                }}
                aria-label={`Choice ${i + 1}: ${choice.label}`}
                style={{
                  background: "none",
                  border: "none",
                  textAlign: "left",
                  color: "var(--text-secondary)",
                  fontFamily: "var(--font-body)",
                  fontSize: "13px",
                  padding: "6px 10px",
                  cursor: "pointer",
                  borderRadius: "6px",
                  transition: "background 0.2s",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <span style={{ color: "var(--neon-cyan)", marginRight: "8px" }} aria-hidden="true">▸</span>
                <span>{choice.label}</span>
                <span
                  style={{ marginLeft: "auto", fontSize: "10px", color: "var(--text-muted)" }}
                  aria-hidden="true"
                >
                  [{i + 1}]
                </span>
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Advance hint */}
        {showFull && !currentDialogue.choices && (
          <motion.div
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "8px", textAlign: "right" }}
            aria-hidden="true"
          >
            Click or press Enter to continue ▼
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

export default React.memo(DialogueBox);
