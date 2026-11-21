import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Volume2, BarChart2 } from 'lucide-react';
import type { NodeProps } from '@xyflow/react';
import type { PassageDisplayData } from '../../services/fixtures';
import styles from './PassageNode.module.css';

export interface PassageNodeData {
  passage: PassageDisplayData;
  isSelected: boolean;
  isOnActiveRoute: boolean;
  onSelect: (passageId: string) => void;
}

export const PassageNode = memo(function PassageNode({
  data,
}: NodeProps & { data: PassageNodeData }) {
  const { passage, isSelected, isOnActiveRoute, onSelect } = data;
  // An issue is only flagged on this passage if it is on the active route
  // (BT-001 affects Route B only; it must not appear as an issue on Route A)
  const isIssue = isOnActiveRoute && passage.issueCount > 0;

  const nodeClass = [
    styles.node,
    isIssue ? styles.nodeIssue : styles.nodeValid,
    isSelected ? styles.nodeSelected : '',
    !isOnActiveRoute ? styles.nodeInactive : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={nodeClass}
      onClick={() => onSelect(passage.passage_id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(passage.passage_id);
        }
      }}
      aria-label={`${passage.title} ${passage.passage_id}${isIssue ? ', 1 Issue' : ', Valid'}`}
      aria-pressed={isSelected}
    >
      <Handle type="target" position={Position.Left} className={styles.handle} />

      {/* Top right issue badge */}
      {isIssue && (
        <span className={styles.badge} aria-label="1 issue detected">
          !
        </span>
      )}

      {/* Cinematic thumbnail preview */}
      <div className={styles.thumbWrap} aria-hidden="true">
        <NodeThumbnail passageId={passage.passage_id} />
      </div>

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.header}>
          <span className={styles.title}>{passage.title}</span>
          <span className={styles.passageId}>{passage.passage_id}</span>
        </div>

        <div className={styles.metaRow}>
          {passage.intensity !== undefined && passage.intensity !== null && (
            <span className={styles.metaItem} title={`Emotional intensity: ${passage.intensity.toString()}/5`}>
              <BarChart2 size={11} aria-hidden="true" />
              <span className={styles.intensityDotted}>{passage.intensity}/5</span>
            </span>
          )}
          {passage.hasAudio && (
            <span className={styles.metaItem} title="Audio cue bound">
              <Volume2 size={11} aria-hidden="true" />
              <span>Audio</span>
            </span>
          )}
        </div>

        <div className={styles.statusRow}>
          <span
            className={isIssue ? styles.statusDotIssue : styles.statusDotValid}
            aria-hidden="true"
          />
          <span className={isIssue ? styles.statusTextIssue : styles.statusTextValid}>
            {isIssue ? `${passage.issueCount.toString()} Issue` : 'Valid'}
          </span>
        </div>
      </div>

      <Handle type="source" position={Position.Right} className={styles.handle} />
    </div>
  );
});

const THUMB_MAP: Record<string, string> = {
  'P-001': '/thumbnails/p001_lobby.jpg',
  'P-002': '/thumbnails/p002_archives.jpg',
  'P-003': '/thumbnails/p003_air_vent.jpg',
  'P-004': '/thumbnails/p004_server_vault.jpg',
  'P-005': '/thumbnails/p005_safe_house.jpg',
};

/**
 * Authentic photographic thumbnails from the approved master reference
 */
function NodeThumbnail({ passageId }: { passageId: string }) {
  const thumbSrc = THUMB_MAP[passageId];
  if (thumbSrc) {
    return (
      <img
        src={thumbSrc}
        alt={`Passage ${passageId}`}
        className={styles.thumbImg}
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
      />
    );
  }
  return null;
}
