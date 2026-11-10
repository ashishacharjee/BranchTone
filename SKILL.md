# SKILL.md — Repeatable Engineering Workflows

Use these workflows; do not skip data validation, compliance or tests.

## A — Repository bootstrap
1. Inspect current repository and environment.
2. Read `TOOLS.md` and `COMPLIANCE_MATRIX.md`.
3. Create frontend/backend folders only if absent; preserve existing files.
4. Pin compatible dependency ranges and generate lockfiles using the local package manager.
5. Add `.env.example`, `.gitignore`, lint/typecheck/test/build commands and health endpoint.
6. Run checks; update TODO/CHANGELOG/MEMORY and report results.

## B — Add/change API endpoint
1. Read entity/endpoint in `SCHEMA.md` and verify compliance gate.
2. Add Pydantic request/response models.
3. Implement HTTP adapter in `api/routes/`; business logic in service/domain module.
4. Verify IDs and project/version ownership.
5. Return standard error envelope for expected errors.
6. Test success, malformed input, missing resource, ownership mismatch and boundary conditions.
7. Update SCHEMA/types/JSON Schema if contract changes.
8. Run backend test/type/lint commands and update project logs.

## C — Add parser support
1. Check approved subset in `PRD.md` and compliance clearance.
2. Implement lexer/parser without `eval` or macro execution.
3. Preserve source offsets and original source hash.
4. Add valid, malformed and near-miss fixtures.
5. Test Unicode, CRLF/LF, duplicate names, missing targets, nested/unclosed syntax and unsupported macros.
6. Unsupported constructs must be diagnostic and affect coverage claims.
7. Run parser/compiler regression tests and update docs.

## D — Add a deterministic validation rule
1. Specify purpose, required inputs, trigger point, severity and deduplication key.
2. Define pass/fail/unknown/incomplete test cases before coding.
3. Implement a pure function under `rules/` independent of FastAPI/DB/AI SDK.
4. Return a typed Finding with trace and source evidence.
5. Add negative controls: intentional silence, permitted foreshadowing, unknown facts and valid new conflict.
6. Verify BT-001 is derived from Route B cue config and state; never hardcode it in React.
7. Run tests and update SCHEMA/PRD/TODO/CHANGELOG.

## E — Add or update a frontend workspace
1. Read `DESIGN.md` and inspect approved master image.
2. Use shared AppShell/sidebar/topbar/tokens.
3. Create a separate route and purpose-built layout.
4. Call typed service functions; no fetch/domain logic in view components.
5. TanStack Query owns remote data; Zustand owns transient selection/playback only.
6. Provide loading, empty, error and demo-data states.
7. Verify keyboard, focus, contrast, labels, reduced motion and 1366px layout.
8. Test cross-workspace selected route/passage state.

## F — Implement audio asset/playback
1. Confirm asset exists, is licensed, passes signature/size validation and decodes.
2. Derive waveform peaks from actual decoded samples; never randomise peaks.
3. Resolve cue triggers from route simulation records, not pixel coordinates.
4. Schedule using route time, layer, offset, fades, looping and stop policies.
5. Start only after user gesture; handle autoplay/decode/device errors.
6. Clean AudioContext, nodes, event listeners and object URLs on route change/unmount.
7. Ensure markers, playhead and ruler share one duration/time base.
8. Test short known audio fixtures and teardown.

## G — Gemini/AI annotation integration
1. Verify organizer approval/current sprint phase in `COMPLIANCE_MATRIX.md` before any provider/prompt/API work.
2. Backend-only provider interface; no key in client env.
3. Use typed structured output and strict schema validation.
4. Validate passage IDs, evidence quote, enum, intensity and duplicate IDs.
5. Persist as pending; creator approval required.
6. Record model ID, prompt version, provider status and timestamps.
7. Test no-key, timeout, rate-limit, malformed output and evidence mismatch.
8. Clearly separate fixture mode from live provider output.

## H — Demo release
1. Confirm phase rules and allowed build scope.
2. Run all backend/frontend tests, typecheck, lint and production build.
3. Seed the fixture and compare backend output to `content/expected-findings.json`.
4. Verify Route B→Air Vent→BT-001 and route state synchronization.
5. Verify exact source quote, intensity 4/5 and no invented source lines.
6. Verify missing audio is not playable and no fake waveform appears.
7. Verify no-key demo mode, no fake metrics and exports.
8. Check media licences and write release notes only after actual tests.
