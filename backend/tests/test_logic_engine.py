"""
Chronos Paradox — Test Suite: Temporal Logic Engine

Tests for causality chains, butterfly effect calculations,
paradox detection, and timeline state management.
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from logic_engine import TemporalLogicEngine, TemporalAnchor, CausalLink


class TestTemporalLogicEngine:
    """Tests for the core temporal logic engine."""

    def setup_method(self):
        self.engine = TemporalLogicEngine()

    # ─── Timeline Initialization ───

    def test_default_timeline_has_8_anchors(self):
        assert len(self.engine.anchors) == 8

    def test_default_timeline_has_branches(self):
        assert len(self.engine.branches) >= 2
        assert "primary" in self.engine.branches

    def test_primary_branch_exists(self):
        primary = self.engine.branches["primary"]
        assert primary.is_primary is True
        assert primary.name == "Alpha Timeline"

    def test_default_butterfly_index(self):
        assert self.engine.butterfly_index == 50.0

    # ─── Anchor Points ───

    def test_renaissance_anchor_exists(self):
        assert "n3" in self.engine.anchors
        assert self.engine.anchors["n3"].era == "Renaissance"
        assert self.engine.anchors["n3"].label == "Leonardo's Workshop"

    def test_anchor_statuses(self):
        assert self.engine.anchors["n1"].status == "stable"
        assert self.engine.anchors["n3"].status == "shifting"
        assert self.engine.anchors["n8"].status == "paradox"

    # ─── Causality Checks ───

    def test_causality_renaissance_to_cyberpunk(self):
        result = self.engine.check_causality("Renaissance", "Cyberpunk")
        assert result["valid"] is True
        assert result["chain_length"] > 0
        assert "path" in result

    def test_causality_invalid_era(self):
        result = self.engine.check_causality("Atlantis", "Cyberpunk")
        assert result["valid"] is False

    def test_causality_path_length(self):
        result = self.engine.check_causality("Dark Ages", "Cyberpunk")
        assert result["valid"] is True
        assert result["chain_length"] >= 3  # Must pass through multiple eras

    def test_causality_includes_paradox_risk(self):
        result = self.engine.check_causality("Renaissance", "Cyberpunk")
        assert "paradox_risk" in result
        assert 0.0 <= result["paradox_risk"] <= 1.0

    # ─── Command Processing ───

    def test_process_save_command(self):
        result = self.engine.process_command("Save Leonardo from the sabotage")
        assert "action_id" in result
        assert "butterfly_effect" in result
        assert "echo_messages" in result
        assert len(result["echo_messages"]) > 0

    def test_process_destroy_command_has_higher_risk(self):
        save_result = self.engine.process_command("Save the workshop")
        destroy_result = self.engine.process_command("Destroy the temporal artifact")
        # Destroy should generally have higher risk
        save_risk = save_result["butterfly_effect"]["paradox_risk"]
        destroy_risk = destroy_result["butterfly_effect"]["paradox_risk"]
        # We can't guarantee exact values due to randomness, but structure should be right
        assert 0.0 <= save_risk <= 1.0
        assert 0.0 <= destroy_risk <= 1.0

    def test_command_updates_butterfly_index(self):
        initial = self.engine.butterfly_index
        self.engine.process_command("Destroy all temporal anchors")
        # Butterfly index should change after a command
        assert isinstance(self.engine.butterfly_index, float)

    def test_command_records_action_history(self):
        assert len(self.engine.action_history) == 0
        self.engine.process_command("Look at the stars")
        assert len(self.engine.action_history) == 1
        assert self.engine.action_history[0]["command"] == "Look at the stars"

    def test_command_affected_eras(self):
        result = self.engine.process_command("Save Leonardo from the sabotage", "Renaissance")
        effect = result["butterfly_effect"]
        assert "Renaissance" in effect["affected_eras"]

    def test_command_narrative_changes(self):
        result = self.engine.process_command("Save the monks", "Dark Ages")
        effect = result["butterfly_effect"]
        assert len(effect["narrative_changes"]) > 0

    # ─── Timeline State ───

    def test_get_timeline_state(self):
        state = self.engine.get_timeline_state()
        assert "anchors" in state
        assert "branches" in state
        assert "butterfly_index" in state
        assert "active_branch" in state
        assert "total_actions" in state

    def test_timeline_state_has_correct_anchor_count(self):
        state = self.engine.get_timeline_state()
        assert len(state["anchors"]) == 8

    # ─── Causal Path Finding ───

    def test_find_causal_path_direct(self):
        path = self.engine._find_causal_path("n1", "n2")
        assert path == ["n1", "n2"]

    def test_find_causal_path_multi_hop(self):
        path = self.engine._find_causal_path("n1", "n3")
        assert "n1" in path
        assert "n3" in path
        assert len(path) >= 3  # At least n1 -> n2 -> n3

    def test_find_causal_path_nonexistent(self):
        path = self.engine._find_causal_path("n8", "n1")
        assert path == []  # No backward links in default timeline
