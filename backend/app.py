"""
Chronos Paradox — Flask Backend API

Main entry point for the Temporal Command Center backend.
Provides REST API routes for the Next.js frontend.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from logic_engine import TemporalLogicEngine
from genie_bridge import GenieBridge
from voice_handler import VoiceHandler
from guardrails import TemporalEthicsBoard
from visuals import ImageGenerator

# ─── Initialize ───

app = Flask(__name__)
CORS(app)

engine = TemporalLogicEngine()
genie = GenieBridge()
voice = VoiceHandler()
ethics = TemporalEthicsBoard()
visuals = ImageGenerator()


# ─── Health Check ───

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "online",
        "engine": "Temporal Logic Engine v4.2.0",
        "gemini": "connected" if engine.client else "procedural_fallback",
        "world_model": "Genie 3 Bridge active",
        "guardrails": "Temporal Ethics Board active",
    })


# ─── Temporal Command ───

@app.route("/api/temporal-command", methods=["POST"])
def temporal_command():
    """
    Process a temporal command from the user.
    Flow: Voice → Intent → Guardrails → Logic Engine → World Update
    """
    data = request.get_json()
    command = data.get("command", "")
    current_era = data.get("era", "Renaissance")

    if not command:
        return jsonify({"error": "No command provided"}), 400

    # Step 1: Extract intent via voice handler
    intent = voice.process_command(command)

    # Step 2: Run guardrail checks (pre-action)
    pre_check = ethics.evaluate_action(command, 0.3, engine.butterfly_index)
    if not pre_check["approved"]:
        return jsonify({
            "blocked": True,
            "reason": pre_check["reason"],
            "details": pre_check["details"],
            "echo_messages": [pre_check["details"].get("message", "Action blocked by guardrails")],
        })

    # Step 3: Process through temporal logic engine
    result = engine.process_command(command, current_era)

    # Step 4: Post-action guardrail check on paradox risk
    post_check = ethics.evaluate_action(
        command,
        result["butterfly_effect"]["paradox_risk"],
        result["butterfly_index"],
    )
    if not post_check["approved"]:
        return jsonify({
            "blocked": True,
            "reason": post_check["reason"],
            "details": post_check["details"],
            "echo_messages": [post_check["details"].get("message", "Paradox gridlock triggered")],
        })

    # Step 5: Apply butterfly effect to world states
    world_delta = result["butterfly_effect"].get("world_state_delta", {})
    world_changes = genie.apply_butterfly_effect(world_delta)

    # Step 6: Sanitize narrative output
    narratives = result["butterfly_effect"].get("narrative_changes", [])
    safe_narratives = ethics.sanitize_output(narratives)
    result["butterfly_effect"]["narrative_changes"] = safe_narratives

    # Combine and return
    return jsonify({
        "action_id": result["action_id"],
        "intent": intent,
        "butterfly_effect": result["butterfly_effect"],
        "butterfly_index": result["butterfly_index"],
        "world_changes": world_changes,
        "echo_messages": result.get("echo_messages", []),
        "is_paradox": result.get("is_paradox", False),
        "vibe": intent.get("vibe", "neutral"),
    })


# ─── Causality Check ───

@app.route("/api/causality-check", methods=["POST"])
def causality_check():
    """Check causal consistency between two eras."""
    data = request.get_json()
    source = data.get("source_era", "")
    target = data.get("target_era", "")

    if not source or not target:
        return jsonify({"error": "source_era and target_era required"}), 400

    result = engine.check_causality(source, target)
    return jsonify(result)


# ─── World State ───

@app.route("/api/world-state/<era>", methods=["GET"])
def world_state(era):
    """Get detailed world state for a specific era."""
    state = genie.get_world_state(era)
    snapshot = genie.generate_environment_snapshot(era)
    return jsonify({**state, "environment": snapshot.get("scene", {})})


@app.route("/api/world-state", methods=["GET"])
def all_world_states():
    """Get summary world states for all eras."""
    return jsonify(genie.get_all_states())


# ─── Timeline ───

@app.route("/api/timeline", methods=["GET"])
def timeline():
    """Get the full timeline state."""
    return jsonify(engine.get_timeline_state())


# ─── Voice Command ───

@app.route("/api/voice-command", methods=["POST"])
def voice_command():
    """Process voice command and return intent + environment vibe."""
    data = request.get_json()
    text = data.get("text", "")

    if not text:
        return jsonify({"error": "No text provided"}), 400

    intent = voice.process_command(text)
    vibe = voice.get_environment_vibe(intent["sentiment"], intent.get("target_era", "current"))

    return jsonify({
        "intent": intent,
        "environment_vibe": vibe,
    })


# ─── Guardrails Status ───

@app.route("/api/guardrails/status", methods=["GET"])
def guardrails_status():
    """Get current guardrail system status."""
    return jsonify({
        "paradox_limiter": ethics.paradox_limiter.get_status(),
        "safety_filter": "active",
        "ethics_board": "operational",
    })


# ─── Visual Generation ───

@app.route("/api/visuals/generate", methods=["POST"])
def generate_visual():
    """
    Generate a scene image using Imagen 3.
    """
    data = request.get_json()
    prompt = data.get("prompt", "")
    era = data.get("era", "Unknown")

    if not prompt:
        return jsonify({"error": "No prompt provided"}), 400

    result = visuals.generate_scene(prompt, era)
    return jsonify(result)


# ─── Run ───

if __name__ == "__main__":
    app.run(debug=False, port=5000, host="0.0.0.0")
