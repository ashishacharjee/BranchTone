/**
 * WorkspacePlaceholder — honest placeholder for unimplemented workspaces.
 * Shows workspace name, purpose and what will be implemented in which slice.
 * Does not claim functionality that does not yet exist.
 */
import type { LucideIcon } from 'lucide-react';
import styles from './WorkspacePlaceholder.module.css';

interface PlaceholderProps {
  workspace: string;
  description: string;
  pendingSlice: number;
  pendingItems: string[];
  complianceNote?: string;
  icon: LucideIcon;
}

export function WorkspacePlaceholder({
  workspace,
  description,
  pendingSlice,
  pendingItems,
  complianceNote,
  icon: Icon,
}: PlaceholderProps) {
  return (
    <div className={styles.container} role="region" aria-label={`${workspace} workspace`}>
      <div className={styles.card}>
        <div className={styles.iconWrap} aria-hidden="true">
          <Icon size={28} />
        </div>
        <h1 className={styles.title}>{workspace}</h1>
        <p className={styles.description}>{description}</p>

        <div className={styles.pending}>
          <span className={styles.pendingLabel}>
            Pending — Slice {pendingSlice.toString()}
          </span>
          <ul className={styles.pendingList} aria-label="Pending features">
            {pendingItems.map((item) => (
              <li key={item} className={styles.pendingItem}>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {complianceNote && (
          <div className={styles.complianceNote} role="note" aria-label="Compliance note">
            <span className={styles.complianceIcon} aria-hidden="true">⚠</span>
            {complianceNote}
          </div>
        )}
      </div>
    </div>
  );
}
