# MISSING_ASSETS_CHECKLIST.md — Resource Acquisition & Pre-Sprint Checklist

**Project:** BranchTone — Narrative Audio QA & Regression Testing Studio  
**Target Event Date:** 21 November 2026  
**Status:** Pre-Sprint Asset Inventory & Action Plan  
**Baseline Git Commit:** `7b82eec` (Frozen Pre-Build Baseline)  

---

## 1. Asset Classification Taxonomy

BranchTone strictly categorizes all narrative text and audio media into three distinct tiers:

1. **Original Assets (Canonical Creator Content):**
   * *Definition:* Authentic, creator-authored story text and genuine composer master recordings.
   * *Current Status:* Passage **P-003 (Air Vent)** text is the only supplied original narrative passage. `traitor_theme.wav` is an original composition specification that is currently **missing**.
   * *Integrity Rule:* If an original asset is missing, it must remain explicitly disclosed as missing in both data schemas and UI displays. Never fabricate replacement content and claim it as original.

2. **Synthetic Demonstration Fixtures:**
   * *Definition:* Mock narrative sentences, programmatic audio tones (e.g. 440Hz sine wave or synthesizer pulses), and typed JSON mock records created strictly for pipeline integration, decoder verification, and UI layout testing.
   * *Current Status:* Passages P-001, P-002, P-004, and P-005 contain placeholder text; audio timeline waveforms currently display demo peak shapes clearly badged as `DEMO DATA`.
   * *Integrity Rule:* **Never represent generated or synthetic audio as the missing original `traitor_theme.wav`.** Any generated test audio must be explicitly named `synthetic_test_fixture.wav` or `demo_synth_tone.wav`, and visibly badged in the UI as `SYNTHETIC FIXTURE`.

3. **Licensed Production Assets:**
   * *Definition:* External narrative or audio assets legally acquired under verifiable public licenses (CC0, CC-BY, public domain) or licensed commercial agreements.
   * *Current Status:* Awaiting acquisition prior to live sprint.
   * *Integrity Rule:* Every licensed asset must have its author, exact source URL, license type, and attribution text recorded in `content/LICENSES.md`.

> [!CAUTION]
> **Strict Non-Representation Mandate:**  
> 1. Do not generate replacement original story passages or audio files without clearly identifying them as synthetic demonstration assets.  
> 2. **NEVER represent generated audio as the missing original `traitor_theme.wav`.**  
> 3. The workbench must continue to transparently disclose whether each individual asset is an authentic original, a licensed production asset, or a synthetic fixture.

---

## 2. Narrative Prose Acquisition & Classification

In `content/the_last_signal.twee`, only passage **P-003 (Air Vent)** contains exact creator-authored story text. Passages P-001, P-002, P-004, and P-005 currently contain explicit structural placeholders.

| Passage ID | Title | Current Status | Asset Classification | Required Content for Live Sprint | Priority | Target Date |
|---|---|---|---|---|---|---|
| **P-001** | Lobby | `[DEMO PLACEHOLDER]` | Synthetic Demonstration Fixture | 2–3 sentences establishing Sen entering the lobby, security desk, and choosing between archives and air vent. | High | 18 Nov 2026 |
| **P-002** | Archives | `[DEMO PLACEHOLDER]` | Synthetic Demonstration Fixture | 2–3 sentences describing Sen discovering confidential records that reveal the conspiracy (`traitor_identity_revealed = true`). | High | 18 Nov 2026 |
| **P-003** | Air Vent | **Complete (Canonical Text)** | **Original Asset** | *"Sen squeezes through the dark metal duct to bypass the locked hallway, completely unaware of who is behind the conspiracy."* | **Verified** | Verified in pack |
| **P-004** | Server Vault | `[DEMO PLACEHOLDER]` | Synthetic Demonstration Fixture | 2–3 sentences describing Sen decrypting central server files, unmasking the conspiracy on Route B. | High | 18 Nov 2026 |
| **P-005** | Safe House | `[DEMO PLACEHOLDER]` | Synthetic Demonstration Fixture | 2–3 sentences resolving the immediate escape sequence and confirming extraction. | Medium | 18 Nov 2026 |

---

## 3. Audio Asset Acquisition & Classification

No actual binary audio files were supplied in the initial development pack. `traitor_theme.wav` is currently defined in metadata only.

| Asset Identifier | Intended Layer | Target Format | Target Duration | Asset Classification | Intended Use in Story | License Source |
|---|---|---|---|---|---|---|
| `traitor_theme.wav` | Music | 16-bit 44.1kHz WAV | ~60–90s | **Original / Licensed Production Asset** (Currently Missing) | Tension cue that triggers at Air Vent entry on Route B (demonstrating defect BT-001). | CC0 / Freesound CC-BY / Original Composition |
| `lobby_ambience.wav` | Ambience | 16-bit 44.1kHz WAV | ~120s (Loop) | Licensed Production Asset | Corporate lobby background drone with HVAC hum. | CC0 / CC-BY with attribution in `LICENSES.md` |
| `air_vent_drone.wav` | Ambience | 16-bit 44.1kHz WAV | ~60s (Loop) | Licensed Production Asset | Claustrophobic metallic ventilation duct resonance. | CC0 / CC-BY with attribution in `LICENSES.md` |
| `vent_grate_creak.wav` | SFX | 16-bit 44.1kHz WAV | 2–4s | Licensed Production Asset | Discrete sound effect of metal duct panel unlatching upon passage entry. | CC0 / Public Domain |
| `synthetic_test_440hz.wav` | Test / QA | 16-bit 44.1kHz WAV | 5.0s | **Synthetic Demonstration Fixture** | Test fixture used strictly for testing PCM peak decoders in `backend/app/audio/`. | Generated via Python `wave` (marked synthetic fixture) |

---

## 4. Organizer Compliance Clarification

A 5-point formal inquiry was dispatched to the organizing team on 10 November 2026 at 12:03 IST (`PHASE_LOG.md`).

| Inquired Item | Question Summary | Current Status | Impact on Live Sprint |
|---|---|---|---|
| **Question 1: Domain Engineering** | Are parser, route simulator, and deterministic validation engine allowed in pre-build? | Awaiting written response | If YES $\to$ pre-build them before sprint. If NO $\to$ execute Milestones 1–3 and 5 in live sprint per `LIVE_SPRINT_RUNBOOK.md`. |
| **Question 2: Audio Engineering** | Does audio upload/decoding and Web Audio scheduling count as pre-build? | Awaiting written response | If YES $\to$ pre-build them before sprint. If NO $\to$ execute Milestone 4 in live sprint. |
| **Question 3: Report Generation** | Is backend report serialization restricted? | Awaiting written response | Determines whether Milestone 6 is pre-build or live sprint. |
| **Question 4: 50% Rubric** | How is the 50% pre-build limit evaluated? | Awaiting written response | Guides team commit and milestone accounting. |
| **Question 5: Scaffolding vs Logic** | Can interfaces and tests remain prepared ahead of sprint? | Awaiting written response | Confirms current baseline scaffolding is 100% compliant. |

---

## 5. Optional API Credentials & Environment Variables

The live sprint includes Milestone 7 (Gemini 2.5 Flash structured annotation proposal) as an **optional stretch goal**. The workbench is fully operational without this credential.

| Credential / Variable | Required Value | Location | Scope | Security Protocol |
|---|---|---|---|---|
| `GEMINI_API_KEY` | Valid Google AI Studio API key (Optional for stretch goal) | `backend/.env` | Backend only | Must NEVER be exposed to Git, committed to version control, or bundled into Vite client bundles (`VITE_*`). Core QA workbench operates normally without it. |
| `ENVIRONMENT` | `production` / `development` | `backend/.env` | Backend only | Controls debug logging and CORS origins. |
| `ALLOWED_ORIGINS` | `["http://localhost:5173", "http://localhost:4173"]` | `backend/.env` | Backend only | Restricts CORS access to local dev/preview instances. |

---

## 6. Pre-Sprint Asset Staging Protocol

1. **Staging Directory:** Place acquired audio files in `staging/audio/` and story text in `staging/the_last_signal_full.twee`.
2. **Hash Verification:** Compute SHA-256 for all acquired audio files:
   ```powershell
   Get-FileHash -Algorithm SHA256 staging/audio/*
   ```
3. **Audio Sanity Check:** Verify PCM encoding and duration using Python `wave`:
   ```python
   import wave
   with wave.open("staging/audio/traitor_theme.wav", "rb") as w:
       print("Channels:", w.getnchannels(), "Sample Rate:", w.getframerate(), "Duration:", w.getnframes() / w.getframerate())
   ```
4. **Licence Recording:** Append attribution entries to `content/LICENSES.md` prior to live sprint start.
