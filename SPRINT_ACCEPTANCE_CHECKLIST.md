# SPRINT_ACCEPTANCE_CHECKLIST.md — Live Sprint Verification & Acceptance Gates

**Event:** GeNarrative Clash 2026 — Live Sprint  
**Date:** 21 November 2026 (12:00 – 17:45 IST)  
**Track:** Soundscapes & Composition  
**Baseline Git Commit:** `7b82eec` (Pre-Build Baseline Freeze)  

> [!IMPORTANT]
> **Priority Policy:**  
> The 6-hour live sprint prioritizes the **core deterministic pipeline** (Gates M1–M6 and M8). Gate M7 (Gemini AI Integration) is an **optional stretch gate**. If API keys are missing or sprint time is constrained, Gate M7 is safely bypassed without preventing sprint acceptance or end-to-end demonstration.

---

## 1. Pre-Sprint Readiness Gate (11:45 – 12:00 IST)

- [ ] Target repository cloned on sprint machines; working tree clean at baseline commit `7b82eec`.
- [ ] Python virtual environment active (`.venv`); dependencies verified with `pytest; ruff check .; mypy app`.
- [ ] Node.js environment active; frontend verified with `npm test -- --run; npm run build; npm run lint`.
- [ ] Live preview server verified at `http://localhost:4173/`.
- [ ] Uvicorn backend verified at `http://127.0.0.1:8000/api/v1/health`.
- [ ] Licensed production audio assets (or explicitly badged synthetic test fixtures) staged in local staging directory.
- [ ] Full prose for passages P-001, P-002, P-004, P-005 staged in `content/the_last_signal_full.twee`.
- [ ] *(Optional)* Gemini API key configured in `.env` (`GEMINI_API_KEY=...`) on backend only for optional stretch gate M7.
- [ ] Screen recording software tested for 3-minute final demonstration video.

---

## 2. Live Sprint Milestone Acceptance Gates

### Gate M1: Twee Lexer & Ingestion (Target: 12:45 IST)
- [ ] `backend/app/ingestion/parser.py` parses headers, tags, choices, and `(set:)` macros.
- [ ] Source SHA-256 hash computed and verified against source file bytes.
- [ ] Zero-based Unicode code-point offsets verified with non-ASCII text.
- [ ] 1-based line and column numbers generated accurately.
- [ ] Malformed headers trigger diagnostic warnings without unhandled exceptions.
- [ ] `pytest app/tests/test_twee_parser.py` passes 100%.

### Gate M2: Canonical Story IR & Compiler (Target: 13:30 IST)
- [ ] `backend/app/compiler/story_compiler.py` builds `CanonicalStoryIR`.
- [ ] Passage links resolved to target passage IDs.
- [ ] Dangling links flagged with `MISSING_LINK_TARGET`.
- [ ] Duplicate titles flagged with `DUPLICATE_PASSAGE_TITLE`.
- [ ] `POST /api/v1/projects/{project_id}/imports` operational and validated via `TestClient`.
- [ ] `pytest app/tests/test_story_compiler.py` passes 100%.

### Gate M3: Route Simulation & State Tracking (Target: 14:30 IST)
- [ ] Directed graph constructed from IR edges.
- [ ] DFS/BFS traversal traverses Route A and Route B from start passage.
- [ ] Domain invariant passage-entry event order (steps 1–6) strictly enforced.
- [ ] Facts before entry and after events captured in each `RouteTraceStep`.
- [ ] Cycle detection terminates story loops within state/depth budget.
- [ ] `POST /api/v1/projects/{project_id}/simulate` operational.
- [ ] `pytest app/tests/test_route_simulation.py` passes 100%.

### Gate M4: Audio Upload & Signal Decoding (Target: 15:15 IST)
- [ ] `POST /api/v1/projects/{project_id}/assets` accepts multipart audio upload.
- [ ] File size limit (50MB) enforced.
- [ ] Magic byte inspection rejects invalid or disguised files.
- [ ] Filenames sanitized; stored under managed UUID keys.
- [ ] Decoded duration, sample rate, channels, and SHA-256 recorded.
- [ ] `GET /api/v1/projects/{project_id}/assets/{id}/waveform` returns normalized peak array [0.0, 1.0].
- [ ] `pytest app/tests/test_audio_assets.py` passes 100%.

### Gate M5: Deterministic Validation Suite & BT-001 (Target: 16:15 IST)
- [ ] `RULE_REVEAL_PROTECTION` evaluates cue required facts at trigger firing.
- [ ] **BT-001 Reproduction:** Air Vent entry on Route B produces BT-001 with exact expected/actual state comparison and verbatim quote.
- [ ] **Route A Negative Control:** Route A does NOT generate BT-001.
- [ ] `RULE_REQUIRED_CUE_COVERAGE` evaluates explicit creator requirements only.
- [ ] `RULE_TENSION_LIFECYCLE` verifies stop policies.
- [ ] `RULE_EMOTIONAL_CONTINUITY` checks adjacent passage delta.
- [ ] Composite deduplication key prevents redundant duplicate findings.
- [ ] `POST /api/v1/projects/{project_id}/validation-runs` operational.
- [ ] `pytest app/tests/test_validation_engine.py` passes 100%.

### Gate M6: Report Generation & Export (Target: 16:50 IST)
- [ ] `GET /api/v1/projects/{project_id}/reports/{run_id}.json` returns canonical JSON envelope.
- [ ] Report JSON strictly conforms to `schemas/report.schema.json`.
- [ ] Provenance metadata correctly marked `backend_validation`.
- [ ] Unexplored routes honestly marked `not_evaluated`.
- [ ] Optional CSV export operational.
- [ ] `pytest app/tests/test_reporting.py` passes 100%.

### Gate M7: Live Gemini AI Integration [OPTIONAL STRETCH GATE] (Target: 17:25 IST)
> *Note: If `GEMINI_API_KEY` is not provided or time is insufficient, this gate is skipped without blocking release readiness.*
- [ ] `google-genai` provider initialized on backend using `GEMINI_API_KEY`.
- [ ] Structured candidate annotations proposed using Pydantic schema.
- [ ] Model outputs validated before storage; candidates remain `pending`.
- [ ] Narrative Map workspace displays proposed candidate annotations for creator approval.
- [ ] Secrets hygiene verified: zero API keys in client bundles.
- [ ] `pytest app/tests/test_gemini_provider.py` passes 100% (or cleanly skips if key absent).

---

## 3. End-to-End Demonstration Acceptance Checklist (Target: 17:45 IST)

- [ ] **Import Workflow:** Uploading `.twee` file updates Story Graph with compiled passages and edges.
- [ ] **Route Traversal:** Route selector highlights Route A and Route B paths dynamically.
- [ ] **Audio Cue Binding:** Audio cue parameters inspected and edited in Cue Library.
- [ ] **Live Validation:** Triggering validation executes backend rule suite and surfaces BT-001 on Route B.
- [ ] **Evidence Transparency:** Finding drawer displays exact source excerpt and route trace.
- [ ] **Remediation Cycle:** Moving cue trigger to Server Vault clears BT-001 on re-run.
- [ ] **Report Download:** Exported JSON report opens cleanly and verifies run integrity.
- [ ] **Zero Fabricated Metrics:** All numbers, waveforms, and coverage metrics reflect real measurements.

---

## 4. Final Submission Packaging (17:45 – 18:00 IST)

- [ ] All code committed with descriptive, small git commits.
- [ ] Git tag created: `git tag -a v1.0.0-live-sprint-final -m "Final live sprint submission"`.
- [ ] Git repository pushed to remote GitHub repository.
- [ ] 3-minute walkthrough video uploaded (YouTube unlisted / Loom).
- [ ] README.md updated with installation, live run instructions, and demo link.
- [ ] Project submitted on Devfolio / GeNarrative Clash portal before 18:00 IST deadline.

---

## 5. Contingency Protocol Verification Checklist

- [ ] **Unavailable Credentials Contingency:** Verified that backend operates in pure deterministic mode when `GEMINI_API_KEY` is omitted, returning clean disabled status without server crashes.
- [ ] **Missing Audio Asset Contingency:** Verified that `traitor_theme.wav` remains clearly disclosed as missing; no synthetic audio is represented as the original asset. Any decoder test audio is explicitly labelled `synthetic_test_fixture.wav`.
- [ ] **Organizer Approval Contingency:** If organizer response is pending at sprint start, Branch B (strict 50/50 live sprint execution) is automatically activated from commit `7b82eec`.
- [ ] **Schedule Compression Contingency:** If sprint is delayed >30 mins, Gate M7 is dropped immediately and reporting simplified to guarantee on-time completion of the core deterministic pipeline.
