# COMPLIANCE_MATRIX.md — Hackathon Build Boundary

**Review date:** 10 November 2026  
**Status:** Public-rule review completed; ambiguous module classifications require organizer clarification. This document is not legal/event-organizer approval.

## 1. Publicly stated facts

The GeNarrative Clash 2026 public event site states:

- Teams may pre-build up to 50% before event day; the remaining 50% must be built live during the six-hour hacking sprint.
- Examples listed for pre-build: wireframes, boilerplate code, trained prompts or baseline UI; a separate rules summary names UI templates, design system and auth scaffolding.
- Examples listed for live sprint: prompt tuning, API orchestration and inference hooks.
- The site describes no technology-stack restrictions.
- The site schedule snapshot reviewed 10 November 2026 lists a 50% MVP submission round from 10–16 November 2026 and the live finale on 21 November 2026.

Sources:
1. Official event page: https://genarrative-clash-2026.web.app/
2. Devfolio listing: https://genarrative-clash.devfolio.co/

Always check the portal and written organizer messages again before coding or submission. If official instructions conflict, the latest direct organizer instruction prevails.

## 2. Classification matrix

| BranchTone work item | Publicly named category? | Pack treatment | Agent instruction |
|---|---|---|---|
| Wireframes and visual prototypes | Yes — pre-build example | `PREBUILD-EXAMPLE` | May be prepared within 50% cap. |
| Design tokens and component system | Yes — pre-build example | `PREBUILD-EXAMPLE` | May be prepared within 50% cap. |
| App shell / baseline UI / workspace navigation | Yes — baseline UI/boilerplate examples | `PREBUILD-EXAMPLE` | May be prepared within 50% cap. |
| Repository / boilerplate scaffolding | Yes — pre-build example | `PREBUILD-EXAMPLE` | May be prepared within 50% cap. |
| Auth scaffolding | Yes — pre-build example | `PREBUILD-EXAMPLE` | May be prepared if auth is actually required; do not fake auth. |
| Trained prompts / prompt tuning | Trained prompts listed as pre-build example; prompt tuning listed as live sprint | `CONFLICT/CONFIRM` | Do not tune prompts in pre-build; preserve any existing prompt only if organizer explicitly says trained prompts are allowed and clarify what “trained” means. |
| API orchestration | Yes — live sprint example | `LIVE-SPRINT-EXAMPLE` | Do not prebuild orchestration unless organizers explicitly clarify otherwise. |
| Inference hooks / model provider wiring | Yes — live sprint example | `LIVE-SPRINT-EXAMPLE` | Keep provider seam inert; implement live integration during sprint if rules remain unchanged. |
| Twee parser/compiler | Not individually classified | `CONFIRM` | Obtain organizer classification; do not assume allowed or prohibited. |
| Canonical IR/schema/domain models | Not individually classified | `CONFIRM` | Contracts/scaffolding may be part of boilerplate, but ask before implementing substantive domain behaviour. |
| Route/state simulation | Not individually classified | `CONFIRM` | Keep interface/design seam only until confirmed or reserve for sprint. |
| Deterministic validation rules | Not individually classified | `CONFIRM` | Same as route/state simulation. Do not misclassify as AI just because it is “validation”. |
| Audio cue scheduler/playback orchestration | Not individually classified; API orchestration has live-sprint example | `CONFIRM` | Ask organizer; do not assume browser audio UX and cue orchestration share same classification. |
| Asset upload/storage backend | Not individually classified | `CONFIRM` | Ask organizer; UI shell can show disabled/import state only. |
| Reports/export implementation | Not individually classified | `CONFIRM` | Ask organizer whether domain-generated reports count as backend functionality. |
| Unit tests and CI configuration | Not individually classified | `CONFIRM` if used to implement restricted functionality | Test scaffolding is normally baseline engineering; do not use it to hide substantive implementation. |

## 3. Conservative operating rule

1. The published examples are examples, not an exhaustive list.
2. Do not infer that every backend module is prohibited, and do not infer that every unmentioned module is permitted.
3. Keep the pre-build branch within the 50% cap as interpreted by the organizers.
4. For each `CONFIRM` item, obtain written clarification and record the response/date in `PHASE_LOG.md`.
5. For `LIVE-SPRINT-EXAMPLE`, keep implementation inactive until the live sprint unless the organizer explicitly changes the rule.
6. Do not fake commits, alter timestamps, hide generated code history or backdate work.
7. If clarification is unavailable, reserve ambiguous substantive functionality for the live sprint and implement only clearly allowed UI/boilerplate scaffolding beforehand.

## 4. Questions to send to organizers

- Are the parser/compiler, route exploration/state simulator and deterministic rule engine permitted as part of the pre-build 50%, or must their substantive implementation happen in the live sprint?
- Is backend asset upload/storage plus Web Audio waveform/playback implementation pre-build or live-sprint work?
- Are typed data contracts, fixture validation and non-executing adapter interfaces counted as boilerplate scaffolding?
- How will the team’s 50% pre-build contribution be measured (features, commits, effort or another rubric)?
- Does the online 50% MVP submission round have any additional restriction beyond the 50/50 rule?

## 5. Record organizer decisions

Append dated, attributable answers to `PHASE_LOG.md`. Do not overwrite this matrix with assumptions. Update classifications only after a direct organizer response or official written rule revision.
