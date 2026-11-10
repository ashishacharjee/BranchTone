import { FlaskConical } from 'lucide-react';
import { WorkspacePlaceholder } from '../../components/WorkspacePlaceholder';

export function RouteLabPage() {
  return (
    <WorkspacePlaceholder
      workspace="Route Lab"
      description="Route sequence, passage/fact state snapshots, cue activation trace, multitrack playback and seek when assets exist. Transport is disabled without loaded audio."
      pendingSlice={4}
      pendingItems={[
        'Route sequence: Lobby → Air Vent → Server Vault → Safe House (Route B)',
        'Passage state snapshots: facts before/after entry per RouteTraceStep',
        'Cue activation trace: trigger_fired, asset_available, timing_provenance',
        'Transport controls: disabled until audio assets are loaded',
        'Volume, seek and layer controls synced to audio timeline',
        'Before/after compare: stub — not yet scoped',
      ]}
      complianceNote="Route/state simulation is CONFIRM per COMPLIANCE_MATRIX.md. Fixture trace data can be shown in Slice 4; live simulation requires organizer approval."
      icon={FlaskConical}
    />
  );
}
