# MEMORY.md — Project Decisions and Verified Context

**Updated:** 12 November 2026. Keep this file factual and short. Update only after a decision or verification.

## Usability & Functionality Repairs (12 Nov 2026)

- Completed thorough repair of dead and static UI elements across Shell and all 7 workspaces per `FUNCTIONALITY_AUDIT_AND_REPAIR.md`.
- Clickable breadcrumbs and active live search dropdown in Topbar (filtering passages & BT-001).
- Interactive "Run Validation" button opening accessible compliance gating modal.
- Active navigation cards in Overview workspace.
- Fixed Route A (Archives P-002) vs Route B (Server Vault P-004) factual reveal discrepancy in Narrative Map and Route Lab.
- Interactive candidate review buttons with local UI state in Narrative Map.
- Clickable rows and layer filtering empty state handling in Cue Library.
- Route Lab step snapshot drawer and clickable BT-001 finding link in trace table.
- Validation Centre interactive row selection and 0-match filter empty state handling with reset button.
- Reports workspace JSON report preview drawer with copy-to-clipboard functionality.
- 100% test integrity: 40 Vitest frontend tests pass, 11 Pytest backend tests pass, production build verified.

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

## Verified Live Sprint Preparation & Baseline Freeze State

- Pre-build application foundation strictly frozen at reference commit `7b82eec`: All 7 workspaces, Story Graph canvas, shared Zustand state, and 100% test suites preserved.
- Core Pipeline Prioritization:
  - Six-hour sprint prioritizes the core deterministic pipeline: M1 (Twee parse), M2 (Story IR), M3 (Route simulator), M4 (Audio decoder), M5 (BT-001 validation engine), M6 (JSON report generation), and M8 (E2E demonstration).
  - Gemini AI integration (M7) is an **optional stretch goal** scheduled for 45 minutes (16:45 – 17:30 IST).
  - Current vs Intended Status: In the **intended product architecture**, BranchTone is designed to operate fully autonomously without Gemini or any API key. The **current application remains a fixture-backed UI** until the parser, simulator, and deterministic validation engine are implemented and tested during the live sprint.
- Three-Way Asset Taxonomy & Strict Non-Representation Mandate (`MISSING_ASSETS_CHECKLIST.md`):
  1. *Original Assets:* Authentic creator text (P-003) and composer master stems. If missing (`traitor_theme.wav`), they remain honestly disclosed as missing.
  2. *Synthetic Demonstration Fixtures:* Clearly labelled mocks for prose/decoder tests (`synthetic_test_440hz.wav`). Mandatory rule: **Never represent generated or synthetic audio as the missing original `traitor_theme.wav`.**
  3. *Licensed Production Assets:* External media with verified CC0/CC-BY attribution in `content/LICENSES.md`.
- Verified 4-Part Sprint Contingency Protocols (`LIVE_SPRINT_RUNBOOK.md`):
  1. *Unavailable Credentials:* Pure deterministic mode operates smoothly; manual UI annotation authoring and approval functional; M7 bypassed without errors.
  2. *Missing Audio Assets:* Honest missing status maintained; transport visibly disabled with reason; decoder tested strictly using designated synthetic test tones.
  3. *Incomplete Organizer Approval:* An absent organizer response **does not constitute approval**. Restricted domain modules must remain outside pre-build; live sprint implementation may be undertaken only to the extent permitted by official event rules from frozen commit `7b82eec`.
  4. *Schedule Compression:* Strict triage hierarchy dropping M7 (Gemini) first (reclaiming 45 minutes directly), dropping CSV export second (15m), while protecting the core Twee $\to$ simulation $\to$ BT-001 $\to$ JSON report $\to$ E2E demo pipeline.
- Live servers running and verified:
  - Frontend Vite preview server running on `http://localhost:4173/` (host 0.0.0.0, port 4173).
  - Backend Uvicorn FastAPI server running on `http://127.0.0.1:8000/`.
  - Preview proxy configured in `frontend/vite.config.ts`: `/api` calls routed to backend; `/api/v1/health` verified returning HTTP 200 JSON.
- Quality gates: 40 frontend tests passing, 11 backend tests passing, TypeScript strict clean, ESLint clean, Vite build clean, Ruff clean, Mypy strict clean.

## Verified Complete Health Check, Functionality Audit & Error Verification State

- Complete application health check, functionality audit, and error verification performed (`FINAL_APPLICATION_HEALTH_REPORT.md`).
- Startup Verified: Vite preview server running on port 4173; Uvicorn FastAPI backend running on port 8000. All 7 workspace URLs return HTTP 200 OK without errors.
- Repairs Completed:
  1. Backend error handling: Registered `StarletteHTTPException` and `Exception` handlers in `backend/app/main.py`, returning standardized error envelope per `SCHEMA.md §6` (`{"error": {"code": "NOT_FOUND", "message": "..."}}`). Tested via `test_error_handling.py`.
  2. SQLite schema verification: Added `backend/app/tests/test_sqlite_schema.py` verifying all 14 tables, foreign keys, offset bounds checks, and self-loop edge constraints.
  3. React Router v7 future flags: Enabled `v7_relativeSplatPath` and `v7_startTransition` across router, main, and test runners, eliminating all future deprecation warnings.
  4. Workflow F integration test: Added automated continuous 7-workspace navigation test in `CrossWorkspaceIntegration.test.tsx`.
- Quality Suite Status:
  - Frontend: 40 tests passing (Vitest), ESLint clean (0 errors, 0 warnings), TypeScript compile clean (0 errors), Vite production build clean.
  - Backend: 11 tests passing (Pytest), Ruff clean (all checks passed), Mypy strict clean (15 source files).
- Honest Core Product Verdict: Pre-build UI foundation is 100% functional and verified. Executable domain modules (Twee parser, route simulator, rule engine, audio backend) are legally GATED by `COMPLIANCE_MATRIX.md`.
- Product Classification: BranchTone is strictly classified as a fixture-backed UI with a functioning application shell, not a completed narrative-audio validation engine.
- BT-001 Provenance: BT-001 is loaded directly from `content/expected-findings.json` as a verification fixture envelope; it has not been generated by an executable validation engine. Missing story passages and audio assets remain fully disclosed.
- Security Assessment Reality: SQL injection prevention remains unassessed until actual database access/repository code exists and is tested (schema tests DDL/constraints only); path traversal and audio upload security are future design requirements unassessed in the running application.

## Verified Technical Readiness & Gating Audit State (Pre-Slice 3)

- Technical Readiness Report completed (`technical-readiness-report.md`) covering all 5 domain modules:
  1. Twee Parser/Compiler (`backend/app/ingestion/` & `backend/app/compiler/`): Unicode code-point offsets, source SHA-256 hash, Harlowe subset AST, diagnostics envelope, `CONFIRM`.
  2. Route & State Simulator (`backend/app/graph/`): Directed graph, domain invariant passage-entry event order (steps 1–6), search budget (10k states / 500 depth), cycle detection, truthful exploration status (`exhaustive` vs `bounded` vs `incomplete`), `CONFIRM`.
  3. Deterministic Validation Engine (`backend/app/rules/`): Pure domain code, zero LLM, 4 canonical rules (`RULE_REVEAL_PROTECTION`, `RULE_REQUIRED_CUE_COVERAGE`, `RULE_TENSION_LIFECYCLE`, `RULE_EMOTIONAL_CONTINUITY`), exact reproduction of BT-001 with verified source evidence, negative controls (Route A, intentional silence, legitimate conflict renewal), `CONFIRM`.
  4. Audio Backend & Scheduling (`backend/app/audio/` & Web Audio): Upload validation, MIME/magic byte checks, path traversal hardening, PCM peak decoding (never fabricated), 3-lane Web Audio scheduler (Music, Ambience, SFX), honest disabled states for missing assets, `CONFIRM`.
  5. Report Generation Engine (`backend/app/reporting/`): Canonical JSON envelope adhering to `schemas/report.schema.json`, truthful coverage accounting (`not_evaluated`), `CONFIRM`.
- Organizer Clarifications & Gating: 3 formal questions defined for hackathon organizers. Gemini provider, prompt tuning, and inference hooks remain strictly reserved for the 6-hour live sprint on 21 November 2026.
- Starlette Deprecation Warning Maintenance: Root cause investigated. Starlette 0.40+ deprecation in `TestClient` (`httpx` vs `httpx2`) is silenced in pytest via `filterwarnings` in `backend/pyproject.toml`. It is documented honestly as an interim test-runner filter, NOT an upstream resolution. Tracking upstream FastAPI/Starlette releases for official client migration.
- Zero Slice 3 domain code written. All 39 Vitest frontend tests and 5 Pytest backend tests pass cleanly. Baseline preserved.

## Verified Cross-Workspace Integration & Acceptance Audit State

- Cross-workspace shared-state workflows verified with automated integration tests (`CrossWorkspaceIntegration.test.tsx`):
  1. Story Graph (Air Vent P-003 selected) → Validation Centre (BT-001 finding active).
  2. Validation Centre → "Inspect in Story Graph Workspace" deep-link updates `selectedRouteId` (`route_b`), `selectedPassageId` (`P-003`), and `selectedFindingId` (`fnd_bt001_route_b_p003_demo`) synchronously, returning to Story Graph with Air Vent P-003 rendered.
  3. Route Lab route switching (Route A / Route B) synchronizes Story Graph active edges, passage highlighting, and Audio Timeline sequence.
  4. Narrative Map route switching updates global route selection and chronological step sequence.
  5. Reports workspace JSON export generates valid download payload with `demo_fixture_preview` provenance, `not_evaluated` coverage status, and full fixture finding data.
- Backend pytest warning resolved: `StarletteDeprecationWarning` filtered in `backend/pyproject.toml`; pytest outputs 5 passed in 0.81s with 0 warnings.
- Responsive visual review verified across 1600×900, 1440×900, and 1366×768 viewports for all 7 workspaces.
- Test suites passing: 39 frontend tests (Vitest), ESLint (0 errors, 0 warnings), Vite production build clean, backend pytest (5 passed, 0 warnings), Ruff clean, Mypy strict clean.
- Compliance boundary strictly preserved: Zero Twee compiler, route simulator, rule engine, audio backend, or Gemini integration was introduced.

## Verified Pre-Build All-Workspaces UI State

- All seven workspaces are now fully implemented and active in the shared AppShell:
  1. `StoryGraphPage` — Interactive React Flow directed graph, Route A/B selector, custom SVG nodes, Passage Inspector with exact P-003 heading and quote, 3-lane Audio Timeline with 01:24/04:32 demo badges and aligned red cue marker.
  2. `OverviewPage` — Project summary, passage/transition/issue metrics, latest validation run card, missing audio asset health, and "Not evaluated" validation coverage score.
  3. `NarrativeMapPage` — Route-synced chronological fact/intensity plot (1–5 scale), reveal markers, and annotation review distinguishing approved from pending annotations.
  4. `CueLibraryPage` — Audio layer filters, inventory table with missing `traitor_theme.wav`, honest empty waveform state, cue parameter inspector, and disabled audition transport.
  5. `RouteLabPage` — Step-by-step passage and fact snapshots along selected route, cue defect annotation at Air Vent entry on Route B, activation trace table, and disabled multitrack transport.
  6. `ValidationCentrePage` — Rule/severity/status filters, findings table displaying BT-001, detail drawer with state comparison and exact evidence quotation, "Inspect in Story Graph" deep-link, and negative controls panel.
  7. `ReportsPage` — Project/version/run identifiers, deterministic rule evaluation summary, honest coverage metric ("Not evaluated"), and client-side JSON export.
- Shared Zustand state verified: Route selection, passage selection, and finding deep-linking synchronize seamlessly across all workspaces.
- Strict compliance maintained: Zero Twee compiler, route simulator, rule engine, audio decoder backend, or Gemini AI provider code was introduced. All data is cleanly mapped from typed demo fixtures (`content/*.json`).
- Test suites passing: 34 frontend tests (Vitest), ESLint (0 errors, 0 warnings), Vite production build clean, backend pytest (5 passed), Ruff clean, Mypy clean.
- 1600×900 screenshots captured for all 7 workspaces.
- Production preview server running live at `http://localhost:4173/`.

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
