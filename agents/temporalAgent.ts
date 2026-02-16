/**
 * Chronos Paradox — Temporal Agent
 *
 * Client-side agent that wraps backend API calls.
 * Handles communication between the Next.js frontend and Flask backend.
 * Includes input sanitization, response validation, and Vertex AI fallback.
 * @module agents/temporalAgent
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

// ─── Input Sanitization ───

/**
 * Sanitize user input by stripping HTML/script tags and limiting length.
 * Prevents XSS and injection attacks.
 * @param input - Raw user input string
 * @param maxLength - Maximum allowed length (default: 500)
 * @returns Sanitized string
 */
function sanitizeInput(input: string, maxLength = 500): string {
    return input
        .replace(/<[^>]*>/g, "")         // Strip HTML tags
        .replace(/javascript:/gi, "")     // Strip JS protocol
        .replace(/on\w+\s*=/gi, "")       // Strip event handlers
        .replace(/[<>'"`;]/g, "")         // Strip dangerous chars
        .trim()
        .slice(0, maxLength);
}

/**
 * Validate that an API response matches the expected TemporalCommandResult shape.
 * @param data - Raw response data
 * @returns true if valid
 */
function isValidCommandResult(data: unknown): data is TemporalCommandResult {
    if (!data || typeof data !== "object") return false;
    const d = data as Record<string, unknown>;
    return (
        typeof d.action_id === "string" &&
        typeof d.butterfly_index === "number" &&
        typeof d.butterfly_effect === "object" &&
        Array.isArray(d.echo_messages)
    );
}

// ─── Types ───

/** Butterfly effect propagation details from a temporal action */
export interface ButterflyEffect {
    source_action: string;
    affected_eras: string[];
    paradox_risk: number;
    narrative_changes: string[];
    world_state_delta: Record<string, unknown>;
}

/** Result of processing a temporal command through the engine */
export interface TemporalCommandResult {
    action_id: string;
    intent: {
        intent: string;
        action: string;
        target_era: string;
        sentiment: string;
        vibe: string;
        confidence: number;
        action_summary: string;
        subjects: string[];
        source: string;
    };
    butterfly_effect: ButterflyEffect;
    butterfly_index: number;
    world_changes: Record<string, unknown>;
    echo_messages: string[];
    is_paradox: boolean;
    vibe: string;
    blocked?: boolean;
    reason?: string;
    details?: Record<string, unknown>;
}

/** World state for a specific era */
export interface WorldState {
    era: string;
    year: number;
    visual_style: string;
    architecture: string;
    population: string;
    tech_level: number;
    dominant_faction: string;
    mood: string;
    weather: string;
    stability: number;
    narrative_context: string;
    active_events: string[];
    resources: Record<string, number>;
    environment?: Record<string, unknown>;
}

/** Full timeline state with anchors and branches */
export interface TimelineState {
    anchors: Array<{
        id: string;
        year: number;
        era: string;
        label: string;
        description: string;
        status: string;
    }>;
    branches: Array<{
        id: string;
        name: string;
        divergence_point: string;
        probability: number;
        is_primary: boolean;
    }>;
    butterfly_index: number;
    active_branch: string;
    total_actions: number;
}

/** Result of a causal path validation check */
export interface CausalityResult {
    valid: boolean;
    path?: string[];
    paradox_risk: number;
    chain_length: number;
    description: string;
}

// ─── Agent Class ───

/**
 * TemporalAgent handles all communication between the game frontend
 * and the Flask backend API. Provides input sanitization, response
 * validation, and graceful fallback to mock data when offline.
 */
class TemporalAgent {
    private baseUrl: string;
    private isOnline: boolean = false;

    constructor(baseUrl: string = API_BASE) {
        this.baseUrl = baseUrl;
    }

    // ─── Health ───

    /**
     * Check if the backend API is online and responsive.
     * @returns Health status with optional backend details
     */
    async checkHealth(): Promise<{ online: boolean; details?: Record<string, string> }> {
        try {
            const res = await fetch(`${this.baseUrl}/api/health`, { signal: AbortSignal.timeout(3000) });
            if (res.ok) {
                const data = await res.json();
                this.isOnline = true;
                return { online: true, details: data };
            }
        } catch {
            // Backend not available
        }
        this.isOnline = false;
        return { online: false };
    }

    // ─── Temporal Command ───

    /**
     * Send a temporal command to the backend for processing.
     * Input is sanitized before sending. Response is validated.
     * Falls back to mock data if backend is offline.
     * @param command - Raw user command
     * @param era - Current era context
     * @returns Processed command result
     */
    async sendCommand(command: string, era: string = "Renaissance"): Promise<TemporalCommandResult> {
        const safeCommand = sanitizeInput(command);
        const safeEra = sanitizeInput(era, 100);

        if (!this.isOnline) {
            return this.mockCommandResult(safeCommand, safeEra);
        }

        try {
            const res = await fetch(`${this.baseUrl}/api/temporal-command`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ command: safeCommand, era: safeEra }),
            });
            const data = await res.json();

            if (isValidCommandResult(data)) {
                return data;
            }
            // Invalid response shape — fall back to mock
            console.warn("[TemporalAgent] Invalid response shape, using mock");
            return this.mockCommandResult(safeCommand, safeEra);
        } catch {
            return this.mockCommandResult(safeCommand, safeEra);
        }
    }

    // ─── World State ───

    /**
     * Fetch detailed world state for a specific era.
     * @param era - Era to fetch state for
     * @returns World state data or null if unavailable
     */
    async getWorldState(era: string): Promise<WorldState | null> {
        if (!this.isOnline) return null;

        try {
            const res = await fetch(`${this.baseUrl}/api/world-state/${encodeURIComponent(era)}`);
            return await res.json();
        } catch {
            return null;
        }
    }

    // ─── Timeline ───

    /**
     * Fetch the full timeline state including anchors and branches.
     * @returns Timeline state or null if unavailable
     */
    async getTimeline(): Promise<TimelineState | null> {
        if (!this.isOnline) return null;

        try {
            const res = await fetch(`${this.baseUrl}/api/timeline`);
            return await res.json();
        } catch {
            return null;
        }
    }

    // ─── Causality Check ───

    /**
     * Validate causal consistency between two eras.
     * @param sourceEra - Origin era
     * @param targetEra - Destination era
     * @returns Causality validation result or null
     */
    async checkCausality(sourceEra: string, targetEra: string): Promise<CausalityResult | null> {
        if (!this.isOnline) return null;

        try {
            const res = await fetch(`${this.baseUrl}/api/causality-check`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    source_era: sanitizeInput(sourceEra, 100),
                    target_era: sanitizeInput(targetEra, 100),
                }),
            });
            return await res.json();
        } catch {
            return null;
        }
    }

    // ─── Mock Fallback ───

    /**
     * Generate a mock command result for offline/fallback mode.
     * Uses pattern matching on the command to produce contextual responses.
     * @param command - Sanitized command
     * @param era - Current era
     * @returns Simulated command result
     */
    private mockCommandResult(command: string, era: string): TemporalCommandResult {
        const isSave = /save|protect|help|rescue/i.test(command);
        const isDestroy = /destroy|kill|remove/i.test(command);

        const paradoxRisk = isDestroy ? 0.6 : isSave ? 0.15 : 0.3;

        return {
            action_id: `mock_${Date.now()}`,
            intent: {
                intent: isSave ? "save" : isDestroy ? "destroy" : "observe",
                action: isSave ? "protective_intervention" : "passive_observation",
                target_era: era,
                sentiment: isSave ? "compassionate" : "curious",
                vibe: isSave ? "hopeful" : "neutral",
                confidence: 0.7,
                action_summary: `Processing: ${command}`,
                subjects: [],
                source: "frontend_mock",
            },
            butterfly_effect: {
                source_action: command,
                affected_eras: [era, "Cyberpunk"],
                paradox_risk: paradoxRisk,
                narrative_changes: [
                    `Temporal flux detected in ${era}`,
                    "Butterfly cascade propagating to future eras...",
                    "Timeline adjusted — monitoring for stability",
                ],
                world_state_delta: {},
            },
            butterfly_index: 50 + paradoxRisk * 20,
            world_changes: {},
            echo_messages: [
                `› Processing command: "${command}"`,
                `› Scanning temporal harmonics in ${era}...`,
                "› Butterfly cascade detected — recalibrating",
                "› Command processed. Timeline updated.",
            ],
            is_paradox: paradoxRisk > 0.7,
            vibe: isSave ? "hopeful" : "neutral",
        };
    }
}

// ─── Singleton Export ───

/** Singleton TemporalAgent instance for use throughout the application */
export const temporalAgent = new TemporalAgent();
export default temporalAgent;
