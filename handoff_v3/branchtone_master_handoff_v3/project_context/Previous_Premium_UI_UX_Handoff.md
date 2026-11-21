# BRANCHTONE — PREMIUM UI/UX IMPLEMENTATION HANDOFF

**Purpose:** Upgrade the existing BranchTone application to the premium visual quality of the approved Option 2 reference while preserving its current architecture, implemented features, data integrity and local Git state.

**Product:** BranchTone — Narrative Audio QA & Regression Testing Studio  
**Tagline:** Sound design you can test, not just hear.  
**Project:** The Last Signal  
**Primary visual reference:** `references/Option2_StoryGraph_Master.png` (included in the companion ZIP)

---

## 0. Instructions to Antigravity

You are continuing an existing application. This document is a **UI/UX implementation handoff**, informed by the supplied BranchTone README and the latest Antigravity audit summary. It is not authorization to replace the application architecture or rewrite working product logic.

Before changing code:

1. Inspect the current repository and the audit document in the local Antigravity workspace.
2. Inspect the current state of every workspace and shared component.
3. Run the current tests and production build; record the actual baseline.
4. Map the current implementation to the screen specifications below.
5. Make the smallest coherent changes required to reach the visual and interaction quality described here.

**Do not commit, push, reset, clean or discard local Git changes.** The user explicitly wants development to remain local. Preserve all current uncommitted work.

The README originally documents 43 frontend tests and 11 backend tests. The latest audit summary reports 43 frontend tests and 37 backend tests. This discrepancy must be resolved by inspecting and running the current repository's actual test suites. Never repeat either count as a current verified result without rerunning the tests.

## 1. Source-of-truth hierarchy

Use these sources in this order:

1. **Approved Option 2 Story Graph screenshot** — definitive visual reference for the application shell, materials, graph, inspector, transport and timeline.
2. **Current working repository** — definitive source for what is already implemented and how it works.
3. **Latest Antigravity technical audit** — source for the current gaps and implementation status.
4. **BranchTone README** — product concept, domain rules, original architecture and demonstration story.
5. Other generated BranchTone collages — secondary feature overview only; do not copy their tiled layouts or promotional composition.
6. Original Vexto/LINC visual references — material and lighting inspiration only; do not reproduce their products or layouts.

Do not mistake a local `file:///C:/...` link for an uploaded file. The full audit should be read from the user's local Antigravity workspace if available.

## 2. Current implementation facts from the latest audit summary

The latest status supplied by the user says:

- The app has existing frontend and backend work in the local working tree.
- There are 43 frontend tests and 37 backend tests according to the audit summary; verify them against the repository.
- An existing `StoryImportModal.tsx` parses `.twee` and `.ink` and reports AST metrics including passages, edges, mutations and SHA-256.
- The imported graph is not yet loaded dynamically into the main React Flow canvas; an explicit **Load Into Story Graph Canvas** step is still needed.
- The WAV/FLAC binary decoder currently creates real 128-bucket waveforms for uploaded files.
- The current audition path still uses Web Audio tone synthesis rather than actual decoded-file playback.
- Simulation and validation runs are held in memory, with deterministic seed fallbacks for the demo project.
- The Ink parser supports a declared core structural subset: global variables, knots, stitches, diverts, choices, tags and mutations. Complex nested multi-branch gathers may not be represented correctly yet.
- Existing local changes must remain uncommitted and unpushed.

Treat these as audit-summary observations, not independently verified facts. Confirm each one in code before implementing or changing it.

## 3. Decisions to resolve before visual implementation

Apply these product decisions unless the repository audit reveals a concrete blocker.

### 3.1 Persistent SQLite — YES

Persist user-created projects, imported story versions, route-exploration runs, validation runs, findings, cue assignments, AI inference records and report metadata in the existing SQLite database.

- Use the current schema and migrations; extend them rather than creating a parallel data model.
- Keep seeded deterministic data only for the explicitly labelled sample/demo project.
- Do not silently replace a user's project with demo fallback data after restart or database errors.
- Show clear save/persistence state in the UI.
- Preserve prior run history when a new run is created.

### 3.2 Load imported story into Story Graph — YES

After parsing, show an import review step with format, parser status, passage count, edge count, warnings and source hash. Provide a clear **Load Into Story Graph** action.

On confirmation:

- Create or select the target project/version.
- Replace the canvas data with the imported normalized graph.
- Update Narrative Map and route exploration inputs from the same story model.
- Clear invalid selections that no longer exist.
- Mark previous route and validation results as belonging to the previous source version; do not delete them.
- Never overwrite the currently open story without a visible confirmation.
- Preserve parser diagnostics and source references.

### 3.3 Actual audio streaming — YES

Add a secure streaming endpoint if the current backend does not already provide one. The route proposed in the audit is:

`GET /api/v1/projects/{project_id}/assets/{asset_id}/stream`

Requirements:

- Stream only assets belonging to the requested project and accessible to the current user/session.
- Support HTTP byte ranges so seeking works in the browser.
- Return the correct MIME type and content length where available.
- Do not accept arbitrary filesystem paths from the client.
- Handle missing, unsupported and unavailable assets explicitly.
- Use an HTML audio element for robust playback; connect it to Web Audio through `MediaElementAudioSourceNode` when oscilloscope/VU analysis is required.
- Keep synthetic audition tones separate from actual production-file playback.

### 3.4 Ink parser scope — disclose accurately

Use the label **Inkle Ink Core Structural Subset** wherever the UI describes parser capability, until complex weave/gather semantics are correctly supported.

- Do not silently flatten unsupported nested gathers into sequential prose and then claim the resulting route graph is exact.
- Flag unsupported constructs with file, line and column where available.
- Mark affected branches and route coverage as **Unverified** or **Not evaluated**.
- Keep the parser architecture extensible for full Ink control-flow support.

### 3.5 Git discipline — local only

- Do not run `git commit` or `git push`.
- Do not run destructive cleanup or reset commands.
- Do not discard the existing  local modifications.
- After implementation, report `git status` and list changed files without committing.

---

# PART A — LOCKED VISUAL DESIGN SYSTEM

## 4. Overall design direction

BranchTone should feel like an established creative-engineering workstation: precise, calm, technical and tactile. The Option 2 Story Graph is the master. Extend its design language; do not invent a new one for the other workspaces.

The quality target is closer to a mature desktop creative tool than a generic SaaS dashboard. Prioritize hierarchy, density, alignment, clear typography and accurate data. Glass is a material treatment, not the layout system.

### 4.1 Palette

Use these as starting tokens and calibrate against the approved screenshot:

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

Colour must carry meaning:

- Emerald: selected route, valid state, active audio signal, successful operation.
- Amber: caution, suspense annotation or warning.
- Red / burgundy: real defect or blocked state.
- Neutral grey: ordinary metadata, inactive controls and dividers.

Do not add purple/blue AI gradients. Do not use saturated green bloom as a full-screen background.

### 4.2 Typography

- Primary: Geist / Inter-style sans-serif.
- Technical: Geist Mono or JetBrains Mono.
- Page title: 22–26px, medium weight.
- Section title: 13–15px, medium weight.
- Body: 13–14px, regular.
- Secondary labels: 11–12px, readable contrast.
- IDs, filenames and timecodes: 11–12px monospaced, tabular numerals.

Avoid ultra-light type at small sizes. Avoid tracking-heavy all-caps labels. Sentence case is preferred except for compact technical section labels already present in the master screen.

### 4.3 Radius, spacing and borders

- Tags/keycaps: 4px.
- Buttons/inputs: 6–8px.
- Cards/inspectors: 12–14px.
- Workspace chassis: 16px.
- Spacing base: 4px; use 4, 8, 12, 16, 20, 24, 32px consistently.
- Borders: 1px muted silver-grey; stronger only for selected/focused elements.

Do not turn every action into a pill. Reserve pill shapes for compact route toggles or status controls only where they match the master screen.

### 4.4 Smoked-glass material

Use opaque or near-opaque surfaces for dense working areas. Use translucent glass selectively for:

- Floating inspector layers.
- Selected passage detail.
- Context menus and overlays.
- Small transport modules.
- Brief status surfaces.

Keep labels, tables, charts and waveforms on sufficiently opaque backgrounds. Avoid blur behind small text. Keep film grain extremely subtle; do not let decorative texture reduce contrast.

### 4.5 Iconography

Use one consistent outline icon family (Lucide React, already present in the project if verified). Use consistent stroke width and 16–18px sizes in navigation. Do not mix filled emoji, 3D icons and outline icons.

### 4.6 Desktop geometry

Target viewport: 1920 × 1200. Validate at 1440 × 900 and 1280px working width.

- Sidebar: approximately 220–236px.
- Top toolbar: approximately 64–72px.
- Right inspector when shown: approximately 320–350px.
- Story Graph central area: dominant region.
- Timeline: substantial lower panel, aligned with central work area and never overlapping the inspector.

Use CSS grid/flex constraints rather than hard-coded absolute positions that break at smaller widths. The exact Option 2 screen must remain visually recognizable.

---

# PART B — SHARED APPLICATION SHELL

## 5. Persistent shell on all seven workspaces

### 5.1 Left navigation

One BranchTone logo and wordmark only.

Workspace switcher:
- Game Development.

Current project card:
- The Last Signal.
- Interactive Detective Story.
- Version v0.4.

Navigation:
1. Overview
2. Story Graph
3. Narrative Map
4. Cue Library
5. Route Lab
6. Validation Centre
7. Reports

At the bottom:
- System status (Ready, Processing, Offline or Error based on actual app state).
- Application version.

The selected item uses a restrained emerald surface/border. The sidebar itself must not change visual identity between screens.

### 5.2 Top toolbar

- Breadcrumb: Projects / The Last Signal / [Workspace].
- Project version.
- Saved / Saving / Unsaved / Save failed status.
- Search or command palette.
- Undo and redo where applicable.
- Run Validation action.
- User profile.

Keep the toolbar compact. No marketing slogans in the toolbar.

### 5.3 Global transport

A compact global audio transport may be available where playback is meaningful. Do not force the full Story Graph waveform timeline into every page. Keep playback state synchronized with the shared store.

### 5.4 Shared state

Continue using the existing Zustand architecture. Preserve at minimum:

- active project and version;
- selected passage;
- selected cue/asset;
- selected finding;
- active route;
- current traversal trace;
- selected validation run;
- playback source and playback time;
- import/parse status.

Navigation between screens must preserve applicable context. Example: choosing **Reproduce BT-001** from Validation Centre opens Route Lab with Route B and P-003 selected.

---

# PART C — SCREEN-BY-SCREEN UI/UX SPECIFICATION

## 6. Workspace 01 — Project Overview

**Purpose:** A focused studio cockpit that explains the state of the current creative project and gives the user a useful next action.

### Layout

1. **Project header:** The Last Signal, Interactive Detective Story, version, last saved time, Import Story and Run Validation.
2. **Compact project facts:** passage count, discovered route count, imported audio asset count, open findings and route exploration status. All values are derived from the database/current model.
3. **Project structure preview:** a small, legible graph preview of the real story, not a decorative diagram. Clicking it opens Story Graph.
4. **Recent activity:** imported source, changed passage, assigned cue, completed validation and resolved finding. Show real timestamps.
5. **QA priorities:** prioritized actions derived from open findings and unevaluated coverage.
6. **Adaption Labs Copilot:** a compact assistant workbench, not a large chat page.

### Copilot content

- Passage tabs P-001 through P-005 for the sample project.
- Mood/tension classification.
- Spoiler-risk result from an actual model response.
- Explanation and evidence.
- Proposed change preview.
- Apply AI Fix Proposal and Undo.
- Benchmark modal entry point.

The documented 94.2% tone agreement and 98.7% spoiler precision are model benchmark/card metrics, not live per-passage confidence. If mentioned, label them as model-card benchmark metrics. Never show a per-passage risk percentage unless returned by the real inference service.

### Interactions

- Import Story opens the existing import modal.
- After parse, user can review then explicitly **Load Into Story Graph**.
- Project facts deep-link to relevant screens and filters.
- Recent activity opens the referenced entity.
- Copilot proposal is never applied without explicit confirmation.

### Premium design direction

A balanced editorial cockpit, not a grid of oversized KPI cards. Use one dominant project identity area, compact facts, activity and QA priority panels. Use imagery only if it is an actual project cover asset; do not invent stock imagery.

## 7. Workspace 02 — Story Graph (LOCKED MASTER)

**Purpose:** Interactive structure and route inspection. This is the approved Option 2 screen. Do not redesign it.

### Required graph

- LOBBY — P-001
- ARCHIVES — P-002
- AIR VENT — P-003
- SERVER VAULT — P-004
- SAFE HOUSE — P-005

Route A: P-001 → P-002 → P-004 → P-005.  
Route B: P-001 → P-003 → P-004 → P-005.

Route B is selected for the BT-001 defect demonstration. AIR VENT is selected.

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

Explanation: “The traitor theme starts before the character's identity is established on this route.”

Show source evidence and a source navigation action. Use actual parser line/column references where available; never invent line numbers.

### Audio timeline

Three tracks: MUSIC, AMBIENCE and SFX. Include timeline ruler, passage boundaries, cue start/stop markers, playhead, route selector, play/pause/stop, previous/next scene, timecode and master volume.

Use actual uploaded-file waveform data when present. For missing assets, show a missing cue/asset marker; do not draw a fake decoded waveform.

### Graph behavior

- Real React Flow canvas from story model.
- Route A/B highlights derive from route traces.
- Node selection updates inspector and timeline.
- Finding marker opens the exact finding.
- Graph updates after confirmed story import.
- Graph updates must not silently discard historical run records.

Preserve the screenshot's composition, node treatment, muted green connections, restrained error state, inspector proportions and integrated timeline.

## 8. Workspace 03 — Narrative Map

**Purpose:** Explain chronological narrative progression and how character knowledge, reveals, conflicts and mood change along a route. This is not another graph.

### Layout

- Header with route selector, timeline scale and event filters.
- Main horizontal narrative timeline with lanes:
  1. Story Beats
  2. Characters
  3. Reveals / Knowledge
  4. Conflicts
  5. Mood / Intensity
- Right event inspector with selected event, passage, route, event time/order, character, state change, evidence and related cues.
- Optional compact mood curve beneath the event lanes.

### Demonstration logic

Route A: Archives (P-002) reveals the conspirator dossier; `conspirator_known` changes from false to true.

Route B: Air Vent (P-003) bypasses Archives; `conspirator_known` remains false at P-003. The story README/prompt describes the later reveal in Server Vault (P-004); only show that event if it is present in the normalized story metadata.

The UI must not infer story meaning solely from passage title. Use explicit creator-authored narrative events/facts or clearly labelled AI suggestions.

### Interactions

- Switch Route A/Route B.
- Filter by story beat, character, reveal, conflict or mood.
- Select event to inspect details.
- Open the event's passage in Story Graph.
- Compare state at the same passage across routes.
- Open related cue in Cue Library.

### Visual direction

Use a precise editorial timeline, not decorative spaghetti curves. Thin tracks, clear event labels, subdued event markers and readable right-side details. Use amber for suspense annotations only when it conveys a real mood/state.

## 9. Workspace 04 — Cue Library

**Purpose:** Audio asset inventory and cue configuration.

### Layout

Three clear regions:

1. Left filter rail: All, Music, Ambience, SFX, Used, Unused, Missing, Issues.
2. Main inventory table: filename, type, duration, status, usage count.
3. Right asset inspector: metadata, waveform (only if actually decoded), playback, assignments and cue settings.

### Expected example filenames

- `rain_loop.wav`
- `suspense_drone.wav`
- `paper_rustle.wav`
- `traitor_theme.wav`
- `morning_birds.wav`

The README says `traitor_theme.wav` was not uploaded in the original demo. The current audit says the decoder generates real waveforms for uploaded WAV/FLAC assets. Determine status from the actual asset store. If the file is absent, show **Missing / Not uploaded**, no duration, no decoded waveform and no measured loudness. If it is uploaded, use the actual decoded metadata.

### Inspector content

- File name and availability.
- Format, sample rate, bit depth, channels and duration from decoded file metadata.
- Real 128-bucket waveform already produced by the current decoder, if verified.
- Play/pause, seek and volume.
- Layer: Music / Ambience / SFX.
- Trigger type and passage/event assignment.
- Loop, fade-in, fade-out and gain configuration where supported.
- All route and passage usages.
- Related validation findings.

### Actual audio playback decision

Complete the backend streaming route described in Section 3.3 if missing. Use HTTP range support so the waveform playhead can seek. Connect an HTML audio element to Web Audio analysis only when needed. Do not confuse synthesized tones with the source asset.

### Interactions

- Import Audio.
- Search and filter.
- Select asset.
- Audition actual asset when present.
- Replace missing asset.
- Assign/unassign cue.
- Navigate to passage, route or finding.

## 10. Workspace 05 — Route Lab

**Purpose:** Stateful route execution, traversal trace and regression reproduction.

### Layout

- Route/test configuration header.
- Main route path/stepper showing visited and pending passages.
- Central traversal trace with ordered passage/event records.
- Right or lower live-state inspector.
- Audio event monitor.
- Compact transport and step controls.
- Exploration summary and budget status.

### Route controls

- Route A / Route B / discovered route selector.
- Start, Pause, Resume, Restart.
- Previous scene / Next scene.
- Auto Traversal.
- Manual branch selection where supported.
- Max depth, max states/routes and time budget configuration where supported.

### Trace record

Each step should show passage ID, visit order, variable updates, knowledge facts, event order, cue triggers, timestamp/simulation time and validation references.

### Core demonstration

Route B: P-001 → P-003 → P-004 → P-005.

At P-003 show:
- Mood: Suspense.
- Intensity: 4/5.
- Identity revealed: No.
- `conspirator_known: false`.

Reproduce BT-001 using the actual route engine and event trace. Do not just switch highlighted UI elements to imitate a simulation.

### BFS status display

Show discovered route count, explored states, maximum depth, truncations and unsupported conditions only from actual exploration results. Use honest statuses: Complete, Partial, Not evaluated, Unverified, Failed. Never display 100% coverage after budget truncation or incomplete semantic parsing.

## 11. Workspace 06 — Validation Centre

**Purpose:** Deterministic QA triage with source evidence and optional AI assistance.

### Layout

- Header: project/source version, validation configuration, Run Validation, latest run status.
- Left rule groups: Narrative Protection, Narrative State, Audio Integrity, Audio Continuity, Loop Integrity, Route Consistency.
- Centre findings table: ID, rule, severity, passage, cue, route, status.
- Right finding inspector: description, source excerpt, trace evidence, related passage/cue, suggested action and status controls.

### Known rules

**BT-001 — Reveal Protection — High**

A reveal cue must not fire while the required narrative knowledge fact is false on the current route. Use route-state simulation as authoritative when conditions and story semantics matter. Use graph dominance as a structural shortcut only when its assumptions hold. For same-passage reveal/cue events, require explicit event order. If order is unknown, report Unverified/Not evaluated instead of passing.

Expected sample defect: BT-001, Route B, Air Vent P-003, `traitor_theme.wav`, Open.

**BT-002 — Missing Asset**

If an assigned cue refers to a missing asset, report a distinct asset-integrity finding. Do not merge it with the spoiler finding. Create the finding only if the actual asset is absent.

Other audio warnings should be based on actual decoding/measurements. Do not label a loudness warning as a deterministic narrative violation.

### Finding actions

- Open in Story Graph.
- Reproduce in Route Lab.
- Inspect Cue.
- View Source.
- Mark In Review.
- Mark Resolved.
- Re-run validation.

Resolution must include audit history and must not erase the original finding/evidence.

### Deterministic versus AI results

Visually distinguish deterministic rule results from AI suggestions. AI must not automatically override a deterministic defect or change its status. Model-card scores must not be rendered as live prediction confidence.

## 12. Workspace 07 — Reports

**Purpose:** Evidence-backed, reproducible QA artifacts and run comparisons.

### Layout

- Header with project version, validation run selector and Generate Report.
- Project quality summary built from actual records.
- Route exploration results and evaluation status.
- Findings by severity and rule.
- Audio asset health with measured values only.
- Validation history and source-version comparison.
- Report preview and export actions.

### Required report formats

- JSON.
- Markdown.
- PDF only if the existing implementation supports a reliable PDF renderer; otherwise do not present a nonfunctional PDF button.

### Cryptographic reproducibility

Include source hash, parser version, exploration configuration, rules executed, run ID, timestamps, finding references, evidence, coverage state and SHA-256 report hash. Provide verification action if implemented.

Reports must distinguish Passed, Failed, Partial, Not evaluated and Unverified. Never invent quality percentages or route coverage.

---

# PART D — MOTION AND INTERACTION SPECIFICATION

## 13. Motion principles

Motion should improve orientation and feedback, not decorate the screen. Keep the app responsive and quiet.

Suggested timings:

- Hover/focus: 100–140ms.
- Button press: 80–120ms.
- Sidebar selection: 160–200ms.
- Workspace content transition: 160–220ms.
- Inspector content transition: 140–180ms.
- Graph route highlight: 220–320ms.
- Node selection: 160–220ms.
- Modal/drawer: 180–240ms.
- Chart reveal: 300–450ms, once on entry.

Use a restrained ease-out or standard cubic-bezier curve. Do not use spring/bounce animations on technical data.

### 13.1 Navigation

Keep the sidebar and top toolbar stationary. Transition only the workspace content with a subtle opacity/4px translation. Preserve selected route and object context.

### 13.2 Story Graph

- Animate connection highlight when the active route changes.
- Change selected node border and surface subtly.
- Update inspector without shifting its frame.
- Do not pulse the whole graph continuously.

### 13.3 Audio

- Playhead follows actual playback time.
- Timecode updates from media time.
- Waveform progress follows audio position.
- VU meters respond to live analyser values.
- Peak hold uses a short decay and clear reset.
- Avoid fake continuous wave animations when media is stopped or missing.

### 13.4 Narrative Map

- Draw mood curve once on initial view.
- Transition between route event datasets.
- Highlight selected event and linked passage.
- Tooltips appear on focus/hover with no large layout jumps.

### 13.5 Cue Library

- Smoothly transition selected row and inspector content.
- Waveform appears only after actual waveform data is available.
- Playback control state follows real audio playback.

### 13.6 Route Lab

- Animate route step progression.
- Highlight the active passage.
- Update state facts with a brief transition.
- Cue activation markers appear at the correct simulated event order.

### 13.7 Validation Centre

- Highlight newly created findings briefly.
- Status transitions should be subtle.
- No flashing red alerts or indefinite pulsing.

### 13.8 Reports

- Draw charts once when their data becomes available.
- Do not continuously animate charts or count up metrics on every render.

### 13.9 Accessibility

Respect `prefers-reduced-motion`. Provide visible keyboard focus. Ensure icon-only controls have accessible labels. Do not rely on colour alone to communicate severity or status.

---

# PART E — COMPONENTS AND IMPLEMENTATION RULES

## 14. Shared components to standardize

Reuse and improve existing components before creating duplicates. Expected shared component responsibilities include:

- ApplicationShell.
- ApplicationSidebar.
- TopToolbar.
- WorkspaceHeader.
- ProjectSwitcher.
- PanelSurface / GlassPanel.
- StatusIndicator.
- RouteSelector.
- PassageNode.
- PassageInspector.
- AudioTransport.
- WaveformDisplay.
- StereoVUMeter.
- NarrativeTimeline.
- AssetTable.
- AssetInspector.
- FindingTable.
- FindingInspector.
- ReportChart.
- CommandPalette.
- Toast / Notification.
- ConfirmDialog.
- EmptyState / LoadingState / ErrorState.

Use design tokens for surfaces, typography, spacing, radius, border and motion. Avoid screen-specific CSS that drifts away from the master.

## 15. Data integrity rules for the UI

- No fabricated passage IDs, routes, source positions, durations, waveforms, loudness values, confidence values, run counts or coverage percentages.
- Distinguish missing assets from uploaded assets.
- Distinguish synthesized audition tones from real media playback.
- Distinguish a parsed story from a story loaded into the graph.
- Distinguish discovered routes from fully evaluated routes.
- Distinguish deterministic findings from AI suggestions.
- Retain historical run results against their source version.
- Show unsupported Ink constructs and incomplete route semantics honestly.

## 16. Import UX — exact flow

1. User selects Import Story.
2. Select `.twee` or `.ink` file.
3. Show upload/parsing progress.
4. Present import summary: format, source hash, passages, edges, mutations/variables, warnings and unsupported constructs.
5. Preview the extracted graph.
6. User explicitly clicks **Load Into Story Graph**.
7. Confirm target project/version and explain that prior runs remain tied to their original source.
8. Load normalized story data into the shared store and persist it.
9. Open Story Graph with the imported project selected.
10. Offer route exploration and validation as next actions.

Do not auto-replace the active graph immediately after upload.

## 17. Audio playback UX — exact flow

1. User selects an asset.
2. UI checks its availability and decoding state.
3. If missing, show a clear missing state with Replace/Locate action.
4. If present, load metadata and real waveform.
5. Playback uses actual binary streaming with range support.
6. Seeking updates media playback position.
7. If visual analysis is active, connect media playback to Web Audio analyser.
8. Stop and cleanup media nodes/object URLs when leaving or changing assets.
9. Synthetic audition remains a separate action and is labelled as a synthesized tone.

## 18. Persistence UX

Show clear states:

- Saving…
- Saved.
- Unsaved changes.
- Save failed / retry.
- Offline / not connected, if applicable.

SQLite-backed custom runs should persist across backend restarts. Demo seed fallback must be clearly labelled and must not masquerade as a user's persisted project.

---

# PART F — RESPONSIVE BEHAVIOUR AND QUALITY ASSURANCE

## 19. Desktop responsiveness

Primary: 1920 × 1200.  
Secondary: 1440 × 900.  
Minimum practical width: 1280px.

At narrower widths:

- Collapse sidebar to icon rail or controlled drawer.
- Convert right inspector into a drawer where needed.
- Preserve graph usability and timeline controls.
- Keep table columns useful; allow horizontal scroll only within the table when unavoidable.
- Avoid whole-page horizontal overflow.

Do not redesign as a mobile-first product.

## 20. States every workspace must support

- Initial/loading.
- Populated.
- Empty project.
- No search results.
- Processing.
- Missing asset.
- Unsupported source construct.
- Partial route exploration.
- Not evaluated.
- Save failure.
- Service unavailable.
- Success.
- Error.

Use the same visual vocabulary for these states across the application.

## 21. Final QA checklist

### Visual

- Story Graph still matches the approved master composition.
- All six other screens feel like the same product.
- Typography, spacing, borders, radius and iconography are consistent.
- Glass is selective; dense data remains readable.
- No promotional collage layout has leaked into the application.
- No excessive glow or generic dashboard styling.

### Functional UI

- All seven navigation entries work.
- Cross-workspace selection context is preserved.
- Import preview and explicit Load Into Story Graph work.
- Cue inspector reflects actual asset state.
- Audio player uses actual media, not only a synthesized tone.
- Route Lab displays real traversal state and honest budget status.
- Validation detail opens exact source/evidence.
- Reports show actual run data and integrity hash.

### Engineering safety

- Existing working components and tests are preserved.
- Current test baseline is rerun and documented.
- TypeScript strict build passes.
- Frontend and backend tests pass.
- No destructive Git operations.
- No commit and no push.
- No hidden fabricated data.

## 22. Required completion report from Antigravity

After changes, provide:

1. Screens/components audited.
2. Screens/components changed.
3. Design tokens and shared components updated.
4. Cross-workspace interactions implemented.
5. Import-to-graph behavior status.
6. SQLite persistence status.
7. Actual audio streaming/playback status.
8. Ink parser unsupported-construct disclosure.
9. Animation and reduced-motion implementation.
10. Test results from fresh runs.
11. Production build result.
12. Changed files.
13. `git status` summary.
14. Any remaining blockers.

Do not claim that the app is fully complete merely because the screens look finished.

---

# FINAL DIRECTIVE

Upgrade the existing BranchTone interface to the premium standard of the approved Option 2 reference. Preserve the working product and its architecture. Apply one coherent visual system across all seven separate workspaces. Connect every visible control to real state and honest data. Resolve the import-to-graph, persistent-run and real-audio-playback gaps described in the latest audit. Disclose parser limitations instead of silently flattening unsupported story constructs. Keep all work local and uncommitted.

**The objective is a premium, usable and technically honest BranchTone application — not another concept mockup.**
