"""Twee 3 story parser for BranchTone.

Parses Harlowe-compatible Twee source text into typed passage blocks with exact offsets.
"""
from __future__ import annotations

from dataclasses import dataclass, field

from app.ingestion.lexer import (
    HEADER_PATTERN,
    RawHeader,
    RawPassageBlock,
    extract_links,
    extract_macros,
)
from app.ingestion.source_map import SourceMap


@dataclass
class ParsingResult:
    filename: str
    source_sha256: str
    passages: list[RawPassageBlock] = field(default_factory=list)
    warnings: list[str] = field(default_factory=list)
    errors: list[str] = field(default_factory=list)


def parse_twee_source(source_text: str, filename: str = "story.twee") -> ParsingResult:
    """Parses a full .twee file into structured passage blocks with source tracking."""
    source_map = SourceMap(source_text, filename=filename)
    header_matches = list(HEADER_PATTERN.finditer(source_text))

    if not header_matches:
        return ParsingResult(
            filename=filename,
            source_sha256=source_map.sha256,
            passages=[],
            warnings=[],
            errors=["No passage headers found. A valid Twee file must contain ':: PassageName' headers."],
        )

    passages: list[RawPassageBlock] = []
    all_warnings: list[str] = []
    all_errors: list[str] = []
    seen_titles: set[str] = set()

    for idx, match in enumerate(header_matches):
        raw_title = match.group("title").strip()
        raw_tags = match.group("tags")
        tags = [t.strip() for t in raw_tags.split()] if raw_tags else []
        meta = match.group("meta")

        # Header span
        header_span = source_map.make_span(match.start(), match.end())
        header = RawHeader(
            title=raw_title,
            tags=tags,
            metadata_json=meta,
            span=header_span,
        )

        # Body span is from end of header line to start of next header or end of file
        body_start = match.end()
        # Skip the immediate newline character if present
        if body_start < len(source_text) and source_text[body_start] in ("\r", "\n"):
            if source_text[body_start : body_start + 2] == "\r\n":
                body_start += 2
            else:
                body_start += 1

        body_end = header_matches[idx + 1].start() if idx + 1 < len(header_matches) else len(source_text)
        body_text = source_text[body_start:body_end]
        body_span = source_map.make_span(body_start, body_end)
        full_span = source_map.make_span(match.start(), body_end)

        # Duplicate title check
        if raw_title in seen_titles:
            err = f"Duplicate passage title '{raw_title}' at line {header_span.source_line_start}."
            all_errors.append(err)
        seen_titles.add(raw_title)

        # Extract links and macros within body
        links = extract_links(body_text, body_start, source_map)
        macros, macro_warnings = extract_macros(body_text, body_start, source_map)
        all_warnings.extend(macro_warnings)

        passages.append(
            RawPassageBlock(
                header=header,
                body_text=body_text,
                body_span=body_span,
                full_span=full_span,
                links=links,
                macros=macros,
                unsupported_syntax_warnings=macro_warnings,
            )
        )

    return ParsingResult(
        filename=filename,
        source_sha256=source_map.sha256,
        passages=passages,
        warnings=all_warnings,
        errors=all_errors,
    )


def parse_story_source(source_text: str, filename: str = "story.twee") -> ParsingResult:
    """Unified story parser that automatically detects Twee (.twee) vs Ink (.ink) formats."""
    from app.ingestion.ink_parser import parse_ink_source

    lower_name = filename.lower()
    if lower_name.endswith(".ink") or ("===" in source_text and "::" not in source_text):
        return parse_ink_source(source_text, filename=filename)
    return parse_twee_source(source_text, filename=filename)

