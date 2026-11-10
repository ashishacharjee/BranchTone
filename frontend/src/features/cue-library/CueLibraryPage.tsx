import { Music2 } from 'lucide-react';
import { WorkspacePlaceholder } from '../../components/WorkspacePlaceholder';

export function CueLibraryPage() {
  return (
    <WorkspacePlaceholder
      workspace="Cue Library"
      description="Audio asset table (Music/Ambience/SFX/Voice filter), measured metadata, waveform preview from decoded bytes, cue editor. Missing assets remain visibly missing — no fabricated waveform or playback claim."
      pendingSlice={4}
      pendingItems={[
        'Asset table: traitor_theme.wav shown as missing (no audio bytes)',
        'Layer filter: Music / Ambience / SFX / Voice',
        'Measured metadata: duration, sample rate, channels — null until uploaded',
        'Waveform: derived from decoded bytes only; "No audio loaded" state when absent',
        'Cue editor: trigger, required facts, stop policy, fades, loop, overlap',
        'Upload button (asset upload confirmed CONFIRM — pending organizer classification)',
      ]}
      complianceNote="Audio upload backend and waveform computation are CONFIRM items per COMPLIANCE_MATRIX.md. The UI upload flow will be visibly disabled until cleared."
      icon={Music2}
    />
  );
}
