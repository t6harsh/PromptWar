import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chronos Paradox — Temporal Command Center",
  description:
    "An AI-native Temporal Command Center. Interact with a living timeline, make choices that ripple through history, and watch the future transform in real-time.",
  keywords: ["chronos", "paradox", "temporal", "AI", "game", "timeline"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Orbitron:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
