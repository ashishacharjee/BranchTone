# BranchTone — Antigravity Development Pack

**Product:** BranchTone — Narrative Audio QA & Regression Testing Studio  
**Tagline:** Sound design you can test, not just hear.  
**Pack revision:** 2.0 · 10 November 2026  
**Status:** Build specification + deterministic structural demo fixtures. This is **not** a completed application.

## Start here

1. Open the **entire extracted `BranchTone_Antigravity_Ready/` folder** in Antigravity. Do not open only an image or Markdown file.
2. Read `AGENTS.md`, `COMPLIANCE_MATRIX.md`, `PACK_AUDIT.md`, `PRODUCT.md`, `PRD.md`, `ARCHITECTURE.md`, `SCHEMA.md`, `DESIGN.md`, `TOOLS.md`, `PHASES.md`, `SKILL.md`, `MEMORY.md` and `TODO.md`.
3. Inspect `references/branchtone-master-ui.png`. It is the only approved BranchTone master UI image. LINC images are secondary references for dotted numerals, restrained gradients and modular glass material only.
4. Inspect all files in `content/` and `schemas/`. These are explicitly marked fixtures/reference data, not production data or a substitute for the missing full original story/audio.
5. Paste the complete contents of `ANTIGRAVITY_KICKOFF.md` as the first Antigravity instruction.
6. Require a repository assessment, phase-compliance breakdown, implementation plan and risk list before code changes. Do not let the agent overwrite an existing project without inspecting it.

## What this pack contains

- Product vision, PRD, architecture, data contracts and approved design specifications.
- Coding-agent rules, repeatable workflows, environment setup, project phases and task checklist.
- Hackathon compliance matrix based on the public event rules reviewed on 10 November 2026, with ambiguous work explicitly gated.
- Deterministic five-passage/two-route structural fixture, exact P-003 source quotation, expected BT-001 result, cue manifest and evaluation cases.
- SQLite reference schema and JSON Schema contract.
- Approved BranchTone master screenshot and selected secondary visual references.
- Audit notes, changelog, phase-log template and SHA-256 pack manifest.

## Non-negotiable project truth

The Last Signal has five passages and two routes:

- Route A: Lobby → Archives → Server Vault → Safe House.
- Route B: Lobby → Air Vent → Server Vault → Safe House.

Default Story Graph state: Route B, Air Vent (`P-003`), Suspense, emotional intensity `4/5`, identity not revealed at Air Vent entry, cue `traitor_theme.wav` on Music / passage entry, and expected finding `BT-001` (`RULE_REVEAL_PROTECTION`, High, Open).

Exact Air Vent source text:

> Sen squeezes through the dark metal duct to bypass the locked hallway, completely unaware of who is behind the conspiracy.

Exact finding explanation:

> The traitor theme starts when entering Air Vent, before the character's identity is revealed on this route.

The red Lobby-to-Air-Vent graph segment is an **issue/cue-activation indicator**, not an invalid structural story edge. The source panel heading is `P-003 · Original Passage Text`. Do not invent source line numbers.

The reference timeline values `04:32` (272 seconds) and `01:24` (84 seconds) are **visual fixture values only**. The pack does not contain the actual audio file. Never say the timeline is a real media duration or playable audio until an actual asset has been uploaded, decoded and measured.

## Source and fixture limits

The complete original `.twee` source and real audio assets were not included in the uploaded documentation. `content/the_last_signal.twee` is therefore a **structural demo skeleton**, not a claim to reproduce the full original story. It contains the exact supplied P-003 sentence and explicit placeholders for other passage prose. Replace those placeholders with the owner-approved source before production/source-backed analysis. Synthetic demo state is labelled `demo_fixture` and must never be presented as creator-approved source truth.

## Technology direction

- Frontend: React + TypeScript + Vite.
- Backend: Python 3.11+ + FastAPI + Pydantic v2.
- Persistence: SQLite, managed local audio storage during development.
- Architecture: modular monolith; no microservices for the MVP.
- AI annotations, if allowed and implemented, are proposals only. Deterministic code owns validation verdicts.

## Hackathon compliance

The public event page describes a 50/50 pre-build/live-sprint rule and gives examples of pre-build work (UI templates/design system/auth scaffolding) and live-sprint work (prompt tuning/API orchestration/inference hooks). It does not explicitly classify every BranchTone engine module. Read `COMPLIANCE_MATRIX.md`; do not silently infer that parser/compiler, route simulation, deterministic validation or audio scheduling are permitted or prohibited. Obtain organizer clarification when marked `CONFIRM`.

Official references reviewed 10 November 2026:

- https://genarrative-clash-2026.web.app/
- https://genarrative-clash.devfolio.co/

The event portal and organizer instructions take precedence over this pack if they change.

## Pack verification

Run the hash verification described in `PACK_AUDIT.md` / `PACK_MANIFEST.sha256`. The manifest intentionally does not hash itself.
