# CHANGELOG.md — Pack and Implementation History

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
