# ANTIGRAVITY_KICKOFF.md — Master Build Instruction

Copy the entire prompt below into Antigravity with this folder opened as the workspace.

---

You are the lead product engineer for **BranchTone — Narrative Audio QA & Regression Testing Studio**. Build the actual application from this specification. Do not redesign it, reduce it to a generic dashboard, or claim a feature is implemented before it works.

## A. Mandatory first actions — no coding yet

1. Inspect the repository tree and git status. Do not assume it is empty. Do not overwrite existing source files.
2. Read, in full: `README.md`, `PACK_AUDIT.md`, `AGENTS.md`, `COMPLIANCE_MATRIX.md`, `PRODUCT.md`, `PRD.md`, `ARCHITECTURE.md`, `SCHEMA.md`, `DESIGN.md`, `TOOLS.md`, `PHASES.md`, `SKILL.md`, `MEMORY.md`, `TODO.md`, `CHANGELOG.md` and `PHASE_LOG.md`.
3. Inspect `references/branchtone-master-ui.png` and `references/README.md`. Inspect the content fixtures and JSON Schema.
4. Compare the source docs, fixture data, TypeScript/Pydantic/JSON contracts and design spec. Report any conflict before implementing it.
5. Return a concise repository assessment, proposed monorepo tree, dependency plan, implementation slices, phase-compliance classification, blockers and first-slice file list.
6. **Do not write/modify code until the user has reviewed the assessment and approved the first slice.** Do not ask questions already answered by the pack. Ask only a blocking question.

## B. Compliance is mandatory

Read `COMPLIANCE_MATRIX.md` first for any substantive feature work. The public event page describes a 50/50 pre-build/live-sprint boundary. UI templates/design systems/auth scaffolding/boilerplate are named pre-build examples; prompt tuning/API orchestration/inference hooks are named live-sprint examples. The parser/compiler, route/state engine, deterministic rule engine, asset backend, cue scheduler, audio playback and report generation are **not individually classified** in the public examples contained in this pack. Do not assume. Request organizer clarification and record the exact response/date in `PHASE_LOG.md`.

Do not build live-sprint examples before the live sprint unless the organizer explicitly changes the rule in writing. Do not falsify commit history or backdate code. Keep pre-build within the 50% cap as interpreted by the organizers.

## C. Product objective

BranchTone validates whether music, ambience and SFX cues activate at narratively appropriate points across branching stories. It is a professional QA workbench, not a DAW, music generator, Twine replacement or chatbot. AI may propose structured annotations; creators approve them. Deterministic code makes all validation verdicts.

## D. Approved visual target

`references/branchtone-master-ui.png` is the **only primary BranchTone design authority**. Follow `DESIGN.md` precisely:

- Charcoal/near-black smoked glass.
- Restrained emerald for valid/selected states.
- Muted burgundy/red for real cue/validation issues.
- Low background bloom, fine borders, readable compact technical type.
- Geist Sans/Inter UI and Geist Mono/IBM Plex Mono metadata.
- Dotted/segmented numeric treatment and mild green/burgundy gradients may be used sparingly, guided by secondary LINC references. Do not copy LINC layout, brand, product imagery or colours.
- Seven independent workspaces in one app shell; never make a seven-panel tiled dashboard.
- No decorative controls, fake metrics, fake waveform or fake user/sync status.

## E. Seven workspaces

1. Overview
2. Story Graph
3. Narrative Map
4. Cue Library
5. Route Lab
6. Validation Centre
7. Reports

Each gets its own appropriate layout. Shared shell, navigation, project context and route/passage/playback state remain consistent.

## F. Canonical Story Graph fixture

Project The Last Signal, version v0.4, five passages:

- P-001 Lobby
- P-002 Archives
- P-003 Air Vent
- P-004 Server Vault
- P-005 Safe House

Routes:
- Route A: Lobby → Archives → Server Vault → Safe House.
- Route B: Lobby → Air Vent → Server Vault → Safe House.

Default: Route B selected; Air Vent P-003 selected; Suspense; intensity 4/5; identity not revealed at Air Vent entry.

Cue: `traitor_theme.wav`, Music layer, passage-entry trigger at P-003, required fact `traitor_identity_revealed = true`.

Expected finding: BT-001, rule `RULE_REVEAL_PROTECTION`, High, Open, Route B, P-003. Explanation exactly:

`The traitor theme starts when entering Air Vent, before the character's identity is revealed on this route.`

Exact source quotation:

`Sen squeezes through the dark metal duct to bypass the locked hallway, completely unaware of who is behind the conspiracy.`

Use source heading `P-003 · Original Passage Text`. Do not invent line numbers. The red Lobby→Air Vent segment represents the cue activation issue; it is **not** a structurally invalid edge.

The included `.twee` file is only a structural skeleton because the full original source was not supplied. P-003 is exact; other passage text is explicitly placeholder. Do not treat placeholders as original story prose.

## G. Timeline/audio truth

- Route B sequence: Lobby → Air Vent → Server Vault → Safe House.
- Reference fixture: 04:32 total, playhead 01:24. These are visual sample values only.
- No actual audio file is included. `traitor_theme.wav` is a missing asset fixture.
- Actual waveform must be derived from decoded uploaded audio. When none exists, show `No audio loaded`/missing state and disable playback. Do not render fake peaks or claim playback.
- Cue marker must be attached to the simulation cue event at Air Vent entry. If exact time is not known, use a passage-boundary marker and label timing unavailable; never invent its offset.
- Three visible layers: MUSIC, AMBIENCE, SFX.

## H. Architecture and code constraints

- Modular monolith.
- Frontend: React + TypeScript + Vite.
- Backend: Python 3.11+ + FastAPI + Pydantic v2.
- SQLite and managed local storage in development.
- React UI does not implement rules. API routes do not contain domain logic.
- TypeScript strict; Python type hints; boundary validation; stable IDs.
- No `eval`/`exec`/arbitrary story macro execution.
- Keep API keys server-side only.
- Keep AI provider disabled until compliance allows it.
- Use the canonical data contracts and event ordering in `SCHEMA.md`/`ARCHITECTURE.md`.

## I. Required implementation order

Only perform work classified as allowed for the current phase:

1. Repository assessment and implementation plan.
2. Foundation: manifests, config, lint/test/build scripts, env example, health endpoint (classification subject to event interpretation).
3. Design tokens and shared shell; seven routes with honest placeholders.
4. Typed demo data adapter; no hardcoded front-end verdicts.
5. Story Graph interactions and synchronized state when permitted.
6. Other purpose-built workspaces.
7. Parser/compiler, route simulation, deterministic rules, audio scheduling and provider integration only after their compliance classifications are cleared.
8. Accessibility, end-to-end verification and release checks.

Make small, testable vertical slices. After each slice, run checks and update `TODO.md`, `MEMORY.md`, `CHANGELOG.md` and `PHASE_LOG.md` honestly.

## J. Definition of done

Do not say the project is complete until:

- seven workspace routes navigate and each has its own layout;
- Story Graph Route B/P-003 selection is correct;
- selection and finding deep-links synchronize Graph, Inspector, Route Lab and timeline;
- BT-001 is derived from backend rule evaluation over fixture data;
- source quote is exact and source location is verified (no invented line number);
- intensity is 4/5, within 1–5 everywhere;
- cue problem does not falsely flag the story edge as structurally invalid;
- actual media waveforms and playback exist only after valid audio import;
- no-audio state is honest;
- metrics derive from real records or say Not evaluated;
- frontend lint/typecheck/tests/build and backend tests/lint/typecheck pass;
- README/setup/limitations and pack logs are current;
- event compliance is documented.

At completion, report files changed, working behaviour, commands actually run, pass/fail outputs, known limitations, live-sprint work still reserved and phase boundaries approached. Never invent a successful test result.

---
