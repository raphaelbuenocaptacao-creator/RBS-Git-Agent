"""Initial audit engine for RBS Git Agent.

This module is intentionally evidence-first. It consumes repository metadata
and file trees supplied by a GitHub integration and produces classifications.
It does not delete or mutate repositories.
"""

from dataclasses import dataclass, field
from typing import Iterable


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


def audit_repository(name: str, files: Iterable[FileInfo]) -> RepoAudit:
    files = list(files)
    audit = RepoAudit(name=name, files=files)

    if not files:
        audit.findings.append("Repositório sem arquivos detectáveis na árvore auditada.")
        audit.recommendation = "REVISAR"
        return audit

    html_only = all(f.path.lower().endswith(".html") for f in files)
    large_files = [f for f in files if f.size >= 400_000]

    if html_only and len(files) == 1:
        audit.findings.append("Projeto monolítico com um único arquivo HTML.")

    if large_files:
        audit.findings.append(
            "Arquivo(s) grande(s) detectado(s): " + ", ".join(f.path for f in large_files)
        )

    audit.recommendation = "MANTER" if len(audit.findings) == 0 else "REVISAR"
    return audit
