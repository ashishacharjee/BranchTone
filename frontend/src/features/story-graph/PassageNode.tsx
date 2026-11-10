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
  const isIssue = passage.issueCount > 0;

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

/**
 * Procedural SVG thumbnails recreating the mood of the master UI screenshot
 */
function NodeThumbnail({ passageId }: { passageId: string }) {
  if (passageId === 'P-001') {
    // Lobby: perspective hallway with ceiling lights
    return (
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
        <rect width="52" height="52" fill="#0A1315" />
        <path d="M0 0L20 18H32L52 0V52L32 34H20L0 52V0Z" fill="#122022" />
        <rect x="22" y="20" width="8" height="12" fill="#1A332C" />
        <line x1="26" y1="0" x2="26" y2="18" stroke="#35D69A" strokeWidth="1.5" strokeOpacity="0.6" />
        <line x1="10" y1="9" x2="16" y2="15" stroke="#35D69A" strokeWidth="1" strokeOpacity="0.3" />
        <line x1="42" y1="9" x2="36" y2="15" stroke="#35D69A" strokeWidth="1" strokeOpacity="0.3" />
      </svg>
    );
  }
  if (passageId === 'P-002') {
    // Archives: tall bookshelves perspective with warm glow
    return (
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
        <rect width="52" height="52" fill="#0E1210" />
        <rect x="4" y="6" width="12" height="40" fill="#1F2820" />
        <rect x="36" y="6" width="12" height="40" fill="#1F2820" />
        <line x1="4" y1="14" x2="16" y2="14" stroke="#D9A65D" strokeOpacity="0.5" strokeWidth="1" />
        <line x1="4" y1="22" x2="16" y2="22" stroke="#D9A65D" strokeOpacity="0.4" strokeWidth="1" />
        <line x1="36" y1="14" x2="48" y2="14" stroke="#D9A65D" strokeOpacity="0.5" strokeWidth="1" />
        <line x1="36" y1="22" x2="48" y2="22" stroke="#D9A65D" strokeOpacity="0.4" strokeWidth="1" />
        <path d="M20 52L24 22H28L32 52H20Z" fill="#142B23" />
      </svg>
    );
  }
  if (passageId === 'P-003') {
    // Air Vent: dark metal ventilation duct, square tunnel receding into dark with subtle red threat
    return (
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
        <rect width="52" height="52" fill="#11080B" />
        <rect x="4" y="4" width="44" height="44" stroke="#421A26" strokeWidth="2" fill="#190F14" />
        <rect x="12" y="12" width="28" height="28" stroke="#68243A" strokeWidth="1.5" fill="#10080B" />
        <rect x="20" y="20" width="12" height="12" stroke="#F04F75" strokeWidth="1" strokeOpacity="0.7" fill="#060204" />
        <line x1="4" y1="4" x2="20" y2="20" stroke="#853C65" strokeWidth="1" />
        <line x1="48" y1="4" x2="32" y2="20" stroke="#853C65" strokeWidth="1" />
        <line x1="4" y1="48" x2="20" y2="32" stroke="#853C65" strokeWidth="1" />
        <line x1="48" y1="48" x2="32" y2="32" stroke="#853C65" strokeWidth="1" />
      </svg>
    );
  }
  if (passageId === 'P-004') {
    // Server Vault: blue/emerald server racks with blinking activity lights
    return (
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
        <rect width="52" height="52" fill="#091216" />
        <rect x="6" y="8" width="14" height="36" fill="#101F26" />
        <rect x="32" y="8" width="14" height="36" fill="#101F26" />
        <circle cx="10" cy="14" r="1.5" fill="#29C98A" />
        <circle cx="14" cy="14" r="1.5" fill="#35D69A" />
        <circle cx="10" cy="22" r="1.5" fill="#29C98A" />
        <circle cx="36" cy="14" r="1.5" fill="#35D69A" />
        <circle cx="40" cy="22" r="1.5" fill="#29C98A" />
        <path d="M22 52L24 20H28L30 52H22Z" fill="#0F2826" />
      </svg>
    );
  }
  // Safe House: interior room with warm light
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
      <rect width="52" height="52" fill="#121510" />
      <path d="M8 44L14 18L38 18L44 44H8Z" fill="#24281E" />
      <rect x="22" y="22" width="8" height="12" fill="#D9A65D" fillOpacity="0.4" />
      <path d="M18 52L26 28L34 52H18Z" fill="#D9A65D" fillOpacity="0.15" />
    </svg>
  );
}
