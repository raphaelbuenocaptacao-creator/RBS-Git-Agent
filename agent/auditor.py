"""RBS Git Agent: safe evidence-first repository auditor."""
from __future__ import annotations
from dataclasses import dataclass, field
from typing import Iterable

OFFICIAL = {
    "captaPro": "main application",
    "CaptaPro-Analytics-PWA": "analytics",
    "Consultoria-e-relat-rio": "commercial reporting",
    "RASULTADOS-E-PERFOMANCE": "results/performance",
    "Gamificacao300": "gamification",
    "Campos-Pass": "specific project",
    "Mundo-da-Sarah": "specific project",
    "Arena-sx": "specialized gamification candidate",
}

@dataclass
class FileInfo:
    path: str
    size: int = 0

@dataclass
class RepoAudit:
    name: str
    files: list[FileInfo] = field(default_factory=list)
    findings: list[str] = field(default_factory=list)
    recommendation: str = "REVISAR"
    confidence: float = 0.0


def audit_repository(name: str, files: Iterable[FileInfo]) -> RepoAudit:
    files = list(files)
    audit = RepoAudit(name=name, files=files)
    if not files:
        audit.findings.append("Nenhum arquivo detectável na árvore auditada.")
        audit.confidence = 0.4
        return audit
    if name in OFFICIAL:
        audit.findings.append(f"Projeto reconhecido como oficial: {OFFICIAL[name]}.")
    if all(f.path.lower().endswith('.html') for f in files) and len(files) == 1:
        audit.findings.append("Projeto monolítico com um único arquivo HTML.")
    large = [f.path for f in files if f.size >= 400_000]
    if large:
        audit.findings.append("Arquivo(s) grande(s): " + ", ".join(large))
    audit.recommendation = "MANTER" if name in OFFICIAL else "REVISAR"
    audit.confidence = 0.85 if name in OFFICIAL else 0.65
    return audit
