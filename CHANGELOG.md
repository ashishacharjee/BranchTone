# CHANGELOG.md — Pack and Implementation History

## 2.3 — 10 November 2026 (Pre-Build Remaining Six Workspaces Implementation)

- Built dedicated, fully functional UI layouts for all six remaining workspaces while preserving the existing Story Graph:
  1. **Overview (`OverviewPage.tsx`):**
     - Project & version summary, import/compile status (`the_last_signal.twee`, `v0.4`, structural placeholder notice).
     - Metric cards: Passages (5), Transitions (5), Active Issues (1), Validation Coverage (`Not evaluated`).
     - Latest validation run card with deep-link navigation to Story Graph / Validation Centre.
     - Audio asset health card with missing asset count (`traitor_theme.wav`).
     - Quick workspace navigation cards.
  2. **Narrative Map (`NarrativeMapPage.tsx`):**
     - Interactive Route A / Route B selector synced with shared Zustand store.
     - Chronological fact & emotional progression stepper (Lobby 3/5, Air Vent 4/5, Server Vault 4/5, Safe House 4/5).
     - Narrative reveal/resolution badges (`traitor_identity_revealed: false/true`).
     - Annotation review model distinguishing Authoritative Approved annotations (`P-003`) from Pending Candidate annotations (`P-004`).
  3. **Cue Library (`CueLibraryPage.tsx`):**
     - Layer filters (`All`, `Music`, `Ambience`, `SFX`, `Voice`).
     - Audio assets & cues inventory table showing `traitor_theme.wav` with `Missing` status and `Unavailable` duration.
     - Waveform area displaying honest missing state ("No Audio Waveform Available — media asset missing; no synthetic peaks displayed").
     - Cue configuration inspector (trigger, required facts, stop policy, fades, loop, overlap).
     - Playback transport visibly disabled with explanatory tooltip.
  4. **Route Lab (`RouteLabPage.tsx`):**
     - Route A / Route B sequence and traversal stepper.
     - Step-by-step fact snapshots with cue defect highlight at Air Vent on Route B.
     - Cue activation trace table with activation ID, required state, actual state, and finding code.
     - Multitrack transport disabled with honest notice ("Simulation trace is demonstration fixture").
  5. **Validation Centre (`ValidationCentrePage.tsx`):**
     - Filter controls by Rule, Severity, and Status.
     - Deterministic validation findings table displaying BT-001 (Reveal Protection, High, Open).
     - Finding detail drawer with state comparison, verified source evidence quote, route trace, and suggested remediation.
     - "Inspect in Story Graph Workspace" deep-link action button.
     - Negative controls & expected absence documentation panel.
  6. **Reports (`ReportsPage.tsx`):**
     - Run identifiers: project ID, story version, run ID, and source SHA-256.
     - Deterministic rule suite results summary (Reveal Protection, Required Cue Coverage, Tension Lifecycle, Emotional Continuity).
     - Exploration scope metrics and honest Graph Coverage Score (`Not evaluated`).
     - Client-side "Export JSON Report" action generating structured verification JSON.
- Tests & Verification:
  - Comprehensive workspace test suite in `WorkspacePages.test.tsx` (all 6 tests passing).
  - Total 34 frontend tests passing (Vitest), ESLint clean (0 errors, 0 warnings), production Vite build clean.
  - Backend tests (5 passed), Ruff clean, Mypy clean.
  - Multi-resolution screenshots captured across all 7 workspaces at 1600×900.

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
