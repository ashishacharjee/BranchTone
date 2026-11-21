"""Unit tests for Ink (.ink) story parser."""
import pytest
from app.compiler.story_compiler import compile_story_ir
from app.ingestion.ink_parser import parse_ink_source
from app.ingestion.parser import parse_story_source

SAMPLE_INK = """\
VAR conspirator_revealed = false

=== Lobby ===
# entry
Sen enters the atrium.
* Sneak through vents -> AirVent
* Search office archives -> Archives

=== Archives ===
# stealth
~ conspirator_revealed = true
Found the classified file.
-> ServerVault

=== AirVent ===
# suspense
Crawling through metal ducts.
-> ServerVault

=== ServerVault ===
# climax
The servers are humming.
* Escape to Safe House -> SafeHouse

=== SafeHouse ===
# resolution
Mission completed.
-> END
"""


def test_parse_ink_basic_knots():
    res = parse_ink_source(SAMPLE_INK, filename="detective.ink")
    assert len(res.errors) == 0
    assert len(res.passages) == 5

    titles = [p.header.title for p in res.passages]
    assert titles == ["Lobby", "Archives", "AirVent", "ServerVault", "SafeHouse"]

    # Tags extracted
    assert "entry" in res.passages[0].header.tags
    assert "suspense" in res.passages[2].header.tags

    # Choices and diverts extracted as links
    lobby_links = res.passages[0].links
    assert len(lobby_links) == 2
    targets = [l.target_title for l in lobby_links]
    assert "AirVent" in targets
    assert "Archives" in targets

    # Variable mutation in Archives
    archives = res.passages[1]
    assert len(archives.macros) >= 1
    assert archives.macros[0].variable_name == "conspirator_revealed"
    assert archives.macros[0].raw_value == "true"


def test_compile_story_ir_from_ink():
    res = parse_story_source(SAMPLE_INK, filename="detective.ink")
    ir = compile_story_ir(res, project_id="prj_ink_test")

    assert ir.story_version.compilation_status == "success"
    assert len(ir.passages) == 5
    assert len(ir.edges) >= 4  # Lobby->(AirVent, Archives), Archives->Vault, AirVent->Vault, Vault->SafeHouse

    # Verify mutation
    assert any(m.variable_name == "conspirator_revealed" and m.value is True for m in ir.mutations)


def test_empty_ink_error():
    res = parse_ink_source("", filename="empty.ink")
    assert len(res.errors) == 1
    assert "empty" in res.errors[0]
