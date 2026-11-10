# TODO.md — Roadmap and Verification Checklist

Update a checkbox only when the task is actually complete and evidence/tests exist. Use `[?]` for organizer clarification and `[-]` for active work.

## Gate 0 — Pack/repository assessment
- [x] Inspect target repository and preserve existing files.
- [x] Read all root documents and reference media.
- [x] Author Technical Readiness Report for domain modules (parser, simulator, validation, audio, reporting) and dependency maintenance analysis (`technical-readiness-report.md`).
- [?] Confirm pre-build/live-sprint boundaries with organizer for every `CONFIRM` item (formal inquiry dispatched 10 Nov 12:03 IST; response pending).
- [ ] Agree the team's 50% measurement method and record it.
- [ ] Replace structural placeholders with the owner-approved full story source when available.

## Gate 1 — Explicit pre-build foundation (within 50% cap)
- [x] Add `.gitignore`, `.env.example`, frontend/backend manifests and lockfiles.
- [x] Implement design tokens and application shell.
- [x] Implement separate workspace routing for all seven workspaces.
- [x] Implement accessible nav, topbar, feedback and demo-state treatment.
- [x] Reproduce Story Graph using typed fixture display data, if permitted.
- [x] Verify 1600×1000, 1600×900, 1440×900 and 1366×768.

## Gate 2 — Contracts and fixture integrity
- [x] Align TypeScript types, Pydantic models and JSON Schema.
- [x] Validate fixture IDs/references/source quote/intensity.
- [x] Ensure fixture and production data are visually distinct.
- [x] Ensure no fake media, metrics, timestamps or evidence offsets.

## Gate 3 — Parser/compiler (`CONFIRM`)
- [?] Obtain organizer classification.
- [ ] Implement only the documented Twee subset.
- [ ] Preserve source hash and correct Unicode source spans.
- [ ] Diagnose malformed headers, duplicates, missing targets and unsupported syntax.
- [ ] Add parser tests (UTF-8, CRLF/LF, Unicode, invalid/boundary cases).

## Gate 4 — Graph and route/state simulation (`CONFIRM`)
- [?] Obtain organizer classification.
- [ ] Build directed graph from canonical IR.
- [ ] Simulate Route A and Route B.
- [ ] Track facts before/after passage events and cue trigger state.
- [ ] Add cycle detection, deduplication, state/depth budgets and cancellation.
- [ ] Report exhaustive/bounded/incomplete truthfully.

## Gate 5 — Deterministic validation (`CONFIRM`)
- [?] Obtain organizer classification.
- [ ] Implement Reveal Protection.
- [ ] Implement explicit Required Cue Coverage.
- [ ] Implement Tension Lifecycle.
- [ ] Implement Emotional Continuity.
- [ ] Add positive/negative/unknown-state controls.
- [ ] Reproduce expected BT-001 from fixture inputs, not UI constants.

## Gate 6 — AI/provider integration (`LIVE-SPRINT-EXAMPLE`)
- [?] Confirm current instructions with organizers before sprint.
- [ ] Add backend-only provider adapter when permitted.
- [ ] Version prompt and structured output schema.
- [ ] Validate passage IDs/evidence/intensity; keep candidates pending.
- [ ] Test missing key, rate limits, timeouts, malformed output.

## Gate 7 — Audio (`CONFIRM` for asset backend/scheduling)
- [?] Confirm classification for upload/storage, scheduling and playback.
- [ ] Obtain licensed assets and record licence details.
- [ ] Validate uploaded audio, hash, decode and measured metadata.
- [ ] Compute waveforms from actual decoded bytes.
- [ ] Implement cue scheduler from simulation trace.
- [ ] Synchronize all three lanes, cue events, playhead and duration.
- [ ] Test browser autoplay/device/decode failures and cleanup.

## Gate 8 — Reports
- [?] Confirm substantive report-generation classification if required.
- [x] JSON report export with run scope, warnings and evidence.
- [ ] CSV optional.
- [x] Never show invented coverage or quality scores.

## Gate 9 — Release readiness
- [x] Backend test/lint/typecheck passes.
- [x] Frontend lint/typecheck/unit tests/build pass.
- [ ] E2E flow passes where configured.
- [x] Route B → P-003 → BT-001 verified from a fresh run.
- [x] Route selection/passage/finding state is consistent across workspaces.
- [x] Source quote exact; source line range only if parser-derived.
- [x] Missing audio produces no play claim and no fabricated waveform.
- [x] Verify demo works without AI credentials.
- [ ] Check asset licences and secrets hygiene.
- [ ] Update README, CHANGELOG, MEMORY and PHASE_LOG.
- [ ] Confirm submission requirements/deadlines on official portal.

## Definition of done

A screen is not done because it resembles the screenshot. A feature is done when behaviour, data source, failure modes, accessibility, tests and documentation are verified.
