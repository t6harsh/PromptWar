# Chronos Paradox — Temporal Command Center

> **"Interact with a living timeline, make choices that ripple through history, and watch the future transform in real-time."**

## Overview

**Chronos Paradox** is an AI-native JRPG web application that evolves the classic time-travel RPG into a modern **Temporal Command Center**. Players explore pixel-art eras, interact with NPCs, and issue temporal commands — every decision triggers a **Butterfly Effect** that rewrites the future in real-time.

The application leverages **Google Gemini** via Vertex AI for dynamic narrative generation and **Firebase** for analytics and game state persistence. An intelligent guardrails system ensures responsible AI behavior while preserving player agency.

## Inspiration

> **"What if the timeline didn't just branch, but *rewrote* itself?"**

Inspired by **Chrono Trigger's** intricate cause-and-effect mechanics, we modernized the concept using generative AI:

- **The World is Alive:** Genie 3 world models generate the visual reality of future eras based on past actions.
- **The Story Defines Itself:** Gemini analyzes the entire history of player actions to produce consistent, surprising outcomes.
- **You Are The Operator:** A futuristic JRPG interface puts you in direct control of the flow of time.

## Core Features

### 🎮 JRPG Game Interface
- **Pixel Art Scenes** — Hand-crafted era backgrounds (Renaissance, Cyberpunk) with ambient particle effects
- **Interactive NPCs & Hotspots** — Click or keyboard-navigate to talk to characters and examine objects
- **Branching Dialogue** — Typewriter-effect dialogue with multiple choice responses
- **Action System** — Act, Observe, and Temporal powers with custom command input

### 🌟 Living Timeline System
- **Real-Time Causality** — Changes in 1432 AD Renaissance propagate instantly to 2847 AD Cyberpunk
- **Butterfly Effect Simulation** — Small alterations lead to massive divergences via the **Paradox Index**
- **Timeline Sidebar** — Visual node graph of eras with clickable travel and echo log

### 🧠 AI-Native Intelligence
- **Vertex AI Gemini Integration** — Dynamic narrative generation, NPC dialogue, and scene descriptions
- **Firebase Analytics** — Game event tracking and session analytics
- **Firestore Persistence** — Save/load game state across sessions
- **Guardrails System** — Content safety filtering and paradox limiting for responsible AI

### 🔒 Security
- **Content Security Policy (CSP)** — Strict source whitelisting
- **Security Headers** — HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- **Input Sanitization** — HTML/XSS stripping, length limiting, response shape validation

### ♿ Accessibility
- **Full ARIA Support** — Roles (`banner`, `progressbar`, `dialog`, `toolbar`, `navigation`, `main`, `log`) on all components
- **Keyboard Navigation** — Enter/Space on all interactive elements, number keys for dialogue choices
- **Screen Reader Announcer** — Live announcements for era changes, dialogue, and paradox events
- **Skip-to-Content Link** — Keyboard shortcut to jump to the game viewport

### ⚡ Performance
- **React.memo** — All components memoized to prevent unnecessary re-renders
- **Dynamic Imports** — Lazy-loaded GameViewport and TimelineSidebar for faster initial load
- **next/image** — Optimized image loading with AVIF/WebP format support
- **Asset Preloading** — Critical game assets preloaded in document head

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router, Standalone output) |
| UI | [React 19](https://react.dev/) with TypeScript |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/) |
| Animations | [Framer Motion](https://www.framer.com/motion/) |
| AI / LLM | Google Vertex AI (Gemini 2.0 Flash) |
| Analytics | Firebase Analytics |
| Database | Firebase Firestore |
| Backend | Python Flask with CORS |
| Testing | Vitest + React Testing Library (frontend), pytest (backend) |
| Deployment | Docker + Google Cloud Run |

## Getting Started

### Prerequisites

- Node.js 18+ / npm
- Python 3.9+ (for backend)

### Installation

```bash
# Clone the repo
git clone https://github.com/t6harsh/PromptWar.git
cd PromptWar

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
pip install -r requirements.txt
cd ..
```

### Configuration

Copy `.env.local` and fill in your Firebase credentials (optional — the app works without them):

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Running

```bash
# Start the backend (port 5000)
cd backend && python app.py &

# Start the frontend (port 3000)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Testing

```bash
# Frontend tests (Vitest)
npm test

# Frontend tests with coverage
npm run test:coverage

# Backend tests (pytest)
cd backend && python -m pytest tests/ -v
```

## Project Structure

```
PromptWar/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (SEO, fonts, preloading)
│   ├── page.tsx                  # Main game page (ErrorBoundary + lazy loading)
│   └── globals.css               # Global styles & design tokens
├── components/                   # React components
│   ├── GameViewport.tsx          # Main game scene (backgrounds, NPCs, hotspots)
│   ├── GameHUD.tsx               # Top bar (HP, energy, era info, stats)
│   ├── DialogueBox.tsx           # JRPG dialogue with typewriter & choices
│   ├── ActionMenu.tsx            # Action buttons & custom command input
│   ├── TimelineSidebar.tsx       # Timeline nodes, paradox meter, echo log
│   ├── ErrorBoundary.tsx         # Crash recovery with themed UI
│   └── ScreenReaderAnnouncer.tsx # Assistive tech announcements
├── agents/
│   └── temporalAgent.ts          # API client (sanitization + validation)
├── context/
│   └── ChronosContext.tsx        # Game state management
├── lib/
│   ├── firebase.ts               # Firebase Analytics + Firestore
│   └── vertexai.ts               # Vertex AI narrative generation
├── backend/
│   ├── app.py                    # Flask API (commands, world state, timeline)
│   ├── logic_engine.py           # Temporal causality engine
│   ├── genie_bridge.py           # World model management
│   ├── voice_handler.py          # Command intent extraction
│   ├── guardrails.py             # AI safety & paradox limiting
│   └── tests/                    # Backend test suite (pytest)
├── __tests__/                    # Frontend test suite (Vitest)
├── public/game/                  # Game assets (backgrounds, sprites)
├── next.config.ts                # Security headers + image optimization
├── vitest.config.ts              # Test configuration
├── Dockerfile                    # Production Docker image
└── .env.local                    # Environment variables template
```

## Architecture

```
┌─────────────────────────────────────────────┐
│                Next.js Frontend             │
│  ┌─────────┐ ┌──────────┐ ┌──────────────┐ │
│  │ GameHUD │ │ Viewport │ │   Timeline   │ │
│  └────┬────┘ └────┬─────┘ └──────┬───────┘ │
│       │           │               │         │
│  ┌────┴───────────┴───────────────┴──────┐  │
│  │         ChronosContext (State)        │  │
│  └────────────────┬──────────────────────┘  │
│                   │                         │
│  ┌────────────────┴──────────────────────┐  │
│  │  TemporalAgent (Sanitize → Validate) │  │
│  └────────────────┬──────────────────────┘  │
│                   │                         │
│  ┌────────┐  ┌────┴────┐                    │
│  │Firebase│  │VertexAI │                    │
│  └────────┘  └─────────┘                    │
└───────────────────┬─────────────────────────┘
                    │ HTTP
┌───────────────────┴─────────────────────────┐
│              Flask Backend                   │
│  Guardrails → Logic Engine → Genie Bridge   │
└─────────────────────────────────────────────┘
```

## Contributing

We welcome contributions! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License — see the `LICENSE` file for details.
