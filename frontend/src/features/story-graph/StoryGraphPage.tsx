import { useCallback, useMemo } from 'react';
import { useWorkspaceStore } from '../../stores/workspace';
import { getPassage } from '../../services/fixtures';
import type { PassageDisplayData } from '../../services/fixtures';
import { GraphCanvas } from './GraphCanvas';
import { PassageInspector } from './PassageInspector';
import { AudioTimeline } from './AudioTimeline';
import styles from './StoryGraphPage.module.css';

export function StoryGraphPage() {
  const loadedStoryIR = useWorkspaceStore((state) => state.loadedStoryIR);
  const selectedRouteId = useWorkspaceStore((state) => state.selectedRouteId);
  const selectedPassageId = useWorkspaceStore((state) => state.selectedPassageId);
  const setSelectedRoute = useWorkspaceStore((state) => state.setSelectedRoute);
  const setSelectedPassage = useWorkspaceStore((state) => state.setSelectedPassage);

  // Look up selected passage data from loaded custom story or demonstration fixtures
  const currentPassage: PassageDisplayData | undefined = useMemo(() => {
    if (loadedStoryIR) {
      const p = loadedStoryIR.passages.find((x) => x.passage_id === selectedPassageId) ?? loadedStoryIR.passages[0];
      if (!p) return undefined;
      return {
        ...p,
        hasAudio: false,
        issueCount: 0,
        mood: 'neutral',
        intensity: 2,
        identity_revealed_at_entry: false,
      };
    }
    return selectedPassageId ? getPassage(selectedPassageId) : undefined;
  }, [loadedStoryIR, selectedPassageId]);

  const handleSelectRoute = useCallback(
    (routeId: string) => {
      setSelectedRoute(routeId);
    },
    [setSelectedRoute],
  );

  const handleSelectPassage = useCallback(
    (passageId: string) => {
      setSelectedPassage(passageId);
    },
    [setSelectedPassage],
  );

  const handleCloseInspector = useCallback(() => {
    setSelectedPassage(null);
  }, [setSelectedPassage]);

  const handleSelectCueMarker = useCallback(() => {
    setSelectedPassage('P-003');
  }, [setSelectedPassage]);

  return (
    <div className={styles.container} data-testid="story-graph-workspace">
      {/* ── Main Graph + Inspector Body ───────────────────────────── */}
      <div className={styles.workspaceBody}>
        <div className={styles.graphArea}>
          <GraphCanvas
            selectedRouteId={selectedRouteId}
            selectedPassageId={selectedPassageId}
            onSelectRoute={handleSelectRoute}
            onSelectPassage={handleSelectPassage}
          />
        </div>

        <PassageInspector
          passage={currentPassage}
          selectedRouteId={selectedRouteId}
          onClose={handleCloseInspector}
        />
      </div>

      {/* ── Bottom Audio Timeline ─────────────────────────────────── */}
      <AudioTimeline
        selectedRouteId={selectedRouteId}
        selectedPassageId={selectedPassageId}
        onSelectPassage={handleSelectPassage}
        onSelectCueMarker={handleSelectCueMarker}
      />
    </div>
  );
}
