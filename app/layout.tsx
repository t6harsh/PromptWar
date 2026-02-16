import type { Metadata, Viewport } from "next";
import "./globals.css";

/** SEO and social metadata for the Chronos Paradox game */
export const metadata: Metadata = {
  title: "Chronos Paradox — Temporal Command Center",
  description:
    "An AI-native JRPG where your choices ripple through history. Interact with a living timeline, make decisions that alter the future, and battle temporal paradoxes in real-time.",
  keywords: ["chronos", "paradox", "temporal", "AI", "JRPG", "game", "timeline", "interactive fiction"],
  authors: [{ name: "Team Chronos" }],
  openGraph: {
    title: "Chronos Paradox — Temporal Command Center",
    description: "An AI-native JRPG where your choices ripple through history.",
    type: "website",
  },
};

/** Viewport and theme configuration */
export const viewport: Viewport = {
  themeColor: "#050510",
  width: "device-width",
  initialScale: 1,
};

/**
 * Root layout for the Chronos Paradox application.
 * Sets up HTML structure, fonts, and global styles.
 */
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
        {/* Preload critical game assets */}
        <link rel="preload" as="image" href="/game/renaissance.png" />
        <link rel="preload" as="image" href="/game/hero.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
