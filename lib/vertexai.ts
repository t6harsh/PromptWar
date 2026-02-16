/**
 * Chronos Paradox — Vertex AI Integration
 *
 * Provides AI-powered narrative generation using Google's Vertex AI
 * Gemini model. Falls back gracefully when credentials are unavailable.
 * @module lib/vertexai
 */

/**
 * Configuration for Vertex AI connection.
 * Set GOOGLE_CLOUD_PROJECT and GOOGLE_CLOUD_LOCATION in environment.
 */
const VERTEX_CONFIG = {
    project: process.env.GOOGLE_CLOUD_PROJECT || "",
    location: process.env.GOOGLE_CLOUD_LOCATION || "us-central1",
    model: "gemini-2.0-flash",
};

/**
 * Generate narrative text using Vertex AI Gemini.
 * Used for enhanced dialogue, scene descriptions, and NPC responses.
 *
 * @param prompt - The generation prompt
 * @param context - Additional game context (era, player state, etc.)
 * @returns Generated text or null if unavailable
 */
export async function generateNarrative(
    prompt: string,
    context?: Record<string, unknown>
): Promise<string | null> {
    if (!VERTEX_CONFIG.project) {
        return null; // No credentials — use built-in narratives
    }

    try {
        const { VertexAI } = await import("@google-cloud/vertexai");
        const vertex = new VertexAI({
            project: VERTEX_CONFIG.project,
            location: VERTEX_CONFIG.location,
        });

        const model = vertex.getGenerativeModel({ model: VERTEX_CONFIG.model });

        const systemPrompt = [
            "You are the narrative engine for Chronos Paradox, an AI-native JRPG.",
            "Generate immersive, atmospheric text in a concise JRPG dialogue style.",
            "Keep responses under 100 words. Use vivid sensory details.",
            context ? `Current context: ${JSON.stringify(context)}` : "",
        ].filter(Boolean).join(" ");

        const result = await model.generateContent({
            contents: [
                { role: "user", parts: [{ text: `${systemPrompt}\n\n${prompt}` }] },
            ],
        });

        const response = result.response;
        const text = response?.candidates?.[0]?.content?.parts?.[0]?.text;
        return text || null;
    } catch (err) {
        console.warn("[VertexAI] Generation failed:", err);
        return null;
    }
}

/**
 * Generate scene description for a given era.
 * @param era - Era name (e.g., "Renaissance", "Cyberpunk")
 * @param worldState - Current world state for the era
 * @returns Enhanced scene description or null
 */
export async function generateSceneDescription(
    era: string,
    worldState?: Record<string, unknown>
): Promise<string | null> {
    return generateNarrative(
        `Describe the current state of ${era} as the time traveler arrives. What do they see, hear, and feel?`,
        { era, ...worldState }
    );
}

/**
 * Generate NPC dialogue response.
 * @param npcName - Name of the NPC
 * @param playerAction - What the player said or did
 * @param era - Current era
 * @returns NPC's dialogue response or null
 */
export async function generateNPCDialogue(
    npcName: string,
    playerAction: string,
    era: string
): Promise<string | null> {
    return generateNarrative(
        `${npcName} responds to the time traveler's action: "${playerAction}" in the ${era} era. Write ${npcName}'s dialogue.`,
        { npc: npcName, action: playerAction, era }
    );
}
