import { FileBarChart } from 'lucide-react';
import { WorkspacePlaceholder } from '../../components/WorkspacePlaceholder';

export function ReportsPage() {
  return (
    <WorkspacePlaceholder
      workspace="Reports"
      description="Validation run summary: project/version/run IDs, exploration scope/status, state/route counts, rules executed, findings/passes/warnings and JSON export. No invented percentages or quality scores."
      pendingSlice={4}
      pendingItems={[
        'Run selector and project/version header',
        'Exploration status: exhaustive / bounded / incomplete (never false)',
        'State and route count from actual run records',
        'Rules executed list with finding counts per rule',
        'Findings table with severity breakdown',
        'JSON export (MVP); CSV optional',
        'Coverage: "Not evaluated" until real run exists',
      ]}
      complianceNote="Report generation is CONFIRM per COMPLIANCE_MATRIX.md. Fixture run data can be displayed in Slice 4; live report generation requires organizer approval."
      icon={FileBarChart}
    />
  );
}
