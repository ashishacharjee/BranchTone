# DESIGN.md — Approved Visual System and Workspace Specifications

## 1. Reference hierarchy

1. **Primary and authoritative visual reference:** `references/branchtone-master-ui.png` (the latest approved BranchTone screenshot supplied by the owner). It defines the Story Graph screen and the BranchTone identity.
2. **Secondary style references only:** `references/linc-*.jpg`. Use them only for selected dotted/numerical display treatments, fine lightweight typography and restrained gradient/glass card inspiration. Do not copy their layout, branding, content, product imagery, colour identity or device mockups.
3. Older generated BranchTone mockups are intentionally excluded to prevent conflicting visual targets.

This is one page in a multi-workspace application, not a seven-screen tiled dashboard.

## 2. Visual direction

A premium, restrained creative-engineering workstation: near-black charcoal, smoked glass used sparingly, low emerald atmospheric bloom, clear muted borders and readable technical typography. Actual issues use burgundy/red. Green indicates valid/selected. Do not turn the app into a generic AI dashboard.

### Colour tokens

```css
:root {
  --bt-bg: #0B1011;
  --bt-bg-elevated: #101719;
  --bt-surface: #141C1E;
  --bt-surface-2: #1A2426;
  --bt-surface-3: #202B2D;
  --bt-glass: rgba(20, 31, 31, 0.78);
  --bt-border: rgba(176, 198, 193, 0.16);
  --bt-border-strong: rgba(176, 198, 193, 0.28);
  --bt-text: #EDF3F0;
  --bt-text-secondary: #AAB8B3;
  --bt-text-muted: #87958F;
  --bt-accent: #29C98A;
  --bt-accent-soft: #74D9B0;
  --bt-accent-deep: #145C43;
  --bt-error: #F04F75;
  --bt-error-soft: #F58AA1;
  --bt-warning: #D9A65D;
  --bt-success: #35D69A;
  --bt-magenta: #853C65;
  --bt-focus: #A2EACB;
}
```

### Typography

- UI: Geist Sans preferred; Inter fallback.
- IDs, filenames, diagnostics and timestamps: Geist Mono or IBM Plex Mono.
- Use a dotted/segmented numeral treatment sparingly for selected counters, duration or prominent numeric readouts, inspired by the supplied secondary references. It must remain legible and should not be used for body copy, source evidence, labels or dense tables.
- At 1600×1000, primary UI text is generally 13–15px; secondary metadata 11–12px minimum. Do not use ultra-thin weights for technical metadata.
- Do not rely on a proprietary Nothing font. Recreate the visual character with licensed/available fonts and CSS treatment.

### Gradient and materials

- Main background: subtle charcoal/black gradient with restrained emerald haze; bloom must not compete with content.
- Selected/valid panels: gentle emerald border/glow, not saturated green fill everywhere.
- Issue panels: restrained burgundy/red surface tint and red indicator.
- Gradient accent cards may use emerald-to-deep-green or burgundy-to-deep-wine. These are accents, not new workspace themes.
- No purple/blue “AI gradient” theme.
- 1px fine borders; 6–10px common radii, 12–16px for major workspace surfaces.
- Use smoked glass on inspector/toolbar/overlays only where it helps hierarchy. Avoid blur over text.

### Icons and motion

Use Lucide outline icons with consistent stroke. No emoji icons. Provide hover/focus/selected states, reduced-motion support and accessible names for icon-only actions. Avoid decorative movement and continuous glow animation.

## 3. Desktop shell

Target: 1600×1000 reference; usable at 1600×900, 1440×900 and 1366×768. Below minimum desktop width, provide a deliberate compact layout or clearly supported scroll behaviour; do not allow overlays to hide essential controls.

- Full-height application shell with independent panel scrolling.
- Left sidebar approximately 220–236px at 1600px: BranchTone mark/wordmark, workspace selector, project card, seven nav links, system status/version.
- Topbar: Projects / The Last Signal / current workspace, version chip `v0.4`, honest save state, searchable project commands, undo/redo only if implemented, Run Validation, account/settings affordance only if real auth/settings exist.
- Main content takes remaining width.
- Passage Inspector is a right panel around 300–340px when present.
- Timeline appears in Story Graph and Route Lab, not every workspace.
- Do not display fake resize handles, fake sync state, fake user presence or controls without an action.

## 4. Story Graph — approved master screen

### Toolbar

- Route A and Route B selectors; default Route B selected.
- Zoom/fit controls only if functional.

### Graph

Five nodes: Lobby P-001, Archives P-002, Air Vent P-003, Server Vault P-004, Safe House P-005.

Edges:
- A: Lobby → Archives → Server Vault → Safe House.
- B: Lobby → Air Vent → Server Vault → Safe House.

Use a directed graph. The route highlight follows selected route. Normal transitions are emerald/neutral. Red at Lobby → Air Vent indicates the problematic cue activation at Air Vent entry, **not** a structurally invalid story edge. Provide a legend that distinguishes structural route edges from cue issues.

Node content: title, ID, approved intensity 1–5 if available, audio indicator, validation state. Selected node and warning have shape/icon/text differences; never rely on colour alone.

### Default inspector

- Passage Air Vent, P-003; Route B.
- Mood Suspense; intensity 4/5; identity revealed No at entry.
- Cue `traitor_theme.wav`; layer Music; trigger Passage entry.
- Finding BT-001, Reveal Protection, High, Open.
- Exact explanation: `The traitor theme starts when entering Air Vent, before the character's identity is revealed on this route.`
- Heading: `P-003 · Original Passage Text`.
- Exact source text: `Sen squeezes through the dark metal duct to bypass the locked hallway, completely unaware of who is behind the conspiracy.`
- Do not invent line ranges. Display parser-derived source line/column only if present in the actual source map.

### Audio timeline

- Three lanes: MUSIC, AMBIENCE, SFX.
- Route B order: Lobby → Air Vent → Server Vault → Safe House.
- Reference-only design values: duration 272s (04:32), playhead 84s (01:24). Label as demo/design fixture when no media/timing source exists; never imply actual playback.
- Actual waveforms must be computed from uploaded audio. Without audio, show a calm empty waveform state (`No audio loaded`) or a clearly identified neutral placeholder that is not shaped like recorded signal. Do not fabricate waveform peaks.
- Place `traitor_theme.wav` cue marker on MUSIC at the Air Vent passage boundary from cue-event data. If exact route time is not available, show boundary anchor with `time unavailable` metadata.
- Playhead, duration, time ruler and media transport must derive from the same active media/route duration when audio exists.

## 5. Other independent workspaces

All seven workspaces share the shell and design tokens; do not render them as a single seven-panel collage.

### Overview
Project/version, import/compile status, passage/edge counts, latest validation run, latest findings and quick actions. Coverage/quality score shows only when calculated from real runs; otherwise `Not evaluated`.

### Narrative Map
Route selector, chronological fact/event timeline, approved mood/intensity plot (1–5), reveal/resolution/new-conflict markers and annotation review. Distinguish AI candidate from approved annotations.

### Cue Library
Filters for Music/Ambience/SFX/Voice, table with filename/layer/measured duration/size/status, decoded waveform preview and cue editor: trigger, required facts, stop policy, fades, loop and overlap. Missing assets remain visibly missing.

### Route Lab
Route sequence, passage/fact snapshots, cue activation trace, actual multitrack playback/seek/volume when assets exist, boundary markers and comparison only if actually implemented.

### Validation Centre
Rule/severity/status filters; findings table; detail panel with source evidence/route trace/deep-links; lifecycle actions. Counts must reflect the filtered underlying result set.

### Reports
Project/version/run IDs, exploration scope/status, state/route counts, rules run, findings/passes/warnings, JSON export. No invented percentages or score rings.

## 6. Behaviour and accessibility

- Every interactive control works or is disabled with a concise reason.
- Search operates on real loaded project objects or is clearly disabled.
- Keyboard navigation, visible focus, semantic regions, properly labelled inputs, accessible dialog focus/escape behaviour, screen-reader status text and reduced motion.
- Use text/icon plus colour for validity/issue states.
- Loading, empty, error and demo-data states for data-dependent pages.
- Toast only after an operation succeeds.
- Source text must be selectable/copyable and use readable line-height.

## 7. Anti-patterns

No generic dashboard redesign, seven-tile mega-screen, excessive glass blur, purple/blue AI gradient theme, oversized hero metrics, random stock imagery in graph nodes, fake users/sync, fabricated score percentages, random waveforms, fake audio transport, tiny unreadable labels, emoji icons or decorative controls.

## 8. Visual acceptance

The Story Graph should be recognisably faithful to the approved master screenshot. Functional correctness, data truth, contrast, keyboard access and responsive behaviour take priority over pixel imitation.
