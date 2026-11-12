import { Sparkles, AlertCircle, FileAudio, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from './AskAnythingPopover.module.css';

interface AskAnythingPopoverProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AskAnythingPopover({ isOpen, onClose }: AskAnythingPopoverProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleInspectFinding = () => {
    onClose();
    navigate('/validation-centre');
  };

  const handleInspectCue = () => {
    onClose();
    navigate('/cue-library');
  };

  return (
    <div className={styles.popover} role="dialog" aria-label="Quick Assistant">
      <div className={styles.topRow}>
        <div className={styles.agentInfo}>
          <div className={styles.agentAvatar} aria-hidden="true">
            <Sparkles size={13} />
          </div>
          <span className={styles.agentName}>BranchTone AI</span>
        </div>
        <span className={styles.timeText}>just now</span>
      </div>

      <p className={styles.messageText}>
        Two narrative QA items need attention today. I can move one forward right now.
      </p>

      <div className={styles.itemList}>
        <div className={styles.itemRow} onClick={handleInspectFinding} style={{ cursor: 'pointer' }}>
          <div className={styles.itemLeft}>
            <AlertCircle size={15} color="#EF4444" aria-hidden="true" />
            <span>Route B Air Vent Traitor Theme</span>
          </div>
          <span className={styles.badgeBlocked}>• Blocked</span>
        </div>

        <div className={styles.itemRow} onClick={handleInspectCue} style={{ cursor: 'pointer' }}>
          <div className={styles.itemLeft}>
            <FileAudio size={15} color="#8B5CF6" aria-hidden="true" />
            <span>traitor_theme.wav file</span>
          </div>
          <span className={styles.badgeNeedsApproval}>• Needs upload</span>
        </div>
      </div>

      <button
        type="button"
        className={styles.actionBtn}
        onClick={handleInspectFinding}
      >
        <span>Inspect Route B Finding</span>
        <ArrowRight size={13} style={{ marginLeft: '6px' }} aria-hidden="true" />
      </button>
    </div>
  );
}
