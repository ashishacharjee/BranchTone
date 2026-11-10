# AGENTS.md — Mandatory Rules for Antigravity and Coding Agents

These rules apply to every agent working in this repository.

## 1. Before coding

1. Inspect the repository and working tree. Never assume it is empty; do not overwrite source files.
2. Read `README.md`, `PACK_AUDIT.md`, `COMPLIANCE_MATRIX.md`, `PRODUCT.md`, `PRD.md`, `ARCHITECTURE.md`, `SCHEMA.md`, `DESIGN.md`, `PHASES.md`, `TOOLS.md`, `SKILL.md`, `MEMORY.md` and `TODO.md`.
3. Inspect the approved screenshot and all content fixtures.
4. Return a repository assessment, target tree, dependency plan, phase split, risks and first implementation slice before writing code.
5. Do not generate seven disconnected static mockups as the first implementation.

## 2. Source-of-truth hierarchy

- Product boundaries: `PRODUCT.md` and `PRD.md`.
- Data/API contracts: `SCHEMA.md` plus `schemas/`.
- Visual design: `DESIGN.md` and `references/branchtone-master-ui.png`.
- Event boundary: `COMPLIANCE_MATRIX.md` and current organizer instructions.
- Current status: `TODO.md`, `MEMORY.md`, `CHANGELOG.md` and `PHASE_LOG.md`.
- If two sources conflict, stop the affected work, record the conflict in `PACK_AUDIT.md` or `MEMORY.md` and ask only the blocking question. Do not silently reconcile.

## 3. Product truth

- BranchTone is a narrative audio QA and regression-testing workbench.
- It is not a DAW, generative-music product, story-writing chatbot or autonomous author.
- AI proposes structured annotations; creators approve them.
- Deterministic domain code produces validation verdicts.
- Findings require rule identity, cue, passage, route, trigger-time state and source/trace evidence.
- Unsupported story syntax is surfaced; never silently ignored.
- Never claim exhaustive coverage unless route exploration proves it.
- Never fabricate metrics, evidence, source line numbers, audio assets, decoded waveform values or findings.
- Every sample record is marked `demo_fixture` and visible as `DEMO DATA` in UI.

## 4. Code quality and security

- TypeScript strict mode; avoid `any`. Isolate and justify any unavoidable escape hatch.
- Python public functions have type hints; Pydantic validates API boundaries.
- Keep modules small and domain logic outside React components/HTTP route handlers.
- No frontend validation-rule implementation; no AI SDK in React.
- No `eval`, `exec`, arbitrary macro execution, shell execution or execution of imported story text.
- Validate filenames, size, extension, MIME/content signature and decoder result.
- Generate managed storage keys; prevent path traversal and overwrite attacks.
- Never expose secrets/backend environment values to browser bundles.
- Treat user source and model output as untrusted.

## 5. State and data consistency

- One `selectedRouteId` source of truth and one `selectedPassageId` source of truth.
- Route selection updates graph path, inspector route context, Route Lab and timeline.
- Passage selection updates graph selection, inspector and timeline selection.
- Finding deep-link sets route, passage and finding together.
- Overview, Validation Centre and Reports derive counts from the same run records.
- Air Vent intensity is exactly 4/5 everywhere; intensity range is 1–5.
- Route B is Lobby → Air_Vent → Server_Vault → Safe_House.
- BT-001 quote is exact and tied to P-003.
- The red Lobby→Air Vent indicator is a cue activation issue, not a graph-integrity error.
- Media duration and waveform are measured from actual decoded files. Reference values 04:32/01:24 are design-fixture values only until real media is loaded.

## 6. Tests and done criteria

- Add tests for each parser/rule change, including valid and negative controls.
- Run backend tests, frontend tests, typecheck and production build after relevant changes.
- Do not suppress failures to produce a green build.
- Test unknown facts, intentional silence, valid foreshadowing and legitimate new conflict.
- Test upload invalid type/size/decode/path traversal, missing audio, autoplay restriction and route change cleanup.
- A task is not done because a screen looks finished. It is done only when expected behaviour, error states, tests and docs are complete.

## 7. Git and event integrity

- Use small, descriptive commits; never fake/rewrite timestamps or history.
- Do not commit `.env`, keys, private audio, unlicensed assets, caches, DBs or build artifacts.
- Follow `COMPLIANCE_MATRIX.md`; record actual work in `PHASE_LOG.md` honestly.
- Do not move live-sprint work into pre-build or disguise its chronology.

## 8. UI rules

- Follow `DESIGN.md` and the one approved BranchTone screenshot.
- Seven independent workspace routes in one shared app shell.
- Do not turn the master reference into a static all-pages dashboard.
- Keep the approved charcoal/emerald/burgundy identity.
- Secondary LINC references apply only to dotted numeric display and restrained gradient/material cues.
- Every control works or is visibly disabled with reason. Use real audio-derived waveforms only.

## 9. Completion report

At the end of each slice, report files changed, behaviour implemented, exact commands/tests and results, known limitations, TODO/MEMORY/CHANGELOG updates, and whether any phase boundary was approached. Distinguish verified work from assumed or blocked work.
