import { LayoutDashboard } from 'lucide-react';
import { WorkspacePlaceholder } from '../../components/WorkspacePlaceholder';

export function OverviewPage() {
  return (
    <WorkspacePlaceholder
      workspace="Overview"
      description="Project summary: version, import state, passage/edge counts, latest validation run, open findings and quick actions. Coverage shows only when calculated from real runs — never invented."
      pendingSlice={2}
      pendingItems={[
        'Project/version card wired to backend API',
        'Compilation status and passage/edge counts (from real run records)',
        'Latest validation run summary',
        'Open findings count and quick links',
        'Coverage: shown only as "Not evaluated" until a real run exists',
      ]}
      icon={LayoutDashboard}
    />
  );
}
