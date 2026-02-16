# Chronos Paradox — Temporal Command Center

> **"Interact with a living timeline, make choices that ripple through history, and watch the future transform in real-time."**

## Overview

**Chronos Paradox** is a 2026 AI-native web application that evolves the classic JRPG concept into a high-tech **Temporal Command Center**. Instead of just playing through a pre-written story, users interact with a "living timeline" rendered via **Genie 3** world models.

The application leverages **Google Gemini 3's 1M+ context window** to track the "Butterfly Effect" of every decision in real-time. An action taken in the past (e.g., saving a key historical figure) instantly triggers a procedural shift in the future era’s architecture, politics, and environment, creating a truly dynamic narrative experience.

## Inspiration

> **"What if the timeline didn't just branch, but *rewrote* itself?"**

This project draws heavy inspiration from the pixel time-hop classic, **Chrono Trigger**, specifically its intricate cause-and-effect mechanics spanning multiple eras.

Our goal was to modernize this beloved concept using generative AI. We wanted to move beyond the constraints of static game assets and 16-bit sprites, creating a world where:
-   **The World is Alive:** Genie 3 generates the visual reality of the future based on the specific chaotic variables introduced in the past.
-   **The Story Defines Itself:** Gemini 3 analyzes the entire history of user actions to generate consistent, logical, yet surprising outcomes.
-   **You Are The Operator:** The interface mimics a futuristic command terminal, putting you in direct control of the flow of time.

## Core Features

### 🌟 Living Timeline System
- **Real-Time Causality:** Changes made in the *Past Era* (e.g., 1432 AD Renaissance) propagate instantly to the *Future Era* (e.g., 2847 AD Cyberpunk).
- **Butterfly Effect Simulation:** Small alterations can lead to massive divergences, tracked via the **Paradox Index**.
- **Dynamic Stability:** Manage "Historical Stability" to prevent catastrophic timeline collapse.

### 🧠 AI-Native World Generation
- **Gemini 3 Pro Integration:** Generates narrative text, historical logs, and news feeds on the fly based on current timeline state.
- **Genie 3 World Model:** Simulates the visual and structural consequences of timeline shifts (e.g., a steampunk future vs. a cyberpunk future).
- **Echo Feed:** A real-time log of temporal anomalies and system status.

### 🎮 Immersive Interface
- **Temporal HUD:** A central command interface visualizing the timeline nodes, branches, and paradox levels.
- **Dual-View Era System:** Simultaneously view the Past and Future to see cause and effect.
- **Voice Command Integration:** Issue temporal commands directly to the Chronos Engine.

## Tech Stack

This project is built with a cutting-edge modern web stack:

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **UI Library:** [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **AI/LLM:** Google Gemini 3 Pro & Genie 3 (Simulated/Integrated)
- **Language:** TypeScript

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/chronos-paradox.git
    cd chronos-paradox
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    # or
    bun install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

4.  **Open the app:**
    Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
chronos-paradox/
├── app/                  # Next.js App Router pages
│   ├── layout.tsx        # Root layout with metadata
│   └── page.tsx          # Main game interface
├── components/           # React components
│   ├── EraView.tsx       # Displays Past/Future eras & content
│   ├── TemporalHUD.tsx   # Central timeline visualization & controls
│   └── TopBar.tsx        # Game status & navigation
├── public/               # Static assets
└── styles/               # Global styles & Tailwind config
```

## Contributing

We welcome contributions! Please see `CONTRIBUTING.md` for details on how to submit pull requests, report issues, and suggest improvements.

## License

This project is licensed under the MIT License - see the `LICENSE` file for details.
