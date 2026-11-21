"""Lexer for Twee 3 / Harlowe interactive fiction source files.

Extracts passage blocks, headers, links, and macros with zero-based Unicode code-point offsets.
"""
from __future__ import annotations

import re
from dataclasses import dataclass, field
from typing import Literal

from app.ingestion.source_map import SourceMap, SourceSpan


@dataclass
class RawHeader:
    title: str
    tags: list[str]
    metadata_json: str | None
    span: SourceSpan


@dataclass
class RawLink:
    choice_text: str
    target_title: str
    span: SourceSpan


@dataclass
class RawMacro:
    macro_name: str
    variable_name: str | None
    raw_value: str | None
    span: SourceSpan
    is_supported: bool = True
    diagnostic_message: str | None = None


@dataclass
class RawPassageBlock:
    header: RawHeader
    body_text: str
    body_span: SourceSpan
    full_span: SourceSpan
    links: list[RawLink] = field(default_factory=list)
    macros: list[RawMacro] = field(default_factory=list)
    unsupported_syntax_warnings: list[str] = field(default_factory=list)


# Regex for Twee 3 passage header:
# :: Title [tag1 tag2] {"position":"100,200"}
HEADER_PATTERN = re.compile(
    r"^::[ \t]*(?P<title>[^\[\{<\r\n]+?)(?:[ \t]+\[(?P<tags>[^\]\r\n]*)\])?(?:[ \t]+(?P<meta>\{[^\r\n]*\}))?[ \t]*\r?$",
    re.MULTILINE,
)

# Regex for Harlowe / SugarCube links:
# [[target]] or [[label->target]] or [[target<-label]] or [[label|target]]
LINK_PATTERN = re.compile(
    r"\[\[(?P<content>[^\]\r\n]+?)\]\]"
)

# Regex for Harlowe set macro:
# (set: $variable to value)
SET_MACRO_PATTERN = re.compile(
    r"\([ \t]*set:[ \t]*\$(?P<var>[A-Za-z0-9_]+)[ \t]+(?:to|=|is)[ \t]+(?P<val>[^)]+?)\)",
    re.IGNORECASE,
)

# General macro pattern to detect any (macro: ...) and report unsupported ones
ANY_MACRO_PATTERN = re.compile(
    r"\([ \t]*(?P<name>[A-Za-z0-9_-]+):(?P<args>[^)]*?)\)"
)


def extract_links(text: str, offset_base: int, source_map: SourceMap) -> list[RawLink]:
    """Finds all choice links inside passage text with accurate character offsets."""
    links: list[RawLink] = []
    for match in LINK_PATTERN.finditer(text):
        raw_content = match.group("content").strip()
        span_start = offset_base + match.start()
        span_end = offset_base + match.end()
        span = source_map.make_span(span_start, span_end)

        if "->" in raw_content:
            parts = raw_content.split("->", 1)
            choice_text = parts[0].strip()
            target_title = parts[1].strip()
        elif "<-" in raw_content:
            parts = raw_content.split("<-", 1)
            target_title = parts[0].strip()
            choice_text = parts[1].strip()
        elif "|" in raw_content:
            parts = raw_content.split("|", 1)
            choice_text = parts[0].strip()
            target_title = parts[1].strip()
        else:
            choice_text = raw_content
            target_title = raw_content

        links.append(
            RawLink(
                choice_text=choice_text,
                target_title=target_title,
                span=span,
            )
        )
    return links


def extract_macros(text: str, offset_base: int, source_map: SourceMap) -> tuple[list[RawMacro], list[str]]:
    """Extracts state mutations and flags unsupported story syntax."""
    macros: list[RawMacro] = []
    warnings: list[str] = []

    # 1. Supported (set: $var to value)
    for match in SET_MACRO_PATTERN.finditer(text):
        var_name = match.group("var")
        raw_val = match.group("val").strip()
        span_start = offset_base + match.start()
        span_end = offset_base + match.end()
        span = source_map.make_span(span_start, span_end)

        macros.append(
            RawMacro(
                macro_name="set",
                variable_name=var_name,
                raw_value=raw_val,
                span=span,
                is_supported=True,
            )
        )

    # 2. General scan for other macros to check for unsupported syntax
    for match in ANY_MACRO_PATTERN.finditer(text):
        m_name = match.group("name").lower()
        if m_name == "set":
            continue  # Handled above
        span_start = offset_base + match.start()
        span_end = offset_base + match.end()
        span = source_map.make_span(span_start, span_end)
        warning_msg = (
            f"Unsupported story syntax '({m_name}: ...)' at line {span.source_line_start}. "
            "Macro was recorded but execution was skipped."
        )
        warnings.append(warning_msg)
        macros.append(
            RawMacro(
                macro_name=m_name,
                variable_name=None,
                raw_value=match.group("args").strip(),
                span=span,
                is_supported=False,
                diagnostic_message=warning_msg,
            )
        )

    return macros, warnings
