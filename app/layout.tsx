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
import { Providers } from "../components/Providers";
import { Space_Grotesk, Orbitron } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${spaceGrotesk.variable} ${orbitron.variable}`}>
      <head>
        {/* Preload critical game assets */}
        <link rel="preload" as="image" href="/game/renaissance.png" />
        <link rel="preload" as="image" href="/game/hero.png" />
      </head>
      <body className="antialiased font-sans bg-gray-900 text-white selection:bg-cyan-500/30">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
