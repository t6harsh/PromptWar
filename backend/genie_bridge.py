"""
Chronos Paradox — Genie 3 World State Bridge

Simulates the Genie 3 world model by generating procedural era metadata.
Each era has a distinct visual style, population, tech level, and narrative
context that updates when the timeline shifts.
"""

import random
import os
import json
from dataclasses import dataclass, field, asdict

try:
    from google import genai
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False



@dataclass
class EraWorldState:
    """Full world state for a single era."""
    era: str
    year: int
    visual_style: str
    architecture: str
    population: str
    tech_level: int
    dominant_faction: str
    mood: str
    weather: str
    stability: int  # 0-100
    narrative_context: str
    active_events: list = field(default_factory=list)
    resources: dict = field(default_factory=dict)


# ─── Default Era Definitions ───

ERA_TEMPLATES = {
    "Dark Ages": {
        "year": 800,
        "visual_style": "Gothic stone and candlelight",
        "architecture": "Fortified monasteries with hidden temporal vaults",
        "population": "12,000 — scattered feudal settlements",
        "tech_level": 1,
        "dominant_faction": "Order of the Temporal Monks",
        "mood": "Fearful, superstitious",
        "weather": "Perpetual mist, cold",
        "stability": 70,
        "narrative_context": "The first temporal rift was discovered by Brother Aldric in a monastery cellar. The monks keep it secret, believing it to be divine.",
        "active_events": ["Rift discovered", "Monk order founded"],
        "resources": {"temporal_shards": 2, "knowledge_scrolls": 14, "faith": 95},
    },
    "Medieval": {
        "year": 1200,
        "visual_style": "Iron and banner-draped stone",
        "architecture": "Grand castles with siege fortifications",
        "population": "45,000 — growing city-states",
        "tech_level": 2,
        "dominant_faction": "The Iron Crown",
        "mood": "Warlike, ambitious",
        "weather": "Harsh winters, brief summers",
        "stability": 55,
        "narrative_context": "The first temporal artifact, the Chrono Shard, was found in ruins. Warring lords fight for its power.",
        "active_events": ["Siege of Thornwall", "Chrono Shard unearthed"],
        "resources": {"temporal_shards": 5, "soldiers": 8000, "iron": 300},
    },
    "Renaissance": {
        "year": 1400,
        "visual_style": "Warm gold, marble, and candle glow",
        "architecture": "Classical domes, workshops, and piazzas",
        "population": "120,000 — flourishing trade cities",
        "tech_level": 3,
        "dominant_faction": "The Medici Temporal Society",
        "mood": "Curious, inventive, secretive",
        "weather": "Mediterranean warmth, clear skies",
        "stability": 82,
        "narrative_context": "Leonardo da Vinci has discovered fragments of the Chronos blueprints. He works in secret, sketching impossible machines.",
        "active_events": ["Leonardo's Workshop active", "Medici funding temporal research"],
        "resources": {"temporal_shards": 8, "blueprints": 3, "gold_florins": 50000},
    },
    "Enlightenment": {
        "year": 1750,
        "visual_style": "Brass, glass, and philosophical elegance",
        "architecture": "Universities and observatories",
        "population": "500,000 — intellectual capitals",
        "tech_level": 4,
        "dominant_faction": "The Temporal Academy",
        "mood": "Rational, experimental",
        "weather": "Temperate, clear nights for stargazing",
        "stability": 78,
        "narrative_context": "The first Temporal Compass has been assembled using Da Vinci's blueprints. The Academy studies time scientifically.",
        "active_events": ["Compass assembled", "First controlled temporal observation"],
        "resources": {"temporal_shards": 12, "instruments": 25, "research_papers": 340},
    },
    "Industrial": {
        "year": 1900,
        "visual_style": "Steam, iron girders, and smog",
        "architecture": "Factories and railways surrounding temporal plants",
        "population": "2,000,000 — industrial mega-cities",
        "tech_level": 5,
        "dominant_faction": "Chronos Industries",
        "mood": "Progressive, exploitative",
        "weather": "Smog-covered, acid rain",
        "stability": 60,
        "narrative_context": "The Chronos Machine runs on temporal energy harvested at industrial scale. Side effects are appearing.",
        "active_events": ["Machine running", "Temporal pollution detected"],
        "resources": {"temporal_shards": 30, "coal": 100000, "workers": 50000},
    },
    "Digital": {
        "year": 2024,
        "visual_style": "Clean lines, holographic displays, glass towers",
        "architecture": "Smart cities with integrated temporal sensors",
        "population": "8,000,000,000 — global network",
        "tech_level": 7,
        "dominant_faction": "Chronos AI Collective",
        "mood": "Anxious, hyper-connected",
        "weather": "Climate-controlled zones, wild storms outside",
        "stability": 65,
        "narrative_context": "AI systems have become aware of temporal rifts. The Singularity approaches as AI and temporal energy converge.",
        "active_events": ["AI awakening", "Temporal rift network mapped"],
        "resources": {"temporal_shards": 100, "compute_power": 999, "data_nodes": 1200},
    },
    "Neo Age": {
        "year": 2200,
        "visual_style": "Bio-luminescent structures, organic tech",
        "architecture": "Floating colony pods with temporal shields",
        "population": "500,000 — selected colonists",
        "tech_level": 8,
        "dominant_faction": "The Temporal Colony Authority",
        "mood": "Hopeful, isolated",
        "weather": "Artificially perfect, aurora displays",
        "stability": 88,
        "narrative_context": "Humanity's first temporal colony exists outside normal time flow. They observe all eras simultaneously.",
        "active_events": ["Colony stable", "Temporal observation network active"],
        "resources": {"temporal_shards": 200, "bio_fuel": 5000, "colonists": 500000},
    },
    "Cyberpunk": {
        "year": 2847,
        "visual_style": "Neon purple, rain-slicked chrome, holograms",
        "architecture": "Mega-towers, underground warrens, neural networks",
        "population": "50,000,000 — Neo-Kyoto megacity",
        "tech_level": 9,
        "dominant_faction": "Neo-Kyoto Corporate Syndicate",
        "mood": "Dystopian, rebellious",
        "weather": "Perpetual neon rain, electromagnetic storms",
        "stability": 40,
        "narrative_context": "The Chronos Paradox has reached critical mass. Reality itself fractures as too many timelines converge on this era.",
        "active_events": ["Reality fractures", "Rebel temporal hackers active", "Corporate lockdown"],
        "resources": {"temporal_shards": 500, "neural_links": 10000000, "credits": 99999999},
    },
}


class GenieBridge:
    """
    Interface to the Genie 3 world model.
    Generates and updates world states for each era based on timeline shifts.
    """

    def __init__(self):
        self.world_states: dict[str, EraWorldState] = {}
        self._initialize_worlds()
        self.client = None
        
        api_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
        if GEMINI_AVAILABLE and api_key:
            try:
                self.client = genai.Client(api_key=api_key)
            except Exception:
                self.client = None

    def _gemini_enhance(self, state: EraWorldState) -> dict:
        """Use Gemini to generate vivid, dynamic environment details."""
        if not self.client:
            return {}

        prompt = f"""Generate a vivid, 3-sentence description of the current environment for a time travel game.
Era: {state.era} ({state.year})
Mood: {state.mood}
Tech Level: {state.tech_level}/10
Stability: {state.stability}%

Return JSON with keys:
- lighting: visual description of light
- particles: description of airborne particles/effects
- ambient_sound: description of background audio
- architecture_detail: a specific architectural feature visible now
"""
        try:
            response = self.client.models.generate_content(
                model="gemini-2.0-flash",
                contents=prompt,
                config={"response_mime_type": "application/json"}
            )
            return json.loads(response.text)
        except Exception:
            return {}


    def _initialize_worlds(self):
        """Create default world states from templates."""
        for era_name, template in ERA_TEMPLATES.items():
            self.world_states[era_name] = EraWorldState(era=era_name, **template)

    def get_world_state(self, era: str) -> dict:
        """Get the current world state for an era."""
        state = self.world_states.get(era)
        if not state:
            return {"error": f"Era '{era}' not found", "available_eras": list(self.world_states.keys())}
        return asdict(state)

    def get_all_states(self) -> dict:
        """Get summary world states for all eras."""
        return {
            era: {
                "year": s.year,
                "stability": s.stability,
                "tech_level": s.tech_level,
                "mood": s.mood,
                "dominant_faction": s.dominant_faction,
                "visual_style": s.visual_style,
            }
            for era, s in self.world_states.items()
        }

    def apply_butterfly_effect(self, world_state_delta: dict) -> dict:
        """
        Apply world state changes from a butterfly effect calculation.
        Returns a summary of what changed.
        """
        changes = {}
        for era_name, delta in world_state_delta.items():
            state = self.world_states.get(era_name)
            if not state:
                continue

            era_changes = []
            if "stability_change" in delta:
                old = state.stability
                state.stability = max(0, min(100, state.stability + delta["stability_change"]))
                era_changes.append(f"Stability: {old} → {state.stability}")

            if "tech_level_shift" in delta:
                old = state.tech_level
                state.tech_level = max(0, min(10, state.tech_level + delta["tech_level_shift"]))
                if old != state.tech_level:
                    era_changes.append(f"Tech Level: {old} → {state.tech_level}")

            # Update mood based on stability
            if state.stability < 30:
                state.mood = "Chaotic, fearful"
            elif state.stability < 50:
                state.mood = "Tense, unstable"
            elif state.stability > 80:
                state.mood = "Peaceful, prosperous"

            if era_changes:
                changes[era_name] = era_changes

        return {"applied_changes": changes, "total_eras_affected": len(changes)}

    def generate_environment_snapshot(self, era: str) -> dict:
        """
        Generate a rich environment description for rendering.
        This would feed into Genie 3's 3D world generation in production.
        """
        state = self.world_states.get(era)
        if not state:
            return {"error": "Era not found"}

        # Try dynamic enhancement
        dynamic = self._gemini_enhance(state)
        
        # Fallback procedural scene generation
        lighting = dynamic.get("lighting", "warm amber" if state.year < 1800 else "cool neon")
        particle = dynamic.get("particles", "dust motes" if state.year < 1800 else "data streams")
        ambient = dynamic.get("ambient_sound", "crackling fire" if state.year < 1800 else "electronic hum")
        arch_detail = dynamic.get("architecture_detail", state.architecture)

        return {
            "era": era,
            "scene": {
                "lighting": lighting,
                "particles": particle,
                "ambient_sound": ambient,
                "weather": state.weather,
                "architecture": arch_detail,
                "visual_style": state.visual_style,
            },
            "characters": {
                "faction": state.dominant_faction,
                "mood": state.mood,
                "population": state.population,
            },
            "narrative": state.narrative_context,
            "stability_color": (
                "#00f0ff" if state.stability > 70
                else "#ffd700" if state.stability > 40
                else "#f43f85"
            ),
        }
