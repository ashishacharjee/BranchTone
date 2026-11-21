# BRANCHTONE — MASTER 100% IMPLEMENTATION & PREMIUM UI/UX SPECIFICATION

**Purpose:** One authoritative handoff for continuing the existing BranchTone repository, completing the remaining product engineering, and upgrading all seven workspaces to the approved premium Option 2 visual design.

**Product:** BranchTone — Narrative Audio QA & Regression Testing Studio  
**Tagline:** Sound design you can test, not just hear.  
**Demo project:** The Last Signal — Interactive Detective Story  
**Production URL in the README:** https://branchtone.vercel.app  
**Repository in the README:** https://github.com/acharjeeashish2-9880/BranchTone_Antigravity_Ready

---

# READ THIS FIRST — COMPLETION STATUS IS NOT ASSUMED

This document defines the target scope and the implementation/verification process. It does **not** assert that BranchTone is already 100% complete.

The latest Antigravity summary supplied by the user indicates substantial work is present, but also identifies incomplete or decision-pending areas: SQLite persistence for runtime runs, loading imported stories into the visible graph, actual uploaded-audio playback/streaming, and limitations in complex Ink weave/gather parsing. It also reports a backend test count that differs from the original README.

**The application may only be called 100% complete after the actual repository has been inspected, the full acceptance criteria in this document have passed, and all remaining limitations are disclosed.** A polished interface, passing unit tests alone, or a generated audit document is not proof of completion.

The immediate goal is to preserve what already works, close verified gaps, and deliver one coherent premium product. Work locally. Do not commit or push.

---

# 0. EXECUTION DIRECTIVE FOR GOOGLE ANTIGRAVITY

You are continuing an existing application. You are not starting a new project, creating a parallel prototype, or replacing the stack.

Before changing code:

1. Extract and read every file in this handoff package.
2. Read the original BranchTone README included in `project_context/`.
3. Read the previous UI/UX handoff included in `project_context/`.
4. Read the latest Antigravity audit file from the user's local Antigravity workspace if it is available at:
   `C:/Users/achar/.gemini/antigravity/brain/80238e39-f4ec-4653-8db3-749ef7699928/branchtone-100-percent-audit-and-handover.md`
5. Inspect the actual repository and current Git working tree.
6. Run the current frontend tests, backend tests, typecheck and production build **before** modifications. Record exact commands, counts and failures.
7. Map every requirement in this document to existing code and classify it as:
   - Implemented and verified.
   - Implemented but incomplete.
   - Implemented but failing.
   - Not implemented.
   - Blocked by external credentials, unavailable media or another dependency.
8. Implement only the verified gaps and UI improvements. Preserve working code and all uncommitted work.

If the local audit path is unavailable, state that it could not be read and continue using the audit summary copied below. Do not pretend to have inspected a file that is not accessible.

## Non-negotiable repository rules

- No `git commit`.
- No `git push`.
- No `git reset --hard`.
- No `git clean` or destructive cleanup.
- Do not discard or overwrite pre-existing local modifications.
- Do not remove tests to make the test suite pass.
- Do not replace working modules without a demonstrated technical reason.
- Do not silently reset user projects to demo seed data.
- Do not claim successful deployment without actually verifying it.
- At completion, report `git status` and the changed-file list. Leave all changes local.

---

# 1. SOURCE-OF-TRUTH HIERARCHY

Use the following priority when references disagree:

1. **Approved Option 2 Story Graph master image** — definitive visual reference for the main shell, graph, inspector, transport, timeline, material treatment and visual hierarchy. File: `references/Option2_StoryGraph_Master.png`.
2. **Current working repository** — definitive technical source for what actually exists, current architecture, dependencies, implementation and real data.
3. **Latest Antigravity audit** — use its verified observations about current code and gaps, after checking it against the repository.
4. **Original BranchTone README** — definitive product framing, original stack, mathematical model, sample story, sponsor integration, existing documented behaviour and original disclosures.
5. **This master specification** — implementation decisions, UI/UX standards, acceptance criteria and the intended final product scope.
6. **Previous UI/UX handoff** — additional screen-level design detail.
7. Other generated BranchTone collages — feature overview only. Do not copy their tiled layout or poster composition.
8. Original Vexto/LINC images — material, lighting, glass and palette inspiration only. Do not copy their product interfaces.

The old README describes an earlier “daylight executive” design direction in its original MVP section. That older description does not override the approved Option 2 dark graphite/emerald master. Preserve the product functionality from the README but use Option 2 as the final visual direction.

---

# 2. CURRENT BASELINE — FACTS TO VERIFY, NOT BLINDLY ASSUME

The original README documents:

- React 19, TypeScript strict mode, Vite 5.
- `@xyflow/react` for the graph.
- Zustand for shared state.
- Web Audio API synthesis.
- FastAPI, Python and Pydantic v2.
- SQLite schema contracts.
- Adaption Labs integration.
- 43 Vitest frontend tests and 11 Pytest backend tests at the original checkpoint.

The latest Antigravity status summary supplied by the user says:

1. Simulation and validation runs are currently held in memory, with deterministic seed fallbacks for the demo project.
2. An existing `StoryImportModal.tsx` parses `.twee` and `.ink` and outputs AST metrics including passages, edges, mutations and SHA-256.
3. A parsed imported story still needs an explicit **Load Into Story Graph Canvas** action so the main React Flow canvas displays the imported nodes rather than always showing the five demo passages.
4. The WAV/FLAC binary decoder reportedly produces real 128-bucket waveforms for uploaded files.
5. Auditioning currently uses Web Audio tone synthesis; actual uploaded-file playback is not yet established in the audit summary.
6. An HTTP streaming route was proposed for real audio playback and seeking.
7. The Ink parser supports an **Inkle Ink Core Structural Subset**: global variables, knots, stitches, diverts, choices, tags and mutations. Complex nested multi-branch gathers may currently be treated as sequential prose and are not yet fully represented.
8. The latest audit summary reports 43 frontend and 37 backend tests, while the original README reports 43 frontend and 11 backend tests.
9. The user instructed Antigravity to work locally and not commit or push.

Verify all nine points in the actual code. The two backend test counts are a discrepancy, not a result to guess. Run the suite and report the exact collected/passed/failed/skipped counts.

## Decisions already made — do not ask the user again

| Topic | Decision |
|---|---|
| SQLite persistence | YES. Persist user-created projects and run history using the existing schema/migrations. |
| Imported graph loading | YES. Add a review/confirm step and explicit **Load Into Story Graph Canvas** action. |
| Actual uploaded-audio playback | YES. Add secure streaming and browser seek support if no equivalent exists. |
| Ink parser scope | Accurately disclose current subset; do not claim full Ink support until full weave/gather semantics are implemented. |
| Git | LOCAL ONLY. No commits, no pushes, no destructive resets/cleans. |

---

# PART I — PREMIUM VISUAL SYSTEM

# 3. PERMANENT OPTION 2 DESIGN LOCK

Option 2 is the approved master visual. It must not be redesigned, reinterpreted as a poster, or diluted into a generic dashboard.

The application should feel like a mature creative-engineering workstation: tactile, calm, precise, technical, premium and immediately usable. Think quality and craft comparable to professional creative tools, while keeping BranchTone's own identity.

## 3.1 Visual characteristics to preserve

- Deep graphite and near-black environment.
- Smoked charcoal and dark metallic panels.
- Selective translucent/frosted glass.
- Fine silver-grey borders.
- Warm off-white text and muted supporting grey.
- Restrained emerald/forest-green highlights.
- Restrained burgundy/wine defect surfaces.
- Subtle atmospheric lighting and soft blur only in selected layers.
- Compact, precise line icons.
- Geist/Inter-like sans-serif typography.
- Monospaced IDs, file names, timestamps and measurements.
- High information density with clean alignment and meaningful negative space.
- A central workspace that dominates the composition.
- A functional audio timeline where relevant.

**Glass is a material treatment, not the layout system.** Dense tables, timelines and technical information must sit on sufficiently opaque surfaces for readability. Do not make every surface transparent.

## 3.2 Starting design tokens

Calibrate against the approved screenshot. These values are starting tokens, not permission to shift the visual direction.

```css
:root {
  --bt-bg: #080A0E;
  --bt-shell: #0B0F13;
  --bt-surface-1: #0F1419;
  --bt-surface-2: #141A20;
  --bt-surface-3: #1A2228;
  --bt-text: #E8EEEB;
  --bt-text-secondary: #A5B0AB;
  --bt-text-muted: #77837E;
  --bt-border: rgba(190, 205, 198, 0.14);
  --bt-border-strong: rgba(190, 205, 198, 0.22);
  --bt-emerald: #10B981;
  --bt-emerald-soft: #74D8AE;
  --bt-amber: #F59E0B;
  --bt-red: #EF4444;
  --bt-burgundy: #6E2638;
  --bt-glass: rgba(19, 26, 28, 0.78);
  --bt-focus: rgba(16, 185, 129, 0.42);
}
```

Semantic use:

- Emerald: selected/valid route, verified state, active audio signal, successful save/operation.
- Amber: warning, suspense annotation or caution.
- Red/burgundy: actual validation defect, failed or blocked state.
- Neutral grey: ordinary labels, inactive controls and dividers.

Never make the background a saturated green/magenta gradient. No purple-blue AI gradients. Keep the illumination very restrained.

## 3.3 Typography

- Primary: Geist or Inter, normal/medium weights.
- Technical: Geist Mono or JetBrains Mono.
- Page titles: 22–26px, medium.
- Section titles: 13–15px, medium.
- Body: 13–14px, regular.
- Metadata: 11–12px with sufficient contrast.
- IDs, filenames and timecodes: 11–12px monospaced with tabular numerals.

Do not use ultra-thin text at small sizes or overly tracked all-caps for every heading. Preserve the reference's quiet precision.

## 3.4 Geometry and spacing

- Tags/keycaps: 4px radius.
- Buttons and inputs: 6–8px.
- Cards and inspectors: 12–14px.
- Main workspace chassis: 16px.
- Spacing scale: 4, 8, 12, 16, 20, 24, 32px.
- Borders: 1px muted silver-grey; stronger only when selected or focused.

Avoid universal pill-shaped controls and excessive rounded cards.

## 3.5 Iconography

Use one consistent outline icon family (Lucide React if already installed). Use similar stroke width and 16–18px navigation icons. Avoid emoji, 3D icons and mixed icon families in the product UI.

## 3.6 Motion design

Motion must improve feedback and spatial understanding, never become decoration.

Recommended timings:

| Interaction | Duration |
|---|---:|
| Hover/focus | 100–140ms |
| Button press | 80–120ms |
| Sidebar active indicator | 160–200ms |
| Workspace content | 160–220ms |
| Inspector update | 140–180ms |
| Graph route highlight | 220–320ms |
| Modal/drawer | 180–240ms |
| Chart entrance | 300–450ms, once |

Use subtle ease-out curves. Keep shell/sidebar stable while the workspace content transitions. Avoid bouncing, dramatic zooms, continuous glows, flashing defects and autoplay motion that distracts from work.

- Story Graph: animate route highlights and connection paths; change selected node border/surface subtly; never pulse the entire graph.
- Audio: playhead follows actual media time; timecode follows playback; VU meters respond to actual analyser data; no fake waveform motion while stopped or when an asset is missing.
- Narrative Map: draw a mood curve once, transition between actual route datasets, highlight selected events.
- Cue Library: transition selection/inspector; render waveform only after real decoded data exists.
- Route Lab: animate passage traversal and actual event activation.
- Validation Centre: subtle insertion/status transitions; no flashing red.
- Reports: draw charts once and keep numbers stable/readable.

Respect `prefers-reduced-motion`.

---

# 4. SHARED APPLICATION SHELL

All seven screens are separate full desktop workspaces within one product, not a collage.

## 4.1 Persistent sidebar

- Single BranchTone logo/wordmark.
- Workspace selector: Game Development.
- Current project: The Last Signal; Interactive Detective Story; v0.4.
- Overview.
- Story Graph.
- Narrative Map.
- Cue Library.
- Route Lab.
- Validation Centre.
- Reports.
- Bottom system status based on actual state: Ready, Processing, Offline or Error.
- Application version.

Keep the same sidebar width, icon family, spacing, selected treatment and hierarchy on every workspace.

## 4.2 Persistent top toolbar

- Breadcrumb: Projects / The Last Signal / [Workspace].
- Project version.
- Actual save status: Saved, Saving, Unsaved or Save failed.
- Global search/command palette.
- Undo/redo where supported.
- Run Validation.
- User/profile control where already supported.

Keep it compact. No marketing headline or oversized slogan.

## 4.3 Global state

Continue the existing Zustand architecture and preserve:

- Active project and version.
- Selected passage.
- Selected cue/asset.
- Selected finding.
- Active route.
- Current traversal trace.
- Selected validation run.
- Playback source and playback time.
- Import/parse status.
- Current exploration result.

Navigation must preserve relevant context. Example: Reproduce BT-001 opens Route Lab with Route B and P-003 selected.

## 4.4 Desktop support

- Primary target: 1920×1200.
- Secondary: 1440×900.
- Minimum practical working width: 1280px.
- At narrower desktop sizes, collapse sidebar and move inspectors into drawers without losing core functions.
- Avoid horizontal overflow.
- Keep waveform, route graph and dense tables usable.
- Do not turn this into a mobile-first application.

---

# PART II — SEVEN FULL WORKSPACES

# 5. WORKSPACE 01 — PROJECT OVERVIEW

**Purpose:** The project cockpit, status summary and next-action entry point.

### Layout

1. Project identity/header: The Last Signal, Interactive Detective Story, version, last saved time, Import Story and Run Validation.
2. Compact project facts: actual passage count, discovered route count, audio assets, configured cues, open findings and exploration status.
3. Real project graph preview linking to Story Graph.
4. Recent activity with actual timestamps and links to referenced entities.
5. QA priorities derived from open issues and unevaluated coverage.
6. Adaption Labs Copilot as a compact workbench, not a large generic chatbot.

### Copilot

- Passage tabs P-001 through P-005 for the sample story.
- Mood/tension classification.
- Spoiler-risk result from actual model output.
- Explanation and supporting evidence.
- Original/proposed text diff.
- Apply AI Fix Proposal and Undo.
- Benchmark modal entry point.

The README's 94.2% tone agreement and 98.7% spoiler detection precision are documented model-card benchmark metrics. They are not live confidence values for individual passages. Label them clearly if displayed. Never fabricate a per-passage risk score.

### Interactions

- Import Story opens the current import modal.
- Import flow shows parse summary and requires explicit Load Into Story Graph.
- Project facts deep-link to filtered workspaces.
- Activity entries open referenced objects.
- AI corrections require explicit user approval and have undo.

### Design direction

A composed, editorial creative-studio cockpit. Avoid huge KPI cards and generic SaaS bento layouts. Use one dominant project identity area, compact data, activity and QA priority modules. No invented stock imagery.

# 6. WORKSPACE 02 — STORY GRAPH (LOCKED MASTER)

**Purpose:** Interactive story structure and route inspection.

Do not redesign the approved Option 2 composition.

### Sample story graph

- LOBBY — P-001
- ARCHIVES — P-002
- AIR VENT — P-003
- SERVER VAULT — P-004
- SAFE HOUSE — P-005

Route A: P-001 → P-002 → P-004 → P-005.  
Route B: P-001 → P-003 → P-004 → P-005.

Both routes merge at Server Vault.

For the BT-001 demonstration, select Route B and AIR VENT.

### Inspector

- Passage: AIR VENT, P-003.
- Route: Route B.
- Mood: Suspense.
- Intensity: 4/5.
- Identity revealed: No.
- Cue: `traitor_theme.wav`.
- Layer: Music.
- Trigger: Passage entry.
- Finding: BT-001, Reveal Protection, High, Open.
- Explanation: “The traitor theme starts before the character's identity is established on this route.”
- Source evidence and source navigation based on actual parsed locations; never invent line/column numbers.

### Timeline

Three aligned tracks: MUSIC, AMBIENCE, SFX. Include ruler, passage boundaries, cue start/stop markers, playhead, route selector, play/pause/stop, previous/next scene, timecode and volume.

Use actual waveform data if audio exists and is decoded. For missing media, display a missing cue/asset marker, not a fabricated waveform.

### Behaviour

- Real React Flow canvas driven by normalized story data.
- Route highlights derived from actual route traces.
- Node selection updates inspector and timeline context.
- Finding marker opens the exact finding.
- Imported graph replaces canvas only after explicit user confirmation.
- Old route and validation records remain tied to their original source versions.

Keep the master screenshot's composition, muted green paths, restrained defect treatment, inspector size and integrated timeline.

# 7. WORKSPACE 03 — NARRATIVE MAP

**Purpose:** Show chronological progression of character knowledge, reveals, conflicts and mood. This is not a second graph editor.

### Layout

- Header with route selector, time/timeline scale and event filters.
- Main horizontal lanes:
  1. Story Beats.
  2. Characters.
  3. Reveals / Knowledge.
  4. Conflicts.
  5. Mood / Intensity.
- Right-side selected-event inspector: event, passage, route, order, character, state change, source evidence and related cues.
- Compact mood curve if backed by actual annotated data.

### Route facts

Route A: At Archives (P-002), the protagonist discovers the conspirator dossier; `conspirator_known` changes from false to true.

Route B: The protagonist bypasses Archives through Air Vent (P-003); `conspirator_known` remains false at P-003.

The README and existing sample source are authoritative for later reveal details. Do not invent the exact reveal event or place it at Server Vault unless the source/story metadata confirms it. Creator-authored events/facts are authoritative; AI may suggest annotations but must label them as suggestions.

### Interactions

- Switch Route A/Route B.
- Filter beat, character, reveal, conflict and mood.
- Select event to inspect.
- Open passage in Story Graph.
- Compare state at the same passage across routes.
- Open related cue in Cue Library.

### Design direction

Precise editorial timeline, fine tracks, compact event markers and legible labels. No decorative spaghetti curves or charts unsupported by data.

# 8. WORKSPACE 04 — CUE LIBRARY

**Purpose:** Manage audio files, metadata and narrative cue assignments.

### Layout

1. Left filters: All, Music, Ambience, SFX, Used, Unused, Missing, Issues.
2. Main inventory: filename, type, duration, availability/status, usage count.
3. Right inspector: metadata, real waveform, playback, assignments and cue settings.

Expected sample filenames:

- `rain_loop.wav`
- `suspense_drone.wav`
- `paper_rustle.wav`
- `traitor_theme.wav`
- `morning_birds.wav`

The README says `traitor_theme.wav` was not uploaded in the original demo. The current audit says the decoder produces real 128-bucket waveforms for uploaded WAV/FLAC files. Inspect the actual media store and decide availability from it. If missing, show **Missing / Not uploaded**, with no duration, fake waveform or measured loudness. If present, use its actual decoded data.

### Inspector

- Name and availability.
- Format, sample rate, bit depth, channel count, duration from actual metadata.
- Actual waveform (use the current 128-bucket decoder output if verified).
- Play/pause, seek and volume.
- Layer: Music / Ambience / SFX.
- Trigger and passage/event assignment.
- Loop, fade-in/out and gain if supported.
- All route and passage usages.
- Related findings.

### Interactions

- Import Audio.
- Search and filter.
- Select asset.
- Audition actual asset if present.
- Replace missing asset.
- Assign/unassign cue.
- Navigate to passage, route or finding.

# 9. WORKSPACE 05 — ROUTE LAB

**Purpose:** Stateful route simulation, trace inspection and regression reproduction.

### Layout

- Route/test configuration header.
- Main route sequence/stepper with visited and pending passages.
- Central ordered traversal trace.
- State inspector.
- Audio event monitor.
- Transport/step controls.
- Exploration summary and budget state.

### Controls

- Route A/Route B and discovered route selector.
- Start, Pause, Resume, Restart.
- Previous Scene / Next Scene.
- Auto Traversal.
- Manual branch selection where semantics support it.
- Max depth, routes/states and time budget.

### Trace record

Each step shows passage ID, visit order, variable updates, narrative facts, event order, cue triggers, simulation time and linked findings.

### BT-001 reproduction

Route B: P-001 → P-003 → P-004 → P-005. At P-003 show Suspense, intensity 4/5, identity not revealed, `conspirator_known: false`. Reproduce BT-001 using actual route simulation and event trace, not merely visual state changes.

### Exploration status

Display discovered routes, visited states, depth, truncation and unsupported conditions only from actual exploration data. Statuses: Complete, Partial, Not evaluated, Unverified, Failed. Never show 100% coverage if the budget truncated exploration or the parser could not model relevant semantics.

# 10. WORKSPACE 06 — VALIDATION CENTRE

**Purpose:** Deterministic narrative/audio QA with traceable source evidence and optional AI support.

### Layout

- Header: source/project version, configuration, Run Validation and latest run status.
- Left rule groups: Narrative Protection, Narrative State, Audio Integrity, Audio Continuity, Loop Integrity, Route Consistency.
- Centre table: ID, rule, severity, passage, cue, route, status.
- Right inspector: description, source excerpt, route trace, related passage/cue, suggested action and status controls.

### BT-001 — Reveal Protection — High

A reveal cue must not fire when the required narrative knowledge fact is false on the current route.

Use route-state execution as authoritative where conditions, event order and story semantics matter. Graph dominance may be used as a structural proof only when its assumptions hold.

For a reveal and cue in the same passage, require explicit event ordering. Unknown order must be Unverified/Not evaluated, never silently passed.

Expected sample defect: BT-001, Route B, Air Vent P-003, `traitor_theme.wav`, Open.

### BT-002 — Missing Asset

If a cue points to a missing file, create a distinct asset-integrity finding. Only create it if the asset is actually absent. Do not merge it into BT-001.

### Other checks

Support measured checks for unsupported/corrupt audio, missing cue references, unused assets, loop warnings, clipping and audio continuity only when corresponding measurements and methods exist. Do not call measurement warnings deterministic narrative failures.

### Finding actions

- Open in Story Graph.
- Reproduce in Route Lab.
- Inspect Cue.
- View Source.
- Mark In Review.
- Mark Resolved.
- Re-run validation.

Keep audit history and original evidence when resolving. AI recommendations must not override deterministic statuses.

# 11. WORKSPACE 07 — REPORTS

**Purpose:** Reproducible QA artifacts and run/version comparison.

### Layout

- Header with project/source version, validation run selector and Generate Report.
- Project summary from actual records.
- Route exploration/evaluation status.
- Findings by severity and rule.
- Audio asset health with measured properties only.
- Validation history and source-version comparison.
- Report preview and export actions.

### Exports

- JSON.
- Markdown.
- PDF only if a reliable renderer already exists or is explicitly implemented and tested. Never show a decorative nonfunctional PDF button.

### Reproducibility

Include source content hash, parser version, exploration configuration, rules executed, run ID, timestamps, route results, findings, evidence, coverage state and SHA-256 hash of the exported report. Implement a verification action if possible.

Reports must distinguish Passed, Failed, Partial, Not evaluated and Unverified. Never invent quality percentages or route coverage.

---

# PART III — PRODUCT ENGINEERING AND REMAINING FUNCTIONALITY

# 12. TECHNOLOGY STACK — PRESERVE THE CURRENT IMPLEMENTATION

The original README specifies:

| Layer | Stack |
|---|---|
| Frontend | React 19 |
| Language | TypeScript 5.8 strict mode; zero `any` |
| Build | Vite 5 |
| Graph | `@xyflow/react` / React Flow |
| State | Zustand |
| Audio | Web Audio API |
| Icons | Lucide React |
| Typography | Geist, Geist Mono, Inter Display/JetBrains Mono as currently installed |
| Backend | Python 3.13, FastAPI |
| Schemas | Pydantic v2 |
| Database | SQLite |
| AI | Existing Adaption Labs inference client |
| Tests | Vitest and Pytest |
| Deployment | Existing Vercel setup |

Inspect actual package versions and configuration. Preserve the existing stack and conventions. Do not migrate frameworks or replace working services without a documented need.

# 13. SQLITE PERSISTENCE — REQUIRED DECISION: YES

The latest audit summary says simulation and validation runs are held in memory with deterministic seed fallbacks. Complete persistence using the existing SQLite schema and migrations.

Persist at minimum:

- User-created projects and settings.
- Imported story/source versions and hashes.
- Passages/edges/facts/events or references to the normalized versioned model.
- Audio assets and cue assignments.
- Route exploration configurations and results.
- Traversal traces and state transitions.
- Validation runs and findings.
- Finding status/history.
- AI inference metadata/responses where appropriate.
- Report artifacts/metadata and integrity hashes.

Requirements:

- Extend existing schema; do not create a parallel store.
- Use transactions, foreign keys and appropriate indexes.
- Add migrations without destroying existing data.
- Keep deterministic seed data only for an explicitly labelled demo project.
- Do not silently replace a user project with seeded demo data after restart or database failure.
- Preserve old runs against their original story/source version.
- Test data persistence after stopping and restarting the backend.

# 14. STORY IMPORT AND DYNAMIC GRAPH LOADING — REQUIRED DECISION: YES

The latest audit reports that `StoryImportModal.tsx` parses `.twee` and `.ink` and returns AST metrics (passages, edges, mutations and SHA-256), but that the visible canvas still needs a deliberate load step.

Implement this flow:

1. User selects/uploads a source file.
2. Identify format and validate file.
3. Parse and display diagnostics.
4. Show format, parser scope/status, passages, edges, mutations/variables, warnings and source hash.
5. Preview normalized graph.
6. User explicitly selects **Load Into Story Graph Canvas**.
7. Confirm replacement if another story is open.
8. Load normalized imported nodes and edges into React Flow.
9. Update Narrative Map, Route Lab and validation inputs from the same versioned model.
10. Preserve prior run history tied to the previous source version.
11. Clear/reconcile selected passage/cue/finding only when no longer valid.

Never hardcode the original five passages after a different story is loaded. The five-passage story is a sample fixture, not the parser's output contract.

# 15. DYNAMIC AST PARSER — TWEE/SUGARCUBE AND INK

This is a critical remaining capability.

## 15.1 `.twee` / Twine / SugarCube

Implement or complete a structured parser/lexer/AST approach, not only a few fragile regular expressions.

Extract as supported:

- Passage names/IDs.
- Passage tags.
- Passage text.
- Links and destinations.
- Relevant SugarCube variables and mutations.
- Conditional branches required for traversal.
- Narrative/audio metadata where explicitly represented.
- Source file, line and column locations.

Report malformed syntax, missing destinations, duplicate IDs and unsupported constructs with source diagnostics wherever possible.

## 15.2 `.ink`

The audit says the current parser supports the **Inkle Ink Core Structural Subset**:

- Global variables.
- Knots (`===`).
- Stitches (`=`).
- Diverts (`->`).
- Choices (`*`, `+`).
- Tags (`#`).
- Mutations (`~`).

Do not claim full Ink support if nested/multi-branch gathers and complex weave semantics are not modelled accurately. Do not silently flatten constructs and claim the resulting route graph is authoritative. Mark affected constructs/branches Unverified or Not evaluated and retain source diagnostics. Expand semantics only with parser/compiler-backed handling and tests.

## 15.3 Normalized model

Both formats should feed one internal representation:

- Story/source/version.
- Passage.
- Directed edge/choice.
- Variable/condition.
- Narrative fact/event.
- Audio cue assignment/trigger.
- Source reference.
- Parse diagnostic.

Keep original source locations so findings can quote the exact passage and open the relevant source.

## 15.4 Parser test fixtures

Valid `.twee`, valid core `.ink`, simple branch, merge, multiple choices, variable conditions, mutations, tags, missing target, duplicate title/ID, malformed syntax, unsupported nested gathers, unreachable passage and source-position diagnostics.

# 16. BREADTH-FIRST ROUTE EXPLORATION — REQUIRED

Implement actual stateful BFS over the parsed story model.

A route is an ordered sequence of visited passages/events. A state must include enough information to distinguish semantically different visits:

- Current passage.
- Previous passage.
- Visit sequence/history required by rules.
- Narrative knowledge facts.
- Story variables.
- Event history/order.
- Triggered cues.
- Depth.

Do not deduplicate states on passage ID alone. The same passage reached with different knowledge/variable states can produce different validation results. Define a canonical state signature that includes all rule-relevant state; explain any abstraction used to keep exploration finite.

Support configurable budgets:

- Maximum depth.
- Maximum route count.
- Maximum state count.
- Maximum wall-clock time.

Explore branch choices deterministically where possible. Evaluate conditions only where semantics are implemented. If a condition is unknown/unsupported, do not randomly choose a branch; mark affected path/coverage Unverified or Not evaluated.

Handle cycles and loops with state-aware deduplication and depth/budget limits. Do not assume all stories are DAGs, even if the sample mathematical model describes a DAG.

Persist:

- Source/version hash.
- Exploration settings.
- Routes/states explored.
- Truncated branches.
- Unsupported conditions.
- Completion status.
- Findings and trace references.

Coverage statuses:

- Complete.
- Partial.
- Not evaluated.
- Unverified.
- Failed.

If any relevant branch is cut off by a budget or parser limitation, do not report complete coverage.

Mandatory sample results:

Route A: P-001 → P-002 → P-004 → P-005.  
Route B: P-001 → P-003 → P-004 → P-005.

These routes must be discovered from the sample model; do not hardcode them as the only possible routes.

# 17. REAL WAV/FLAC DECODING AND AUDIO PLAYBACK — REQUIRED

The latest audit says a real binary decoder already produces 128-bucket waveforms for uploaded WAV/FLAC files. Verify and preserve the working decoder rather than rewriting it unnecessarily.

The remaining reported gap is actual uploaded-media playback; the current audition path uses Web Audio synthesis.

## 17.1 Decode/asset pipeline

- Validate uploaded file type, size and content.
- Parse/decode WAV and FLAC using an appropriate verified decoder.
- Extract sample rate, channels, duration, bit depth where available.
- Generate waveform summaries from actual samples.
- Preserve actual upload hash and asset state.
- Keep heavy processing off the main UI thread where appropriate.
- Do not assume native browser `decodeAudioData` supports FLAC in every browser.
- Use a tested decoder/WASM/backend fallback where needed.

## 17.2 Streaming endpoint

If the backend lacks an equivalent, implement:

`GET /api/v1/projects/{project_id}/assets/{asset_id}/stream`

Support:

- Actual binary streaming.
- Correct MIME type.
- HTTP Range / partial-content requests.
- Browser seeking.
- Content length where available.
- Project ownership/access checks.
- Safe storage lookup; never accept arbitrary filesystem paths from the client.
- Missing/unavailable/unsupported asset handling.

Use an HTML audio element for production-file playback. Connect it to Web Audio with `MediaElementAudioSourceNode` when oscilloscope/VU analysis is required. Keep synthetic audition separate from actual asset playback.

## 17.3 Actual measurement disclosure

Only report duration, loudness, sample peak, true peak, clipping, sample rate and channel information when measured from the actual file with a documented method. Do not invent a waveform, duration or measurement for a missing file.

# 18. ADAPTION LABS — PRESERVE AND COMPLETE

Sponsor: Adaption Labs.  
Referral: `https://adaptionlabs.ai/app/auth/referral?ref=c902663068828f4bf2e63348`  
Model card: `adaption-branchtone-7b-v1`  
Documented base model: Mistral 7B Instruct v0.3.  
Documented LoRA settings: rank 16, alpha/scaling 32, dropout 0.05.  
Documented dataset: 3,400 curated branching-game dialogue passages.  
Documented model-card results: 94.2% tone classification agreement; 98.7% spoiler leak detection precision.

Preserve the existing inference client and connectivity. Inspect actual implementation and complete:

- Secure environment-based authentication.
- Typed request/response schemas.
- Timeouts and error handling.
- Rate limit handling.
- Response validation.
- Honest unavailable/offline states.
- Narrative tone classification.
- Tension analysis.
- Spoiler-risk assistance.
- Copilot passage selection.
- Benchmark modal with preset/custom text.
- Actual inference output and latency/token metadata only when supplied.
- Proposed correction with original-vs-proposed diff.
- Explicit user approval to apply.
- Undo.

Do not expose credentials to the frontend or commit them. Do not fabricate inference responses when service/credentials are unavailable. Core deterministic validation must continue to work without the AI service.

AI is probabilistic assistance. It must not silently set a deterministic finding to Passed or override route-state evidence. Label model-card benchmarks separately from live inference outputs.

# 19. WEB AUDIO SYNTHESIS — PRESERVE AND EXTEND

Existing service in the README: `frontend/src/services/synth.ts`. Inspect it before modifying.

Preserve/verify:

- `playAuditionTone(freq, duration)` — harmonic sine-wave audition with exponential gain decay; documented example range 440Hz to 587Hz.
- `playCueTriggerSound(isViolation)` — defect alert uses a dual-oscillator tritone, documented C5 + F#4, with resonant low-pass sweep; clean transition uses a major chord.
- `playMechanicalClick()` — documented approximately 15ms mechanical relay-style UI feedback.

Integrate with route stepping, timeline scrubbing, auto traversal, passage transitions, Talk to BranchTone and validation alerts.

Provide a user setting to disable UI sound effects. Do not autoplay sound on application load. A synthesized sound is not the actual source audio asset.

# 20. OSCILLOSCOPE, STEREO VU METERS AND DAW TRANSPORT

These are product features in the original README; preserve them.

## Oscilloscope

- Driven by actual playback via Web Audio `AnalyserNode`.
- Time-domain waveform.
- Smooth rendering at a practical ~60fps target.
- Controlled phosphor treatment.
- No fake continuously animated waveform when stopped or when no audio exists.

## Stereo VU meters

- Separate L/R channels.
- dB scale.
- Dynamic level updates.
- Peak hold and decay.
- Calibration action.
- Documented approximate display range -24dB to +3dB, if it matches actual signal mapping.

## Transport

- Play, pause, stop.
- Route switching.
- Previous/next scene.
- Timeline scrubber.
- Current/total timecode.
- -5s/+5s nudge where meaningful.
- Master volume.
- Active cue markers.

Timecode and playhead must follow actual media/simulation state.

# 21. DATABASE AND NORMALIZED DOMAIN MODEL

Inspect the existing SQLite schema contracts and extend them rather than creating duplicates. Use migrations that preserve data.

The model must represent the following concepts (reuse existing names/IDs where already defined):

- Project and project version.
- Story source, source hash, parser version and diagnostics.
- Passage and source location.
- Passage edge/choice and condition.
- Story variable and narrative fact.
- Narrative event and event order.
- Audio asset and availability/decoded metadata.
- Audio cue and passage/event assignment.
- Route exploration config and result.
- Traversal trace/state snapshot.
- Validation run.
- Finding and evidence.
- AI inference and proposed fix.
- Report artifact and SHA-256.
- Audit event/status history.

Use foreign keys, transactions, indexes and Pydantic v2 schemas. Do not discard old runs when a new story version is loaded. Every run/finding/report must point to the relevant source/project version.

# 22. API/SERVICE INTEGRATION

Inspect current FastAPI routes first. Reuse existing naming/auth conventions. Ensure there is functionality equivalent to:

**Projects:** create/list/get/update/archive/delete.  
**Story:** upload source, parse, retrieve diagnostics, preview normalized graph, confirm/load graph, retrieve passages and edges.  
**Routes:** configure exploration, start exploration, retrieve results/traces, simulate route.  
**Audio:** upload asset, inspect asset, decode, retrieve waveform, stream/play, assign cue, update cue settings.  
**Validation:** start run, get run, list findings, get evidence, update status, revalidate.  
**AI:** classify passage, assess risk, propose fix, approve/apply, undo, benchmark.  
**Reports:** generate JSON/Markdown, export, verify SHA-256.

Use background/task processing for expensive parse, decode and exploration tasks when appropriate. Return explicit states such as queued/running/completed/failed. Never tell the UI a task succeeded before the service reports success.

# 23. REPORTS AND SHA-256 VERIFICATION

Generate real JSON and Markdown artifacts. Include:

- Project and source version.
- Source hash.
- Parser name/version and warnings.
- Exploration configuration/status.
- Routes/states evaluated and truncated branches.
- Rules executed.
- Findings and evidence.
- Audio asset availability and measured data.
- AI analysis summary (clearly labelled probabilistic).
- Validation run ID and timestamps.
- Test/result summary where applicable.
- SHA-256 hash of the report artifact.

Provide verification against the stored/exported artifact. PDF is optional unless a reliable existing renderer is present or added and tested. Do not expose a nonfunctional PDF button.

---

# PART IV — DATA CONSISTENCY, DOMAIN RULES AND HONEST DISCLOSURES

# 24. DEMONSTRATION STORY — EXACT DATA

Passages:

- P-001: Lobby.
- P-002: Archives.
- P-003: Air Vent.
- P-004: Server Vault.
- P-005: Safe House.

Route A: P-001 → P-002 → P-004 → P-005.  
Route B: P-001 → P-003 → P-004 → P-005.

README facts:

- Route A visits Archives (P-002), where the protagonist uncovers the conspirator dossier; the relevant knowledge becomes true.
- Route B bypasses Archives via Air Vent (P-003); at Air Vent the protagonist remains unaware of the conspirator.
- Air Vent is Suspense, intensity 4/5.
- `traitor_theme.wav` firing at Air Vent is the BT-001 premature reveal cue defect.

Source excerpt supplied in README:

> “Sen squeezes through the dark metal duct to bypass the locked hallway, completely unaware of who is behind the conspiracy.”

Use the exact source in evidence, but use parser-generated source positions. Do not invent line numbers.

The supplied visual-generation brief also used the concept that the identity is revealed later in Server Vault on Route B. Treat that as a sample event only if the actual source/story metadata confirms it. The parsed source and creator-authored metadata are authoritative.

Expected sample finding:

`BT-001 — Reveal Protection — High — Route B — Air Vent (P-003) — Open`

Potential audio assets listed in README:

- `rain_loop.wav`
- `suspense_drone.wav`
- `paper_rustle.wav`
- `traitor_theme.wav`
- `morning_birds.wav`

The original README says `traitor_theme.wav` was not uploaded. Verify the actual current file store; do not assume it is still missing if a real upload now exists. Never fabricate duration or waveform if absent.

# 25. MATHEMATICAL / VALIDATION INVARIANTS

The README models a directed narrative graph `G = (V, E, λv, λe)` where vertices are passages, edges are choices and each passage carries story text, intensity and audio cue triggers.

A route is an ordered sequence of connected passage visits. Narrative knowledge accumulates through facts/events encountered along that route:

`K_r(v_i) = K_r(v_(i-1)) ∪ ΔK(v_i)`

BT-001 invariant:

For every explored route, a reveal cue may fire only if the required fact is already known at the cue's actual event order.

Important caveats:

- A passage-level dominance result can prove structural ordering under its assumptions, but does not prove event order within the same passage.
- Same-passage reveal/cue needs explicit ordering metadata.
- Unknown/unsupported semantics must be Unverified or Not evaluated.
- Route execution, state transitions and cue event order are the decisive evidence for cases involving conditions and knowledge state.
- AI classification is supplementary and does not replace the invariant.

---

# PART V — TESTING, QUALITY AND ACCEPTANCE

# 26. TEST BASELINE AND TEST COUNT DISCREPANCY

Original README documents 43 Vitest tests and 11 Pytest tests.

Latest Antigravity audit summary supplied by the user reports 43 frontend tests and 37 backend tests.

Do not assume either backend count. Run the actual commands and record collected/passed/failed/skipped. Preserve all current tests; do not delete or weaken them.

Before changes:

- Frontend tests.
- Backend tests.
- TypeScript strict check.
- Production build.
- Git status.

After changes, run the same plus new integration/end-to-end tests. Record exact outputs and failures.

## 26.1 Parser tests

- Valid `.twee`.
- Valid supported `.ink`.
- Branch/merge.
- Multiple choices.
- Variables and conditions.
- Mutations and tags.
- Missing targets.
- Duplicate identifiers.
- Malformed syntax.
- Unsupported gathers/weaves.
- Source references.

## 26.2 BFS tests

- Single route.
- Multiple branches.
- Merge.
- Conditions.
- Same passage reached with different fact/variable state.
- Cycle/loop.
- Depth/state/route/time budget.
- Budget truncation.
- Unsupported condition.
- Deterministic reproducibility.

## 26.3 BT-001 tests

- Route A: required fact established before cue → Pass.
- Route B: fact false at Air Vent when cue fires → High-severity BT-001.
- Same passage, reveal ordered before cue → Pass.
- Same passage, cue ordered before reveal → Fail.
- Same passage, missing event order → Unverified/Not evaluated.

## 26.4 Audio tests

- Valid WAV.
- Valid FLAC.
- Invalid binary.
- Unsupported encoding.
- Missing asset.
- Mono/stereo.
- Duration/sample rate/channel metadata.
- 128-bucket waveform corresponds to real decoded samples.
- Streaming content type and range requests.
- Browser seeking.
- Real playback.
- Visualiser response to actual playback.

## 26.5 Persistence tests

Create project, import source, run route exploration, create finding, change status, stop/restart backend and confirm all expected records persist with correct version references.

## 26.6 AI tests

Use mock responses for unit/integration tests. Verify success, invalid response, timeout, unavailable service, authentication failure, proposal generation, user approval, applied change and undo. Do not require a live paid model request for every unit test.

## 26.7 Reports tests

- JSON export.
- Markdown export.
- Stable IDs and references.
- Correct coverage disclosure.
- SHA-256 verification.
- Historical source/run references.

## 26.8 Full end-to-end acceptance flow

Run one reproducible integrated flow:

1. Create/open project.
2. Import a different `.twee` fixture.
3. Review parse result.
4. Explicitly load it into Story Graph.
5. Confirm the graph actually changes from the sample five nodes to imported nodes.
6. Run BFS with a configured budget.
7. Confirm route trace and coverage status.
8. Upload a real WAV and a real FLAC test fixture.
9. Decode, inspect waveform, stream, play and seek.
10. Assign a cue to a passage.
11. Run deterministic validation.
12. Reproduce BT-001 using the sample story fixture.
13. Inspect exact source evidence.
14. Correct/approve the relevant cue configuration.
15. Re-run validation and record new status without deleting history.
16. Generate JSON and Markdown reports.
17. Verify SHA-256.
18. Restart backend and confirm persisted state.

---

# 27. SECURITY AND RELIABILITY

- Validate file type, signature/content and size; do not trust extension alone.
- Prevent path traversal and arbitrary filesystem access.
- Store uploaded assets in controlled storage.
- Check project/user/session ownership on asset stream routes.
- Keep API secrets in environment variables; never bundle them into frontend code.
- Avoid logging secrets or sensitive file contents unnecessarily.
- Validate API request/response payloads.
- Use timeouts and bounded resource usage for parse/decode/exploration.
- Use database transactions and migrations.
- Handle missing/corrupt media and DB errors without silently seeding or overwriting user data.
- AI outage must not disable deterministic validation.
- Make long-running operations report queued/running/completed/failed accurately.

---

# 28. IMPLEMENTATION PHASES — RECOMMENDED ORDER

Do not do all changes in one unreviewed rewrite. Work in verified phases with checkpoints and run tests between phases.

### Phase 0 — Baseline audit

Read package docs and local audit, inspect repository, run tests/build/typecheck, record Git status and current working changes. Produce a concise gap matrix.

### Phase 1 — Design system and shell

Implement design tokens and reusable shell components based on Option 2. Do not change backend logic during this phase. Compare Story Graph against the exact master screenshot and correct visual regressions.

### Phase 2 — Existing seven workspace UI polish

Improve all seven separate screens using the screen-by-screen specification. Confirm navigation and shared state. No collage or marketing page.

### Phase 3 — Persistence

Finish SQLite-backed projects, versions, routes, traces, validation and report metadata. Verify backend-restart durability.

### Phase 4 — Import-to-canvas integration

Complete review/confirm/load flow. Confirm imported graph updates React Flow and all downstream workspace models.

### Phase 5 — Real audio playback

Preserve verified decoder and waveform generation. Add streaming with range support and real playback/seek. Integrate oscilloscope/VU analysis with actual media.

### Phase 6 — Parser and BFS semantics

Verify parser coverage and disclose Ink subset; implement state-aware BFS with budgets, cycles and honest partial/unverified status.

### Phase 7 — Deterministic validation

Connect BT-001/BT-002 to route traces, actual cue assignments, event order and source evidence. Add regression fixtures.

### Phase 8 — Adaption Labs workflow

Complete error handling, real inference, benchmark, review/apply/undo and offline states.

### Phase 9 — Reports and reproducibility

Implement JSON/Markdown export, report hash and verification.

### Phase 10 — Full regression and production verification

Run all tests, typecheck, production build, integration flow, backend restart, actual media playback and local Git inspection. Only then assess completion.

---

# 29. FINAL ACCEPTANCE CHECKLIST

BranchTone can be called complete only when the following have been verified in the current repository:

## Visual and interaction quality

- [ ] All seven workspaces open as separate full desktop screens.
- [ ] Approved Option 2 Story Graph visual composition is preserved.
- [ ] Shared shell, tokens, typography, icons, borders and spacing are consistent.
- [ ] Screens are professionally aligned at 1920×1200, 1440×900 and practical 1280px width.
- [ ] Relevant animations are restrained, purposeful and respect reduced motion.
- [ ] No decorative control is presented as functional when it is not.
- [ ] Empty/loading/error/offline/unsaved states exist.

## Application and persistence

- [ ] Seven workspaces use one project model and shared state.
- [ ] Custom projects and runs persist after backend restart.
- [ ] Seed data is limited to a clearly labelled demo project.
- [ ] Historical runs remain associated with their source versions.

## Import and graph

- [ ] `.twee` imports and diagnostics work.
- [ ] Supported `.ink` imports work and subset limitations are disclosed.
- [ ] Import review and explicit Load Into Story Graph work.
- [ ] Graph is generated from imported story data.
- [ ] Source references remain available.

## BFS and validation

- [ ] BFS discovers actual routes, including Route A and B in sample story.
- [ ] State includes rule-relevant knowledge/variables/events.
- [ ] Budgets/cycles/unsupported branches are handled honestly.
- [ ] BT-001 differentiates Route A and Route B correctly.
- [ ] Same-passage event ordering is handled explicitly.
- [ ] BT-002 is generated only when an asset is actually missing.
- [ ] Findings include route, passage, cue, source and trace evidence.

## Audio

- [ ] Real WAV decoding is verified.
- [ ] Real FLAC decoding is verified.
- [ ] Actual file playback and seeking work.
- [ ] HTTP streaming supports range requests or an equivalent tested mechanism.
- [ ] Waveform uses real samples.
- [ ] Oscilloscope/VU meters follow actual playback.
- [ ] Synthesis is clearly distinct from source-media playback.
- [ ] Missing files never receive fabricated measurements/waveforms.

## AI

- [ ] Adaption Labs calls work when credentials/service are available.
- [ ] Errors/timeouts/offline state are handled.
- [ ] Runtime response is distinguished from model-card benchmark metrics.
- [ ] AI proposal is reviewable, user-approved and undoable.
- [ ] AI never overrides deterministic validation.

## Reports and quality

- [ ] JSON export works.
- [ ] Markdown export works.
- [ ] SHA-256 verification works.
- [ ] Coverage statuses distinguish Complete, Partial, Not evaluated, Unverified and Failed.
- [ ] Existing tests are preserved and new tests pass.
- [ ] TypeScript strict check passes.
- [ ] Production build succeeds.
- [ ] End-to-end acceptance flow passes.
- [ ] Backend restart persistence test passes.
- [ ] Git status and changed-file list are reported; no commit/push was made.

A checkbox must only be marked complete when supported by actual test output, code inspection or reproducible manual verification. If a required third-party credential, missing sample asset or unsupported parser semantic prevents verification, leave it explicitly blocked/unverified and explain why.

---

# 30. REQUIRED FINAL REPORT FROM ANTIGRAVITY

At the end, produce a concise but detailed engineering report containing:

1. Initial baseline: exact test counts/results, typecheck and build.
2. Current implementation map: which requirements were already present.
3. Changes made: features and files modified.
4. UI/UX: changes to all seven workspaces and design consistency checks.
5. SQLite: migrations and restart persistence result.
6. Parser: `.twee` coverage and exact supported Ink subset.
7. BFS: state signature, budgets, route counts, truncation/unverified states.
8. Audio: formats decoded, stream/range/seek result, actual playback and visualiser result.
9. Validation: BT-001/BT-002 test outcomes and evidence behaviour.
10. Adaption Labs: actual connectivity, model response test, failure handling and remaining credential limitations.
11. Reports: JSON/Markdown export and SHA-256 verification.
12. Final test results: exact collected/passed/failed/skipped counts, no unexplained count discrepancy.
13. Production build/deployment status, with evidence; do not claim deployment if not performed.
14. Remaining limitations, blockers and unverified requirements.
15. Final `git status` and changed-file list. No commit or push.

---

# FINAL DIRECTIVE

Preserve the working BranchTone foundation. Complete the verified remaining engineering gaps. Upgrade all seven workspaces to the professional, understated, premium Option 2 design. Keep all product data accurate and every claim testable.

The objective is not a 100%-finished-looking interface. It is a real, reproducible, technically honest and visually polished BranchTone application.

**Do not declare 100% complete until every applicable acceptance criterion has been verified.**
