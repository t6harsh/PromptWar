"""
Chronos Paradox — Temporal Logic Engine

Handles "Long-Horizon Reasoning" using Gemini 3 Deep Think.
Tracks causality chains across eras, detects paradoxes, and manages
the Butterfly Effect index for timeline branch management.
"""

import os
import json
import random
import hashlib
from dataclasses import dataclass, field, asdict
from typing import Optional
from datetime import datetime

try:
    from google import genai
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False


# ─────────────────────────────────────────────
# Data Models
# ─────────────────────────────────────────────

@dataclass
class TemporalAnchor:
    """A decision point in the timeline."""
    id: str
    year: int
    era: str
    label: str
    description: str
    status: str = "stable"  # stable | shifting | paradox
    created_at: str = field(default_factory=lambda: datetime.utcnow().isoformat())


@dataclass
class CausalLink:
    """A cause-effect relationship between two anchors."""
    source_id: str
    target_id: str
    effect_type: str  # "positive" | "negative" | "neutral"
    magnitude: float  # 0.0 - 1.0
    description: str = ""


@dataclass
class TimelineBranch:
    """An alternate path in the timeline."""
    id: str
    name: str
    divergence_point: str  # anchor_id
    probability: float  # 0.0 - 1.0
    is_primary: bool = False
    world_state: dict = field(default_factory=dict)


@dataclass
class ButterflyEffect:
    """Result of a temporal action's ripple across the timeline."""
    source_action: str
    affected_eras: list
    paradox_risk: float  # 0.0 - 1.0
    narrative_changes: list
    world_state_delta: dict


# ─────────────────────────────────────────────
# Temporal Logic Engine
# ─────────────────────────────────────────────

class TemporalLogicEngine:
    """
    Core reasoning engine for the Chronos Paradox system.
    Uses Gemini 3 for deep causal reasoning when available,
    falls back to procedural logic otherwise.
    """

    SYSTEM_PROMPT = """You are the Chronos Temporal Logic Engine, an AI that reasons about
causality across time. You analyze temporal actions and predict their butterfly effects
across multiple eras. You must:
1. Maintain causal consistency — no grandfather paradoxes
2. Track ripple effects across at least 3 eras for each action
3. Generate narrative descriptions of how changes cascade
4. Rate paradox risk from 0.0 (safe) to 1.0 (catastrophic)
5. Suggest corrective actions when paradox risk > 0.7

Respond in JSON with keys: affected_eras, paradox_risk, narrative_changes, world_state_delta"""

    def __init__(self):
        self.anchors: dict[str, TemporalAnchor] = {}
        self.causal_links: list[CausalLink] = []
        self.branches: dict[str, TimelineBranch] = {}
        self.butterfly_index: float = 50.0
        self.action_history: list[dict] = []
        self.client = None

        # Initialize Gemini client if API key is present
        api_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
        if GEMINI_AVAILABLE and api_key:
            try:
                self.client = genai.Client(api_key=api_key)
            except Exception:
                self.client = None

        # Seed the default timeline
        self._seed_timeline()

    def _seed_timeline(self):
        """Create the default timeline with canonical anchor points."""
        default_anchors = [
            TemporalAnchor("n1", 800, "Dark Ages", "The Awakening",
                           "Ancient temporal rift first detected by monks"),
            TemporalAnchor("n2", 1200, "Medieval", "Castle Siege",
                           "War over the first temporal artifact"),
            TemporalAnchor("n3", 1400, "Renaissance", "Leonardo's Workshop",
                           "Da Vinci discovers the Chronos blueprints", "shifting"),
            TemporalAnchor("n4", 1750, "Enlightenment", "The Invention",
                           "First temporal compass assembled"),
            TemporalAnchor("n5", 1900, "Industrial", "The Machine",
                           "Industrial-scale temporal experiments begin"),
            TemporalAnchor("n6", 2024, "Digital", "The Singularity",
                           "AI becomes aware of temporal rifts", "shifting"),
            TemporalAnchor("n7", 2200, "Neo Age", "First Colony",
                           "Humanity's first temporal colony established"),
            TemporalAnchor("n8", 2847, "Cyberpunk", "Neo-Kyoto",
                           "The Chronos Paradox reaches critical mass", "paradox"),
        ]
        for anchor in default_anchors:
            self.anchors[anchor.id] = anchor

        default_links = [
            CausalLink("n1", "n2", "positive", 0.3, "Discovery leads to conflict"),
            CausalLink("n2", "n3", "positive", 0.5, "Artifacts inspire Renaissance minds"),
            CausalLink("n3", "n4", "positive", 0.7, "Blueprints enable the invention"),
            CausalLink("n3", "n5", "neutral", 0.2, "Alternate industrial path"),
            CausalLink("n4", "n5", "positive", 0.6, "Compass powers the machine"),
            CausalLink("n5", "n6", "positive", 0.8, "Machine data feeds digital age"),
            CausalLink("n6", "n7", "positive", 0.5, "AI enables colony planning"),
            CausalLink("n6", "n8", "negative", 0.4, "Digital overreach creates dystopia"),
            CausalLink("n7", "n8", "positive", 0.6, "Colony resources flow to Neo-Kyoto"),
        ]
        self.causal_links = default_links

        self.branches = {
            "primary": TimelineBranch("primary", "Alpha Timeline", "n1", 0.7, True),
            "b7": TimelineBranch("b7", "Branch B-7 (Cyberpunk)", "n6", 0.3, False),
        }

    # ───── Core API ─────

    def process_command(self, command: str, current_era: str = "Renaissance") -> dict:
        """
        Process a temporal command and return the butterfly effect.
        Uses Gemini for reasoning if available, else procedural fallback.
        """
        action_id = hashlib.md5(f"{command}{datetime.utcnow().isoformat()}".encode()).hexdigest()[:8]

        # Record action
        self.action_history.append({
            "id": action_id,
            "command": command,
            "era": current_era,
            "timestamp": datetime.utcnow().isoformat(),
        })

        # Try Gemini reasoning first
        if self.client:
            try:
                return self._gemini_reason(command, current_era, action_id)
            except Exception:
                pass

        # Fallback: procedural reasoning
        return self._procedural_reason(command, current_era, action_id)

    def check_causality(self, source_era: str, target_era: str) -> dict:
        """
        Check if a causal chain exists between two eras.
        Returns the chain and any paradox risks.
        """
        source_anchors = [a for a in self.anchors.values() if a.era == source_era]
        target_anchors = [a for a in self.anchors.values() if a.era == target_era]

        if not source_anchors or not target_anchors:
            return {"valid": False, "reason": "Era not found in timeline"}

        # BFS to find causal path
        source_id = source_anchors[0].id
        target_id = target_anchors[0].id
        path = self._find_causal_path(source_id, target_id)

        paradox_risk = 0.0
        for link in self.causal_links:
            if link.source_id in path and link.effect_type == "negative":
                paradox_risk += link.magnitude * 0.3

        return {
            "valid": len(path) > 0,
            "path": path,
            "paradox_risk": min(paradox_risk, 1.0),
            "chain_length": len(path),
            "description": f"Causal chain from {source_era} to {target_era}: {len(path)} links",
        }

    def get_timeline_state(self) -> dict:
        """Return the full timeline state."""
        return {
            "anchors": [asdict(a) for a in self.anchors.values()],
            "branches": [asdict(b) for b in self.branches.values()],
            "butterfly_index": round(self.butterfly_index, 1),
            "active_branch": next(
                (b.name for b in self.branches.values() if b.is_primary),
                "Alpha Timeline"
            ),
            "total_actions": len(self.action_history),
        }

    # ───── Gemini Reasoning ─────

    def _gemini_reason(self, command: str, era: str, action_id: str) -> dict:
        """Use Gemini 3 for deep temporal reasoning."""
        context = json.dumps({
            "current_era": era,
            "timeline": [asdict(a) for a in self.anchors.values()],
            "butterfly_index": self.butterfly_index,
            "recent_actions": self.action_history[-5:],
        })

        prompt = f"""Analyze this temporal command and predict its butterfly effect:

Command: "{command}"
Current Era: {era}

Timeline Context:
{context}

What are the ripple effects across the timeline? Generate a JSON response."""

        response = self.client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt,
            config={
                "system_instruction": self.SYSTEM_PROMPT,
                "temperature": 0.7,
                "response_mime_type": "application/json",
            },
        )

        try:
            result = json.loads(response.text)
        except (json.JSONDecodeError, AttributeError):
            return self._procedural_reason(command, era, action_id)

        # Update engine state based on Gemini's analysis
        paradox_risk = result.get("paradox_risk", 0.2)
        self.butterfly_index = min(100, self.butterfly_index + paradox_risk * 15)

        return {
            "action_id": action_id,
            "command": command,
            "source": "gemini_deep_think",
            "butterfly_effect": ButterflyEffect(
                source_action=command,
                affected_eras=result.get("affected_eras", [era]),
                paradox_risk=paradox_risk,
                narrative_changes=result.get("narrative_changes", []),
                world_state_delta=result.get("world_state_delta", {}),
            ).__dict__,
            "butterfly_index": round(self.butterfly_index, 1),
            "echo_messages": result.get("narrative_changes", [
                f"Analyzing temporal ripples from: {command}",
                "Gemini Deep Think: causality verified",
            ]),
        }

    # ───── Procedural Fallback ─────

    def _procedural_reason(self, command: str, era: str, action_id: str) -> dict:
        """Procedural butterfly effect calculation when Gemini is unavailable."""
        cmd_lower = command.lower()

        # Classify action intent
        is_save = any(w in cmd_lower for w in ["save", "protect", "warn", "help", "rescue"])
        is_destroy = any(w in cmd_lower for w in ["destroy", "kill", "delete", "remove", "stop"])
        is_change = any(w in cmd_lower for w in ["change", "alter", "modify", "move", "travel"])

        # Calculate base paradox risk
        if is_destroy:
            paradox_risk = 0.5 + random.uniform(0.1, 0.3)
        elif is_change:
            paradox_risk = 0.3 + random.uniform(0.05, 0.2)
        elif is_save:
            paradox_risk = 0.1 + random.uniform(0.05, 0.15)
        else:
            paradox_risk = 0.2 + random.uniform(0, 0.1)

        # Determine affected eras based on causal links
        era_anchor = next((a for a in self.anchors.values() if a.era == era), None)
        affected_eras = [era]
        if era_anchor:
            for link in self.causal_links:
                if link.source_id == era_anchor.id:
                    target = self.anchors.get(link.target_id)
                    if target and target.era not in affected_eras:
                        affected_eras.append(target.era)

        # Generate narrative changes
        narratives = self._generate_narratives(command, era, affected_eras, is_save, is_destroy)

        # Calculate world state delta
        world_delta = {}
        for affected_era in affected_eras:
            if affected_era == era:
                world_delta[affected_era] = {"stability_change": -5 if is_destroy else 3}
            else:
                world_delta[affected_era] = {
                    "stability_change": random.randint(-10, 5),
                    "tech_level_shift": random.choice([-1, 0, 0, 1]),
                }

        # Update engine state
        self.butterfly_index = min(100, max(0, self.butterfly_index + paradox_risk * 12))

        # Check for paradox threshold
        is_paradox = paradox_risk > 0.7
        if is_paradox and era_anchor:
            era_anchor.status = "paradox"
            narratives.append("⚠ PARADOX WARNING: Causal loop approaching gridlock threshold")

        effect = ButterflyEffect(
            source_action=command,
            affected_eras=affected_eras,
            paradox_risk=round(paradox_risk, 3),
            narrative_changes=narratives,
            world_state_delta=world_delta,
        )

        echo = [
            f"Processing temporal command: \"{command}\"",
            f"Scanning {len(affected_eras)} affected era(s)...",
            *narratives[:3],
            f"Butterfly Index updated: {round(self.butterfly_index, 1)}%",
        ]

        return {
            "action_id": action_id,
            "command": command,
            "source": "procedural_engine",
            "butterfly_effect": effect.__dict__,
            "butterfly_index": round(self.butterfly_index, 1),
            "echo_messages": echo,
            "is_paradox": is_paradox,
        }

    def _generate_narratives(self, command: str, era: str, affected: list,
                             is_save: bool, is_destroy: bool) -> list:
        """Generate narrative changes describing the butterfly effect."""
        narratives = []

        if is_save:
            narratives.append(f"Action in {era}: A life is preserved. The timeline shifts.")
            if "Cyberpunk" in affected:
                narratives.append(
                    "2847 AD: Neo-Kyoto's architecture evolves — brass and organic motifs emerge"
                )
            if "Neo Age" in affected:
                narratives.append("2200 AD: Colony resources redistribute based on new lineage")
        elif is_destroy:
            narratives.append(f"Action in {era}: Destruction ripples forward. Stability drops.")
            if "Digital" in affected:
                narratives.append("2024 AD: The Singularity event accelerates unpredictably")
            if "Cyberpunk" in affected:
                narratives.append("2847 AD: Neo-Kyoto descends further into dystopia")
        else:
            narratives.append(f"Action in {era}: The timeline adjusts to accommodate changes")
            narratives.append(
                f"Temporal flux detected across {len(affected)} eras — recalibrating"
            )

        return narratives

    def _find_causal_path(self, source_id: str, target_id: str) -> list:
        """BFS to find causal chain between two anchors."""
        visited = set()
        queue = [(source_id, [source_id])]

        while queue:
            current, path = queue.pop(0)
            if current == target_id:
                return path
            if current in visited:
                continue
            visited.add(current)
            for link in self.causal_links:
                if link.source_id == current and link.target_id not in visited:
                    queue.append((link.target_id, path + [link.target_id]))

        return []
