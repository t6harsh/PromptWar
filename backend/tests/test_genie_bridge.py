"""
Chronos Paradox — Test Suite: Genie Bridge

Tests for the world model: state management, butterfly effect application,
environment snapshots, and multi-era state tracking.
"""

import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from genie_bridge import GenieBridge


class TestGenieBridge:
    """Tests for world model management."""

    def setup_method(self):
        self.genie = GenieBridge()

    def test_get_world_state_renaissance(self):
        state = self.genie.get_world_state("Renaissance")
        assert "era" in state
        assert "year" in state
        assert "stability" in state

    def test_get_world_state_cyberpunk(self):
        state = self.genie.get_world_state("Cyberpunk")
        assert "era" in state
        assert state["era"] == "Cyberpunk"

    def test_get_all_states(self):
        states = self.genie.get_all_states()
        assert isinstance(states, (dict, list))

    def test_apply_butterfly_effect(self):
        delta = {"stability": -0.1}
        result = self.genie.apply_butterfly_effect(delta)
        assert isinstance(result, dict)

    def test_generate_environment_snapshot(self):
        snapshot = self.genie.generate_environment_snapshot("Renaissance")
        assert isinstance(snapshot, dict)

    def test_unknown_era_returns_default(self):
        state = self.genie.get_world_state("Atlantis")
        assert isinstance(state, dict)
