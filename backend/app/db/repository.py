"""SQLite database repository for BranchTone.

Persists projects, story versions, simulation runs, validation runs,
findings, and audio assets according to content/sqlite_schema.reference.sql.
"""
from __future__ import annotations

import json
import sqlite3
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from app.domain.entities import (
    AudioAsset,
    AudioCue,
    Finding,
    FindingStatus,
    Passage,
    Project,
    RuleId,
    Severity,
    SimulationRun,
    StoryVersion,
    ValidationRun,
)

DEFAULT_DB_PATH = Path("storage/branchtone.db")
SCHEMA_PATH = Path(__file__).resolve().parents[3] / "content" / "sqlite_schema.reference.sql"


class SQLiteRepository:
    """Manages SQLite storage and retrieval for BranchTone workspace runs and assets."""

    def __init__(self, db_path: Path | str = DEFAULT_DB_PATH) -> None:
        self.db_path = Path(db_path)
        self.db_path.parent.mkdir(parents=True, exist_ok=True)
        self._init_db()

    def get_connection(self) -> sqlite3.Connection:
        conn = sqlite3.connect(str(self.db_path), check_same_thread=False)
        conn.row_factory = sqlite3.Row
        conn.execute("PRAGMA foreign_keys = ON;")
        return conn

    def _init_db(self) -> None:
        if not SCHEMA_PATH.exists():
            return
        with open(SCHEMA_PATH, encoding="utf-8") as f:
            schema_sql = f.read()
        with self.get_connection() as conn:
            conn.executescript(schema_sql)

    # ── Helpers for FK dependencies ───────────────────────────────────────────

    def _ensure_project(self, conn: sqlite3.Connection, project_id: str) -> None:
        row = conn.execute("SELECT project_id FROM projects WHERE project_id = ?", (project_id,)).fetchone()
        if not row:
            now_iso = datetime.now(timezone.utc).isoformat()
            conn.execute(
                """
                INSERT OR IGNORE INTO projects (project_id, name, description, current_version_id, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?)
                """,
                (project_id, f"Project {project_id}", "BranchTone Active Project", "ver_default", now_iso, now_iso),
            )

    def _ensure_version(self, conn: sqlite3.Connection, project_id: str, version_id: str) -> None:
        self._ensure_project(conn, project_id)
        row = conn.execute("SELECT version_id FROM story_versions WHERE version_id = ?", (version_id,)).fetchone()
        if not row:
            now_iso = datetime.now(timezone.utc).isoformat()
            conn.execute(
                """
                INSERT OR IGNORE INTO story_versions (version_id, project_id, version_label, source_filename, source_sha256, story_format, compilation_status, compiled_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (version_id, project_id, version_id, "story.twee", "0" * 64, "twee_harlowe_subset", "success", now_iso),
            )

    def _ensure_passage(self, conn: sqlite3.Connection, version_id: str, passage_id: str) -> None:
        row = conn.execute("SELECT passage_id FROM passages WHERE passage_id = ?", (passage_id,)).fetchone()
        if not row:
            conn.execute(
                """
                INSERT OR IGNORE INTO passages (passage_id, version_id, source_name, title, raw_text, tags_json, provenance)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """,
                (passage_id, version_id, passage_id, passage_id, f"Passage {passage_id}", "[]", "demo_fixture"),
            )

    def _ensure_asset(self, conn: sqlite3.Connection, project_id: str, asset_id: str) -> None:
        self._ensure_project(conn, project_id)
        row = conn.execute("SELECT asset_id FROM audio_assets WHERE asset_id = ?", (asset_id,)).fetchone()
        if not row:
            conn.execute(
                """
                INSERT OR IGNORE INTO audio_assets (
                    asset_id, project_id, filename, media_type, status, provenance
                ) VALUES (?, ?, ?, ?, ?, ?)
                """,
                (asset_id, project_id, asset_id, "music", "missing", "demo_fixture"),
            )

    def _ensure_cue(self, conn: sqlite3.Connection, project_id: str, version_id: str, cue_id: str, passage_id: str) -> None:
        row = conn.execute("SELECT cue_id FROM audio_cues WHERE cue_id = ?", (cue_id,)).fetchone()
        if not row:
            self._ensure_passage(conn, version_id, passage_id)
            self._ensure_asset(conn, project_id, f"asset_for_{cue_id}")
            conn.execute(
                """
                INSERT OR IGNORE INTO audio_cues (
                    cue_id, asset_id, layer, trigger_type, trigger_passage_id, stop_policy, provenance
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
                """,
                (cue_id, f"asset_for_{cue_id}", "music", "passage_entry", passage_id, "end_of_passage", "demo_fixture"),
            )

    def _ensure_simulation(self, conn: sqlite3.Connection, project_id: str, version_id: str, simulation_id: str) -> None:
        self._ensure_version(conn, project_id, version_id)
        row = conn.execute("SELECT simulation_id FROM simulation_runs WHERE simulation_id = ?", (simulation_id,)).fetchone()
        if not row:
            now_iso = datetime.now(timezone.utc).isoformat()
            conn.execute(
                """
                INSERT OR IGNORE INTO simulation_runs (simulation_id, project_id, version_id, exploration_status, states_explored, warnings_json, provenance, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (simulation_id, project_id, version_id, "exhaustive", 0, "[]", "demo_fixture", now_iso),
            )

    # ── Projects ──────────────────────────────────────────────────────────────

    def save_project(self, project: Project) -> None:
        with self.get_connection() as conn:
            conn.execute(
                """
                INSERT OR REPLACE INTO projects (project_id, name, description, current_version_id, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?)
                """,
                (
                    project.project_id,
                    project.name,
                    project.description,
                    project.current_version_id,
                    project.created_at.isoformat(),
                    project.updated_at.isoformat(),
                ),
            )

    # ── Audio Assets ──────────────────────────────────────────────────────────

    def save_audio_asset(self, asset: AudioAsset) -> None:
        with self.get_connection() as conn:
            self._ensure_project(conn, asset.project_id)
            conn.execute(
                """
                INSERT OR REPLACE INTO audio_assets (
                    asset_id, project_id, filename, media_type, mime_type,
                    duration_seconds, sample_rate_hz, channels, size_bytes,
                    storage_key, sha256, status, provenance
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    asset.asset_id,
                    asset.project_id,
                    asset.filename,
                    asset.media_type,
                    asset.mime_type,
                    asset.duration_seconds,
                    asset.sample_rate_hz,
                    asset.channels,
                    asset.size_bytes,
                    asset.storage_key,
                    asset.sha256,
                    asset.status,
                    asset.provenance,
                ),
            )

    def get_audio_asset(self, asset_id: str) -> AudioAsset | None:
        with self.get_connection() as conn:
            row = conn.execute("SELECT * FROM audio_assets WHERE asset_id = ?", (asset_id,)).fetchone()
            if not row:
                return None
            return AudioAsset(
                asset_id=row["asset_id"],
                project_id=row["project_id"],
                filename=row["filename"],
                media_type=row["media_type"],
                mime_type=row["mime_type"],
                duration_seconds=row["duration_seconds"],
                sample_rate_hz=row["sample_rate_hz"],
                channels=row["channels"],
                size_bytes=row["size_bytes"],
                storage_key=row["storage_key"],
                sha256=row["sha256"],
                status=row["status"],
                provenance=row["provenance"],
            )

    def list_audio_assets(self, project_id: str) -> list[AudioAsset]:
        with self.get_connection() as conn:
            rows = conn.execute("SELECT * FROM audio_assets WHERE project_id = ?", (project_id,)).fetchall()
            return [
                AudioAsset(
                    asset_id=r["asset_id"],
                    project_id=r["project_id"],
                    filename=r["filename"],
                    media_type=r["media_type"],
                    mime_type=r["mime_type"],
                    duration_seconds=r["duration_seconds"],
                    sample_rate_hz=r["sample_rate_hz"],
                    channels=r["channels"],
                    size_bytes=r["size_bytes"],
                    storage_key=r["storage_key"],
                    sha256=r["sha256"],
                    status=r["status"],
                    provenance=r["provenance"],
                )
                for r in rows
            ]

    # ── Simulation Runs ───────────────────────────────────────────────────────

    def save_simulation_run(self, simulation: SimulationRun) -> None:
        with self.get_connection() as conn:
            self._ensure_version(conn, simulation.project_id, simulation.version_id)
            conn.execute(
                """
                INSERT OR REPLACE INTO simulation_runs (
                    simulation_id, project_id, version_id, exploration_status,
                    states_explored, warnings_json, provenance, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    simulation.simulation_id,
                    simulation.project_id,
                    simulation.version_id,
                    simulation.exploration_status.value if hasattr(simulation.exploration_status, "value") else str(simulation.exploration_status),
                    simulation.states_explored,
                    json.dumps(simulation.warnings),
                    simulation.provenance,
                    simulation.created_at.isoformat(),
                ),
            )

    # ── Validation Runs & Findings ────────────────────────────────────────────

    def save_validation_run(self, run: ValidationRun) -> None:
        with self.get_connection() as conn:
            self._ensure_simulation(conn, run.project_id, run.version_id, run.simulation_id)
            rule_ids = list(run.rule_counts.keys())
            conn.execute(
                """
                INSERT OR REPLACE INTO validation_runs (
                    run_id, project_id, version_id, simulation_id,
                    rule_ids_json, status, started_at, completed_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    run.run_id,
                    run.project_id,
                    run.version_id,
                    run.simulation_id,
                    json.dumps(rule_ids),
                    run.status,
                    run.created_at.isoformat(),
                    run.created_at.isoformat(),
                ),
            )

            for f in run.findings:
                self._ensure_passage(conn, run.version_id, f.passage_id)
                if f.asset_id:
                    self._ensure_asset(conn, run.project_id, f.asset_id)
                if f.cue_id:
                    self._ensure_cue(conn, run.project_id, run.version_id, f.cue_id, f.passage_id)
                conn.execute(
                    """
                    INSERT OR REPLACE INTO findings (
                        finding_id, run_id, finding_code, rule_id, severity, status,
                        passage_id, cue_id, asset_id, affected_route_ids_json,
                        explanation, expected_state_json, actual_state_json,
                        evidence_quote, evidence_verified, source_start, source_end,
                        route_trace_json, suggested_action, provenance, created_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """,
                    (
                        f.finding_id,
                        run.run_id,
                        f.finding_code,
                        f.rule_id.value if hasattr(f.rule_id, "value") else str(f.rule_id),
                        f.severity.value if hasattr(f.severity, "value") else str(f.severity),
                        f.status.value if hasattr(f.status, "value") else str(f.status),
                        f.passage_id,
                        f.cue_id,
                        f.asset_id,
                        json.dumps(f.affected_route_ids),
                        f.explanation,
                        json.dumps(f.expected_state) if f.expected_state is not None else None,
                        json.dumps(f.actual_state) if f.actual_state is not None else None,
                        f.evidence_quote,
                        1 if f.evidence_verified else 0,
                        f.source_start,
                        f.source_end,
                        json.dumps(f.route_trace),
                        f.suggested_action,
                        f.provenance,
                        f.created_at.isoformat(),
                    ),
                )

    def get_validation_run(self, run_id: str) -> ValidationRun | None:
        with self.get_connection() as conn:
            run_row = conn.execute("SELECT * FROM validation_runs WHERE run_id = ?", (run_id,)).fetchone()
            if not run_row:
                return None

            finding_rows = conn.execute("SELECT * FROM findings WHERE run_id = ?", (run_id,)).fetchall()
            findings: list[Finding] = []
            rule_counts: dict[str, int] = {}

            for r in finding_rows:
                f = Finding(
                    finding_id=r["finding_id"],
                    finding_code=r["finding_code"],
                    rule_id=RuleId(r["rule_id"]),
                    severity=Severity(r["severity"]),
                    status=FindingStatus(r["status"]),
                    passage_id=r["passage_id"],
                    cue_id=r["cue_id"],
                    asset_id=r["asset_id"],
                    affected_route_ids=json.loads(r["affected_route_ids_json"]),
                    explanation=r["explanation"],
                    expected_state=json.loads(r["expected_state_json"]) if r["expected_state_json"] else None,
                    actual_state=json.loads(r["actual_state_json"]) if r["actual_state_json"] else None,
                    evidence_quote=r["evidence_quote"],
                    evidence_verified=bool(r["evidence_verified"]),
                    source_start=r["source_start"],
                    source_end=r["source_end"],
                    route_trace=json.loads(r["route_trace_json"]),
                    suggested_action=r["suggested_action"],
                    created_at=datetime.fromisoformat(r["created_at"]),
                    provenance=r["provenance"],
                )
                findings.append(f)
                rule_counts[f.rule_id.value] = rule_counts.get(f.rule_id.value, 0) + 1

            return ValidationRun(
                run_id=run_row["run_id"],
                project_id=run_row["project_id"],
                version_id=run_row["version_id"],
                simulation_id=run_row["simulation_id"],
                status=run_row["status"],
                total_findings=len(findings),
                findings=findings,
                rule_counts=rule_counts,
                created_at=datetime.fromisoformat(run_row["started_at"]),
                provenance="backend_validation",
            )

    def get_finding(self, finding_id: str) -> Finding | None:
        with self.get_connection() as conn:
            r = conn.execute(
                "SELECT * FROM findings WHERE finding_id = ? OR finding_code = ?",
                (finding_id, finding_id),
            ).fetchone()
            if not r:
                return None
            return Finding(
                finding_id=r["finding_id"],
                finding_code=r["finding_code"],
                rule_id=RuleId(r["rule_id"]),
                severity=Severity(r["severity"]),
                status=FindingStatus(r["status"]),
                passage_id=r["passage_id"],
                cue_id=r["cue_id"],
                asset_id=r["asset_id"],
                affected_route_ids=json.loads(r["affected_route_ids_json"]),
                explanation=r["explanation"],
                expected_state=json.loads(r["expected_state_json"]) if r["expected_state_json"] else None,
                actual_state=json.loads(r["actual_state_json"]) if r["actual_state_json"] else None,
                evidence_quote=r["evidence_quote"],
                evidence_verified=bool(r["evidence_verified"]),
                source_start=r["source_start"],
                source_end=r["source_end"],
                route_trace=json.loads(r["route_trace_json"]),
                suggested_action=r["suggested_action"],
                created_at=datetime.fromisoformat(r["created_at"]),
                provenance=r["provenance"],
            )

    def update_finding_status(self, finding_id: str, status: FindingStatus) -> Finding | None:
        with self.get_connection() as conn:
            conn.execute(
                "UPDATE findings SET status = ? WHERE finding_id = ? OR finding_code = ?",
                (status.value if hasattr(status, "value") else str(status), finding_id, finding_id),
            )
        return self.get_finding(finding_id)


# Global repository instance
sqlite_repo = SQLiteRepository()
