# CHANGELOG.md — Pack and Implementation History

## 2.7 — 10 November 2026 (Live Sprint Preparation, Runbook Authoring & Baseline Freeze)

- Authored comprehensive preparation deliverables for the GeNarrative Clash live sprint on 21 November 2026:
  1. **`LIVE_SPRINT_RUNBOOK.md`:** 6-hour implementation schedule (M1–M8) broken down by technical milestones: Twee story parser & compiler (M1), canonical Story IR (M2), directed graph & route/state simulation (M3), audio cue scheduling & narrative-state evaluation (M4), deterministic validation engine with BT-001 reproduction (M5), evidence-backed report generation (M6), live Gemini AI provider integration & prompt tuning (M7), and end-to-end rehearsal/buffer (M8). Documented module technical specs (files, interfaces, inputs/outputs, unit tests, failure scenarios), step-by-step E2E demo script, and organizer decision branching.
  2. **`SPRINT_ACCEPTANCE_CHECKLIST.md`:** Operational acceptance gates covering pre-sprint setup (T-30m), live milestone gates (M1–M7), end-to-end demonstration verification, and final submission packaging checklist.
  3. **`MISSING_ASSETS_CHECKLIST.md`:** Complete asset disclosure and acquisition protocol for missing narrative prose (P-001, P-002, P-004, P-005), licensed audio assets (`traitor_theme.wav`, ambience, SFX), organizer compliance written response, and live AI credentials (`GEMINI_API_KEY`).
- Enhanced Vite Preview Server Configuration (`frontend/vite.config.ts`):
  - Configured `preview.proxy` matching `server.proxy` for `/api` requests to proxy seamlessly to `http://127.0.0.1:8000`.
  - Verified live preview: `http://localhost:4173/` serves frontend; `http://localhost:4173/api/v1/health` proxies to backend and returns HTTP 200 with service metadata.
- Pre-Build Baseline Frozen:
  - Preserved all 7 workspaces, Story Graph, and shared Zustand state.
  - Zero domain engine code written (Twee parser, route simulator, rule engine, audio backend, Gemini provider remain untouched).
  - All 40 Vitest frontend tests and 11 Pytest backend tests passing cleanly.

## 2.6 — 10 November 2026 (Complete Application Health Check, Functionality Audit & Error Verification)

- Conducted exhaustive senior-level QA, architectural, and reliability audit of the entire BranchTone application (`FINAL_APPLICATION_HEALTH_REPORT.md`).
- Verified clean startup and live operation:
  - Frontend Vite preview server operational on `http://localhost:4173/`. Direct navigation and client refreshes verified across all seven workspaces (`/overview`, `/story-graph`, `/narrative-map`, `/cue-library`, `/route-lab`, `/validation-centre`, `/reports`). Zero blank screens, zero rendering errors.
  - Backend Uvicorn FastAPI server operational on `http://127.0.0.1:8000/`. Health endpoint (`/api/v1/health`) verified returning HTTP 200 with service metadata and compliance note.
- Identified and Repaired Existing Defects:
  1. **Standardized Error Envelope (`backend/app/main.py`):** Wired `StarletteHTTPException` and general `Exception` handlers in `app/main.py`. Any 404 or unhandled server error now returns the standardized envelope specified in `SCHEMA.md §6`: `{"error": {"code": "NOT_FOUND", "message": "..."}}`.
  2. **Automated SQLite Schema Verification (`backend/app/tests/test_sqlite_schema.py`):** Added 4 automated tests verifying schema execution, table existence (14 tables), foreign key enforcement, offset bounds checks, and self-loop edge constraints.
  3. **React Router v7 Future Flags Configured:** Enabled `v7_relativeSplatPath` and `v7_startTransition` across router, main, and test runners, eliminating all future deprecation warnings in console and test logs.
  4. **Added Workflow F Integration Test (`frontend/src/test/CrossWorkspaceIntegration.test.tsx`):** Added automated test verifying continuous navigation across all 7 workspaces, confirming that shared selection state (`selectedRouteId`, `selectedPassageId`, `selectedFindingId`) remains perfectly consistent.
- Quality Gates & Test Suite Verification:
  - Frontend: 40 tests passing (Vitest), TypeScript strict compile clean (0 errors), ESLint clean (0 errors, 0 warnings), Vite production build clean (built in 7.0s).
  - Backend: 11 tests passing (Pytest), Ruff clean (all checks passed), Mypy strict clean (15 source files verified).
- Core Product Capabilities Truthfully Audited:
  - Classified all 10 core product capabilities. Pre-build UI and data contracts are 100% verified.
  - Formally classified BranchTone as a fixture-backed UI with a functioning application shell, not a completed narrative-audio validation engine.
  - Explicitly confirmed that BT-001 is currently rendered from `expected-findings.json` as a typed verification fixture; the backend validation engine is deliberately GATED by hackathon compliance rules.
  - Confirmed all missing story passages (P-001, P-002, P-004, P-005) and missing audio assets (`traitor_theme.wav`) remain explicitly disclosed.
  - Security audit clarified: SQL injection prevention marked as not yet assessed (schema tests DDL only); path traversal and upload security marked as design requirements for future implementation.
  - Git HEAD reference corrected to exact hash `a67e92a5f3580f24f4e4eb7bad898bb0cf3f83c9` (`a67e92a`).

## 2.5 — 10 November 2026 (Technical Readiness Report & Dependency Maintenance Analysis)

- Created exhaustive Technical Readiness Report (`technical-readiness-report.md`) covering domain engine architecture before Slice 3:
  1. **Twee Parser/Compiler:** Unicode code-point offset preservation (`source_start`, `source_end`), SHA-256 source hash, Harlowe subset AST, diagnostics envelope (`UNSUPPORTED_STORY_SYNTAX`, `DUPLICATE_PASSAGE_TITLE`, `MISSING_LINK_TARGET`), positive/negative test controls, `CONFIRM` compliance classification.
  2. **Graph & Route Simulation Engine:** Directed graph construction, strict domain invariant passage-entry event order (steps 1–6), search budget (10k states / 500 depth), cycle detection, truthful exploration reporting (`exhaustive` vs `bounded` vs `incomplete`), `CONFIRM` classification.
  3. **Deterministic Validation Engine:** Pure domain code, zero LLM dependencies, 4 canonical rules (`RULE_REVEAL_PROTECTION`, `RULE_REQUIRED_CUE_COVERAGE`, `RULE_TENSION_LIFECYCLE`, `RULE_EMOTIONAL_CONTINUITY`), exact reproduction of BT-001 with verified source evidence, negative controls (Route A, intentional silence, legitimate conflict renewal), composite deduplication key, `CONFIRM` classification.
  4. **Audio Backend & Web Audio Scheduling:** File size limit (50MB), MIME/magic byte checks, path traversal hardening, PCM peak decoding (never fabricated), 3-lane Web Audio scheduler (Music, Ambience, SFX), honest disabled states for missing assets, `CONFIRM` classification.
  5. **Report Generation Engine:** Canonical JSON envelope adhering to `schemas/report.schema.json`, truthful coverage accounting (`not_evaluated`), reproducibility hashes, `CONFIRM` classification.
- Conducted Dependency-Maintenance Analysis on Starlette Deprecation Warning:
  - Investigated root cause: Starlette 0.40+ deprecation in `starlette.testclient.TestClient` (`httpx` vs `httpx2`).
  - Documented that pytest warning filter in `backend/pyproject.toml` is an interim test-runner noise suppression measure, NOT an upstream fix.
  - Formulated upgrade roadmap to adopt official client when FastAPI updates its dependency specification.
- Mapped Organizer Clarifications & Gating:
  - Formulated 3 explicit questions for hackathon organizers regarding parser, route engine, validation, and audio scope.
  - Maintained strict live-sprint boundary for Gemini AI provider, prompt tuning, and inference hooks (zero pre-build code).
- Verification & Integrity:
  - Frontend: 39 tests passing (Vitest), TypeScript strict compile clean (0 errors), ESLint clean (0 errors, 0 warnings), Vite production build clean.
  - Backend: 5 tests passing (Pytest), Ruff clean, Mypy strict clean (13 source files).
  - Zero domain engine code written; pre-build baseline strictly preserved.

## 2.4 — 10 November 2026 (Cross-Workspace Integration & Acceptance Audit)

- Added comprehensive cross-workspace shared-state integration test suite (`CrossWorkspaceIntegration.test.tsx`):
  1. Story Graph → select Air Vent → Validation Centre → inspect BT-001 finding.
  2. Validation Centre → click "Inspect in Story Graph" → returns to Story Graph with Air Vent P-003, Route B, and finding BT-001 selected.
  3. Route Lab → switch Route A/B → verifies Story Graph active edges, inspector context, and timeline sequence synchronization.
  4. Narrative Map → switch routes → verifies shared selected route and chronological progression.
  5. Reports → export JSON → verifies demo fixture provenance, project ID, story version, and un-evaluated coverage status.
- Addressed Pytest warning in backend:
  - Investigated `StarletteDeprecationWarning` regarding `httpx` in Starlette's `testclient.py`.
  - Configured `filterwarnings` in `backend/pyproject.toml` targeting `starlette.exceptions.StarletteDeprecationWarning`.
  - Pytest now runs 100% clean with 5 passed and 0 warnings.
- Visual review across 3 viewports:
  - Captured full-resolution screenshots at 1600×900, 1440×900, and 1366×768 across all seven workspaces.
  - Verified no text clipping, proportional layouts, readable tables, and emerald/burgundy design consistency against `references/branchtone-master-ui.png` and `DESIGN.md`.
- Quality gates verified:
  - Frontend: 39 tests passing (Vitest), ESLint clean (0 errors, 0 warnings), TypeScript strict compile clean (0 errors), Vite production build clean.
  - Backend: 5 tests passing (Pytest), Ruff clean, Mypy strict clean (13 source files).

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
