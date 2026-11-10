import { ShieldCheck } from 'lucide-react';
import { WorkspacePlaceholder } from '../../components/WorkspacePlaceholder';

export function ValidationCentrePage() {
  return (
    <WorkspacePlaceholder
      workspace="Validation Centre"
      description="Rule/severity/status filters, findings table, detail panel with source evidence and route trace, deep-link navigation and finding lifecycle actions. Counts derive from actual run records only."
      pendingSlice={4}
      pendingItems={[
        'Findings table: rule, severity, status, passage, route columns',
        'Rule filter: RULE_REVEAL_PROTECTION, RULE_REQUIRED_CUE_COVERAGE, etc.',
        'Severity / status filter chips with live counts',
        'Detail panel: source quote, route trace, suggested action',
        'Deep-link: clicking a finding sets selectedRouteId, selectedPassageId, selectedFindingId',
        'Lifecycle actions: Mark Resolved, Accept Risk, Mark False Positive',
        'BT-001 displayed from backend finding record (not hardcoded in React)',
      ]}
      complianceNote="Deterministic validation rules are CONFIRM per COMPLIANCE_MATRIX.md. Fixture finding BT-001 can be displayed in Slice 4; live rule evaluation requires organizer approval."
      icon={ShieldCheck}
    />
  );
}
