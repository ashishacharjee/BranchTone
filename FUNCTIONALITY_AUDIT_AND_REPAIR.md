# FUNCTIONALITY_AUDIT_AND_REPAIR.md — Comprehensive UI & Interaction Audit

**Project:** BranchTone — Narrative Audio QA & Regression Testing Studio  
**Date:** 10 November 2026  
**Auditor:** Lead Full-Stack Engineer, QA Engineer & Product Reliability Engineer  
**Objective:** Systematically inspect every visible interactive element across all seven workspaces and the application shell, identify all broken, static, incomplete, or placeholder interactions, and define the required repairs and automated tests.

---

## 1. Executive Summary & Defect Inventory

An exhaustive hands-on audit of the running application (`http://localhost:4173/`) and its underlying source code identified several critical usability defects, static non-responsive controls, and factual state bugs:

1. **Dead Toolbar Controls (Story Graph):** The graph canvas header displays Zoom 100%, Fullscreen, and Share action buttons, but none possess click handlers or state bindings. Clicking them produces zero action.
2. **Audio Timeline Skip Controls:** Skip Backward and Skip Forward buttons are hard-disabled rather than enabling passage-by-passage sequence navigation along the active route.
3. **Factual Reveal Bug (Narrative Map & Route Lab):** The fact state logic hardcodes `isIdentityRevealed = pId === 'P-004' || pId === 'P-005'`. On Route A, identity is revealed at Archives (`P-002`), but the interface incorrectly displays `Identity Revealed: No`.
4. **Missing Annotation Interactivity (Narrative Map):** Clicking annotation cards does not select the associated passage or highlight its step. The pending candidate annotation card lacks creator review actions (Approve / Reject demonstration controls).
5. **Cue Library Filter & Inspector Decoupling:** Filtering by layer (`ambience`, `sfx`, `voice`) renders an empty table body with no empty state notice, while the right-hand inspector continues to display the Music cue (`cues[0]`). Table rows have no selection handlers. The inspector has no deep-link navigation back to the Story Graph.
6. **Route Lab Interaction Deficiencies:** Cue activation trace rows have no selection handler or deep-link to the finding. Stepper steps do not expose an expanded fact snapshot for the selected step.
7. **Validation Centre Filter Desynchronization:** When filters match zero findings, the table is empty, but the right-hand drawer falls back to displaying BT-001 (High severity / Reveal Protection) regardless of the active filter. Table rows have hardcoded selection styles and lack click handlers.
8. **Static Metric Cards (Overview):** Metric cards displaying passages, transitions, issues, and coverage lack click navigation to their corresponding workspaces. The Audio Health panel lacks an action link to open the Cue Library.
9. **Dead Shell Search & Project Navigation:** The Topbar search input is permanently disabled. Breadcrumb links ("Projects", "The Last Signal") are non-interactive spans. The project card in the sidebar is non-interactive.

---

## 2. Complete Visible Control Inventory & Audit Table

### A. Application Shell, Sidebar & Topbar

| Control ID | Element Type | Visible Label / Icon | Intended Purpose | Current Behaviour | Working Status | Associated Error / Defect | Required Repair | Verification Test |
|---|---|---|---|---|---|---|---|---|
| `SH-001` | NavLink | Overview (`LayoutDashboard`) | Navigate to `/overview` workspace | Navigates to `/overview` with active indicator | **WORKING** | None | Preserve existing behavior | `Sidebar.test.tsx` |
| `SH-002` | NavLink | Story Graph (`GitBranch`) | Navigate to `/story-graph` workspace | Navigates to `/story-graph` with active indicator | **WORKING** | None | Preserve existing behavior | `Sidebar.test.tsx` |
| `SH-003` | NavLink | Narrative Map (`Map`) | Navigate to `/narrative-map` workspace | Navigates to `/narrative-map` with active indicator | **WORKING** | None | Preserve existing behavior | `Sidebar.test.tsx` |
| `SH-004` | NavLink | Cue Library (`Music2`) | Navigate to `/cue-library` workspace | Navigates to `/cue-library` with active indicator | **WORKING** | None | Preserve existing behavior | `Sidebar.test.tsx` |
| `SH-005` | NavLink | Route Lab (`FlaskConical`) | Navigate to `/route-lab` workspace | Navigates to `/route-lab` with active indicator | **WORKING** | None | Preserve existing behavior | `Sidebar.test.tsx` |
| `SH-006` | NavLink | Validation Centre (`ShieldCheck`) | Navigate to `/validation-centre` workspace | Navigates to `/validation-centre` with active indicator | **WORKING** | None | Preserve existing behavior | `Sidebar.test.tsx` |
| `SH-007` | NavLink | Reports (`FileBarChart`) | Navigate to `/reports` workspace | Navigates to `/reports` with active indicator | **WORKING** | None | Preserve existing behavior | `Sidebar.test.tsx` |
| `SH-008` | Card / Button | Project Card ("The Last Signal") | Navigate to project overview or view project metadata | Static div container; no hover or click effect | **STATIC** | Non-responsive control | Convert to interactive project button navigating to `/overview` | `Sidebar.test.tsx` |
| `SH-009` | Dropdown | Workspace Selector ("Game Development") | Switch workspace context or view scope | Static div container | **STATIC** | Dead dropdown presentation | Add dropdown menu showing current workspace details and role scope | `Sidebar.test.tsx` |
| `SH-010` | Breadcrumb | "Projects" / "The Last Signal" | Navigate back to projects list or project root | Non-clickable `<span>` elements | **STATIC** | Navigation dead-end | Make breadcrumb items navigable (links to `/overview`) | `Topbar.test.tsx` |
| `SH-011` | Search Input | "Search passages or commands…" | Quick lookup of passages, cues, or findings | `disabled` attribute; no input possible | **STATIC** | Unusable search bar | Enable quick filter/jump input searching passages (P-001..P-005) and findings | `Topbar.test.tsx` |
| `SH-012` | Icon Button | Undo (`RotateCcw`) | Undo previous navigation or selection | `disabled` with generic title | **DISABLED WITH REASON** | None | Keep disabled but show informative tooltip explaining history scope | `Topbar.test.tsx` |
| `SH-013` | Icon Button | Redo (`RotateCw`) | Redo navigation or selection | `disabled` with generic title | **DISABLED WITH REASON** | None | Keep disabled but show informative tooltip | `Topbar.test.tsx` |
| `SH-014` | Action Button | "Run Validation" (`PlayCircle`) | Execute deterministic validation suite | `disabled` attribute with compliance note | **DISABLED WITH REASON** | None | Add click action opening an informative modal detailing compliance status and live-sprint roadmap | `Topbar.test.tsx` |

---

### B. Story Graph Workspace

| Control ID | Element Type | Visible Label / Icon | Intended Purpose | Current Behaviour | Working Status | Associated Error / Defect | Required Repair | Verification Test |
|---|---|---|---|---|---|---|---|---|
| `SG-001` | Route Pill | "Route A" (Pill `A`) | Switch to Route A (Lobby $\to$ Archives $\to$ Vault $\to$ Safe House) | Updates Zustand store, graph edges, and inspector | **WORKING** | None | Preserve | `StoryGraph.test.tsx` |
| `SG-002` | Route Pill | "Route B" (Pill `B`) | Switch to Route B (Lobby $\to$ Vent $\to$ Vault $\to$ Safe House) | Updates Zustand store, graph edges, inspector, and BT-001 | **WORKING** | None | Preserve | `StoryGraph.test.tsx` |
| `SG-003` | Node | P-001 Lobby | Select passage P-001 | Updates `selectedPassageId` and inspector | **WORKING** | None | Preserve | `StoryGraph.test.tsx` |
| `SG-004` | Node | P-002 Archives | Select passage P-002 | Updates `selectedPassageId` and inspector | **WORKING** | None | Preserve | `StoryGraph.test.tsx` |
| `SG-005` | Node | P-003 Air Vent | Select passage P-003 | Updates `selectedPassageId`, inspector, and BT-001 | **WORKING** | None | Preserve | `StoryGraph.test.tsx` |
| `SG-006` | Node | P-004 Server Vault | Select passage P-004 | Updates `selectedPassageId` and inspector | **WORKING** | None | Preserve | `StoryGraph.test.tsx` |
| `SG-007` | Node | P-005 Safe House | Select passage P-005 | Updates `selectedPassageId` and inspector | **WORKING** | None | Preserve | `StoryGraph.test.tsx` |
| `SG-008` | Action Button | Zoom 100% (`ZoomIn`) | Reset React Flow graph zoom to 100% | No `onClick` handler; dead button | **BROKEN** | Click does nothing | Wire to React Flow viewport zoom reset (`fitView` / `setViewport`) | `StoryGraph.test.tsx` |
| `SG-009` | Action Button | Fullscreen (`Maximize2`) | Toggle fullscreen mode for graph area | No `onClick` handler; dead button | **BROKEN** | Click does nothing | Implement fullscreen toggle via Fullscreen API with fallback | `StoryGraph.test.tsx` |
| `SG-010` | Action Button | Share Graph (`Share2`) | Copy deep-link URL to clipboard | No `onClick` handler; dead button | **BROKEN** | Click does nothing | Copy current URL with `?route=...&passage=...` and display toast | `StoryGraph.test.tsx` |
| `SG-011` | Icon Button | Close Inspector (`X`) | Deselect passage and close inspector | Calls `onClose`, sets `selectedPassageId(null)` | **WORKING** | None | Preserve | `StoryGraph.test.tsx` |
| `SG-012` | Finding Card | BT-001 in Inspector | View finding details & navigate to Validation Centre | Card displays finding details but has no action | **PARTIALLY WORKING** | Missing deep-link action | Add "View in Validation Centre" action button | `StoryGraph.test.tsx` |
| `SG-013` | Cue Card | Audio Cue in Inspector | View cue details & navigate to Cue Library | Card displays metadata but has no action | **PARTIALLY WORKING** | Missing deep-link action | Add "View in Cue Library" action button | `StoryGraph.test.tsx` |
| `SG-014` | Transport Button | Skip Backward (`SkipBack`) | Jump to previous passage in route sequence | `disabled` with "no audio loaded" title | **DISABLED WITH REASON** | Should navigate sequence | Wire to select previous passage in active route | `StoryGraph.test.tsx` |
| `SG-015` | Transport Button | Play / Pause (`Play`) | Playback audition | `disabled` with honest missing asset explanation | **DISABLED WITH REASON** | None | Preserve honest disabled state with tooltip | `StoryGraph.test.tsx` |
| `SG-016` | Transport Button | Skip Forward (`SkipForward`) | Jump to next passage in route sequence | `disabled` with "no audio loaded" title | **DISABLED WITH REASON** | Should navigate sequence | Wire to select next passage in active route | `StoryGraph.test.tsx` |
| `SG-017` | Timeline Segment | Passage Segments (P-001..P-005) | Select passage on timeline click | Calls `onSelectPassage` and syncs inspector | **WORKING** | None | Preserve | `StoryGraph.test.tsx` |
| `SG-018` | Cue Marker | Red Diamond (Air Vent Entry) | Select Air Vent passage and highlight defect | Calls `onSelectCueMarker` (sets P-003) | **WORKING** | None | Preserve and enhance with defect tooltip | `StoryGraph.test.tsx` |

---

### C. Overview Workspace

| Control ID | Element Type | Visible Label / Icon | Intended Purpose | Current Behaviour | Working Status | Associated Error / Defect | Required Repair | Verification Test |
|---|---|---|---|---|---|---|---|---|
| `OV-001` | Metric Card | "Passages" (5) | Quick glance & navigation to Story Graph | Static card | **STATIC** | Card looks clickable but does not navigate | Make card clickable with hover effect, navigating to `/story-graph` | `WorkspacePages.test.tsx` |
| `OV-002` | Metric Card | "Story Transitions" (5) | Quick glance & navigation to Route Lab | Static card | **STATIC** | Card looks clickable but does not navigate | Make card clickable, navigating to `/route-lab` | `WorkspacePages.test.tsx` |
| `OV-003` | Metric Card | "Active Issues" (1) | Quick glance & navigation to Validation Centre | Static card | **STATIC** | Card looks clickable but does not navigate | Make card clickable, navigating to `/validation-centre` | `WorkspacePages.test.tsx` |
| `OV-004` | Metric Card | "Validation Coverage" (Not evaluated) | Quick glance & navigation to Reports | Static card | **STATIC** | Card looks clickable but does not navigate | Make card clickable, navigating to `/reports` | `WorkspacePages.test.tsx` |
| `OV-005` | Action Button | "Inspect in Story Graph" | Deep-link to BT-001 in Story Graph | Sets route B, P-003, BT-001, navigates to `/story-graph` | **WORKING** | None | Preserve | `CrossWorkspaceIntegration.test.tsx` |
| `OV-006` | Action Button | Audio Health Panel Link | Navigate to Cue Library to view missing assets | Panel has no navigation link | **STATIC** | Missing action | Add "Inspect in Cue Library" action link | `WorkspacePages.test.tsx` |
| `OV-007`..`012` | Action List | 6 Workspace Navigation Buttons | Jump directly to each workspace | Navigates to corresponding route via React Router | **WORKING** | None | Preserve | `WorkspacePages.test.tsx` |

---

### D. Narrative Map Workspace

| Control ID | Element Type | Visible Label / Icon | Intended Purpose | Current Behaviour | Working Status | Associated Error / Defect | Required Repair | Verification Test |
|---|---|---|---|---|---|---|---|---|
| `NM-001` | Route Pill | "Route A" / "Route B" | Switch route sequence and progression plot | Updates route in Zustand and updates steps | **WORKING** | None | Preserve | `CrossWorkspaceIntegration.test.tsx` |
| `NM-002` | Step Card | Chronological Step Cards | Select passage and inspect fact progression | Updates `selectedPassageId` and highlights step | **WORKING** | None | Preserve | `WorkspacePages.test.tsx` |
| `NM-003` | Fact Badge | "Identity Revealed: Yes/No" | Reflect true narrative reveal state on route | Hardcoded `pId === 'P-004' || pId === 'P-005'` | **BROKEN** | On Route A, Archives (P-002) falsely shows "No" | Correct logic: on Route A, P-002 is reveal point | `WorkspacePages.test.tsx` |
| `NM-004` | Annotation Card | P-003 Approved Card | Inspect approved narrative annotation | Card has no click handler | **STATIC** | Non-responsive to selection | Click selects P-003 in store and highlights step | `WorkspacePages.test.tsx` |
| `NM-005` | Annotation Card | P-004 Pending Card | Inspect candidate annotation and test review | Card has no click handler; no actions | **STATIC** | Cannot test approval model | Add "Approve (Demo Local Action)" & "Reject" buttons with clear demo badge | `WorkspacePages.test.tsx` |

---

### E. Cue Library Workspace

| Control ID | Element Type | Visible Label / Icon | Intended Purpose | Current Behaviour | Working Status | Associated Error / Defect | Required Repair | Verification Test |
|---|---|---|---|---|---|---|---|---|
| `CL-001` | Filter Button | "All", "Music", "Ambience", "SFX", "Voice" | Filter cue inventory by layer | Updates `selectedLayer` state | **PARTIALLY WORKING** | Filtering to ambience/sfx shows empty table but inspector still shows music cue | Add empty table row and update inspector to show empty/layer state | `WorkspacePages.test.tsx` |
| `CL-002` | Table Row | Cue row (`traitor_theme.wav`) | Select cue to inspect parameters | Row has no `onClick` handler | **STATIC** | Clicking row does not select it | Add row selection handler and active styling | `WorkspacePages.test.tsx` |
| `CL-003` | Action Button | Playback Disabled Transport | Play cue audition | `disabled` with honest missing asset reason | **DISABLED WITH REASON** | None | Preserve honest disabled state with tooltip | `WorkspacePages.test.tsx` |
| `CL-004` | Action Link | Cue Inspector Passage Link | Jump to trigger passage in Story Graph | No navigation link exists | **STATIC** | Missing cross-workspace deep link | Add "Inspect Trigger in Story Graph" button | `WorkspacePages.test.tsx` |
| `CL-005` | Action Link | BT-001 Issue Card Link | Jump to BT-001 in Validation Centre | No navigation link exists | **STATIC** | Missing cross-workspace deep link | Add "View Finding in Validation Centre" button | `WorkspacePages.test.tsx` |

---

### F. Route Lab Workspace

| Control ID | Element Type | Visible Label / Icon | Intended Purpose | Current Behaviour | Working Status | Associated Error / Defect | Required Repair | Verification Test |
|---|---|---|---|---|---|---|---|---|
| `RL-001` | Route Pill | "Route A" / "Route B" | Switch route sequence and simulation trace | Updates route in Zustand and updates steps | **WORKING** | None | Preserve | `CrossWorkspaceIntegration.test.tsx` |
| `RL-002` | Step Card | Sequential Passage Steps | Select step along route | Sets `selectedPassageId` | **PARTIALLY WORKING** | Does not show full fact snapshot panel | Add expanded fact snapshot drawer for selected passage | `WorkspacePages.test.tsx` |
| `RL-003` | Fact Badge | Fact State in Stepper | Display exact state variables at step | Hardcoded `pId === 'P-004' || pId === 'P-005'` | **BROKEN** | Route A Archives displays false instead of true | Correct state mapping for Route A vs Route B | `WorkspacePages.test.tsx` |
| `RL-004` | Table Row | Cue Activation Trace Row | Select trace step and inspect defect | Table row has no click action | **STATIC** | Row cannot be clicked | Add click selection handler | `WorkspacePages.test.tsx` |
| `RL-005` | Action Badge | "Issue BT-001" Badge | Deep-link to finding BT-001 | Static badge | **STATIC** | Badge cannot be clicked | Add deep-link navigating to Story Graph with BT-001 selected | `WorkspacePages.test.tsx` |
| `RL-006` | Transport Button | "Play Route (Disabled)" | Audition full route multitrack | `disabled` with honest missing asset reason | **DISABLED WITH REASON** | None | Preserve | `WorkspacePages.test.tsx` |

---

### G. Validation Centre Workspace

| Control ID | Element Type | Visible Label / Icon | Intended Purpose | Current Behaviour | Working Status | Associated Error / Defect | Required Repair | Verification Test |
|---|---|---|---|---|---|---|---|---|
| `VC-001` | Dropdown | Filter by Rule | Filter findings by rule ID | Updates `ruleFilter` state | **PARTIALLY WORKING** | When 0 findings match, right column still shows BT-001! | Add empty state handling for both table and inspector | `WorkspacePages.test.tsx` |
| `VC-002` | Dropdown | Filter by Severity | Filter findings by severity | Updates `severityFilter` state | **PARTIALLY WORKING** | Same 0-match bug as VC-001 | Fix fallback logic when `filteredFindings.length === 0` | `WorkspacePages.test.tsx` |
| `VC-003` | Dropdown | Filter by Status | Filter findings by status | Updates `statusFilter` state | **PARTIALLY WORKING** | Same 0-match bug as VC-001 | Fix fallback logic when `filteredFindings.length === 0` | `WorkspacePages.test.tsx` |
| `VC-004` | Table Row | Findings Table Rows | Select finding to inspect in right drawer | No `onClick` handler; all rows styled as selected | **BROKEN** | Rows not interactive; hardcoded selection | Add `onClick` selection, active row styling, and empty state | `WorkspacePages.test.tsx` |
| `VC-005` | Action Button | "Inspect in Story Graph Workspace" | Deep-link to finding and passage in graph | Sets route, passage, finding, and navigates | **WORKING** | None | Preserve | `CrossWorkspaceIntegration.test.tsx` |
| `VC-006` | Action Button | "Reset Filters" | Clear active filters when 0 findings match | Control does not exist | **MISSING** | User gets stuck on empty filter state | Add "Reset Filters" action button when count is 0 | `WorkspacePages.test.tsx` |

---

### H. Reports Workspace

| Control ID | Element Type | Visible Label / Icon | Intended Purpose | Current Behaviour | Working Status | Associated Error / Defect | Required Repair | Verification Test |
|---|---|---|---|---|---|---|---|---|
| `RP-001` | Action Button | "Export JSON Report" | Generate and download valid verification JSON | Generates data URI and triggers browser download | **WORKING** | Payload not previewable in-app | Add in-app "Preview JSON" collapsible drawer & download status toast | `WorkspacePages.test.tsx` |
| `RP-002` | Metric Box | Coverage Score | Report exploration coverage honestly | Displays "Not evaluated" with PRD explanation | **WORKING** | None | Preserve | `WorkspacePages.test.tsx` |
| `RP-003` | Rule List | 4 Evaluated Rules | Display deterministic rule statuses | Displays 1 issue (BT-001) and 3 passing rules | **WORKING** | None | Preserve | `WorkspacePages.test.tsx` |

---

## 3. Systematic Implementation Plan for Functionality Repairs

### Phase 1: Shell & Navigation Repairs
1. Enable quick search input in `Topbar.tsx` to search passages (Lobby, Archives, Air Vent, Server Vault, Safe House) and findings, jumping directly to the selected object in Story Graph.
2. Make Topbar breadcrumb items clickable links to `/overview`.
3. Make project card in `Sidebar.tsx` a clickable navigation control to `/overview`.
4. Add click handler on "Run Validation" button opening an accessible status dialog explaining compliance gating and live sprint roadmap.

### Phase 2: Story Graph Interaction Repairs
1. Wire Zoom 100% button in `GraphCanvas.tsx` to reset viewport zoom.
2. Wire Fullscreen button in `GraphCanvas.tsx` to toggle fullscreen.
3. Wire Share button in `GraphCanvas.tsx` to copy deep-link URL (`?route=...&passage=...`) with toast notification.
4. Add "View in Validation Centre" action button to finding card in `PassageInspector.tsx`.
5. Add "View in Cue Library" action button to cue card in `PassageInspector.tsx`.
6. Wire Skip Backward / Skip Forward buttons in `AudioTimeline.tsx` to navigate to the previous / next passage along the active route sequence.

### Phase 3: Overview Repairs
1. Make all 4 metric cards (Passages, Story Transitions, Active Issues, Validation Coverage) clickable navigation targets.
2. Add "Inspect in Cue Library" action button to the Audio Asset Inventory panel.

### Phase 4: Narrative Map Repairs
1. Fix factual reveal bug: on Route A, P-002 (Archives) is the identity reveal point (`isIdentityRevealed = true`).
2. Make annotation cards clickable to select the associated passage in the store.
3. Add functional demonstration review buttons ("Approve (Demo Local Action)" and "Reject (Demo Local Action)") to the pending candidate card with explicit demo feedback.

### Phase 5: Cue Library Repairs
1. Add row selection handler and active row styling for cues and assets.
2. Fix layer filter empty state: when a layer has 0 cues, render a clear empty table row and update the inspector to reflect the layer status.
3. Add "Inspect Trigger in Story Graph" deep-link button.
4. Add "View Finding in Validation Centre" deep-link button to the BT-001 defect card.

### Phase 6: Route Lab Repairs
1. Fix factual reveal bug: on Route A, P-002 displays `identity_revealed: true`.
2. Add click handler to cue activation trace table rows and "Issue BT-001" badge to navigate directly to the finding.
3. Add detailed fact snapshot inspector for the currently selected route step.

### Phase 7: Validation Centre Repairs
1. Add click selection to findings table rows with active row styling.
2. Fix 0-match filter bug: when `filteredFindings.length === 0`, render empty state in both table and inspector, and display a "Reset Filters" button.

### Phase 8: Reports Repairs
1. Add "Preview Report JSON" toggle drawer allowing creators to view the structured report payload directly inside the workspace before downloading.
2. Verify downloaded JSON payload schema validity and formatting.

---

## 4. Test Suite Strategy (Vitest + Integration Tests)

Create an expanded end-to-end integration test suite `RealUserInteractionE2E.test.tsx` verifying:
- **Scenario A:** Story Graph $\to$ Route B $\to$ Air Vent $\to$ BT-001 inspection.
- **Scenario B:** Route switching $\to$ Route A $\to$ Archives selected, BT-001 absent.
- **Scenario C:** Route B return $\to$ Air Vent and BT-001 restored.
- **Scenario D:** Validation Centre finding selection & deep-link back to Story Graph.
- **Scenario E:** Narrative Map route switching, fact verification, and candidate annotation review.
- **Scenario F:** Cue Library filtering, cue row selection, and deep-link.
- **Scenario G:** Reports JSON export and preview parsing.
- **Scenario H:** Full 7-workspace continuous cyclic navigation verifying zero state degradation.
