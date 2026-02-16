"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import ChronosLogo from "./ChronosLogo";

export default function TopBar() {
  const [time, setTime] = useState("");
  const [gameTime, setGameTime] = useState("Cycle 1 — Day 47");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="flex items-center justify-between px-6 py-2.5 border-b"
      style={{
        background: "rgba(5, 5, 16, 0.9)",
        backdropFilter: "blur(20px)",
        borderColor: "var(--glass-border)",
      }}
    >
      {/* Left: Logo + Title */}
      <div className="flex items-center gap-3">
        <ChronosLogo size={32} />
        <div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "14px",
              fontWeight: 700,
              letterSpacing: "4px",
              color: "var(--text-primary)",
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            CHRONOS PARADOX
          </h1>
          <span
            style={{
              fontSize: "9px",
              letterSpacing: "2px",
              color: "var(--neon-cyan-dim)",
            }}
          >
            TEMPORAL COMMAND CENTER
          </span>
        </div>
      </div>

      {/* Center: Status indicators */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="glow-dot" />
          <span style={{ fontSize: "10px", color: "var(--text-secondary)", letterSpacing: "1px" }}>ONLINE</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="glow-dot-gold" />
          <span style={{ fontSize: "10px", color: "var(--text-secondary)", letterSpacing: "1px" }}>{gameTime}</span>
        </div>
      </div>

      {/* Right: Time + Avatar */}
      <div className="flex items-center gap-4">
        <div className="text-right">
          <div style={{ fontFamily: "var(--font-display)", fontSize: "13px", color: "var(--neon-cyan)", letterSpacing: "2px" }}>
            {time}
          </div>
          <div style={{ fontSize: "9px", color: "var(--text-muted)", letterSpacing: "1px" }}>REAL TIME</div>
        </div>
        <motion.div
          whileHover={{ scale: 1.1, boxShadow: "0 0 15px var(--neon-purple)" }}
          className="relative"
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, var(--neon-cyan), var(--neon-purple))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--chronos-void)" }}>V</span>
          <div
            className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full"
            style={{
              background: "var(--neon-cyan)",
              border: "2px solid var(--chronos-void)",
              boxShadow: "0 0 4px var(--neon-cyan)",
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}
