/**
 * Chronos Paradox — Google Calendar/Workspace Mock Integration
 *
 * Maps real-world time to in-game temporal cycles.
 * In production, this would integrate with Google Calendar API
 * to schedule temporal events and sync game state with user's calendar.
 */

// ─── Types ───

export interface TemporalCycleInfo {
    cycle: number;
    day: number;
    phase: "dawn" | "meridian" | "dusk" | "void";
    real_date: string;
    game_era: string;
    narrative_event: string;
}

export interface CalendarEvent {
    id: string;
    title: string;
    description: string;
    start: string;
    end: string;
    era: string;
    type: "temporal_event" | "paradox_alert" | "mission" | "observation";
}

// ─── Constants ───

const CYCLE_DURATION_HOURS = 24;
const DAYS_PER_CYCLE = 50;
const ERA_ROTATION = [
    "Dark Ages",
    "Medieval",
    "Renaissance",
    "Enlightenment",
    "Industrial",
    "Digital",
    "Neo Age",
    "Cyberpunk",
];

const DAILY_EVENTS: Record<string, string[]> = {
    dawn: [
        "Temporal sensors recalibrating after night cycle",
        "New butterfly cascade detected at dawn",
        "Morning chronometer sync complete",
    ],
    meridian: [
        "Peak temporal flux — all eras at maximum connectivity",
        "Meridian scan reveals new causal threads",
        "Cross-era communication channels open",
    ],
    dusk: [
        "Temporal energy waning — conserve chrono-shards",
        "Dusk patrol detecting minor timeline fractures",
        "Era boundaries softening as night approaches",
    ],
    void: [
        "Void phase — the space between seconds",
        "Deep temporal currents accessible only during void",
        "Warning: void phase actions have amplified butterfly effects",
    ],
};

// ─── Calendar Sync ───

class CalendarSync {
    private events: CalendarEvent[] = [];
    private gameStartDate: Date;

    constructor() {
        // Game starts at a fixed reference point
        this.gameStartDate = new Date("2026-01-01T00:00:00Z");
        this._seedEvents();
    }

    /**
     * Get current temporal cycle info based on real-world time.
     */
    getCurrentCycle(): TemporalCycleInfo {
        const now = new Date();
        const elapsed = now.getTime() - this.gameStartDate.getTime();
        const hoursElapsed = elapsed / (1000 * 60 * 60);

        const totalDays = Math.floor(hoursElapsed / CYCLE_DURATION_HOURS);
        const cycle = Math.floor(totalDays / DAYS_PER_CYCLE) + 1;
        const day = (totalDays % DAYS_PER_CYCLE) + 1;

        // Phase based on hour of day
        const hour = now.getHours();
        let phase: "dawn" | "meridian" | "dusk" | "void";
        if (hour >= 5 && hour < 11) phase = "dawn";
        else if (hour >= 11 && hour < 17) phase = "meridian";
        else if (hour >= 17 && hour < 23) phase = "dusk";
        else phase = "void";

        // Era rotates based on cycle
        const eraIndex = (cycle - 1) % ERA_ROTATION.length;
        const gameEra = ERA_ROTATION[eraIndex];

        // Pick a narrative event
        const events = DAILY_EVENTS[phase];
        const eventIndex = day % events.length;

        return {
            cycle,
            day,
            phase,
            real_date: now.toISOString(),
            game_era: gameEra,
            narrative_event: events[eventIndex],
        };
    }

    /**
     * Get upcoming temporal events (mock calendar integration).
     */
    getUpcomingEvents(limit: number = 5): CalendarEvent[] {
        const now = new Date().toISOString();
        return this.events
            .filter((e) => e.start >= now)
            .slice(0, limit);
    }

    /**
     * Schedule a new temporal event.
     */
    scheduleEvent(event: Omit<CalendarEvent, "id">): CalendarEvent {
        const newEvent: CalendarEvent = {
            ...event,
            id: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        };
        this.events.push(newEvent);
        this.events.sort((a, b) => a.start.localeCompare(b.start));
        return newEvent;
    }

    /**
     * Seed some default calendar events.
     */
    private _seedEvents(): void {
        const baseDate = new Date();

        const templates = [
            {
                title: "Temporal Rift Alignment",
                description: "All 8 eras align — maximum cross-era influence window",
                era: "Digital",
                type: "temporal_event" as const,
                hoursFromNow: 2,
            },
            {
                title: "Paradox Early Warning",
                description: "Renaissance-Cyberpunk causal link showing strain",
                era: "Renaissance",
                type: "paradox_alert" as const,
                hoursFromNow: 6,
            },
            {
                title: "Mission: Leonardo's Workshop",
                description: "Protect the Chronos blueprints from Medici spies",
                era: "Renaissance",
                type: "mission" as const,
                hoursFromNow: 12,
            },
            {
                title: "Neo-Kyoto Observation Window",
                description: "Brief stable window to observe Cyberpunk era without interference",
                era: "Cyberpunk",
                type: "observation" as const,
                hoursFromNow: 24,
            },
            {
                title: "Temporal Maintenance Cycle",
                description: "System recalibration — reduced functionality for 30 minutes",
                era: "Digital",
                type: "temporal_event" as const,
                hoursFromNow: 48,
            },
        ];

        for (const t of templates) {
            const start = new Date(baseDate.getTime() + t.hoursFromNow * 3600 * 1000);
            const end = new Date(start.getTime() + 3600 * 1000);

            this.scheduleEvent({
                title: t.title,
                description: t.description,
                start: start.toISOString(),
                end: end.toISOString(),
                era: t.era,
                type: t.type,
            });
        }
    }
}

// ─── Singleton Export ───

export const calendarSync = new CalendarSync();
export default calendarSync;
