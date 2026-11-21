"""Canonical Story IR Compiler for BranchTone.

Converts a ParsingResult into fully resolved Passages, StoryEdges, StateMutations, and StoryVersion.
"""
from __future__ import annotations

import re
import uuid
from datetime import datetime, timezone
from typing import Any

from pydantic import BaseModel, ConfigDict, Field

from app.domain.entities import Passage, StateMutation, StoryEdge, StoryVersion
from app.ingestion.parser import ParsingResult


class CanonicalStoryIR(BaseModel):
    model_config = ConfigDict(extra="forbid")

    story_version: StoryVersion
    passages: list[Passage]
    edges: list[StoryEdge]
    mutations: list[StateMutation]
    warnings: list[str] = Field(default_factory=list)
    errors: list[str] = Field(default_factory=list)


def parse_macro_value(val_str: str) -> bool | int | float | str:
    """Parses a Harlowe macro value string into typed Python primitives."""
    cleaned = val_str.strip().strip('"').strip("'")
    lower = cleaned.lower()
    if lower == "true":
        return True
    if lower == "false":
        return False
    try:
        if "." in cleaned:
            return float(cleaned)
        return int(cleaned)
    except ValueError:
        return cleaned


def slugify_passage_id(title: str, index: int) -> str:
    """Generates a clean, consistent passage ID from title or index."""
    # Check if title already looks like a formatted ID (e.g. 'P-001' or 'P-001 Lobby')
    match = re.match(r"^(P-[0-9]{3,})", title)
    if match:
        return match.group(1)
    
    slug = re.sub(r"[^A-Za-z0-9]+", "_", title).strip("_").lower()
    if not slug:
        slug = f"node_{index}"
    return f"pas_{slug}"


def compile_story_ir(
    parsing_result: ParsingResult,
    project_id: str,
    version_label: str = "v1.0",
    version_id: str | None = None,
) -> CanonicalStoryIR:
    """Compiles parsed Twee blocks into a validated CanonicalStoryIR."""
    v_id = version_id or f"ver_{uuid.uuid4().hex[:12]}"
    warnings: list[str] = list(parsing_result.warnings)
    errors: list[str] = list(parsing_result.errors)

    if parsing_result.errors:
        story_version = StoryVersion(
            version_id=v_id,
            project_id=project_id,
            version_label=version_label,
            source_filename=parsing_result.filename,
            source_sha256=parsing_result.source_sha256,
            story_format="twee_harlowe_subset",
            compilation_status="failed",
            warnings=errors,
        )
        return CanonicalStoryIR(
            story_version=story_version,
            passages=[],
            edges=[],
            mutations=[],
            warnings=warnings,
            errors=errors,
        )

    # 1. First pass: Assign passage IDs and register lookup by title
    title_to_passage_id: dict[str, str] = {}
    passage_id_to_index: dict[str, int] = {}
    passages_temp: list[dict[str, Any]] = []

    for idx, raw_p in enumerate(parsing_result.passages):
        title = raw_p.header.title
        p_id = slugify_passage_id(title, idx + 1)
        # Ensure uniqueness of passage IDs
        unique_p_id = p_id
        counter = 2
        while unique_p_id in passage_id_to_index:
            unique_p_id = f"{p_id}_{counter}"
            counter += 1

        title_to_passage_id[title] = unique_p_id
        passage_id_to_index[unique_p_id] = idx

        passages_temp.append({
            "passage_id": unique_p_id,
            "source_name": title,
            "title": title,
            "raw_text": raw_p.body_text.strip(),
            "tags": raw_p.header.tags,
            "source_start": raw_p.full_span.source_start,
            "source_end": raw_p.full_span.source_end,
            "source_line_start": raw_p.full_span.source_line_start,
            "source_line_end": raw_p.full_span.source_line_end,
            "outgoing_edge_ids": [],
            "incoming_edge_ids": [],
            "provenance": "imported_source",
        })

    # 2. Second pass: Build edges and state mutations
    all_edges: list[StoryEdge] = []
    all_mutations: list[StateMutation] = []

    for idx, raw_p in enumerate(parsing_result.passages):
        source_pid = passages_temp[idx]["passage_id"]

        # Process links into StoryEdges
        for link_idx, raw_link in enumerate(raw_p.links):
            target_pid = title_to_passage_id.get(raw_link.target_title)
            if not target_pid:
                # Dangling link target
                warn_msg = (
                    f"MISSING_LINK_TARGET: Target passage '{raw_link.target_title}' in "
                    f"link '{raw_link.choice_text}' from '{raw_p.header.title}' does not exist."
                )
                warnings.append(warn_msg)
                continue

            edge_id = f"edge_{source_pid}_{target_pid}_{link_idx}"
            edge = StoryEdge(
                edge_id=edge_id,
                source_passage_id=source_pid,
                target_passage_id=target_pid,
                choice_text=raw_link.choice_text,
                guard=None,
                source_start=raw_link.span.source_start,
                source_end=raw_link.span.source_end,
            )
            all_edges.append(edge)

            # Update passage connectivity
            passages_temp[idx]["outgoing_edge_ids"].append(edge_id)
            target_idx = passage_id_to_index[target_pid]
            passages_temp[target_idx]["incoming_edge_ids"].append(edge_id)

        # Process macros into StateMutations
        for m_idx, raw_m in enumerate(raw_p.macros):
            if not raw_m.is_supported or not raw_m.variable_name or raw_m.raw_value is None:
                continue

            mut_id = f"mut_{source_pid}_{m_idx}"
            mut_val = parse_macro_value(raw_m.raw_value)
            mutation = StateMutation(
                mutation_id=mut_id,
                passage_id=source_pid,
                variable_name=raw_m.variable_name,
                value=mut_val,
                source_start=raw_m.span.source_start,
                source_end=raw_m.span.source_end,
                provenance="source_macro",
            )
            all_mutations.append(mutation)

    # 3. Finalize Passages list
    final_passages = [Passage(**p) for p in passages_temp]

    comp_status = "warning" if warnings else "success"
    story_version = StoryVersion(
        version_id=v_id,
        project_id=project_id,
        version_label=version_label,
        source_filename=parsing_result.filename,
        source_sha256=parsing_result.source_sha256,
        story_format="twee_harlowe_subset",
        compiled_at=datetime.now(timezone.utc),
        compilation_status=comp_status,
        warnings=warnings,
    )

    return CanonicalStoryIR(
        story_version=story_version,
        passages=final_passages,
        edges=all_edges,
        mutations=all_mutations,
        warnings=warnings,
        errors=errors,
    )
