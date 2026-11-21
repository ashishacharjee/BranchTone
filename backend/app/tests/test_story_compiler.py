"""Unit tests for Canonical Story IR Compiler."""
import pytest
from app.compiler.story_compiler import compile_story_ir
from app.ingestion.parser import parse_twee_source

TWEE_BRANCHING = """\
:: P-001 Lobby [entry]
Sen arrives at the corporation lobby.
[[Take Elevator->P-002 Archives]]
[[Climb Vent->P-003 Air Vent]]

:: P-002 Archives [stealth]
(set: $conspirator_revealed to true)
(set: $security_level to 3)
Found the secret file.
[[Enter Server Room->P-004 Server Vault]]

:: P-003 Air Vent [suspense]
(set: $vents_cleared to true)
Sneaking through vents.
[[Drop Down->P-004 Server Vault]]

:: P-004 Server Vault [climax]
In the vault.
[[Exit to Street->P-005 Safe House]]

:: P-005 Safe House [resolution]
Safe at last.
"""


def test_compile_story_ir_happy_path():
    parse_res = parse_twee_source(TWEE_BRANCHING, filename="mission.twee")
    ir = compile_story_ir(parse_res, project_id="prj_test_01", version_label="v1.0")

    assert ir.story_version.compilation_status == "success"
    assert ir.story_version.project_id == "prj_test_01"
    assert len(ir.passages) == 5
    assert len(ir.edges) == 5  # Lobby->(Archives, Air Vent), Archives->Vault, Vent->Vault, Vault->Safe House

    # Verify Lobby outgoing edges
    lobby = next(p for p in ir.passages if p.passage_id == "P-001")
    assert len(lobby.outgoing_edge_ids) == 2
    assert len(lobby.incoming_edge_ids) == 0

    # Verify Server Vault incoming edges
    vault = next(p for p in ir.passages if p.passage_id == "P-004")
    assert len(vault.incoming_edge_ids) == 2

    # Verify state mutations
    assert len(ir.mutations) == 3
    rev_mut = next(m for m in ir.mutations if m.variable_name == "conspirator_revealed")
    assert rev_mut.value is True

    sec_mut = next(m for m in ir.mutations if m.variable_name == "security_level")
    assert sec_mut.value == 3


def test_compile_story_ir_dangling_link_warning():
    twee_with_broken_link = """:: Room A
Go somewhere.
[[Go to Mystery Room->Room B]]
"""
    parse_res = parse_twee_source(twee_with_broken_link)
    ir = compile_story_ir(parse_res, project_id="prj_broken")

    assert ir.story_version.compilation_status == "warning"
    assert len(ir.warnings) == 1
    assert "MISSING_LINK_TARGET" in ir.warnings[0]
    assert len(ir.edges) == 0  # Broken link dropped from edge list
