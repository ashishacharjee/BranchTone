"""Report generation service for BranchTone.

Serializes validation runs, findings, and evidence into canonical JSON and Markdown reports.
"""
from __future__ import annotations

import hashlib
import json
from datetime import datetime, timezone
from typing import Any

from app.domain.entities import Finding, SimulationRun, StoryVersion, ValidationRun


def generate_json_report(
    validation_run: ValidationRun,
    simulation_run: SimulationRun,
    story_version: StoryVersion,
) -> dict[str, Any]:
    """Generates a canonical, reproducible JSON report."""
    raw_payload = {
        "report_id": f"rep_{validation_run.run_id[4:]}",
        "project_id": validation_run.project_id,
        "version_id": validation_run.version_id,
        "source_filename": story_version.source_filename,
        "source_sha256": story_version.source_sha256,
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "exploration_status": simulation_run.exploration_status,
        "routes_explored": len(simulation_run.routes),
        "states_explored": simulation_run.states_explored,
        "total_findings": validation_run.total_findings,
        "rule_summary": validation_run.rule_counts,
        "findings": [f.model_dump(mode="json") for f in validation_run.findings],
    }

    # Compute deterministic report checksum
    serialized = json.dumps(raw_payload, sort_keys=True)
    report_sha256 = hashlib.sha256(serialized.encode("utf-8")).hexdigest()
    raw_payload["report_sha256"] = report_sha256

    return raw_payload


def generate_markdown_report(
    validation_run: ValidationRun,
    simulation_run: SimulationRun,
    story_version: StoryVersion,
) -> str:
    """Generates a structured Markdown audit report."""
    md = [
        f"# BranchTone Narrative Audio QA Audit Report",
        f"",
        f"- **Project ID:** `{validation_run.project_id}`",
        f"- **Story Version:** `{story_version.version_label}` (`{story_version.source_filename}`)",
        f"- **Source SHA-256:** `{story_version.source_sha256}`",
        f"- **Validation Run ID:** `{validation_run.run_id}`",
        f"- **Generated:** {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S UTC')}",
        f"- **Exploration Coverage:** `{simulation_run.exploration_status}` ({len(simulation_run.routes)} routes, {simulation_run.states_explored} states)",
        f"- **Total Findings:** **{validation_run.total_findings}**",
        f"",
        f"---",
        f"",
        f"## 📋 Rule Summary",
        f"",
        f"| Rule ID | Finding Count |",
        f"| :--- | :---: |",
    ]

    for rule_id, count in validation_run.rule_counts.items():
        md.append(f"| `{rule_id}` | {count} |")

    md.extend([
        f"",
        f"---",
        f"",
        f"## 🔍 Findings & Defect Evidence",
        f"",
    ])

    if not validation_run.findings:
        md.append("*(No defects or violations found. Traversal verified clean.)*")
    else:
        for idx, f in enumerate(validation_run.findings, 1):
            md.extend([
                f"### {idx}. [{f.finding_code}] {f.rule_id} ({f.severity.upper()})",
                f"",
                f"- **Passage:** `{f.passage_id}`",
                f"- **Cue ID:** `{f.cue_id or 'None'}` (Asset: `{f.asset_id or 'None'}`)",
                f"- **Status:** `{f.status.upper()}`",
                f"- **Affected Routes:** {', '.join(f'`{r}`' for r in f.affected_route_ids)}",
                f"- **Route Trace:** `{' -> '.join(f.route_trace)}`",
                f"",
                f"**Explanation:**  ",
                f"> {f.explanation}",
                f"",
            ])
            if f.evidence_quote:
                md.extend([
                    f"**Source Evidence Excerpt:**  ",
                    f"> *\"{f.evidence_quote}\"*",
                    f"",
                ])
            if f.suggested_action:
                md.extend([
                    f"**Suggested Remediation:**  ",
                    f"{f.suggested_action}",
                    f"",
                ])
            md.append("---")

    return "\n".join(md)
