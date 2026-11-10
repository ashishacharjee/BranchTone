# MISSING_ASSETS_CHECKLIST.md — Resource Acquisition & Pre-Sprint Checklist

**Project:** BranchTone — Narrative Audio QA & Regression Testing Studio  
**Target Event Date:** 21 November 2026  
**Status:** Pre-Sprint Asset Inventory & Action Plan  

---

## 1. Missing Narrative Prose Acquisition

In `content/the_last_signal.twee`, only passage **P-003 (Air Vent)** contains exact creator-authored story text. Passages P-001, P-002, P-004, and P-005 currently contain explicit structural placeholders.

| Passage ID | Title | Current Status | Required Content for Live Sprint | Priority | Target Acquisition Date |
|---|---|---|---|---|---|
| **P-001** | Lobby | `[DEMO PLACEHOLDER]` | 2–3 sentences of narrative prose establishing Sen entering the corporate lobby, encountering the security desk, and choosing between the archive corridor and the ventilation duct. | High | 18 November 2026 |
| **P-002** | Archives | `[DEMO PLACEHOLDER]` | 2–3 sentences describing Sen discovering confidential records that explicitly reveal who is orchestrating the conspiracy (`traitor_identity_revealed = true`). | High | 18 November 2026 |
| **P-003** | Air Vent | **Complete (Canonical Text)** | *"Sen squeezes through the dark metal duct to bypass the locked hallway, completely unaware of who is behind the conspiracy."* | **Verified** | N/A (Already in pack) |
| **P-004** | Server Vault | `[DEMO PLACEHOLDER]` | 2–3 sentences describing Sen decrypting the central server files, where the conspiracy identity is finally unmasked on Route B. | High | 18 November 2026 |
| **P-005** | Safe House | `[DEMO PLACEHOLDER]` | 2–3 sentences resolving the immediate escape sequence and confirming extraction. | Medium | 18 November 2026 |

> [!IMPORTANT]
> **Narrative Integrity Rule:**  
> Never invent or fabricate story prose. Narrative text must come directly from the project creator or domain author. Placeholders must be replaced only with verified creator text.

---

## 2. Licensed Audio Asset Acquisition

No actual binary audio assets were supplied in the development pack. `traitor_theme.wav` is currently defined in metadata only.

| Asset Identifier | Intended Layer | Target Format | Duration Target | Intended Use in Story | Required Licence | Acquisition Source |
|---|---|---|---|---|---|---|
| `traitor_theme.wav` | Music | 16-bit 44.1kHz WAV | ~60–90 seconds | Tension cue that triggers at Air Vent entry on Route B (demonstrating defect BT-001). | CC0 / Freesound CC-BY / Original Composition | Freesound.org / In-house composer |
| `lobby_ambience.wav` | Ambience | 16-bit 44.1kHz WAV | ~120s (Looping) | Smoked-glass corporate lobby background drone with HVAC hum. | CC0 / CC-BY with attribution in `LICENSES.md` | Freesound.org |
| `air_vent_drone.wav` | Ambience | 16-bit 44.1kHz WAV | ~60s (Looping) | Claustrophobic metallic ventilation duct resonance. | CC0 / CC-BY with attribution in `LICENSES.md` | Freesound.org |
| `vent_grate_creak.wav` | SFX | 16-bit 44.1kHz WAV | 2–4 seconds | Discrete sound effect of metal duct panel unlatching upon passage entry. | CC0 / Public Domain | Freesound.org |

> [!CAUTION]
> **Audio Licensing Compliance:**  
> Do NOT use copyrighted, unlicensed commercial music or film stems. All assets must have clear, verifiable CC0 or CC-BY licences. Every acquired asset must be documented in `content/LICENSES.md` with source URL, author, and licence terms.

---

## 3. Organizer Compliance Clarification

A 5-point formal inquiry was dispatched to the organizing team on 10 November 2026 at 12:03 IST (`PHASE_LOG.md`).

| Inquired Item | Question Summary | Current Status | Impact on Live Sprint |
|---|---|---|---|
| **Question 1: Domain Engineering** | Are parser, route simulator, and deterministic validation engine allowed in pre-build? | Awaiting written response | If YES $\to$ pre-build them before sprint. If NO $\to$ execute Milestones 1–3 and 5 in live sprint per `LIVE_SPRINT_RUNBOOK.md`. |
| **Question 2: Audio Engineering** | Does audio upload/decoding and Web Audio scheduling count as pre-build? | Awaiting written response | If YES $\to$ pre-build them before sprint. If NO $\to$ execute Milestone 4 in live sprint. |
| **Question 3: Report Generation** | Is backend report serialization restricted? | Awaiting written response | Determines whether Milestone 6 is pre-build or live sprint. |
| **Question 4: 50% Rubric** | How is the 50% pre-build limit evaluated? | Awaiting written response | Guides team commit and milestone accounting. |
| **Question 5: Scaffolding vs Logic** | Can interfaces and tests remain prepared ahead of sprint? | Awaiting written response | Confirms current baseline scaffolding is 100% compliant. |

---

## 4. API Credentials & Environment Variables

The live sprint includes Milestone 7 (Gemini 2.5 Flash structured annotation proposal).

| Credential / Variable | Required Value | Location | Scope | Security Protocol |
|---|---|---|---|---|
| `GEMINI_API_KEY` | Valid Google AI Studio API key | `backend/.env` | Backend only | Must NEVER be exposed to Git, committed to version control, or bundled into Vite client bundles (`VITE_*`). |
| `ENVIRONMENT` | `production` / `development` | `backend/.env` | Backend only | Controls debug logging and CORS origins. |
| `ALLOWED_ORIGINS` | `["http://localhost:5173", "http://localhost:4173"]` | `backend/.env` | Backend only | Restricts CORS access to local dev/preview instances. |

---

## 5. Pre-Sprint Asset Staging Protocol

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
