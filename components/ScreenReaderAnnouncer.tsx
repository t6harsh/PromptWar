"use client";

import { useChronos } from "../context/ChronosContext";

/**
 * ScreenReaderAnnouncer provides an invisible live region that announces
 * game state changes to assistive technology. This ensures screen reader
 * users receive updates about dialogue, era changes, paradox events, etc.
 */
export default function ScreenReaderAnnouncer() {
  const { currentDialogue, currentScene, isParadoxEvent, butterflyIndex } = useChronos();

  // Derive announcement text directly from state priorities
  // 1. Paradox events (Critical)
  // 2. Era changes (Major navigation)
  // 3. Dialogue (Live updates)
  const announcement = (() => {
    if (isParadoxEvent) {
      return `Warning: Paradox event detected. Butterfly index at ${Math.round(butterflyIndex)} percent.`;
    }
    // We can allow the parent to handle "Era Changed" logic or just announce scene details
    // For a clearer live region, we often just want the *latest* relevant thing.
    // However, without a prop pointing to "last event", derived state can be tricky for transient updates.
    // The previous implementation tried to "catch" changes.
    // A better React pattern for announcers is to have a "status" state in Context,
    // but here we can rely on the fact that these states are mutually exclusive or prioritized.
    
    if (currentDialogue) {
      const speaker = currentDialogue.speaker || "Narrator";
      return `${speaker}: ${currentDialogue.text}`;
    }

    return `Current location: ${currentScene.name}, year ${currentScene.year} AD.`;
  })();

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {announcement}
    </div>
  );
}
