"""Ink language lexer and parser for BranchTone.

Supports Inkle's Ink format:
- Knots: === knot_name === or === knot_name(params) ===
- Stitches: = stitch_name
- Diverts: -> target_knot or -> END or -> DONE
- Choices: * choice text -> target or + sticky choice text -> target
- Variables: VAR var_name = value or ~ var_name = value
- Tags: # tag_name
- Narrative prose with source line and character tracking.
"""
from __future__ import annotations

import re
from dataclasses import dataclass, field

from app.ingestion.lexer import RawHeader, RawLink, RawMacro, RawPassageBlock
from app.ingestion.parser import ParsingResult
from app.ingestion.source_map import SourceMap

# Regex patterns for Ink
KNOT_HEADER_PATTERN = re.compile(
    r"^[ \t]*===[ \t]*(?P<name>[A-Za-z0-9_]+)(?:\([^\)]*\))?[ \t]*===[ \t]*\r?$",
    re.MULTILINE,
)

STITCH_HEADER_PATTERN = re.compile(
    r"^[ \t]*=[ \t]*(?P<name>[A-Za-z0-9_]+)[ \t]*\r?$",
    re.MULTILINE,
)

DIVERT_PATTERN = re.compile(
    r"->[ \t]*(?P<target>[A-Za-z0-9_]+)",
)

CHOICE_PATTERN = re.compile(
    r"^[ \t]*(?P<type>[\*\+])[ \t]*(?:\[(?P<hidden>[^\]]+)\])?[ \t]*(?P<text>[^\->\r\n]*)(?:->[ \t]*(?P<target>[A-Za-z0-9_]+))?[ \t]*\r?$",
    re.MULTILINE,
)

VAR_DECL_PATTERN = re.compile(
    r"^[ \t]*VAR[ \t]+(?P<var>[A-Za-z0-9_]+)[ \t]*=[ \t]*(?P<val>[^\r\n]+)\r?$",
    re.MULTILINE | re.IGNORECASE,
)

VAR_ASSIGN_PATTERN = re.compile(
    r"^[ \t]*~[ \t]*(?P<var>[A-Za-z0-9_]+)[ \t]*=[ \t]*(?P<val>[^\r\n]+)\r?$",
    re.MULTILINE,
)

TAG_PATTERN = re.compile(
    r"#[ \t]*(?P<tag>[A-Za-z0-9_\-\.]+)",
)


def parse_ink_source(source_text: str, filename: str = "story.ink") -> ParsingResult:
    """Parses an Ink (.ink) source file into structured passages compatible with BranchTone IR."""
    source_map = SourceMap(source_text, filename=filename)

    knot_matches = list(KNOT_HEADER_PATTERN.finditer(source_text))

    # If no === knot === headers exist, treat the entire file as an anonymous root knot 'Start'
    if not knot_matches:
        # Check if there is non-empty content
        stripped = source_text.strip()
        if not stripped:
            return ParsingResult(
                filename=filename,
                source_sha256=source_map.sha256,
                passages=[],
                warnings=[],
                errors=["Ink file is empty."],
            )
        # Synthetic root knot
        knot_blocks: list[tuple[str, int, int, int, int]] = [
            ("Start", 0, 0, 0, len(source_text))
        ]
    else:
        knot_blocks = []
        global_macros: list[RawMacro] = []

        # Check preamble before first knot
        if knot_matches[0].start() > 0:
            preamble = source_text[: knot_matches[0].start()]
            # Extract any global VAR declarations in preamble
            for v_match in VAR_DECL_PATTERN.finditer(preamble):
                var_name = v_match.group("var").strip()
                raw_val = v_match.group("val").strip()
                span = source_map.make_span(v_match.start(), v_match.end())
                global_macros.append(
                    RawMacro(
                        macro_name="set",
                        variable_name=var_name,
                        raw_value=raw_val,
                        span=span,
                        is_supported=True,
                    )
                )

            # Check if there is actual prose in preamble
            preamble_prose = re.sub(r"^[ \t]*(?:VAR[ \t]+[^\r\n]+|//[^\r\n]*)\r?$", "", preamble, flags=re.MULTILINE).strip()
            if preamble_prose:
                knot_blocks.append(("Start", 0, 0, 0, knot_matches[0].start()))

        for idx, match in enumerate(knot_matches):
            knot_name = match.group("name").strip()
            header_start = match.start()
            header_end = match.end()
            body_start = header_end
            if body_start < len(source_text) and source_text[body_start] in ("\r", "\n"):
                if source_text[body_start : body_start + 2] == "\r\n":
                    body_start += 2
                else:
                    body_start += 1
            body_end = knot_matches[idx + 1].start() if idx + 1 < len(knot_matches) else len(source_text)
            knot_blocks.append((knot_name, header_start, header_end, body_start, body_end))

    passages: list[RawPassageBlock] = []
    all_warnings: list[str] = []
    all_errors: list[str] = []
    seen_titles: set[str] = set()

    for knot_name, h_start, h_end, b_start, b_end in knot_blocks:
        if knot_name in seen_titles:
            err = f"Duplicate knot identifier '{knot_name}' in Ink source."
            all_errors.append(err)
        seen_titles.add(knot_name)

        header_span = source_map.make_span(h_start, h_end)
        body_text = source_text[b_start:b_end]
        body_span = source_map.make_span(b_start, b_end)
        full_span = source_map.make_span(h_start, b_end)

        # Extract tags: # tag
        tags: list[str] = []
        for t_match in TAG_PATTERN.finditer(body_text):
            tags.append(t_match.group("tag").strip())

        # Extract variables: VAR x = val and ~ x = val
        macros: list[RawMacro] = []
        for v_match in VAR_DECL_PATTERN.finditer(body_text):
            var_name = v_match.group("var").strip()
            raw_val = v_match.group("val").strip()
            span = source_map.make_span(b_start + v_match.start(), b_start + v_match.end())
            macros.append(
                RawMacro(
                    macro_name="set",
                    variable_name=var_name,
                    raw_value=raw_val,
                    span=span,
                    is_supported=True,
                )
            )

        for a_match in VAR_ASSIGN_PATTERN.finditer(body_text):
            var_name = a_match.group("var").strip()
            raw_val = a_match.group("val").strip()
            span = source_map.make_span(b_start + a_match.start(), b_start + a_match.end())
            macros.append(
                RawMacro(
                    macro_name="set",
                    variable_name=var_name,
                    raw_value=raw_val,
                    span=span,
                    is_supported=True,
                )
            )

        # Prepend global macros to the first knot if present
        if len(passages) == 0 and global_macros:
            macros = global_macros + macros

        # Extract choices (* and +) and diverts (->)
        links: list[RawLink] = []
        for c_match in CHOICE_PATTERN.finditer(body_text):
            raw_text = c_match.group("text").strip()
            hidden_text = c_match.group("hidden")
            display_text = (hidden_text or raw_text).strip()
            target_knot = c_match.group("target")
            if target_knot and target_knot not in ("END", "DONE"):
                span = source_map.make_span(b_start + c_match.start(), b_start + c_match.end())
                links.append(
                    RawLink(
                        choice_text=display_text or f"Choice -> {target_knot}",
                        target_title=target_knot,
                        span=span,
                    )
                )

        # Standalone diverts (-> TargetKnot) on lines without choices
        for d_match in DIVERT_PATTERN.finditer(body_text):
            target_knot = d_match.group("target")
            if target_knot in ("END", "DONE"):
                continue
            # Avoid duplicating if already caught by choice pattern
            if not any(l.target_title == target_knot for l in links):
                span = source_map.make_span(b_start + d_match.start(), b_start + d_match.end())
                links.append(
                    RawLink(
                        choice_text=f"Continue to {target_knot}",
                        target_title=target_knot,
                        span=span,
                    )
                )

        # Clean prose (remove markup lines for display)
        clean_lines: list[str] = []
        for line in body_text.splitlines():
            line_str = line.strip()
            if not line_str:
                continue
            if line_str.startswith("VAR ") or line_str.startswith("~") or line_str.startswith("#"):
                continue
            if line_str.startswith("*") or line_str.startswith("+"):
                continue
            if line_str.startswith("->"):
                continue
            clean_lines.append(line_str)

        clean_body = " ".join(clean_lines) if clean_lines else body_text.strip()

        raw_header = RawHeader(
            title=knot_name,
            tags=tags,
            metadata_json=None,
            span=header_span,
        )

        passages.append(
            RawPassageBlock(
                header=raw_header,
                body_text=clean_body,
                body_span=body_span,
                full_span=full_span,
                links=links,
                macros=macros,
                unsupported_syntax_warnings=[],
            )
        )

    return ParsingResult(
        filename=filename,
        source_sha256=source_map.sha256,
        passages=passages,
        warnings=all_warnings,
        errors=all_errors,
    )
