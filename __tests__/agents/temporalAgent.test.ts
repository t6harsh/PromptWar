/**
 * Tests for the TemporalAgent API client.
 * Validates input sanitization, response validation, mock fallback,
 * and health checking.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// We need to test the module's internal functions, so we'll test via behavior
describe("TemporalAgent", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
        // Reset module cache to get fresh TemporalAgent instance
        vi.resetModules();
    });

    describe("Input Sanitization", () => {
        it("should strip HTML tags from commands", async () => {
            const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(
                new Response(JSON.stringify({ online: false }))
            );

            const { temporalAgent } = await import("../../agents/temporalAgent");
            const result = await temporalAgent.sendCommand('<script>alert("xss")</script>Save Leonardo');

            // Should use mock (offline) — verify the result doesn't contain HTML
            expect(result.butterfly_effect.source_action).not.toContain("<script>");
            expect(result.butterfly_effect.source_action).not.toContain("</script>");
            fetchSpy.mockRestore();
        });

        it("should strip javascript: protocol", async () => {
            const { temporalAgent } = await import("../../agents/temporalAgent");
            const result = await temporalAgent.sendCommand("javascript:alert(1)");
            expect(result.butterfly_effect.source_action).not.toContain("javascript:");
        });

        it("should limit input length to 500 characters", async () => {
            const { temporalAgent } = await import("../../agents/temporalAgent");
            const longInput = "A".repeat(1000);
            const result = await temporalAgent.sendCommand(longInput);
            expect(result.butterfly_effect.source_action.length).toBeLessThanOrEqual(500);
        });
    });

    describe("Health Check", () => {
        it("should return offline when backend is unavailable", async () => {
            vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Connection refused"));
            const { temporalAgent } = await import("../../agents/temporalAgent");
            const health = await temporalAgent.checkHealth();
            expect(health.online).toBe(false);
        });

        it("should return online when backend responds", async () => {
            vi.spyOn(globalThis, "fetch").mockResolvedValue(
                new Response(JSON.stringify({ status: "online" }), { status: 200 })
            );
            const { temporalAgent } = await import("../../agents/temporalAgent");
            const health = await temporalAgent.checkHealth();
            expect(health.online).toBe(true);
        });
    });

    describe("Mock Command Result", () => {
        it("should return valid mock result when offline", async () => {
            const { temporalAgent } = await import("../../agents/temporalAgent");
            const result = await temporalAgent.sendCommand("Save Leonardo");

            expect(result).toHaveProperty("action_id");
            expect(result).toHaveProperty("butterfly_effect");
            expect(result).toHaveProperty("butterfly_index");
            expect(result).toHaveProperty("echo_messages");
            expect(result.echo_messages.length).toBeGreaterThan(0);
        });

        it("should detect save intent for protective commands", async () => {
            const { temporalAgent } = await import("../../agents/temporalAgent");
            const result = await temporalAgent.sendCommand("Save the workshop");
            expect(result.intent.intent).toBe("save");
            expect(result.butterfly_effect.paradox_risk).toBeLessThan(0.3);
        });

        it("should detect destroy intent for destructive commands", async () => {
            const { temporalAgent } = await import("../../agents/temporalAgent");
            const result = await temporalAgent.sendCommand("Destroy the artifact");
            expect(result.intent.intent).toBe("destroy");
            expect(result.butterfly_effect.paradox_risk).toBeGreaterThan(0.3);
        });

        it("should include affected eras in butterfly effect", async () => {
            const { temporalAgent } = await import("../../agents/temporalAgent");
            const result = await temporalAgent.sendCommand("Observe the stars", "Renaissance");
            expect(result.butterfly_effect.affected_eras).toContain("Renaissance");
        });
    });
});
