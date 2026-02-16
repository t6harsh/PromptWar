"use client";

import dynamic from "next/dynamic";
import { ChronosProvider } from "../context/ChronosContext";
import GameHUD from "../components/GameHUD";
import DialogueBox from "../components/DialogueBox";
import ActionMenu from "../components/ActionMenu";
import ErrorBoundary from "../components/ErrorBoundary";
import ScreenReaderAnnouncer from "../components/ScreenReaderAnnouncer";

/**
 * Lazy-load heavy components to improve initial bundle size and load time.
 * GameViewport and TimelineSidebar contain the most visual assets.
 */
const GameViewport = dynamic(() => import("../components/GameViewport"), {
  ssr: false,
  loading: () => (
    <div
      className="flex items-center justify-center w-full h-full"
      style={{ background: "var(--chronos-void)" }}
      role="status"
      aria-label="Loading game scene"
    >
      <div style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)", fontSize: "13px" }}>
        Loading temporal matrix...
      </div>
    </div>
  ),
});

const TimelineSidebar = dynamic(() => import("../components/TimelineSidebar"), {
  ssr: false,
  loading: () => (
    <div
      style={{ width: "220px", background: "rgba(5,5,16,0.85)" }}
      role="status"
      aria-label="Loading timeline"
    />
  ),
});

/**
 * Main game page for Chronos Paradox.
 * Assembles the game layout: HUD (top), TimelineSidebar (left),
 * GameViewport with DialogueBox overlay (center), ActionMenu (bottom).
 */
export default function Home() {
  return (
    <ErrorBoundary>
      <ChronosProvider>
        {/* Skip to main content link for keyboard users */}
        <a
          href="#game-viewport"
          className="sr-only"
          style={{
            position: "absolute",
            left: "-9999px",
            top: "auto",
            width: "1px",
            height: "1px",
            overflow: "hidden",
            zIndex: 9999,
          }}
          onFocus={(e) => {
            const el = e.currentTarget;
            el.style.position = "fixed";
            el.style.left = "50%";
            el.style.top = "10px";
            el.style.transform = "translateX(-50%)";
            el.style.width = "auto";
            el.style.height = "auto";
            el.style.overflow = "visible";
            el.style.padding = "8px 16px";
            el.style.background = "var(--chronos-deep)";
            el.style.color = "var(--neon-cyan)";
            el.style.border = "1px solid var(--neon-cyan)";
            el.style.borderRadius = "6px";
            el.style.fontFamily = "var(--font-body)";
            el.style.fontSize = "13px";
          }}
          onBlur={(e) => {
            const el = e.currentTarget;
            el.style.position = "absolute";
            el.style.left = "-9999px";
            el.style.width = "1px";
            el.style.height = "1px";
          }}
        >
          Skip to game viewport
        </a>

        {/* Screen reader announcer */}
        <ScreenReaderAnnouncer />

        <div
          className="flex flex-col h-screen"
          style={{
            background: "var(--chronos-void)",
            color: "var(--text-primary)",
            overflow: "hidden",
          }}
        >
          {/* Top: Game HUD */}
          <GameHUD />

          {/* Main content */}
          <div className="flex flex-1 overflow-hidden">
            {/* Left: Timeline */}
            <TimelineSidebar />

            {/* Center: Game Viewport */}
            <div className="flex flex-col flex-1 overflow-hidden">
              <div
                id="game-viewport"
                className="relative flex-1 overflow-hidden"
                tabIndex={-1}
              >
                <GameViewport />
                <DialogueBox />
              </div>

              {/* Bottom: Action Menu */}
              <ActionMenu />
            </div>
          </div>
        </div>
      </ChronosProvider>
    </ErrorBoundary>
  );
}
