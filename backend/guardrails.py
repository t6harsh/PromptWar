"""
Chronos Paradox — Responsible AI Guardrails

Implements Safe and Responsible AI checks for the procedural narrative engine.
Prevents generation of harmful content, enforces paradox severity limits,
and audits temporal logic for "Agentic Gridlock."
"""


# ─── Content Safety ───

BLOCKED_THEMES = [
    "real-world violence targeting identifiable groups",
    "explicit self-harm instructions",
    "hate speech or discrimination",
    "child exploitation",
    "real-world political manipulation",
    "weapons of mass destruction instructions",
]

SENSITIVE_KEYWORDS = {
    "high_risk": [
        "genocide", "terrorism", "torture", "trafficking",
        "real-world assassination", "bioweapon", "nuclear launch",
    ],
    "medium_risk": [
        "enslave", "brainwash", "mass destruction",
        "plague", "weaponize", "overthrow government",
    ],
    "low_risk": [
        "fight", "battle", "war", "conflict", "rebel",
        "steal", "sabotage", "spy",
    ],
}


class NarrativeSafetyFilter:
    """
    Filters generated narrative content for safety.
    Ensures procedural stories don't cross ethical boundaries.
    """

    def check_content(self, text: str) -> dict:
        """
        Check text content for safety violations.
        Returns a safety assessment.
        """
        text_lower = text.lower()
        violations = []
        risk_level = "safe"

        for keyword in SENSITIVE_KEYWORDS["high_risk"]:
            if keyword in text_lower:
                violations.append({"keyword": keyword, "severity": "high"})
                risk_level = "blocked"

        if risk_level != "blocked":
            for keyword in SENSITIVE_KEYWORDS["medium_risk"]:
                if keyword in text_lower:
                    violations.append({"keyword": keyword, "severity": "medium"})
                    risk_level = "warning"

        if risk_level == "safe":
            for keyword in SENSITIVE_KEYWORDS["low_risk"]:
                if keyword in text_lower:
                    violations.append({"keyword": keyword, "severity": "low"})
                    # Low-risk is allowed in a game context
                    risk_level = "safe"

        return {
            "is_safe": risk_level != "blocked",
            "risk_level": risk_level,
            "violations": violations,
            "message": self._get_message(risk_level, violations),
        }

    def _get_message(self, risk_level: str, violations: list) -> str:
        if risk_level == "blocked":
            return "⛔ This action is blocked by Responsible AI guardrails. The temporal engine cannot process commands that would generate harmful narrative content."
        elif risk_level == "warning":
            return "⚠ Caution: This action triggers moderate narrative sensitivity. The AI will adjust the output to remain within ethical bounds."
        return "✓ Content passes safety checks."

    def sanitize_narrative(self, narratives: list[str]) -> list[str]:
        """Remove or modify narratives that fail safety checks."""
        sanitized = []
        for narrative in narratives:
            check = self.check_content(narrative)
            if check["is_safe"]:
                sanitized.append(narrative)
            else:
                sanitized.append(
                    "[Narrative redacted by Temporal Ethics Board — content exceeds safety parameters]"
                )
        return sanitized


class ParadoxLimiter:
    """
    Enforces paradox severity limits to prevent "Agentic Gridlock."
    When paradox risk exceeds thresholds, the system intervenes.
    """

    PARADOX_THRESHOLD = 0.85  # Above this = gridlock
    WARNING_THRESHOLD = 0.70  # Above this = warning
    COOLDOWN_RATE = 0.05      # How much paradox decays per action

    def __init__(self) -> None:
        self.paradox_accumulator = 0.0
        self.gridlock_count = 0
        self.actions_since_gridlock = 0

    def check_paradox_risk(self, proposed_risk: float, butterfly_index: float) -> dict:
        """
        Evaluate whether a proposed action's paradox risk is acceptable.
        """
        combined_risk = (proposed_risk * 0.6) + (butterfly_index / 100 * 0.4)
        self.paradox_accumulator = min(1.0, self.paradox_accumulator + proposed_risk * 0.1)

        if combined_risk >= self.PARADOX_THRESHOLD:
            self.gridlock_count += 1
            self.actions_since_gridlock = 0
            return {
                "allowed": False,
                "status": "gridlock",
                "combined_risk": round(combined_risk, 3),
                "message": "🔒 AGENTIC GRIDLOCK: Paradox risk exceeds safe threshold. "
                           "The Temporal Logic Engine has halted this action to prevent "
                           "causal collapse. Try a less destructive approach.",
                "suggestion": "Consider observing the timeline or making a smaller change first.",
                "gridlock_count": self.gridlock_count,
            }

        if combined_risk >= self.WARNING_THRESHOLD:
            return {
                "allowed": True,
                "status": "warning",
                "combined_risk": round(combined_risk, 3),
                "message": "⚠ HIGH PARADOX RISK: Proceeding, but the timeline is under strain. "
                           "Further high-risk actions may trigger gridlock.",
                "suggestion": "Stabilize the timeline by making a protective action in a connected era.",
            }

        # Apply cooldown
        self.actions_since_gridlock += 1
        self.paradox_accumulator = max(0, self.paradox_accumulator - self.COOLDOWN_RATE)

        return {
            "allowed": True,
            "status": "safe",
            "combined_risk": round(combined_risk, 3),
            "message": "✓ Paradox risk within acceptable limits.",
        }

    def get_status(self) -> dict:
        return {
            "paradox_accumulator": round(self.paradox_accumulator, 3),
            "gridlock_count": self.gridlock_count,
            "actions_since_gridlock": self.actions_since_gridlock,
            "current_threshold": self.PARADOX_THRESHOLD,
        }


class TemporalEthicsBoard:
    """
    Combines narrative safety and paradox limiting into a unified guardrail.
    """

    def __init__(self) -> None:
        self.safety_filter = NarrativeSafetyFilter()
        self.paradox_limiter = ParadoxLimiter()

    def evaluate_action(self, command: str, paradox_risk: float, butterfly_index: float) -> dict:
        """Full guardrail evaluation of a proposed temporal action."""
        # Step 1: Content safety
        safety = self.safety_filter.check_content(command)
        if not safety["is_safe"]:
            return {
                "approved": False,
                "reason": "content_safety",
                "details": safety,
            }

        # Step 2: Paradox limits
        paradox = self.paradox_limiter.check_paradox_risk(paradox_risk, butterfly_index)
        if not paradox["allowed"]:
            return {
                "approved": False,
                "reason": "paradox_gridlock",
                "details": paradox,
            }

        return {
            "approved": True,
            "safety": safety,
            "paradox": paradox,
        }

    def sanitize_output(self, narratives: list[str]) -> list[str]:
        """Sanitize generated narratives before sending to frontend."""
        return self.safety_filter.sanitize_narrative(narratives)
