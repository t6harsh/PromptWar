"use client";

import { motion } from "framer-motion";
import TopBar from "../components/TopBar";
import EraView from "../components/EraView";
import TemporalHUD from "../components/TemporalHUD";

export default function Home() {
  return (
    <div
      className="flex flex-col h-screen overflow-hidden relative"
      style={{ background: "var(--chronos-void)" }}
    >
      {/* Background ambient effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Large orbs */}
        <motion.div
          className="absolute"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          style={{
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,240,255,0.04) 0%, transparent 70%)",
            top: "10%",
            left: "30%",
            filter: "blur(60px)",
          }}
        />
        <motion.div
          className="absolute"
          animate={{
            x: [0, -30, 0],
            y: [0, 40, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          style={{
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(168,85,247,0.04) 0%, transparent 70%)",
            bottom: "10%",
            right: "10%",
            filter: "blur(60px)",
          }}
        />
        <motion.div
          className="absolute"
          animate={{
            x: [0, 20, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          style={{
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,215,0,0.03) 0%, transparent 70%)",
            top: "20%",
            left: "5%",
            filter: "blur(50px)",
          }}
        />
      </div>

      {/* Scan lines overlay across entire app */}
      <div
        className="absolute inset-0 pointer-events-none z-50"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,240,255,0.008) 2px, rgba(0,240,255,0.008) 4px)",
        }}
      />

      {/* Top Bar */}
      <TopBar />

      {/* Main Content: 3-panel layout */}
      <div className="flex-1 flex gap-3 p-3 relative z-10 min-h-0">
        {/* Left Panel — THE PAST */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="glass-panel shimmer-border flex-1 overflow-hidden"
          style={{ minWidth: 0 }}
        >
          <EraView era="past" />
        </motion.div>

        {/* Center Panel — TEMPORAL HUD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="glass-panel shimmer-border overflow-hidden"
          style={{ flex: "1.5", minWidth: 0 }}
        >
          <TemporalHUD />
        </motion.div>

        {/* Right Panel — THE FUTURE */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="glass-panel shimmer-border flex-1 overflow-hidden"
          style={{ minWidth: 0 }}
        >
          <EraView era="future" />
        </motion.div>
      </div>

      {/* Bottom status bar */}
      <div
        className="flex items-center justify-between px-6 py-1.5 border-t relative z-10"
        style={{
          background: "rgba(5, 5, 16, 0.8)",
          borderColor: "var(--glass-border)",
        }}
      >
        <div className="flex items-center gap-4">
          <span style={{ fontSize: "9px", color: "var(--text-muted)", letterSpacing: "1.5px" }}>
            CHRONOS ENGINE v4.2.0-ALPHA
          </span>
          <span style={{ fontSize: "9px", color: "var(--neon-cyan-dim)" }}>|</span>
          <span style={{ fontSize: "9px", color: "var(--text-muted)", letterSpacing: "1px" }}>
            GEMINI 3 PRO — DEEP THINK
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span style={{ fontSize: "9px", color: "var(--text-muted)", letterSpacing: "1px" }}>
            GENIE 3 — WORLD MODEL ACTIVE
          </span>
          <span style={{ fontSize: "9px", color: "var(--neon-cyan-dim)" }}>|</span>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--neon-cyan)", boxShadow: "0 0 4px var(--neon-cyan)" }} />
            <span style={{ fontSize: "9px", color: "var(--neon-cyan)", letterSpacing: "1px" }}>
              ALL SYSTEMS NOMINAL
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
