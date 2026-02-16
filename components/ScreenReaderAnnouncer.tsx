"use client";

import { useEffect, useState, useRef } from "react";
import { useChronos } from "../context/ChronosContext";

/**
 * ScreenReaderAnnouncer provides an invisible live region that announces
 * game state changes to assistive technology. This ensures screen reader
 * users receive updates about dialogue, era changes, paradox events, etc.
 */
export default function ScreenReaderAnnouncer() {
  const { currentDialogue, currentEra, currentScene, isParadoxEvent, butterflyIndex } = useChronos();
  const [announcement, setAnnouncement] = useState("");
  const prevEra = useRef(currentEra);

  // Announce era changes
  useEffect(() => {
    if (currentEra !== prevEra.current) {
      setAnnouncement(`Traveled to ${currentScene.name}, year ${currentScene.year} AD.`);
      prevEra.current = currentEra;
    }
  }, [currentEra, currentScene]);

  // Announce dialogue lines
  useEffect(() => {
    if (currentDialogue) {
      const speaker = currentDialogue.speaker || "Narrator";
      setAnnouncement(`${speaker}: ${currentDialogue.text}`);
    }
  }, [currentDialogue]);

  // Announce paradox events
  useEffect(() => {
    if (isParadoxEvent) {
      setAnnouncement(`Warning: Paradox event detected. Butterfly index at ${Math.round(butterflyIndex)} percent.`);
    }
  }, [isParadoxEvent, butterflyIndex]);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
      style={{
        position: "absolute",
        width: "1px",
        height: "1px",
        padding: 0,
        margin: "-1px",
        overflow: "hidden",
        clip: "rect(0, 0, 0, 0)",
        whiteSpace: "nowrap",
        borderWidth: 0,
      }}
    >
      {announcement}
    </div>
  );
}
