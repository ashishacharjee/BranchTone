import { Map } from 'lucide-react';
import { WorkspacePlaceholder } from '../../components/WorkspacePlaceholder';

export function NarrativeMapPage() {
  return (
    <WorkspacePlaceholder
      workspace="Narrative Map"
      description="Route selector, chronological fact/event timeline, approved mood/intensity curve (integer 1–5), reveal/resolution/new-conflict markers and annotation review panel."
      pendingSlice={4}
      pendingItems={[
        'Route selector synced to selectedRouteId',
        'Fact/event timeline ordered by passage sequence',
        'Intensity curve from approved annotations (1–5 integer only)',
        'Identity reveal / mystery resolved / new conflict markers',
        'Annotation review: AI candidate vs. creator-approved, pending vs. approved',
      ]}
      complianceNote="Narrative annotations via AI require LIVE-SPRINT clearance per COMPLIANCE_MATRIX.md. Fixture annotations are displayable in Slice 4."
      icon={Map}
    />
  );
}
