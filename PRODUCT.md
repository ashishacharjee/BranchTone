# PRODUCT.md — Product Vision and Boundaries

## 1. Product identity

- **Name:** BranchTone
- **Full name:** Narrative Audio QA & Regression Testing Studio
- **Tagline:** Sound design you can test, not just hear.
- **Category:** Creative-engineering software / narrative-aware audio quality assurance
- **Intended track:** Soundscapes & Composition (confirm final track selection in event portal)

## 2. Vision

Give interactive storytellers a reliable way to verify that music, ambience and sound effects respect story state across branching routes. BranchTone makes hidden narrative-audio defects visible, traceable and reproducible without taking creative control away from the sound designer.

## 3. Problem

In a branching story, a character theme may play before identity is revealed, suspense may continue after resolution, or an explicit required ambience cue may be missing on one route. Manually replaying every route is slow and error-prone. General story editors author branches; audio tools arrange and play sound. BranchTone focuses on whether cue behaviour is appropriate at the narrative state and event where it activates.

## 4. Target users

- Independent game developers.
- Interactive-fiction and branching-story creators.
- Narrative designers.
- Sound designers working on branching/adaptive experiences.
- Small creative teams without dedicated audio QA infrastructure.

## 5. Primary user jobs

1. Import a branching story and inspect its structure.
2. Understand how facts/events change along a route.
3. Attach audio assets to passage-entry or narrative-event triggers.
4. Specify cue prerequisites, stop events and overlap intent.
5. Explore supported routes and inspect state at cue activation.
6. Find the exact passage, cue and route responsible for a finding.
7. Correct a cue and rerun validation.
8. Export a reproducible report.

## 6. Core promise

**Does this audio cue fire at a point in the story where it makes narrative sense?** BranchTone answers using deterministic rules, route-state traces and source-linked evidence.

## 7. Product principles

- Creator remains in control; proposed annotations require review.
- Deterministic verdicts come from code, not free-form model judgement.
- Every finding explains its rule, route, passage, cue and source evidence.
- Coverage must be labelled exhaustive, bounded or incomplete.
- Support a narrow, documented Twee subset rather than falsely claiming full Twine/Harlowe compatibility.
- Do not assume every passage requires every audio layer.
- Never fabricate metrics, findings, model results, source quotes or audio waveforms.
- Demo fixtures are visibly labelled `DEMO DATA`.
- The interface is a professional creative-engineering workbench, not a chat product.

## 8. Differentiation

The intended differentiator is the combination of a compiler-like import path, canonical Story IR, route-aware state simulation, cue-trigger modelling, deterministic narrative-audio validation, source-backed findings and reproducible reports. Do not claim to be the first/only product of this kind without competitor research.

## 9. Non-goals

- Generative music platform.
- Full DAW replacement.
- Twine replacement.
- General-purpose story-writing chatbot.
- Autonomous story editor that silently changes creator content.
- Primary focus on generic loudness/mastering analysis.

## 10. Success measures

Calculate only from actual runs: passages/edges compiled, states explored, exploration status, rules executed, findings by severity/rule, and labelled benchmark precision/recall if benchmark annotations exist. If no benchmark has run, show `Not evaluated`; do not invent quality percentages.

## 11. Canonical demo

Project: `The Last Signal`. Routes:

- Route A: Lobby → Archives → Server Vault → Safe House.
- Route B: Lobby → Air Vent → Server Vault → Safe House.

On Route B, `traitor_theme.wav` is configured for passage entry at Air Vent (`P-003`) while requiring `traitor_identity_revealed = true`. The fact is false/unknown at entry in the demonstration state. This creates `BT-001` under `RULE_REVEAL_PROTECTION`. The recommended corrective design is to bind the cue to a verified reveal event, not merely to a passage name. A reveal event must be creator-approved and source-evidenced before it becomes authoritative.

The exact P-003 source quote and finding explanation are canonical in `DESIGN.md`, `SCHEMA.md` and fixtures.

## 12. Team model

Intended two-person team:

- Member A: frontend, interactions, visualisation, audio UX.
- Member B: backend, domain logic, graph/validation, data persistence.
- Shared ownership: contracts, integration, tests, demo reliability and compliance log.
