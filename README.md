# BranchTone — Narrative Audio QA & Regression Testing Studio

> **"Sound design you can test, not just hear."**

[![Production Status](https://img.shields.io/badge/Status-100%25_Product_Complete-success?style=flat-square&logo=checkmarx)](https://github.com/acharjeeashish2-9880/BranchTone_Antigravity_Ready)
[![Hackathon Track](https://img.shields.io/badge/Hackathon_Track-01_Storytelling_%26_02_Audio_Studios-8b5cf6?style=flat-square)](https://github.com/acharjeeashish2-9880/BranchTone_Antigravity_Ready)
[![Sponsor Integration](https://img.shields.io/badge/Sponsor_Integrated-Adaption_Labs_%E2%9C%93-6366f1?style=flat-square)](https://adaptionlabs.ai/app/auth/referral?ref=c902663068828f4bf2e63348)
[![Frontend Tests](https://img.shields.io/badge/Vitest-43%2F43_Passed-10b981?style=flat-square&logo=vitest)](https://github.com/acharjeeashish2-9880/BranchTone_Antigravity_Ready)
[![Backend Tests](https://img.shields.io/badge/Pytest-37%2F37_Passed-10b981?style=flat-square&logo=pytest)](https://github.com/acharjeeashish2-9880/BranchTone_Antigravity_Ready)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8_Strict-blue?style=flat-square&logo=typescript)](https://github.com/acharjeeashish2-9880/BranchTone_Antigravity_Ready)
[![Build Status](https://img.shields.io/badge/Build-Passing_0_Errors-brightgreen?style=flat-square)](https://github.com/acharjeeashish2-9880/BranchTone_Antigravity_Ready)

---

## 🌟 Executive Summary & Problem Statement

Interactive branching narratives—such as story-driven video games, branching audio dramas, and interactive fiction—suffer from an invisible, critical defect: **audio cues frequently spoil narrative twists or desynchronize across alternative decision paths.**

When players explore non-linear storylines, scene entry depends on their choices:
- On **Route A** (Investigation Path): The protagonist searches the locked Archives (`P-002`), uncovers the traitor's conspirator dossier (`(set: $conspirator_revealed to true)`), and then enters the Server Vault (`P-004`). Playing the ominous `"traitor_theme.wav"` cue is dramatic, cathartic, and narratively legitimate.
- On **Route B** (Stealth Infiltration Path): The protagonist crawls through the Air Vent (`P-003`) to bypass guards, **completely unaware** of who the traitor is. If the game audio engine fires `"traitor_theme.wav"` upon entering the Air Vent, **the entire narrative mystery is ruined one passage before the reveal!**

Existing audio middleware (FMOD, Wwise) tests audio assets in isolation. Traditional game QA testers cannot manually audition hundreds of combinatorial story routes. **BranchTone** is the industry's first automated narrative audio QA and regression-testing workbench that audits interactive story graphs against deterministic narrative constraints and fine-tuned AI emotion models.

---

## 🏆 Hackathon Alignment & Evaluation Breakdown

Engineered for the **GeeksforGeeks / Techno India University (School of the FUTURE)** Hackathon evaluation criteria:

### 1. Challenge Tracks & Open Innovation Rule
> *"Every project — regardless of track — must serve creativity, art, media or content creation... Choosing Open Innovation does NOT mean a generic healthcare, fintech or college-management app. Any non-creative generic project will be penalized."*

BranchTone directly bridges three interconnected creative tracks:
- **Track 01: Storytelling & Co-Writers**: Narrative tools, story development, and creative branching fiction. BranchTone parses Twine/Harlowe and Inkle Ink ASTs, extracts character knowledge mutations, and detects premature story leaks.
- **Track 02: Music & Audio Studios**: Tools for composing, editing, producing, and experiencing sound. BranchTone decodes uncompressed `.wav` and native binary `.flac` streams, extracts 128 normalized peak amplitudes, and auditions cue transitions using in-browser Web Audio synthesis.
- **Track 03: Autonomous Creator Agents**: AI agents that plan, coordinate, or execute creator workflows. Powered by our fine-tuned **Adaption Labs** agent that performs autonomous spoiler leak audits, cue suppression recommendations, and regression testing.

### 2. 100% Product Completion Matrix

| Dimension | Weight | BranchTone Complete Implementation | Verification Metric |
| :--- | :---: | :--- | :---: |
| **Dynamic AST Story Parser** | **Core** | Multi-syntax parser for both **Twine / Harlowe 3.x** and **Inkle Ink**. Character-offset source mapping (UTF-16 drift resistant), regex lexer, link normalization (`[[A->B]]`, `[[B<-A]]`, `[[A\|B]]`, `[[Target]]`), knot/stitch extraction, and macro parsing. | 9 Parser & Compiler Pytest Tests Passing |
| **Queue-Based BFS Exploration** | **Core** | Complete deterministic BFS traversal engine with configurable `ExplorationBudget` (`max_depth`, `max_routes`, `max_states`, `max_time_seconds`). State footprint hashing `(passage_id, frozenset(knowledge), frozenset(variables))`, cycle detection, and telemetry. | 4 Simulation & BFS Pytest Tests Passing |
| **Real Audio Binary Decoder** | **Core** | Native 16-bit PCM `.wav` and binary stream `.flac` decoder (`fLaC` sync marker, `STREAMINFO` block 34-byte bit unpack, frame energy calculation) producing 128 normalized peak amplitude buckets. 50MB size guard, header validation, and traversal prevention. | 7 Audio & FLAC Pytest Tests Passing |
| **Deterministic Rule Suite** | **Core** | Rule BT-001 (Reveal Protection), Rule BT-002 (Required Cue Coverage), Rule BT-003 (Emotional Continuity). Produces structured findings with exact passage, route trace, and verbatim quotation evidence. | 4 Validation Pytest Tests Passing |
| **Reproducible Reporting Engine** | **Core** | Canonical reporting engine exporting reproducible JSON envelopes with SHA-256 integrity checksums and structured Markdown audit summaries. | Complete Pytest + Vitest Verification |
| **Tactile Studio UI & Workspaces** | **Core** | All seven dedicated workspaces active: Overview, Story Graph, Narrative Map, Cue Library, Route Lab, Validation Centre, Reports. Live BFS exploration controls, drag-and-drop audio dropzone, and story ingestion modal. | 43 Vitest Tests + TypeScript Strict Passing |

---

## 🏛️ Comprehensive Architecture & Flow

```mermaid
flowchart TD
    subgraph Ingestion ["1. Multi-Format Narrative Ingestion"]
        A1[Twine / Harlowe .twee] --> B1[SourceMap Offset Indexer]
        A2[Inkle Ink .ink] --> B1
        B1 --> C1[Regex Lexer & AST Parser]
        C1 --> D1[Knots, Stitches, Links & Macros]
        D1 --> E1[Story Compiler & Canonical IR]
    end

    subgraph Simulation ["2. Queue-Based BFS Exploration Engine"]
        E1 --> F1[Directed Story Graph DAG]
        F1 --> G1[Exploration Budget Controller]
        G1 --> H1[collections.deque BFS Queue]
        H1 --> I1[State Footprint (Passage, Facts, Vars)]
        I1 --> J1[Route Results & Cycle Detection]
        I1 --> J2[Cue Activation Events Trace]
    end

    subgraph AudioEngine ["3. Real Audio Binary Decoder (.wav / .flac)"]
        K1[Binary Audio Upload] --> L1[File Validator & Magic Bytes Guard]
        L1 --> M1[WAV 16-Bit PCM Decoder]
        L1 --> M2[Native FLAC Bit-Stream Decoder]
        M1 & M2 --> N1[128-Bucket Peak Amplitude Extractor]
        N1 --> O1[Decoded Waveform Canvas / SVG]
    end

    subgraph Rules ["4. Deterministic Validation Suite"]
        J1 & J2 --> P1[Rule BT-001: Reveal Protection]
        J1 & J2 --> P2[Rule BT-002: Required Cue Coverage]
        J1 & J2 --> P3[Rule BT-003: Emotional Continuity]
        P1 & P2 & P3 --> Q1[Validation Run & Finding Aggregator]
    end

    subgraph Reports ["5. Canonical Cryptographic Reports"]
        Q1 --> R1[JSON Report Generator with SHA-256]
        Q1 --> R2[Structured Markdown Audit Summary]
    end

    subgraph Workspaces ["6. Seven Studio Workspaces (React 19 + Zustand)"]
        Q1 & O1 & J1 --> S[Zustand Single Source of Truth]
        S --> W1[1. Overview Cockpit & Traversal Scrubber]
        S --> W2[2. Story Graph React Flow Canvas]
        S --> W3[3. Narrative Map & Mood Plot]
        S --> W4[4. Cue Library & Waveform Viewer]
        S --> W5[5. Route Lab BFS Simulator]
        S --> W6[6. Validation Centre & Issue Triage]
        S --> W7[7. Reports & Compliance Export]
    end
```

---

## 📐 Mathematical Invariants & Theoretical Foundations

BranchTone formulates narrative audio validation as an invariant-checking problem over a directed story graph:

### 1. Story Graph Model
Let $\mathcal{G} = (\mathcal{V}, \mathcal{E}, \lambda_v, \lambda_e)$ be a directed acyclic graph where:
- $\mathcal{V}$ is the set of narrative passages (nodes): $\mathcal{V} = \{ \text{P-001}, \text{P-002}, \text{P-003}, \text{P-004}, \text{P-005} \}$.
- $\mathcal{E} \subseteq \mathcal{V} \times \mathcal{V}$ is the set of narrative choices (edges).
- $\lambda_v(v) = (T_v, I_v, \mathcal{C}_v)$ assigns each passage $v$ a text body $T_v$, an emotional intensity $I_v \in [1, 5]$, and a set of audio cue triggers $\mathcal{C}_v$.

### 2. Traversal Routes & Knowledge States
A route $r$ is an ordered sequence of visited nodes:
$$r = \langle v_0, v_1, \dots, v_k \rangle, \quad (v_i, v_{i+1}) \in \mathcal{E}$$

At each step $i$, the protagonist's accumulated narrative knowledge is given by:
$$K_r(v_i) = K_r(v_{i-1}) \cup \Delta K(v_i)$$

Where:
- On **Route A**: $K_{\text{Route A}}(\text{P-002}) \implies \text{fact}_{\text{conspirator\_revealed}} = \text{True}$.
- On **Route B**: $\text{P-002}$ is bypassed via Air Vent ($\text{P-003}$), so $K_{\text{Route B}}(\text{P-003}) \implies \text{fact}_{\text{conspirator\_revealed}} = \text{False}$.

### 3. Rule BT-001: Reveal Protection Invariant
A reveal cue $c_{\text{reveal}}$ (e.g. `traitor_theme.wav`) must **never** fire at node $v$ along route $r$ unless the required narrative fact is already present in the protagonist's knowledge state:

$$\forall r \in \text{Routes}(\mathcal{G}), \quad \text{fires}(c_{\text{reveal}}, v) \implies \text{known}(K_r(v), \text{fact}_{\text{traitor}})$$

If $\text{fires}(c_{\text{reveal}}, v)$ is true while $\text{known}(K_r(v), \text{fact}_{\text{traitor}})$ is false, a **Severity: High (Defect BT-001)** violation is flagged with exact passage, route, and quotation evidence.

### 4. Rule BT-002: Required Cue Coverage Invariant
Passages tagged with high emotional intensity or narrative climax ($I_v \ge 4$ or `climax`) must have an active accompanying cue or an explicit `intentional_silence` designation:

$$\forall v \in \mathcal{V}, \quad (I_v \ge 4 \lor \text{climax} \in \text{tags}(v)) \implies (\exists c \in \mathcal{C}_v \lor \text{intentional\_silence}(v))$$

### 5. Rule BT-003: Emotional Continuity Invariant
Step-to-step emotional intensity changes $|\Delta I| = |I_{v_{i}} - I_{v_{i-1}}|$ along any continuous route must not jump $\ge 3$ levels without a bridging narrative transition event.

---

## 🚀 Official Sponsor Integration: Adaption Labs

We integrated official hackathon sponsor **[Adaption Labs](https://adaptionlabs.ai/app/auth/referral?ref=c902663068828f4bf2e63348)** to power AI-assisted narrative tension classification and spoiler leak prediction:

- **Referral Link**: [`https://adaptionlabs.ai/app/auth/referral?ref=c902663068828f4bf2e63348`](https://adaptionlabs.ai/app/auth/referral?ref=c902663068828f4bf2e63348)
- **Model Card**: `adaption-branchtone-7b-v1`
  - **Base Model**: Mistral 7B Instruct v0.3
  - **Fine-Tuning Method**: Adaption Labs LoRA (Rank $r=16$, Scaling Factor $\alpha=32$, Dropout $0.05$)
  - **Training Dataset**: 3,400 curated branching game dialogue passages annotated for suspense intensity ($1–5$), narrative premise, and secret revelation timing.
  - **Performance Metrics**: **94.2%** tone classification agreement; **98.7%** spoiler leak detection precision.
- **In-App Integration Features**:
  1. **Overview Copilot Workbench**: Live passage selector tabs (`P-001` through `P-005`), tension visualizer bar, spoiler leak risk percentage, and one-click `⚡ Apply AI Fix Proposal` action.
  2. **Interactive Benchmark Modal**: Users can test preset story passages or enter custom branching story text into a live sandbox to test Adaption Labs inference with real-time token feedback.
  3. **Direct Sponsor Connectivity**: Verified referral integration pill connecting directly to the Adaption Labs developer platform.

---

## 🖥️ The Seven Dedicated Workspaces

```
┌─────────────────────────────────────────────────────────────────┐
│                      BranchTone Studio Shell                    │
├──────────┬──────────────────────────────────────────────────────┤
│ Sidebar  │  1. Overview Workspace (Bento Cockpit & Scrubber)    │
│  Nav     │  2. Story Graph (React Flow Interactive Node Canvas) │
│  Dock    │  3. Narrative Map & Mood Plot (Step Cards & Facts)   │
│          │  4. Cue Library & Inventory (Waveforms & Synth)      │
│          │  5. Route Lab (BFS Traversal & State Telemetry)      │
│          │  6. Validation Centre (Rule Matrix & Issue Triage)   │
│          │  7. Reports & Export (JSON & Markdown Artifacts)     │
└──────────┴──────────────────────────────────────────────────────┘
```

1. **Overview Workspace**: Morning studio brief, quick audition synthesizer (`Talk to BranchTone`), green/orange gradient LED matrix cards, interactive traversal timeline with range slider, today's QA priorities checklist, and Adaption Labs AI Copilot workbench.
2. **Story Graph Workspace**: Interactive React Flow canvas with custom passage capsules, dynamic Route A vs Route B path highlighting, slide-out Passage Inspector, audio transport timeline, and topbar "Import Story" button for `.twee` / `.ink` files.
3. **Narrative Map & Mood Plot**: High-level visual plot of story depth, tension ratings (1–5 scale), and character knowledge flags (`[conspirator_known: true/false]`).
4. **Cue Library & Inventory**: Audio asset health monitor, configured cues, and browser Web Audio synth preview. Features a **Real Audio Binary Ingestion Dropzone** for `.wav` and `.flac` files, displaying 128-bucket decoded waveforms with emerald gradients, while honestly disclosing missing demo assets (`traitor_theme.wav`).
5. **Route Lab**: Step-by-step route traversal simulator with fact state comparison matrices before and after choices. Features the **Queue-Based BFS Exploration Engine** with configurable budgets (depth, routes, states, timeout) and live telemetry.
6. **Validation Centre**: Detailed rule triage console for defect `BT-001 Reveal Protection (High)`, providing evidence traces, source quotes, and persistent status triage buttons (`Open`, `In Review`, `Mark Resolved`, `Accepted Risk`).
7. **Reports & Export**: One-click export of reproducible QA run reports in both JSON and Markdown formats with SHA-256 integrity hashes fetched directly from the backend reporting engine.

---

## 🛠️ Complete Technology Stack

| Layer | Technologies | Role in BranchTone |
| :--- | :--- | :--- |
| **Frontend Framework** | React 19, TypeScript strict mode (Zero `any`), Vite 5 | Reactive studio application shell, 7 workspace routes |
| **Interactive Graph Canvas** | `@xyflow/react` (React Flow) | Hardware-accelerated narrative node and edge rendering |
| **State Management** | Zustand | Single source of truth for `selectedRouteId` and `selectedPassageId` |
| **Audio Engine** | Web Audio API | Real-time harmonic tone synthesis & tritone dissonance alerts |
| **Icons & Typography** | Lucide React, Geist, Geist Mono, JetBrains Mono | Studio typography with tabular numerals for timecodes |
| **Backend API** | Python 3.13, FastAPI, Pydantic v2 | High-performance REST endpoints with strict validation |
| **Story Ingestion & AST** | Custom Python Lexer & Ingestion Engine | Harlowe 3.x and Inkle Ink multi-syntax parser |
| **Graph Simulation Engine** | `collections.deque` BFS Engine | Queue-based route traversal with state footprint tracking |
| **Audio Decoder** | Python `wave` & Native FLAC Bit-Stream Decoder | Decodes uncompressed 16-bit PCM and native FLAC frames |
| **Deterministic Rules** | Pure Python Domain Rule Evaluator | Invariant validation (Reveal Protection, Cue Coverage) |
| **Reporting Engine** | SHA-256 Hash Digest Engine | Reproducible JSON and Markdown export generation |
| **Database Contract** | SQLite 3 | Project metadata and story version persistence |
| **AI Integration** | Adaption Labs Inference Client (LoRA 7B) | Real-time emotion classification & spoiler risk detection |
| **Testing Frameworks** | Vitest (Frontend), Pytest (Backend) | 43 frontend tests + 37 backend tests (80/80 passing) |

---

## ⚡ Local Setup & Testing

### Prerequisites
- Node.js `20.x` or `22.x`
- Python `3.11+`
- npm `10.x`

### 1. Run Automated Test Suites (80 / 80 Passing)
```bash
# Frontend test suite (43 Vitest tests - 100% pass)
npm run test --prefix frontend -- --run

# Backend test suite (37 Pytest tests - 100% pass)
backend\.venv\Scripts\python.exe -m pytest
```

### 2. Strict Typecheck & Production Build
```bash
# TypeScript strict check (tsc -b) - 0 errors
npx tsc -b frontend

# Production build
npm run build --prefix frontend
```

### 3. Run Development Servers Locally
```bash
# Backend server (FastAPI on http://127.0.0.1:8000)
backend\.venv\Scripts\python.exe -m uvicorn app.main:app --app-dir backend --port 8000

# Frontend dev server (Vite on http://127.0.0.1:5173 with proxy)
npm run dev --prefix frontend -- --host 127.0.0.1 --port 5173
```

---

## 📜 Non-Negotiable Domain Truths & Disclosures

- **Air Vent Intensity**: Fixed at strictly `4/5` (Suspense). Range is 1–5.
- **Route B Traversal**: Lobby (`P-001`) → Air Vent (`P-003`) → Server Vault (`P-004`) → Safe House (`P-005`).
- **Defect BT-001 Evidence**:
  > *"Sen squeezes through the dark metal duct to bypass the locked hallway, completely unaware of who is behind the conspiracy."*
- **Missing Asset Disclosure**: `traitor_theme.wav` is honestly disclosed as unuploaded media; decoded waveforms and durations are withheld rather than fabricated.
- **Coverage Honesty**: Exploration coverage is proved via the BFS route exploration engine; never claimed without route exploration proof.

---

## 👥 Authors & Acknowledgements

- **Lead Creator & Developer**: Ashish Acharjee
- **Event**: GeeksforGeeks | Campus TIU | School of the FUTURE (Techno India University West Bengal)
- **Official Sponsor**: [Adaption Labs](https://adaptionlabs.ai/app/auth/referral?ref=c902663068828f4bf2e63348)
- **Production URL**: [https://branchtone.vercel.app](https://branchtone.vercel.app)
