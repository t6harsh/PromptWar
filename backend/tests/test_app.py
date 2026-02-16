"""
Chronos Paradox — Test Suite: Flask API Integration

Tests for all REST API routes: health, temporal-command, world-state,
timeline, voice-command, causality-check, and guardrails status.
"""

import sys
import os
import json
import pytest

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import app


@pytest.fixture
def client():
    """Create a test client for the Flask app."""
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client


class TestHealthEndpoint:
    """Tests for GET /api/health."""

    def test_health_returns_200(self, client):
        response = client.get("/api/health")
        assert response.status_code == 200

    def test_health_returns_online_status(self, client):
        response = client.get("/api/health")
        data = json.loads(response.data)
        assert data["status"] == "online"

    def test_health_includes_engine_info(self, client):
        response = client.get("/api/health")
        data = json.loads(response.data)
        assert "engine" in data
        assert "guardrails" in data


class TestTemporalCommand:
    """Tests for POST /api/temporal-command."""

    def test_empty_command_returns_400(self, client):
        response = client.post(
            "/api/temporal-command",
            data=json.dumps({"command": "", "era": "Renaissance"}),
            content_type="application/json",
        )
        assert response.status_code == 400

    def test_valid_command_returns_result(self, client):
        response = client.post(
            "/api/temporal-command",
            data=json.dumps({"command": "Save Leonardo", "era": "Renaissance"}),
            content_type="application/json",
        )
        assert response.status_code == 200
        data = json.loads(response.data)
        # Either blocked or has action_id
        assert "action_id" in data or "blocked" in data

    def test_safe_command_has_butterfly_effect(self, client):
        response = client.post(
            "/api/temporal-command",
            data=json.dumps({"command": "Observe the stars", "era": "Renaissance"}),
            content_type="application/json",
        )
        data = json.loads(response.data)
        if not data.get("blocked"):
            assert "butterfly_effect" in data
            assert "butterfly_index" in data

    def test_blocked_command_returns_reason(self, client):
        response = client.post(
            "/api/temporal-command",
            data=json.dumps({"command": "Commit genocide", "era": "Renaissance"}),
            content_type="application/json",
        )
        data = json.loads(response.data)
        assert data["blocked"] is True
        assert "reason" in data


class TestWorldState:
    """Tests for GET /api/world-state endpoints."""

    def test_world_state_for_era(self, client):
        response = client.get("/api/world-state/Renaissance")
        assert response.status_code == 200
        data = json.loads(response.data)
        assert "era" in data or "year" in data

    def test_all_world_states(self, client):
        response = client.get("/api/world-state")
        assert response.status_code == 200


class TestTimeline:
    """Tests for GET /api/timeline."""

    def test_timeline_returns_200(self, client):
        response = client.get("/api/timeline")
        assert response.status_code == 200

    def test_timeline_has_anchors(self, client):
        response = client.get("/api/timeline")
        data = json.loads(response.data)
        assert "anchors" in data
        assert len(data["anchors"]) > 0

    def test_timeline_has_butterfly_index(self, client):
        response = client.get("/api/timeline")
        data = json.loads(response.data)
        assert "butterfly_index" in data


class TestVoiceCommand:
    """Tests for POST /api/voice-command."""

    def test_empty_text_returns_400(self, client):
        response = client.post(
            "/api/voice-command",
            data=json.dumps({"text": ""}),
            content_type="application/json",
        )
        assert response.status_code == 400

    def test_valid_voice_command(self, client):
        response = client.post(
            "/api/voice-command",
            data=json.dumps({"text": "Save Leonardo from danger"}),
            content_type="application/json",
        )
        assert response.status_code == 200
        data = json.loads(response.data)
        assert "intent" in data


class TestCausalityCheck:
    """Tests for POST /api/causality-check."""

    def test_missing_eras_returns_400(self, client):
        response = client.post(
            "/api/causality-check",
            data=json.dumps({"source_era": "", "target_era": ""}),
            content_type="application/json",
        )
        assert response.status_code == 400

    def test_valid_causality_check(self, client):
        response = client.post(
            "/api/causality-check",
            data=json.dumps({"source_era": "Renaissance", "target_era": "Cyberpunk"}),
            content_type="application/json",
        )
        assert response.status_code == 200
        data = json.loads(response.data)
        assert "valid" in data


class TestGuardrailsStatus:
    """Tests for GET /api/guardrails/status."""

    def test_guardrails_status(self, client):
        response = client.get("/api/guardrails/status")
        assert response.status_code == 200
        data = json.loads(response.data)
        assert "paradox_limiter" in data
        assert "safety_filter" in data
