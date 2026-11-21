"""Unit tests for Twee Harlowe source parser and source map."""
import pytest
from app.ingestion.parser import parse_twee_source


SAMPLE_TWEE = """\
:: Lobby [entry]
Sen steps into the glass atrium of Omnicorp.
The receptionist watches carefully.
[[Head to Archives->Archives]]
[[Sneak into Air Vent->Air Vent]]

:: Archives [stealth]
(set: $conspirator_revealed to true)
Sen uncovers the secret dossier on desk 4.
[[Proceed to Server Vault->Server Vault]]

:: Air Vent [suspense]
(set: $in_vents to true)
(print: "ambient ventilation sound")
Sen squeezes through the dark metal duct to bypass the locked hallway.
[[Drop into Server Vault->Server Vault]]

:: Server Vault [climax]
The central servers hum with blue fluorescent light.
[[Escape to Safe House->Safe House]]

:: Safe House [resolution]
Mission complete.
"""


def test_twee_parser_basic_structure():
    result = parse_twee_source(SAMPLE_TWEE, filename="test_story.twee")
    assert len(result.errors) == 0
    assert len(result.passages) == 5
    assert result.source_sha256 is not None
    assert len(result.source_sha256) == 64

    # Verify passage titles
    titles = [p.header.title for p in result.passages]
    assert titles == ["Lobby", "Archives", "Air Vent", "Server Vault", "Safe House"]

    # Verify tags
    assert result.passages[0].header.tags == ["entry"]
    assert result.passages[2].header.tags == ["suspense"]


def test_twee_parser_link_formats():
    twee_text = """:: Start
[[TargetDirect]]
[[Choice Label->TargetArrow]]
[[TargetReverse<-Choice Label]]
[[Choice Pipe|TargetPipe]]
"""
    result = parse_twee_source(twee_text)
    assert len(result.passages) == 1
    links = result.passages[0].links
    assert len(links) == 4
    assert links[0].target_title == "TargetDirect"
    assert links[0].choice_text == "TargetDirect"

    assert links[1].target_title == "TargetArrow"
    assert links[1].choice_text == "Choice Label"

    assert links[2].target_title == "TargetReverse"
    assert links[2].choice_text == "Choice Label"

    assert links[3].target_title == "TargetPipe"
    assert links[3].choice_text == "Choice Pipe"


def test_twee_parser_macros_and_unsupported_syntax():
    result = parse_twee_source(SAMPLE_TWEE)
    # Archives should have (set: $conspirator_revealed to true)
    archives = result.passages[1]
    assert len(archives.macros) == 1
    assert archives.macros[0].variable_name == "conspirator_revealed"
    assert archives.macros[0].raw_value == "true"
    assert archives.macros[0].is_supported is True

    # Air Vent should have (set:) and an unsupported (print:) macro
    air_vent = result.passages[2]
    macro_names = [m.macro_name for m in air_vent.macros]
    assert "set" in macro_names
    assert "print" in macro_names

    # The unsupported macro should be recorded in warnings, not crash
    assert any("print" in w for w in result.warnings)


def test_twee_parser_crlf_lf_consistency():
    crlf_text = SAMPLE_TWEE.replace("\n", "\r\n")
    res_lf = parse_twee_source(SAMPLE_TWEE)
    res_crlf = parse_twee_source(crlf_text)

    assert len(res_lf.passages) == len(res_crlf.passages)
    for p_lf, p_crlf in zip(res_lf.passages, res_crlf.passages):
        assert p_lf.header.title == p_crlf.header.title
        assert len(p_lf.links) == len(p_crlf.links)
        assert len(p_lf.macros) == len(p_crlf.macros)


def test_twee_parser_duplicate_titles_flagged():
    bad_twee = """:: Room
First room text.
:: Room
Duplicate room text.
"""
    result = parse_twee_source(bad_twee)
    assert len(result.errors) == 1
    assert "Duplicate passage title 'Room'" in result.errors[0]


def test_twee_parser_no_headers_error():
    empty_twee = "This is just raw text without any twee passage headers."
    result = parse_twee_source(empty_twee)
    assert len(result.errors) == 1
    assert "No passage headers found" in result.errors[0]
