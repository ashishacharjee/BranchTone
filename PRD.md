# PRD.md — Product Requirements Document

**Status:** Product baseline. Implementation scope is constrained by `COMPLIANCE_MATRIX.md`.  
**Primary demonstration:** The Last Signal · Route B · Air Vent · BT-001.

## 1. Objective

Build a desktop-oriented workbench that imports a documented subset of Twee, models narrative facts and audio cues, explores supported routes, evaluates deterministic rules and presents reproducible findings. A feature is done only when the source of its data, state transitions, failure modes and tests are implemented.

## 2. Primary user journey

1. Create/open a project and select a story version.
2. Import a `.twee` source file.
3. Review compile diagnostics and the directed passage graph.
4. Review narrative annotations; approve/reject/edit candidates.
5. Upload audio assets and create cue bindings.
6. Simulate supported routes.
7. Run deterministic validation against simulation traces.
8. Inspect a finding, evidence and route state at the exact trigger moment.
9. Edit the cue configuration and rerun.
10. Export a report that records coverage and limitations.

## 3. Workspace requirements

| Workspace | Required behaviour | Authoritative source |
|---|---|---|
| Overview | Project/version, import state, actual passage/edge counts, latest run, open findings and quick links. Unknown health/coverage is `Not evaluated`. | Project, compilation and run records |
| Story Graph | Directed graph, route selection, passage selection, issue/cue indicators, contextual inspector and route timeline. | Compiled graph + selected route + simulation + validation run |
| Narrative Map | Route selector, event/fact timeline, approved mood/intensity curve (1–5), reveal/resolution markers and annotation review. | Approved annotations and route trace |
| Cue Library | Music/Ambience/SFX/optional Voice assets, measured metadata, actual waveform preview and cue editor. Missing assets remain missing. | Asset and cue records |
| Route Lab | Route sequence, passage state, cue events, transport, seek, volume and optional before/after compare. | Simulation trace and real audio files |
| Validation Centre | Rule/severity/status filters, findings table, source/route deep links and status actions. Filter counts derive from visible records. | Validation run + findings |
| Reports | Run/version, explored routes/states, executed rules, findings, warnings, coverage status and export. | Persisted simulation and validation records |

Each workspace is an independent route in one shared application shell. Do not make a seven-tile mega-dashboard.

## 4. Functional requirements

### Project and import
- **FR-001:** Create/open a project and select its active version.
- **FR-002:** Accept `.twee` UTF-8 imports subject to size and encoding limits.
- **FR-003:** Return stable passage IDs, edge IDs, source spans, warnings and unsupported constructs.
- **FR-004:** Surface malformed headers, duplicates, broken targets and unsupported syntax.
- **FR-005:** Preserve original source text/hash for evidence traceability.

### Graph and shared state
- **FR-006:** Render a directed passage graph with keyboard-accessible node selection.
- **FR-007:** Maintain one `selectedRouteId` source of truth across graph, Route Lab, timeline and inspector.
- **FR-008:** Passage selection updates inspector and selected timeline segment.
- **FR-009:** Finding navigation deep-links to affected route and passage.
- **FR-010:** Cue warnings never imply a structural graph edge is invalid unless a graph-integrity rule independently proves that.

### Narrative annotations
- **FR-011:** Annotation candidates are typed and tied to a real passage.
- **FR-012:** Intensity is an integer 1–5; reject out-of-range and decimal input.
- **FR-013:** Model-generated candidates remain `pending`; creator approval is required for authoritative state.
- **FR-014:** Evidence must match the referenced passage after documented whitespace normalization.
- **FR-015:** Only supported source mutations and creator-approved, evidence-verified events update authoritative facts.

### Audio assets and cues
- **FR-016:** Validate upload size, extension, MIME and decodability; calculate hash and measured metadata.
- **FR-017:** Missing/invalid assets are visible and not playable.
- **FR-018:** Cue config includes layer, trigger, required facts, offsets, fades, stop policy, looping and overlap intent.
- **FR-019:** A displayed waveform is derived from decoded actual audio bytes. No random or fabricated waveform peaks.
- **FR-020:** The main timeline has three lanes: MUSIC, AMBIENCE and SFX. Voice can be an optional future lane.
- **FR-021:** Playback starts only after a user gesture; decode/autoplay/device errors are handled visibly.
- **FR-022:** Cue marker placement comes from route simulation event time or actual media timing. If only passage identity is known, anchor to that passage boundary and label exact time unavailable.

### Simulation and deterministic validation
- **FR-023:** Simulation carries supported variables, narrative facts, active cue IDs, path and event trace.
- **FR-024:** Passage-entry cues are evaluated against inherited state before passage-local mutations/events.
- **FR-025:** Narrative-event cue triggers are evaluated immediately after the approved event updates the fact state.
- **FR-026:** Exploration limits/cycles/unsupported syntax yield `bounded` or `incomplete`, never false exhaustive coverage.
- **FR-027:** Findings include rule ID, user-visible finding code, severity/status, route, passage, cue, state snapshot, evidence and trace.
- **FR-028:** BT-001 is produced by the backend/domain evaluator from the fixture cue/state, never hardcoded in React.
- **FR-029:** Required-cue coverage is evaluated only for explicit creator-authored requirements.

### Reporting
- **FR-030:** Report project/version/run IDs, scope, exploration status, limits, rules, counts, findings and warnings.
- **FR-031:** JSON report export is MVP; CSV may follow.
- **FR-032:** All counts/metrics derive from the same persisted run records. Unknown values show `Not evaluated`.

## 5. Supported Twee subset — proposed, explicitly narrow

This is a parser target only after its work is cleared by `COMPLIANCE_MATRIX.md`:

- UTF-8 plain text.
- Passage header: `:: PassageName` with optional simple bracketed tags.
- Unconditional links: `[[TargetPassage]]` and `[[Visible label->TargetPassage]]`.
- Optional literal boolean assignment only if implemented and tested: `(set: $variable to true)` or `(set: $variable to false)`.

Not supported unless separately specified and tested: conditional links/macros, arbitrary Harlowe/SugarCube macros, JavaScript, widgets, arbitrary expressions, custom formats/plugins. Unsupported constructs must have source ranges and must not be silently ignored. If a construct may affect reachability/state, mark affected analysis incomplete.

## 6. Deterministic rule requirements

1. `RULE_REVEAL_PROTECTION`: all cue `required_facts` must match at the exact trigger moment; unknown is not true.
2. `RULE_REQUIRED_CUE_COVERAGE`: only creator-authored required-cue rules are evaluated.
3. `RULE_TENSION_LIFECYCLE`: a stop event is required only for `event_required` stop policy with a configured stop event.
4. `RULE_EMOTIONAL_CONTINUITY`: compare approved adjacent 1–5 intensity values; configurable threshold; intentional transitions exempt; warning by default.

Do not display a rule as implemented until code and positive/negative/unknown-state tests exist. The frontend displays backend results; it does not adjudicate.

## 7. Non-functional requirements

- **Usability:** desktop target 1600×1000; usable at 1600×900, 1440×900 and 1366×768.
- **Accessibility:** keyboard operation, visible focus, semantic landmarks, labels, non-colour status cues, reduced motion and contrast.
- **Security:** validate all uploads, prevent path traversal, treat source/model output as untrusted, never expose secrets.
- **Reliability:** deterministic fixtures, stable IDs, reproducible reports and explicit error states.
- **Maintainability:** modular monolith, typed boundaries, business logic outside React.
- **Performance:** configurable route-state/depth budgets, cancellation and user feedback for long operations.

## 8. Acceptance scenario

In labelled demo mode: open The Last Signal; select Route B and Air Vent (`P-003`); inspector shows Suspense, 4/5, identity not revealed; cue `traitor_theme.wav` is configured for Music / passage entry / required fact true; backend rule produces BT-001 High/Open on Route B at P-003; exact source evidence matches the P-003 raw body; route sequence is Lobby → Air Vent → Server Vault → Safe House.

Timeline design fixture: total 272 seconds (04:32), playhead 84 seconds (01:24). These are not real audio durations/timings. With no uploaded audio, transports are disabled or show an unavailable state; the visual reference values are clearly labelled.

## 9. Out of scope for MVP

Full DAW functions, generative music, arbitrary macro execution, autonomous story editing, live co-editing, multiplayer collaboration, automatic annotation approval and multi-version regression until the core workflow is stable and event scope permits it.
