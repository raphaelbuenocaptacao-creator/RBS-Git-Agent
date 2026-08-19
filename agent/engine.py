"""Core decision engine for RBS Git Agent.

The engine is deliberately policy-first: it can recommend and prepare work,
but destructive actions remain approval-only regardless of learned confidence.
"""
from dataclasses import dataclass
from enum import Enum

class Risk(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    CRITICAL = "critical"

@dataclass
class Proposal:
    action: str
    reason: str
    risk: Risk
    confidence: float = 0.0
    requires_approval: bool = True

DESTRUCTIVE = {"delete_repository", "delete_file", "delete_branch", "delete_data", "change_secret", "production_deploy", "destructive_migration"}

def propose(action: str, reason: str, confidence: float = 0.0) -> Proposal:
    critical = action in DESTRUCTIVE
    return Proposal(action, reason, Risk.CRITICAL if critical else Risk.MEDIUM, confidence, True if critical else confidence < 0.90)

def can_execute(proposal: Proposal, approved: bool = False) -> bool:
    if proposal.action in DESTRUCTIVE:
        return approved
    return approved or not proposal.requires_approval
