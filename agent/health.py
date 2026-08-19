"""Project health scoring primitives."""
from dataclasses import dataclass

@dataclass
class Health:
    score: int
    label: str
    findings: list[str]

def score_health(findings: list[str], critical: int = 0) -> Health:
    score = max(0, 100 - len(findings) * 5 - critical * 20)
    label = "GREEN" if score >= 85 else "YELLOW" if score >= 65 else "RED"
    return Health(score, label, findings)
