import { GitBranch } from 'lucide-react';
import { WorkspacePlaceholder } from '../../components/WorkspacePlaceholder';

export function StoryGraphPage() {
  return (
    <WorkspacePlaceholder
      workspace="Story Graph"
      description="Interactive directed passage graph with route selection, passage selection, cue issue indicators, passage inspector and audio timeline. Default: Route B selected, Air Vent (P-003) selected, BT-001 visible."
      pendingSlice={2}
      pendingItems={[
        '@xyflow/react graph canvas with 5 passage nodes',
        'Route A / Route B selector — Route B default',
        'Emerald route highlighting; red cue-issue indicator at Lobby→Air Vent',
        'Passage Inspector: Suspense, 4/5, identity No, traitor_theme.wav, BT-001',
        'SOURCE EVIDENCE: exact P-003 source quote (no invented line numbers)',
        'Three-lane audio timeline: MUSIC / AMBIENCE / SFX (design fixture values labelled)',
        'Shared Zustand state: selectedRouteId, selectedPassageId, selectedFindingId',
      ]}
      complianceNote="BT-001 must be derived from the backend rule evaluator, not hardcoded in React (PRD.md FR-028). Backend domain engine is classified CONFIRM in COMPLIANCE_MATRIX.md — pending organizer approval."
      icon={GitBranch}
    />
  );
}
