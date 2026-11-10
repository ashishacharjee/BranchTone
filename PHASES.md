# PHASES.md — Build Plan and Team Split

## 1. Event schedule snapshot

The public GeNarrative Clash site reviewed on **10 November 2026** lists:

- Phase 1 registration/asynchronous build: 27 September–10 November 2026.
- Phase 2 online 50% MVP submission: 10–16 November 2026; listed deadline 16 November 2026 at 11:59 PM IST.
- Evaluation/shortlist: 17–19 November 2026.
- Offline finale/live sprint: 21 November 2026; six-hour sprint listed from 12:00 PM to 5:45 PM IST.

The same public page describes the 50/50 rule and example categories in `COMPLIANCE_MATRIX.md`. Verify the latest event portal/organizer notice before acting; this schedule is a dated snapshot, not a guarantee that the portal has not changed.

Official pages:
- https://genarrative-clash-2026.web.app/
- https://genarrative-clash.devfolio.co/

## 2. Development slices

### Slice 0 — Pack and repository assessment
Read all docs, inspect repository, compare schema/fixtures and agree allowed pre-build scope. No feature coding until the assessment is returned.

### Slice 1 — Explicitly named pre-build foundation
Design tokens, app shell, navigation, workspace route placeholders, accessibility foundation, baseline UI, repository/boilerplate scaffolding and authentication scaffolding only if needed. Keep within the total 50% pre-build allowance.

### Slice 2 — Demo UI and fixture adapter
Wire typed fixture records to shell/Story Graph and show clear DEMO DATA. Confirm that the UI does not invent validation outputs, metrics or audio waveforms. Domain-engine work must follow compliance classification.

### Slice 3 — Domain functionality (classification gate)
Parser/compiler, graph/state traversal, deterministic validation, cue scheduling and report generation are required product capabilities, but the public 50/50 examples do not individually classify them. Obtain organizer confirmation or reserve implementation for live sprint if required. Build interfaces/contracts and tests where that is permitted, without pretending an unimplemented engine exists.

### Slice 4 — AI/provider integration (live-sprint example)
Prompt tuning, API orchestration and inference hooks are explicitly listed as live-sprint examples. Keep providers disabled and do not prebuild these components unless organizers give written clarification.

### Slice 5 — Audio integration (classification gate)
Audio file upload, waveform extraction, browser playback and cue scheduling are product requirements; ask whether they count as pre-build functional implementation or live-sprint integration. In either case, do not include copyrighted sample audio without licence.

### Slice 6 — Testing and release preparation
Automated tests, truthful demo workflow, source/evidence verification, accessibility and docs. Record all work chronologically in `PHASE_LOG.md`.

### Slice 7 — Six-hour live sprint
Complete reserved work only; do not pre-stage hidden implementation. Record start/stop times, contributors, commits and decisions honestly.

## 3. Two-person responsibilities

| Workstream | Member A | Member B | Shared |
|---|---|---|---|
| Frontend/UI | Lead | Review | Design acceptance |
| Backend/API | Review | Lead | Contract integration |
| Domain parser/graph/rules | UI integration | Lead only when cleared | Tests/evidence |
| Audio UX/assets | Lead | Asset/API integration | Licensing and schedule correctness |
| Compliance/history | Record UI and sprint work | Record backend and sprint work | Confirm organizer rules |
| Demo/release | Run UI walkthrough | Run API/domain walkthrough | End-to-end rehearsal |

## 4. Percentage accounting

The public rule limits pre-build to 50% of the project and reserves the remaining 50% for the live sprint. Do not invent a task-weighting formula. Before work begins, agree with the team/organizer how the 50% is measured and record the agreed interpretation. Maintain `PHASE_LOG.md` with links to real commits/PRs and actual work.
