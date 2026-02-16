"use client";

import { motion } from "framer-motion";

export default function ChronosLogo({ size = 40 }: { size?: number }) {
  const scale = size / 40;

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      whileHover={{ scale: 1.1 }}
      style={{ filter: "drop-shadow(0 0 8px rgba(0, 240, 255, 0.5))" }}
    >
      {/* Outer glow ring */}
      <motion.circle
        cx="20"
        cy="20"
        r="18"
        stroke="url(#glowGrad)"
        strokeWidth="0.5"
        fill="none"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "center" }}
      />

      {/* Hourglass body - top */}
      <path
        d="M12 6 L28 6 L20 18 Z"
        fill="none"
        stroke="url(#hourglassGrad)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* Hourglass body - bottom */}
      <path
        d="M12 34 L28 34 L20 22 Z"
        fill="none"
        stroke="url(#hourglassGrad)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* Fracture line */}
      <motion.line
        x1="14"
        y1="20"
        x2="26"
        y2="20"
        stroke="#00f0ff"
        strokeWidth="2"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />

      {/* Core energy */}
      <motion.circle
        cx="20"
        cy="20"
        r="3"
        fill="#00f0ff"
        animate={{
          r: [2.5, 3.5, 2.5],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ filter: "blur(1px)" }}
      />
      <circle cx="20" cy="20" r="1.5" fill="white" opacity="0.9" />

      {/* Sand/data particles falling */}
      {[0, 1, 2].map((i) => (
        <motion.circle
          key={`sand-${i}`}
          cx={18 + i * 2}
          cy={24}
          r="0.5"
          fill="#00f0ff"
          animate={{
            cy: [23, 30],
            opacity: [1, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        />
      ))}

      {/* Fracture cracks */}
      <motion.path
        d="M17 16 L15 13"
        stroke="#a855f7"
        strokeWidth="0.5"
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
      />
      <motion.path
        d="M23 16 L25 13"
        stroke="#a855f7"
        strokeWidth="0.5"
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
      />

      {/* Gradients */}
      <defs>
        <linearGradient id="hourglassGrad" x1="12" y1="6" x2="28" y2="34">
          <stop offset="0%" stopColor="#ffd700" />
          <stop offset="50%" stopColor="#00f0ff" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
        <linearGradient id="glowGrad" x1="0" y1="0" x2="40" y2="40">
          <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.5" />
          <stop offset="50%" stopColor="#a855f7" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.5" />
        </linearGradient>
      </defs>
    </motion.svg>
  );
}
