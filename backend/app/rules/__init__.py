"""Rules package for deterministic narrative audio validation."""
from app.rules.cue_coverage import evaluate_cue_coverage
from app.rules.emotional_continuity import (
    evaluate_emotional_continuity,
    evaluate_tension_lifecycle,
)
from app.rules.evaluator import run_validation_suite
from app.rules.reveal_protection import evaluate_reveal_protection

__all__ = [
    "run_validation_suite",
    "evaluate_reveal_protection",
    "evaluate_cue_coverage",
    "evaluate_tension_lifecycle",
    "evaluate_emotional_continuity",
]
