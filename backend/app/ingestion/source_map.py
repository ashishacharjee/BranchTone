"""Unicode code-point source mapping utilities for BranchTone.

Converts character offsets and 1-based line numbers accurately across CRLF/LF newlines.
Ensures zero-based Unicode code-point offsets match exact characters without UTF-16 drift.
"""
from __future__ import annotations

import hashlib
from dataclasses import dataclass


@dataclass(frozen=True)
class SourceSpan:
    """Exact source character span and 1-based line positions."""
    source_start: int
    source_end: int
    source_line_start: int
    source_line_end: int


class SourceMap:
    """Calculates 1-based line and column coordinates from Unicode code-point offsets."""

    def __init__(self, source_text: str, filename: str = "source.twee") -> None:
        self.filename = filename
        self.source_text = source_text
        self.sha256 = hashlib.sha256(source_text.encode("utf-8")).hexdigest()

        # Build newline index for fast line lookups
        self._line_starts: list[int] = [0]
        for idx, char in enumerate(source_text):
            if char == "\n":
                self._line_starts.append(idx + 1)

    def offset_to_line(self, offset: int) -> int:
        """Returns 1-based line number for a given 0-based code-point offset."""
        if offset < 0:
            return 1
        low, high = 0, len(self._line_starts) - 1
        while low <= high:
            mid = (low + high) // 2
            if self._line_starts[mid] <= offset:
                low = mid + 1
            else:
                high = mid - 1
        return high + 1

    def make_span(self, start: int, end: int) -> SourceSpan:
        """Builds a SourceSpan with 1-based line numbers."""
        return SourceSpan(
            source_start=start,
            source_end=end,
            source_line_start=self.offset_to_line(start),
            source_line_end=self.offset_to_line(max(start, end - 1)),
        )
