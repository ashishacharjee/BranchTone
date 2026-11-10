# CHANGELOG.md — Pack and Implementation History

## 2.2 — 10 November 2026 (Slice 2 Implementation)

- Implemented typed fixture adapter (`frontend/src/services/fixtures.ts`) importing JSON fixtures (`content/demo-project.json`, `content/expected-findings.json`, `content/audio-cues.example.json`, `content/narrative_annotations.example.json`) into strongly typed frontend models.
- Built interactive Story Graph canvas (`GraphCanvas.tsx` + `PassageNode.tsx`) using `@xyflow/react` v12:
  - 5 custom passage nodes (Lobby, Archives, Air Vent, Server Vault, Safe House) with SVG procedural miniatures, intensity badges, and issue counters.
  - Interactive Route A / Route B switching via global Zustand store.
  - Verbatim choice text on story edges from `the_last_signal.twee`.
  - Red indicator on `edge_lobby_airvent` accurately conveying the cue activation issue at passage entry without corrupting structural edge validity.
- Built Passage Inspector (`PassageInspector.tsx`):
  - Canonical heading `P-003 · Original Passage Text`.
  - Exact P-003 quote verbatim from source: *"Sen squeezes through the dark metal duct to bypass the locked hallway, completely unaware of who is behind the conspiracy."*
  - Narrative state: Suspense mood, 4/5 intensity indicator bar, Identity Revealed: No.
  - Audio cues list with `traitor_theme.wav` (Music, Passage entry).
  - Validation finding BT-001 (High severity, Open, Reveal Protection) with exact text: *"The traitor theme starts when entering Air Vent, before the character's identity is revealed on this route."*
  - Prominent `DEMO DATA` badges across narrative state, audio cues, and findings sections.
- Built Audio Timeline (`AudioTimeline.tsx`):
  - Displays all 4 Route B passages in sequence: Lobby → Air Vent → Server Vault → Safe House.
  - Explicit design-fixture time values `01:24 / 04:32` labelled `DEMO DATA`.
  - Three audio lanes: MUSIC, AMBIENCE, SFX with synthetic waveforms clearly marked as demonstration visuals.
  - Red diamond cue activation marker at the Air Vent entry boundary (01:10) on the MUSIC lane.
  - Disabled transport controls with explicit tooltip stating playback is unavailable until audio assets are uploaded.
- Tests & Verification:
  - Added 10 tests in `frontend/src/test/StoryGraph.test.tsx` verifying route switching, passage selection, inspector sync, exact quote, 4/5 intensity, BT-001 display, Route B sequence, red cue marker, and timeline playhead.
  - 33 frontend tests passing (Vitest), ESLint clean (0 errors, 0 warnings), production Vite build passing.
  - Backend tests (5 passed), Ruff clean, Mypy clean (13 files).
  - Production screenshots captured at 1600×900, 1440×900, and 1366×768.

## 2.1 — 10 November 2026 (Slice 1 Implementation)

- Built baseline frontend and backend repository scaffolding.
- Frontend: Vite + React 18 + TypeScript strict mode, CSS tokens matching `DESIGN.md`, AppShell, Sidebar with all 7 workspace links, Topbar with breadcrumb and honest control states, WorkspacePlaceholder with pending notes and compliance alerts.
- Implemented Zustand transient selection store (`workspace.ts`) with synchronized route/passage/finding actions.
- Implemented typed API service (`api.ts`) with Zod schema validation and error envelope.
- Backend: FastAPI service with Pydantic settings, standardized error envelope (`SCHEMA.md` §6), CORS configuration, and `/api/v1/health` endpoint.
- Domain & Schema integrity: Updated `sqlite_schema.reference.sql` to represent unavailable source offsets as `NULL` (never 0,0 sentinels); implemented full Pydantic models in `app/domain/entities.py` mirroring `SCHEMA.md` with strict types and 1–5 integer intensity.
- Test suites: 24 frontend tests (Vitest + RTL), 5 backend tests (Pytest), ESLint (0 errors, 0 warnings), Mypy strict (clean), Vite production build verified.
- Visual verification: Captured full-page screenshots at 1600×900, 1440×900, and 1366×768.

## 2.0 — 10 November 2026

- Consolidated the eight uploaded source documents into one consistent documentation set.
- Added missing PRD, TOOLS, PHASES, COMPLIANCE_MATRIX, MEMORY, CHANGELOG, PHASE_LOG, audit and manifest files.
- Added explicit source/fixture provenance and exact P-003 evidence.
- Resolved naming and semantics for finding code vs rule ID vs finding record ID.
- Clarified 04:32/01:24 as design-only timeline values until actual audio is uploaded.
- Clarified cue issue vs structural graph-edge validity.
- Added JSON Schema, SQL reference and evaluation cases.
- Added the approved screenshot and secondary style references with a clear visual hierarchy.
- Recorded remaining source/audio/organizer questions instead of filling them with assumptions.

## 1.0 — previous draft

An earlier pack draft existed, but it lacked several documents referenced by its own instructions and did not include a complete integrity audit. It is superseded by revision 2.0.
