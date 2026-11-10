"""SQLite reference schema execution and constraint verification tests."""
import sqlite3
from pathlib import Path

import pytest


@pytest.fixture
def db_conn() -> sqlite3.Connection:
    """In-memory SQLite connection with foreign keys enabled."""
    conn = sqlite3.connect(":memory:")
    conn.execute("PRAGMA foreign_keys = ON;")
    schema_path = Path(__file__).resolve().parents[3] / "content" / "sqlite_schema.reference.sql"
    assert schema_path.exists(), f"Schema file not found at {schema_path}"
    with open(schema_path, encoding="utf-8") as f:
        schema_sql = f.read()
    conn.executescript(schema_sql)
    return conn


def test_sqlite_schema_creates_all_14_tables(db_conn: sqlite3.Connection) -> None:
    expected_tables = {
        "projects",
        "story_versions",
        "passages",
        "story_edges",
        "audio_assets",
        "audio_cues",
        "state_mutations",
        "narrative_annotations",
        "narrative_events",
        "simulation_runs",
        "route_results",
        "cue_activation_events",
        "validation_runs",
        "findings",
    }
    cursor = db_conn.execute("SELECT name FROM sqlite_master WHERE type='table';")
    actual_tables = {row[0] for row in cursor.fetchall()}
    assert expected_tables.issubset(actual_tables), (
        f"Missing tables: {expected_tables - actual_tables}"
    )


def test_foreign_key_enforcement(db_conn: sqlite3.Connection) -> None:
    # Attempting to insert a story_version without a parent project must fail
    with pytest.raises(sqlite3.IntegrityError):
        db_conn.execute(
            """
            INSERT INTO story_versions (
                version_id, project_id, version_label, source_filename,
                source_sha256, story_format, compilation_status
            ) VALUES (?, ?, ?, ?, ?, ?, ?);
            """,
            (
                "ver_01",
                "nonexistent_proj",
                "v1.0",
                "story.twee",
                "hash",
                "twee_harlowe_subset",
                "success",
            ),
        )


def test_passage_offset_check_constraints(db_conn: sqlite3.Connection) -> None:
    # 1. Insert valid project and version
    db_conn.execute(
        """
        INSERT INTO projects (project_id, name, created_at, updated_at)
        VALUES ('p1', 'Test', '2026-11-10T00:00:00Z', '2026-11-10T00:00:00Z');
        """
    )
    db_conn.execute(
        """
        INSERT INTO story_versions (
            version_id, project_id, version_label, source_filename,
            source_sha256, story_format, compilation_status
        ) VALUES (
            'v1', 'p1', 'v1.0', 'story.twee',
            'hash', 'twee_harlowe_subset', 'success'
        );
        """
    )

    # 2. Negative offset must fail check constraint
    with pytest.raises(sqlite3.IntegrityError):
        db_conn.execute(
            """
            INSERT INTO passages (
                passage_id, version_id, source_name, title, raw_text,
                source_start, source_end, provenance
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?);
            """,
            ("P-001", "v1", "Start", "Start Title", "Hello", -5, 10, "demo_fixture"),
        )

    # 3. source_end < source_start must fail check constraint
    with pytest.raises(sqlite3.IntegrityError):
        db_conn.execute(
            """
            INSERT INTO passages (
                passage_id, version_id, source_name, title, raw_text,
                source_start, source_end, provenance
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?);
            """,
            ("P-002", "v1", "Start2", "Start Title 2", "Hello", 20, 10, "demo_fixture"),
        )

    # 4. Valid passage with NULL offsets must succeed
    db_conn.execute(
        """
        INSERT INTO passages (
            passage_id, version_id, source_name, title, raw_text,
            source_start, source_end, provenance
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?);
        """,
        ("P-003", "v1", "Air_Vent", "Air Vent", "Valid text", None, None, "demo_fixture"),
    )
    db_conn.commit()
    cursor = db_conn.execute("SELECT passage_id FROM passages WHERE passage_id = 'P-003';")
    assert cursor.fetchone()[0] == "P-003"


def test_story_edge_no_self_loops(db_conn: sqlite3.Connection) -> None:
    db_conn.execute(
        """
        INSERT INTO projects (project_id, name, created_at, updated_at)
        VALUES ('p1', 'Test', '2026-11-10T00:00:00Z', '2026-11-10T00:00:00Z');
        """
    )
    db_conn.execute(
        """
        INSERT INTO story_versions (
            version_id, project_id, version_label, source_filename,
            source_sha256, story_format, compilation_status
        ) VALUES (
            'v1', 'p1', 'v1.0', 'story.twee',
            'hash', 'twee_harlowe_subset', 'success'
        );
        """
    )
    db_conn.execute(
        """
        INSERT INTO passages (
            passage_id, version_id, source_name, title, raw_text, provenance
        ) VALUES ('P-001', 'v1', 'P1', 'P1 Title', 'Text', 'demo_fixture');
        """
    )

    # Edge from P-001 to P-001 must fail CHECK (source_passage_id <> target_passage_id)
    with pytest.raises(sqlite3.IntegrityError):
        db_conn.execute(
            """
            INSERT INTO story_edges (
                edge_id, version_id, source_passage_id, target_passage_id, choice_text
            ) VALUES (?, ?, ?, ?, ?);
            """,
            ("e1", "v1", "P-001", "P-001", "Loop"),
        )
