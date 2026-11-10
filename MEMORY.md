# MEMORY.md — Project Decisions and Verified Context

**Updated:** 10 November 2026. Keep this file factual and short. Update only after a decision or verification.

## Product facts

- BranchTone is a narrative-aware audio QA/regression workbench, not a DAW or generative music application.
- Product promise: test whether audio cues activate at narratively appropriate moments.
- Primary example: The Last Signal; Route A via Archives; Route B via Air Vent.
- Route B default: Lobby → Air Vent → Server Vault → Safe House.
- Default selected passage: Air Vent (`P-003`), mood Suspense, intensity 4/5, identity revealed No at entry.
- Expected demonstration finding: BT-001 / `RULE_REVEAL_PROTECTION` / High / Open.
- Exact P-003 quote and explanation are in `DESIGN.md`, `content/the_last_signal.twee` and expected finding fixture.
- Red graph cue indication is not a structural edge error.

## Canonical exact text

Source:

> Sen squeezes through the dark metal duct to bypass the locked hallway, completely unaware of who is behind the conspiracy.

Finding explanation:

> The traitor theme starts when entering Air Vent, before the character's identity is revealed on this route.

## Design decisions

- One approved screenshot: `references/branchtone-master-ui.png`.
- Brand: charcoal/smoked glass, emerald valid/selected, burgundy/red issue.
- Secondary LINC references guide only select dotted numerals and restrained card gradient treatment; no copied layout/brand colours.
- Seven independent workspace routes in one shell.
- Timeline reference 04:32 and 01:24 is design fixture only until audio is uploaded and measured.

## Source limitations

- Full original `.twee` story was not among the uploaded documentation. The included `the_last_signal.twee` is explicitly a structural skeleton with placeholders except for the exact supplied P-003 sentence.
- No actual audio files supplied. `traitor_theme.wav` remains a missing asset fixture. The UI must not claim it can be played or waveform-rendered.
- No backend code or validation engine is included in this pack; Antigravity must build it only within the compliance scope cleared by the organizers.

## Event/compliance

- Public event page reviewed 10 November 2026; 50/50 pre-build/live-sprint model and examples are recorded in `COMPLIANCE_MATRIX.md`.
- Parser, route/state engine, deterministic validator, audio scheduling and reports are not individually classified by the public examples in this pack. Ask the organizer; do not guess.
- AI prompt tuning, API orchestration and inference hooks are explicitly listed as live-sprint examples.

## Verified Slice 2 State

- Typed fixture adapter operational: Loads `content/*.json` directly into typed frontend entities without hardcoded data duplication.
- Interactive Story Graph workspace fully implemented with `@xyflow/react`:
  - 5 custom passage nodes (Lobby, Archives, Air Vent, Server Vault, Safe House) with custom procedural SVG artwork matching the approved visual theme.
  - Route A / Route B selector dynamically updating graph active edges, passage highlights, inspector context, and timeline sequence via shared Zustand store (`workspace.ts`).
  - Red indicator on Lobby → Air Vent transition communicates the cue activation defect at entry while preserving structural graph edge integrity.
- Passage Inspector verified:
  - Exact heading `P-003 · Original Passage Text`.
  - Verbatim quotation matching `the_last_signal.twee` line 22.
  - Suspense mood, 4/5 emotional intensity bar, Identity Revealed: No.
  - BT-001 Reveal Protection finding with canonical explanation.
  - `DEMO DATA` tags prominently displayed.
- Audio Timeline verified:
  - 4 Route B passages sequenced: Lobby (00:00-01:10), Air Vent (01:10-02:15), Server Vault (02:15-03:45), Safe House (03:45-04:32).
  - Explicit `01:24 / 04:32 DEMO DATA` badge and playhead position.
  - Red diamond cue marker at Air Vent entry on MUSIC lane.
  - Playback transport visibly disabled with honest explanatory tooltip.
- Quality gates verified:
  - 33 frontend tests passing in Vitest (including 10 specific StoryGraph workspace integration tests).
  - TypeScript strict compile clean (0 errors), ESLint clean (0 errors, 0 warnings), Vite production build verified.
  - Backend pytest (5 passed), Ruff clean, Mypy clean.
  - Multi-resolution screenshots captured and verified at 1600×900, 1440×900, and 1366×768.
- Zero domain/engine logic built: Twee parser, route simulator, deterministic rule engine, audio upload/decoder, and Gemini provider remain strictly unbuilt per hackathon compliance rules.

## Verified Slice 1 State

- Baseline architecture operational: React 18 + Vite + TS strict frontend and FastAPI + Pydantic v2 backend.
- 7 workspace routes implemented in AppShell with navigation and honest placeholders.
- Design tokens and visual styling verified against `references/branchtone-master-ui.png` at 1600×900, 1440×900, and 1366×768.
- Source offset rule established: unavailable source offsets are strictly `null` (None), never 0,0 sentinels. `content/sqlite_schema.reference.sql` and `app/domain/entities.py` updated accordingly.
- Test suites passing: 24 frontend tests (Vitest + RTL), 5 backend tests (Pytest), ESLint (0 errors, 0 warnings), Mypy strict (0 issues), Vite production build clean.
- All domain modules (parser, route explorer, rule engine, audio scheduler) remain unbuilt and strictly guarded under `COMPLIANCE_MATRIX.md`.

## Open decisions

- Organizer classification of ambiguous backend/domain modules.
- Full original `.twee` source and source line map.
- Licensed real audio files and measured media duration.
- Whether production authentication is required; no fake sign-in UI.
