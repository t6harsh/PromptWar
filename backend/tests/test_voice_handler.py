"""
Chronos Paradox — Test Suite: Voice Handler

Tests for voice command processing: intent extraction, sentiment analysis,
action classification, and environment vibe generation.
"""

import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from voice_handler import VoiceHandler


class TestVoiceHandler:
    """Tests for voice command processing."""

    def setup_method(self):
        self.handler = VoiceHandler()

    def test_process_save_command(self):
        result = self.handler.process_command("Save Leonardo from danger")
        assert "intent" in result
        assert "sentiment" in result
        assert "confidence" in result

    def test_process_observe_command(self):
        result = self.handler.process_command("Look at the stars")
        assert "intent" in result

    def test_process_destroy_command(self):
        result = self.handler.process_command("Destroy the temporal artifact")
        assert "intent" in result

    def test_intent_has_action_summary(self):
        result = self.handler.process_command("Protect the hourglass")
        assert "action_summary" in result

    def test_intent_has_subjects(self):
        result = self.handler.process_command("Save Leonardo")
        assert "subjects" in result

    def test_empty_command(self):
        result = self.handler.process_command("")
        assert "intent" in result

    def test_environment_vibe(self):
        intent = self.handler.process_command("Save Leonardo")
        vibe = self.handler.get_environment_vibe(intent["sentiment"], "Renaissance")
        assert isinstance(vibe, dict)
