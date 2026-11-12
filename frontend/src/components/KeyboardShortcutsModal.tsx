import { Keyboard, X } from 'lucide-react';
import styles from './KeyboardShortcutsModal.module.css';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  if (!isOpen) return null;

  const shortcuts = [
    {
      section: 'Workspaces',
      items: [
        { label: 'Switch to Overview', keys: ['1'] },
        { label: 'Switch to Story Graph', keys: ['2'] },
        { label: 'Switch to Narrative Map', keys: ['3'] },
        { label: 'Switch to Cue Library', keys: ['4'] },
        { label: 'Switch to Route Lab', keys: ['5'] },
        { label: 'Switch to Validation Centre', keys: ['6'] },
        { label: 'Switch to Reports', keys: ['7'] },
      ],
    },
    {
      section: 'Playback & Traversal',
      items: [
        { label: 'Toggle Route A / Route B', keys: ['R'] },
        { label: 'Audition Route Defect Sound', keys: ['Space'] },
        { label: 'Open 60s Judge Tour', keys: ['T'] },
        { label: 'Toggle Shortcuts Help', keys: ['?'] },
        { label: 'Close Active Modal', keys: ['Esc'] },
      ],
    },
  ];

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="shortcuts-title">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.title}>
            <Keyboard size={18} color="var(--bt-accent)" aria-hidden="true" />
            <h2 id="shortcuts-title" style={{ margin: 0, fontSize: '15px' }}>
              Studio Keyboard Shortcuts
            </h2>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close shortcuts">
            <X size={15} />
          </button>
        </div>

        <div className={styles.body}>
          {shortcuts.map((group) => (
            <div key={group.section} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div className={styles.sectionTitle}>{group.section}</div>
              {group.items.map((item) => (
                <div key={item.label} className={styles.shortcutRow}>
                  <span>{item.label}</span>
                  <div className={styles.keyGroup}>
                    {item.keys.map((k) => (
                      <span key={k} className={styles.keyBadge}>{k}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
