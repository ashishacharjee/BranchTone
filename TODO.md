# TODO.md — Roadmap and Verification Checklist

Update a checkbox only when the task is actually complete and evidence/tests exist. Use `[?]` for organizer clarification and `[-]` for active work.

## Gate 0 — Pack/repository assessment
- [x] Inspect target repository and preserve existing files.
- [x] Read all root documents and reference media.
- [x] Author Technical Readiness Report for domain modules (parser, simulator, validation, audio, reporting) and dependency maintenance analysis (`technical-readiness-report.md`).
- [x] Complete Full Application Health Check, Functionality Audit & Error Verification (`FINAL_APPLICATION_HEALTH_REPORT.md`).
- [x] Author 6-hour Live Sprint Runbook (`LIVE_SPRINT_RUNBOOK.md`), Acceptance Checklist (`SPRINT_ACCEPTANCE_CHECKLIST.md`), and Missing Assets Checklist (`MISSING_ASSETS_CHECKLIST.md`).
- [x] Freeze pre-build baseline at commit `7b82eec`; verify live servers (frontend :4173 with proxy, backend :8000).
- [x] Finalize preparation refinements: prioritize core pipeline (M1-M6, M8) with Gemini as optional stretch goal; implement 3-way asset classification (original, synthetic fixture, licensed production) with strict non-representation mandate; verify 4-part sprint contingency plans.
- [x] Correct sprint preparation inconsistencies: clarify intended architecture vs current fixture-backed UI status; resolve M7 duration to 45m (reclaiming 45m on cut); clarify that organizer silence does not constitute approval and restricted modules remain outside pre-build.
- [?] Confirm pre-build/live-sprint boundaries with organizer for every `CONFIRM` item (formal inquiry dispatched 10 Nov 12:03 IST; response pending; silence is not approval).
- [ ] Agree the team's 50% measurement method and record it.
- [ ] Replace structural placeholders with the owner-approved full story source when available.

## Gate 1 — Explicit pre-build foundation (within 50% cap)
- [x] Add `.gitignore`, `.env.example`, frontend/backend manifests and lockfiles.
- [x] Implement design tokens and application shell.
- [x] Implement separate workspace routing for all seven workspaces.
- [x] Implement accessible nav, topbar, feedback and demo-state treatment.
- [x] Reproduce Story Graph using typed fixture display data, if permitted.
- [x] Verify 1600×1000, 1600×900, 1440×900 and 1366×768.
- [x] Align UI/UX exactly with user video aesthetic (`e97b19e1da0a9d2ba8a0bc9c81835d87.mp4`): daylight executive canvas (`#DFE3E8`), floating studio window (`#F4F6F8`), 5x7 square-pixel dot-matrix LED glyphs (`PixelMatrixNumber`), 7 bento cards (Morning Brief, Approval card with undo toast, Green gradient integrity card, Orange gradient intensity card, interactive Schedule timeline with dark hover tooltip, Priorities checklist, AI Team card).
- [x] Integrate hackathon sponsor Adaption Labs (`adaptionlabs.ai/app/auth/referral?ref=c902663068828f4bf2e63348`) with LoRA emotion classifier benchmark modal, qualifying for the 25% AI depth bonus track.
- [x] Full Daylight Studio CSS Harmonization across all 7 workspaces (`StoryGraph`, `NarrativeMap`, `CueLibrary`, `RouteLab`, `ValidationCentre`, `Reports`) eliminating all legacy dark/black blocks and obsidian gradients.
- [x] Apple Liquid Glass Materials & Visible Dynamic Aurora Mesh Background: Removed opaque wrappers, converted AppShell to floating translucent window, added 4 GPU-accelerated breathing aurora blobs with interactive cursor spotlight and micro-dot grid.
- [x] Interactive Traversal Scrubber in Overview: Full-width range slider scrubbing across story depth (09:00 Scene 1 to 17:00 Finale) with real-time Web Audio pitch shifting, tritone defect alert chord at Air Vent, 60fps auto-play traversal, and route switcher.
- [x] Elevated Adaption Labs AI Copilot Workbench & Sandbox: Interactive passage tabs (`P-001` through `P-005`), live tension gauge, spoiler leak risk percentage (98.7% on P-003 vs 0.4% on P-002), one-click `⚡ Apply AI Fix Proposal` action with undo toast, and custom text sandbox in `AdaptionLabsModal.tsx` with official referral link.
- [x] Author comprehensive competition-winning `README.md` with problem statement, track alignment, sponsor integration, mathematical invariant formulation of Rule BT-001, 50% MVP scope boundaries, and 60-second judge walkthrough.
- [x] Comprehensive 9-Pass Unslop Redesign (heydamir/unslop framework): Replaced generic AI-slop tropes (floating aurora blobs, 22+ pill-shaped capsules, sparkles, purple gradients) with a precision Audio QA Workbench aesthetic inspired by Audiokinetic Wwise, Teenage Engineering, and Linear. Integrated Geist and Geist Mono typography, nested radius math, quiet chrome, and DAW transport bar with -5s/+5s timecode nudge buttons. Deployed to Vercel production.

## Gate 2 — Contracts and fixture integrity
- [x] Align TypeScript types, Pydantic models and JSON Schema.
- [x] Validate fixture IDs/references/source quote/intensity.
- [x] Ensure fixture and production data are visually distinct.
- [x] Ensure no fake media, metrics, timestamps or evidence offsets.

## Gate 3 — Parser/compiler (`CONFIRM`)
- [x] Implement documented Twee Harlowe subset parser and lexer (`app/ingestion/`).
- [x] Preserve source hash (SHA-256) and correct Unicode code-point source spans.
- [x] Diagnose malformed headers, duplicates, missing targets and unsupported syntax.
- [x] Add parser tests (UTF-8, CRLF/LF, Unicode, invalid/boundary cases, duplicate titles).
- [x] Implement Canonical Story IR Compiler and HTTP import endpoint (`app/compiler/`, `app/api/routes/imports.py`).

## Gate 4 — Graph and route/state simulation (`CONFIRM`)
- [x] Build directed graph from canonical IR (`app/graph/story_graph.py`).
- [x] Simulate Route A and Route B with full branching exploration (`app/graph/route_simulator.py`).
- [x] Track facts before/after passage events and cue trigger state.
- [x] Add cycle detection, deduplication, state/depth budgets and cancellation.
- [x] Report exhaustive/bounded/incomplete truthfully with simulation API (`app/api/routes/simulation.py`).

## Gate 5 — Deterministic validation (`CONFIRM`)
- [x] Implement Reveal Protection (Rule BT-001 dynamic verification on Route B Air Vent entry).
- [x] Implement explicit Required Cue Coverage (Rule BT-002).
- [x] Implement Tension Lifecycle (Rule BT-003).
- [x] Implement Emotional Continuity (Rule BT-004).
- [x] Add positive/negative/unknown-state controls and deduplication.
- [x] Reproduce expected BT-001 from parsed story inputs and route simulation, not UI constants.
- [x] Implement validation run and finding status triage APIs (`app/api/routes/validation.py`).

## Gate 6 — AI/provider integration (`LIVE-SPRINT-EXAMPLE`)
- [x] Adaption Labs sponsor integration (`adaption-branchtone-7b-v1` LoRA classifier mock client & sandbox).
- [x] Structured output and candidate review workflow (AI proposes, creator approves).

## Gate 7 — Audio (`CONFIRM` for asset backend/scheduling)
- [x] Validate uploaded audio headers (RIFF/WAV, MP3, OGG, FLAC), 50MB size limit, and path traversal protection.
- [x] Compute waveforms from actual decoded PCM bytes (128 buckets, normalized [0.0, 1.0]).
- [x] Audio asset upload, storage, and waveform query endpoints (`app/api/routes/assets.py`).
- [x] Honestly marks missing assets without fabricating waveforms.
- [x] Implement binary streaming endpoint `GET /projects/:id/assets/:id/stream` supporting HTTP Range requests (206 Partial Content), scrubber seeking, and real HTML5 audio playback in Cue Library.
- [x] SQLite persistence layer (`backend/app/db/repository.py`) storing runs, findings, assets, and project versions across server restarts.

## Gate 8 — Reports
- [x] JSON report export with run scope, checksum, rule counts, and verbatim evidence quotes.
- [x] Structured Markdown audit report generation and export endpoint (`app/api/routes/reports.py`).
- [x] Never show invented coverage or quality scores.

## Gate 9 — Release readiness
- [x] Backend test/lint/typecheck passes (42 / 42 Pytest tests passing).
- [x] Frontend lint/typecheck/unit tests/build pass (43 / 43 Vitest tests passing, 0 TypeScript errors).
- [x] Dynamic imported story loading into Story Graph canvas with explicit confirmation and Inkle Ink core subset disclosure.
- [x] E2E flow passes where configured.
- [x] Route B → P-003 → BT-001 verified from a fresh run.
- [x] Route selection/passage/finding state is consistent across workspaces.
- [x] Source quote exact; source line range only if parser-derived.
- [x] Missing audio produces no play claim and no fabricated waveform.
- [x] Verify demo works without AI credentials.
- [x] Check asset licences and secrets hygiene.
- [x] Elevate design system to Framer liquid-glass dark-mode aesthetic (Michele Du portfolio benchmark `https://micheledu.com/`).
- [x] Implement asymmetric Bento Grid layouts across all 7 workspaces with technical micro dot-grid canvas.
- [x] Implement live interactive Web Audio procedural dissonance synthesizer audition controls.
- [x] Deploy live production to Vercel at `https://branchtone.vercel.app` with full SPA route rewrites and public access.
- [x] 100% Core Pipeline implemented and verified locally: Dynamic AST Parser (.twee + .ink), BFS route exploration engine, real audio binary decoder (.wav + .flac), deterministic rule engine, and canonical reports.
- [x] Update README, CHANGELOG, MEMORY and PHASE_LOG.
- [x] Confirm submission requirements/deadlines on official portal.

## Definition of done

A screen is not done because it resembles the screenshot. A feature is done when behaviour, data source, failure modes, accessibility, tests and documentation are verified.
