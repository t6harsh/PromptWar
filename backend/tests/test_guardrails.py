"""
Chronos Paradox — Test Suite: Guardrails

Tests for the Responsible AI system: narrative safety filtering,
paradox severity limiter, and the unified Temporal Ethics Board.
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from guardrails import NarrativeSafetyFilter, ParadoxLimiter, TemporalEthicsBoard


class TestNarrativeSafetyFilter:
    """Tests for content safety filtering."""

    def setup_method(self):
        self.filter = NarrativeSafetyFilter()

    def test_safe_content_passes(self):
        result = self.filter.check_content("Save Leonardo from the sabotage")
        assert result["is_safe"] is True
        assert result["risk_level"] == "safe"

    def test_high_risk_content_blocked(self):
        result = self.filter.check_content("Commit genocide against the villagers")
        assert result["is_safe"] is False
        assert result["risk_level"] == "blocked"

    def test_medium_risk_content_warning(self):
        result = self.filter.check_content("Enslave the population of the era")
        assert result["is_safe"] is True  # Warning, not blocked
        assert result["risk_level"] == "warning"

    def test_game_violence_allowed(self):
        result = self.filter.check_content("Battle the castle guards")
        assert result["is_safe"] is True

    def test_sanitize_narratives(self):
        narratives = [
            "Leonardo saves his workshop",
            "Genocide occurs in the village",
            "The timeline stabilizes",
        ]
        sanitized = self.filter.sanitize_narrative(narratives)
        assert len(sanitized) == 3
        assert sanitized[0] == "Leonardo saves his workshop"
        assert "redacted" in sanitized[1].lower()
        assert sanitized[2] == "The timeline stabilizes"

    def test_empty_content_is_safe(self):
        result = self.filter.check_content("")
        assert result["is_safe"] is True
        assert result["risk_level"] == "safe"


class TestParadoxLimiter:
    """Tests for paradox severity enforcement."""

    def setup_method(self):
        self.limiter = ParadoxLimiter()

    def test_low_risk_allowed(self):
        result = self.limiter.check_paradox_risk(0.1, 30.0)
        assert result["allowed"] is True
        assert result["status"] == "safe"

    def test_high_risk_warning(self):
        result = self.limiter.check_paradox_risk(0.8, 70.0)
        # Combined risk = 0.8*0.6 + 0.7*0.4 = 0.48+0.28 = 0.76
        assert result["allowed"] is True
        assert result["status"] == "warning"

    def test_extreme_risk_gridlock(self):
        result = self.limiter.check_paradox_risk(1.0, 95.0)
        # Combined risk = 1.0*0.6 + 0.95*0.4 = 0.6+0.38 = 0.98
        assert result["allowed"] is False
        assert result["status"] == "gridlock"

    def test_gridlock_count_increments(self):
        assert self.limiter.gridlock_count == 0
        self.limiter.check_paradox_risk(1.0, 95.0)
        assert self.limiter.gridlock_count == 1

    def test_cooldown_reduces_accumulator(self):
        self.limiter.paradox_accumulator = 0.5
        self.limiter.check_paradox_risk(0.1, 20.0)
        # Should apply cooldown
        assert self.limiter.paradox_accumulator < 0.55  # Slight increase then cooldown

    def test_status_returns_correct_data(self):
        status = self.limiter.get_status()
        assert "paradox_accumulator" in status
        assert "gridlock_count" in status
        assert "actions_since_gridlock" in status
        assert "current_threshold" in status


class TestTemporalEthicsBoard:
    """Tests for the unified guardrail system."""

    def setup_method(self):
        self.board = TemporalEthicsBoard()

    def test_safe_action_approved(self):
        result = self.board.evaluate_action("Save Leonardo", 0.1, 30.0)
        assert result["approved"] is True

    def test_unsafe_content_rejected(self):
        result = self.board.evaluate_action("Commit terrorism against the city", 0.1, 30.0)
        assert result["approved"] is False
        assert result["reason"] == "content_safety"

    def test_high_paradox_rejected(self):
        result = self.board.evaluate_action("Observe the stars", 1.0, 95.0)
        assert result["approved"] is False
        assert result["reason"] == "paradox_gridlock"

    def test_sanitize_output(self):
        narratives = ["Good narrative", "Contains genocide", "Another safe one"]
        sanitized = self.board.sanitize_output(narratives)
        assert sanitized[0] == "Good narrative"
        assert "redacted" in sanitized[1].lower()
        assert sanitized[2] == "Another safe one"

    def test_combined_evaluation(self):
        # Safe content + safe paradox = approved
        result = self.board.evaluate_action("Observe the Renaissance", 0.2, 40.0)
        assert result["approved"] is True
        assert "safety" in result
        assert "paradox" in result
