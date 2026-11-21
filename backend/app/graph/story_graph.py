"""Directed Graph representation of an interactive branching story."""
from __future__ import annotations

from typing import Iterable

from app.domain.entities import Passage, StateMutation, StoryEdge


class StoryGraph:
    """Directed graph of passages and choice edges."""

    def __init__(
        self,
        passages: Iterable[Passage],
        edges: Iterable[StoryEdge],
        mutations: Iterable[StateMutation] | None = None,
    ) -> None:
        self.passages: dict[str, Passage] = {p.passage_id: p for p in passages}
        self.edges: dict[str, StoryEdge] = {e.edge_id: e for e in edges}
        self.mutations_by_passage: dict[str, list[StateMutation]] = {}
        if mutations:
            for m in mutations:
                self.mutations_by_passage.setdefault(m.passage_id, []).append(m)

        # Adjacency structures
        self.outgoing: dict[str, list[StoryEdge]] = {pid: [] for pid in self.passages}
        self.incoming: dict[str, list[StoryEdge]] = {pid: [] for pid in self.passages}

        for edge in self.edges.values():
            if edge.source_passage_id in self.outgoing:
                self.outgoing[edge.source_passage_id].append(edge)
            if edge.target_passage_id in self.incoming:
                self.incoming[edge.target_passage_id].append(edge)

    def find_entry_passages(self) -> list[str]:
        """Finds root passages (passages with zero incoming edges or tagged 'entry')."""
        tagged_entry = [
            pid for pid, p in self.passages.items() if "entry" in p.tags or "start" in p.tags
        ]
        if tagged_entry:
            return tagged_entry

        zero_incoming = [pid for pid, in_edges in self.incoming.items() if len(in_edges) == 0]
        if zero_incoming:
            return zero_incoming

        # Fallback to the first passage if graph is a cycle
        return [next(iter(self.passages.keys()))] if self.passages else []
