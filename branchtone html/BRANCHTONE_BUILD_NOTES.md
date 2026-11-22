# BranchTone: build notes

BranchTone is a single-file web app, `branchtone.html`, for testing whether audio cues in a branching story respect what the player knows. This document records what the file does, how it works, and what is not built. Nothing here was run in a browser by the author; treat every claim as "implemented in code, unverified in practice" until you have tried it.

## 1. What it is

- One HTML file with no build step. It loads Geist, Geist Mono, JetBrains Mono and Instrument Serif from Google Fonts, with system fallbacks. Everything else is inline.
- Two parts: a **landing website** and the **studio** (the working app). "Launch studio" enters the studio. The "Website" button in the studio top bar returns to the landing page.

## 2. The core engine (real, data-driven)

All of this runs on one story model, `M`, in the script.

- **Story model:** 5 passages (P-001 Lobby, P-002 Archives, P-003 Air Vent, P-004 Server Vault, P-005 Safe House), 5 edges, 5 cues and 5 registered assets.
- **BFS route exploration:** `explore()` is queue-based. Its state is passage + knowledge facts + path. It respects budgets (depth 12, routes 50, states 500) and reports truncation. Routes A and B are *discovered*, not hardcoded.
- **Simulation:** `simulate(route)` walks a route and produces ordered events (enter, reveal, cue) with the knowledge state before each passage.
- **Validation:**
  - **BT-001 Reveal Protection.** A cue protecting `conspirator_known` fails if the fact is false when it fires. Same-passage cases need event-order metadata; without it the result is *Unverified*, never a silent pass.
  - **BT-002 Missing Media Asset.** A cue pointing to an asset with no uploaded binary (`traitor_theme.wav`) is reported.
- **Fix flow:** a rule-based proposal moves the `traitor_theme.wav` cue to Server Vault. It shows a before/after review, needs explicit approval, supports undo, and re-runs validation. This is a deterministic proposal, not AI.

## 3. Studio workspaces

1. **Overview:** hero, real stats, health, QA priorities, a traversal scrubber, synthetic audition tones, a Copilot panel.
2. **Story Graph:** SVG graph generated from the model, route highlighting, passage inspector, 3-track timeline, animated traversal pulse.
3. **Narrative Map:** event lanes, knowledge state per route, mood curve with route comparison.
4. **Cue Library:** asset table, filters, search, real WAV/FLAC import (browser `decodeAudioData`) with waveform, duration, sample rate, channels, peak and content hash.
5. **Route Lab:** step-through simulation and an audio event monitor. "Reproduce BT-001" loads Route B at Air Vent.
6. **Validation Centre:** findings table, inspector, status changes.
7. **Reports:** route verdicts (Passed / Failed / Unverified), severity donut, validation history, asset integrity, JSON and Markdown report, and snapshot + verify (see section 5).

## 4. Premium interface features added in the latest pass

- **Collapsible sidebar:** the menu button in the top bar toggles the sidebar between full and icon-only. The grid column animates with an eased transition, and labels fade and slide out.
- **Liquid navigation indicator:** one highlight pill slides between workspaces with a slight overshoot. It is kept alive across re-renders so the movement is real. The Validation entry shows an open-findings badge.
- **Logo as a now-playing player:** clicking the BranchTone logo opens a Spotify-style card. It has liquid-morphing cover art, an equalizer that animates while playing, the current passage and its cue, a progress bar, previous / play-pause / next, and a clickable queue of the route's passages. It closes with Esc or an outside click.
- **Page transition:** switching workspace reveals the new screen with a curtain wipe plus staggered card entrances, without delaying the interaction.
- **Self-drawing charts:** the severity donut and the validation-history line draw themselves in when a workspace opens.
- **Playback:** `requestAnimationFrame`-driven, with a pulse travelling the active route, a ring when a cue fires (red for a violation), and a live oscilloscope and level meter driven by a Web Audio `AnalyserNode`.

## 5. Reports

- Route verdicts are computed from the simulation, not typed in.
- Coverage is stated honestly: passage coverage, and audio verification marked **Partial** because loudness is not measured and not every asset is decoded.
- **Snapshot and verify:** "Create snapshot" hashes the current report JSON with SHA-256. "Verify" recomputes it against the live model. It reports VERIFIED if nothing changed and MISMATCH if the model changed (for example after applying the fix and re-validating).
- JSON and Markdown views, with Copy.

## 6. Landing website

- Hero with a dot grid that reacts to the cursor, a rising-word headline, a live product preview with a Route A/B toggle, and parallax on scroll.
- Sections: workspaces, an original generated "cue score" (D pentatonic plucked-string synth with a deliberate wrong note), and a route test.
- **Cursor sound (off until you press SOUND OFF):** moving plays glass-like chimes (pitch follows horizontal position), clicking empty space plays a pluck and a thump, clicking a button plays a short two-note chime, hovering a button plays a tick. The cursor ring changes shape when moving and when pressed.

## 7. Animation techniques used

| Technique | Where |
|---|---|
| Scrollytelling / parallax | landing hero shifts and fades on scroll |
| Morphing / liquid motion | now-playing cover blob |
| Microinteractions | magnetic buttons, hover lifts, press states |
| Kinetic typography | hero headline words |
| Page transitions and staggered reveals | curtain wipe and card entrances |
| Self-drawing lines | donut and history line, route edges |
| Glassmorphism | panels, dock, sidebar, now-playing card |
| WebGL / real-time 3D | **not used**; the particle and dot effects are 2D canvas |

All motion is switched off for users who prefer reduced motion (the global `prefers-reduced-motion` rule).

## 8. Not built (be honest about these)

- No Twee/Ink importer; the story model is bundled.
- No Adaption Labs connection. The Copilot panel states it is not connected and shows no AI scores.
- No SQLite or persistence; state lives in memory for the session.
- No PDF export, no HTTP streaming endpoint, no WASM FLAC fallback.
- No loudness (LUFS) measurement; only peak.
- `traitor_theme.wav` stays Missing until you import a real file.
- The graph is plain SVG, not React Flow. The original spec's React / FastAPI stack is not used.
- Download buttons do not work inside a published page, so reports are shown and copied rather than downloaded.

## 7. Known risks

- Not browser-tested: layout overlaps, a broken edit, or an audio-permission quirk are all possible.
- Cursor and UI sounds need a user gesture before browsers allow audio.
- `backdrop-filter` blur is heavy on weak devices.

## 9. Fix pass (tested in headless Chromium)

The previous version had never been opened in a browser. This pass loaded it in headless Chromium, clicked through every screen and flow, and fixed what broke.

| Problem found | Fix |
|---|---|
| Script crashed on load (`npo` used before it existed), so the landing page never appeared | Guarded the now-playing renderer |
| Landing animation froze after the first click (negative ellipse radius in the score ripple) | Clamped the ripple age to zero |
| **Every table row was invisible** (Cue Library, Validation Centre): the cursor click-ripple class `.clk` also matched the table-row class `tr.clk` | Renamed the ripple to `.ripc` |
| Primary hero button was unreadable; hero text was centered | Restyled the button and left-aligned the hero |
| Finding IDs changed when another finding was fixed | IDs are now stable per rule: BT-001 Reveal Protection, BT-002 Missing Media Asset |
| Narrative Map clipped lane labels and the mood curve was almost flat | Wider canvas and rescaled mood curve |
| Playhead sat at 00:00 while the selected passage was Air Vent | Initial time now matches the selected passage |
| Transport dock text wrapped and the volume slider overflowed | Wider dock, no-wrap text |
| Finding source said `story.twee`, a file that does not exist | Now says "demo story model" |
| Sidebar vanished and content overflowed on phone widths | Mobile layout: nav becomes a scrolling top bar |

Verified by script: no page errors across the landing page, all seven workspaces, playback, the now-playing card, sidebar collapse, the Reports snapshot and verify, the command palette (Ctrl+K), the fix proposal with approve and undo, Route Lab reproduction of BT-001, and importing a real WAV for `traitor_theme.wav` (it decodes, and BT-002 disappears). Not verified: how it looks and sounds on real devices, other browsers, and long sessions.

## 10. Design-direction pass (inspired by, not copied from)

The studio was rebuilt around ten reference principles. These are interpretations of general design ideas; no brand assets or code were used, and the referenced sites were not inspected.

| Inspiration | What was applied |
|---|---|
| Apple (animation) | One spring easing curve everywhere. Screens fade up 10px in 0.5s with a short stagger. The earlier clip-path wipe, blur reveals, drifting aurora and film grain were removed from the studio. |
| Duolingo (onboarding) | A "Find your first bug" quest card with four steps that tick off from real actions (open Story Graph, select Air Vent, reproduce BT-001, approve the fix). It has a chunky progress bar, springy check marks, a raised "Continue" button and a confetti burst on completion. The card can be collapsed or dismissed. |
| Pentagram (typography) | Heavy 46px headlines with tight tracking, small monospaced labels, and strict size steps. |
| Linear (UI) | Flat surfaces with 1px hairlines, compact controls, keycap hints, and number keys 1 to 7 to switch workspaces. |
| Muji (minimalism) | Glass, glow, gradients and decoration were stripped from the studio: flat warm-graphite panels with one emerald accent. |
| Airbnb (search) | A rounded search pill in the top bar opens a large search overlay that live-filters workspaces, passages, findings and assets, with arrow-key and Enter navigation. |
| Aesop (art direction) | Warm neutral text colours and an italic serif accent inside each page headline. |
| Notion (dashboard) | Quiet, content-first pages made of flat blocks with subtle row hover and property-style lists. |
| Stripe (landing) | A soft animated gradient mesh behind the hero. |
| Framer (interactions) | Story Graph nodes can be dragged and the edges follow live; clicking still selects. The nav highlight slides with a spring. |

Bugs found while testing this pass: the pulse dot in the Story Graph blocked clicks on the node under it (fixed with `pointer-events:none`).

## 11. Piano, lights, child-friendly guidance, better report integrity

- **Piano (landing page):** inspired by the "press play and the lights go down" listening idea on davidcata.com/en/musica. Only that page's text was read, not its visuals, so this is an interpretation. There is a two-octave playable piano: click keys, or use A S D F G H J K L and the black keys W E T Y U O P. Notes are made live (additive synth with a soft reverb), keys press down, and a light beam rises from each key. "Play the tune" dims the whole page, lights the piano with a spotlight, and plays a short original tune with keys moving in sync. Press Stop, or launch the studio, to end it.
- **Lights:** swaying stage beams behind the hero, a warm spotlight on the piano, and a light-sweep shine on primary buttons in the studio.
- **Landing page now matches the studio:** warm flat surfaces, bold headlines with an italic serif accent, plainer wording.
- **Easier for anyone to use:**
  - Every workspace has a plain-words explanation under its title.
  - The "Find your first bug" quest steps are clickable: each shows a "Show me" action that does the step for you.
  - A "?" button in the top bar reopens the quest.
  - Landing text uses everyday words.
- **Report integrity:** replaced with a three-step "wax seal" flow (Seal, Check later, See the answer). Sealing stores a SHA-256 fingerprint, shown as a visual pattern plus the full hash, with a copy button. Checking says "Unchanged" or "Changed" and lists what differs (findings, validation runs, decoded sounds). The report view is height-limited and scrollable.

Verified in headless Chromium: playable keys, keyboard keys, Play/Stop with the lights-down mode, quest "Show me" actions, seal then check (unchanged) and seal then re-validate then check (changed), with no page errors. Not verified: how the sound and animation feel on real devices.
