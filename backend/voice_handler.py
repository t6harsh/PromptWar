"""
Chronos Paradox — Voice Command Handler

Processes voice/text commands using sentiment analysis and intent extraction.
Maps user intent to temporal actions for the Logic Engine.
In production, this would interface with the Gemini Live API for
real-time voice streaming and sentiment-aware environment adjustment.
"""

import re
import os
import json

try:
    from google import genai
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False


# ─── Intent Categories ───

TEMPORAL_INTENTS = {
    "save": {
        "keywords": ["save", "protect", "warn", "help", "rescue", "defend", "shield", "preserve"],
        "action": "protective_intervention",
        "sentiment_modifier": "compassionate",
        "vibe": "hopeful",
    },
    "destroy": {
        "keywords": ["destroy", "kill", "eliminate", "delete", "erase", "annihilate", "remove"],
        "action": "destructive_intervention",
        "sentiment_modifier": "aggressive",
        "vibe": "ominous",
    },
    "observe": {
        "keywords": ["look", "observe", "watch", "scan", "analyze", "study", "examine", "inspect"],
        "action": "passive_observation",
        "sentiment_modifier": "curious",
        "vibe": "neutral",
    },
    "travel": {
        "keywords": ["travel", "go", "move", "jump", "teleport", "visit", "navigate", "warp"],
        "action": "temporal_travel",
        "sentiment_modifier": "adventurous",
        "vibe": "energetic",
    },
    "communicate": {
        "keywords": ["tell", "speak", "say", "communicate", "message", "whisper", "announce"],
        "action": "temporal_communication",
        "sentiment_modifier": "diplomatic",
        "vibe": "tense",
    },
    "create": {
        "keywords": ["create", "build", "forge", "craft", "invent", "make", "construct"],
        "action": "creative_intervention",
        "sentiment_modifier": "inspired",
        "vibe": "hopeful",
    },
}

ERA_KEYWORDS = {
    "Dark Ages": ["dark age", "800", "monks", "monastery", "aldric"],
    "Medieval": ["medieval", "1200", "castle", "siege", "iron crown", "knight"],
    "Renaissance": ["renaissance", "1400", "leonardo", "da vinci", "medici", "florence", "workshop"],
    "Enlightenment": ["enlightenment", "1750", "academy", "compass", "philosophy"],
    "Industrial": ["industrial", "1900", "factory", "machine", "steam", "chronos industries"],
    "Digital": ["digital", "2024", "ai", "singularity", "cyber", "network"],
    "Neo Age": ["neo age", "2200", "colony", "colonist", "bio", "floating"],
    "Cyberpunk": ["cyberpunk", "2847", "neo-kyoto", "neon", "hacker", "corporate", "neural"],
}


class VoiceHandler:
    """
    Processes voice/text commands for the Temporal Command Center.
    Extracts intent, target era, sentiment, and maps to temporal actions.
    """

    def __init__(self) -> None:
        self.client = None
        api_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
        if GEMINI_AVAILABLE and api_key:
            try:
                self.client = genai.Client(api_key=api_key)
            except Exception:
                self.client = None

    def process_command(self, text: str) -> dict:
        """
        Process a voice/text command and extract structured intent.
        Uses Gemini if available, otherwise uses procedural NLP.
        """
        if self.client:
            try:
                return self._gemini_process(text)
            except Exception:
                pass
        return self._procedural_process(text)

    def _gemini_process(self, text: str) -> dict:
        """Use Gemini for sophisticated intent extraction and sentiment analysis."""
        prompt = f"""Analyze this temporal command for a time-travel game:
Command: "{text}"

Extract and return JSON with:
- intent: one of [save, destroy, observe, travel, communicate, create]
- target_era: the historical era being targeted (or "current" if unclear)
- sentiment: emotional tone (compassionate, aggressive, curious, etc.)
- vibe: how the game environment should feel (hopeful, ominous, neutral, energetic, tense)
- confidence: 0.0-1.0 how confident you are in the intent
- action_summary: one-line description of what this command means temporally
- subjects: list of key entities mentioned (people, places, objects)"""

        response = self.client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt,
            config={
                "temperature": 0.3,
                "response_mime_type": "application/json",
            },
        )

        try:
            result = json.loads(response.text)
            result["source"] = "gemini_live"
            return result
        except (json.JSONDecodeError, AttributeError):
            return self._procedural_process(text)

    def _procedural_process(self, text: str) -> dict:
        """Rule-based intent extraction and sentiment analysis."""
        text_lower = text.lower().strip()

        # Extract intent
        detected_intent = "observe"
        confidence = 0.5
        for intent_name, intent_data in TEMPORAL_INTENTS.items():
            for keyword in intent_data["keywords"]:
                if keyword in text_lower:
                    detected_intent = intent_name
                    confidence = 0.8
                    break

        intent_data = TEMPORAL_INTENTS[detected_intent]

        # Extract target era
        target_era = "current"
        for era_name, keywords in ERA_KEYWORDS.items():
            for keyword in keywords:
                if keyword in text_lower:
                    target_era = era_name
                    confidence = min(1.0, confidence + 0.1)
                    break

        # Extract subjects (simple NER via regex)
        subjects = []
        # Proper nouns (capitalized words not at start of sentence)
        words = text.split()
        for i, word in enumerate(words):
            clean = re.sub(r'[^a-zA-Z]', '', word)
            if clean and clean[0].isupper() and i > 0:
                subjects.append(clean)

        # Sentiment analysis (simple keyword-based)
        urgency = 0.5
        urgency_words = {"immediately": 0.3, "quickly": 0.2, "now": 0.2, "urgent": 0.3, "hurry": 0.2}
        for word, boost in urgency_words.items():
            if word in text_lower:
                urgency = min(1.0, urgency + boost)

        return {
            "intent": detected_intent,
            "action": intent_data["action"],
            "target_era": target_era,
            "sentiment": intent_data["sentiment_modifier"],
            "vibe": intent_data["vibe"],
            "confidence": round(confidence, 2),
            "urgency": round(urgency, 2),
            "action_summary": f"{intent_data['action'].replace('_', ' ').title()} targeting {target_era}",
            "subjects": subjects,
            "source": "procedural_nlp",
        }

    def get_environment_vibe(self, sentiment: str, era: str) -> dict:
        """
        Generate environment modifications based on sentiment.
        This adjusts the "vibe" of the generated world in real-time.
        """
        vibe_map = {
            "compassionate": {
                "color_shift": "warmer",
                "music_tempo": "adagio",
                "particle_density": 0.3,
                "lighting": "golden hour",
            },
            "aggressive": {
                "color_shift": "redder",
                "music_tempo": "allegro",
                "particle_density": 0.8,
                "lighting": "harsh shadows",
            },
            "curious": {
                "color_shift": "bluer",
                "music_tempo": "moderato",
                "particle_density": 0.5,
                "lighting": "ambient glow",
            },
            "adventurous": {
                "color_shift": "vivid",
                "music_tempo": "vivace",
                "particle_density": 0.6,
                "lighting": "dynamic spotlights",
            },
            "diplomatic": {
                "color_shift": "neutral",
                "music_tempo": "andante",
                "particle_density": 0.4,
                "lighting": "soft diffused",
            },
            "inspired": {
                "color_shift": "warmer",
                "music_tempo": "moderato",
                "particle_density": 0.5,
                "lighting": "bright creative",
            },
        }

        return {
            "era": era,
            "sentiment": sentiment,
            "environment_modifiers": vibe_map.get(sentiment, vibe_map["curious"]),
        }
