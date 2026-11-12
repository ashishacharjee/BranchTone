/**
 * Sidebar — left navigation panel (~220px).
 * Implements: BranchTone mark, workspace label, project card, 7 nav links, status.
 * Visual source: DESIGN.md §3 and references/branchtone-master-ui.png.
 */
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  GitBranch,
  Map,
  Music2,
  FlaskConical,
  ShieldCheck,
  FileBarChart,
  Activity,
} from 'lucide-react';
import styles from './Sidebar.module.css';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  workspaceId: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    path: '/overview',
    label: 'Overview',
    icon: <LayoutDashboard size={16} aria-hidden="true" />,
    workspaceId: 'overview',
  },
  {
    path: '/story-graph',
    label: 'Story Graph',
    icon: <GitBranch size={16} aria-hidden="true" />,
    workspaceId: 'story-graph',
  },
  {
    path: '/narrative-map',
    label: 'Narrative Map',
    icon: <Map size={16} aria-hidden="true" />,
    workspaceId: 'narrative-map',
  },
  {
    path: '/cue-library',
    label: 'Cue Library',
    icon: <Music2 size={16} aria-hidden="true" />,
    workspaceId: 'cue-library',
  },
  {
    path: '/route-lab',
    label: 'Route Lab',
    icon: <FlaskConical size={16} aria-hidden="true" />,
    workspaceId: 'route-lab',
  },
  {
    path: '/validation-centre',
    label: 'Validation Centre',
    icon: <ShieldCheck size={16} aria-hidden="true" />,
    workspaceId: 'validation-centre',
  },
  {
    path: '/reports',
    label: 'Reports',
    icon: <FileBarChart size={16} aria-hidden="true" />,
    workspaceId: 'reports',
  },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside
      className={styles.sidebar}
      aria-label="Application navigation"
      role="navigation"
    >
      {/* Skip link target */}
      <a href="#main-content" className={styles.skipLink}>
        Skip to main content
      </a>

      {/* ── BranchTone mark + wordmark ──────────────────────────────── */}
      <div className={styles.brand} aria-label="BranchTone">
        <span className={styles.brandIcon} aria-hidden="true">
          <BranchToneMark />
        </span>
        <span className={styles.brandName}>BranchTone</span>
      </div>

      {/* ── Workspace label ─────────────────────────────────────────── */}
      <div className={styles.section}>
        <span className={styles.sectionLabel}>WORKSPACE</span>
        <div className={styles.workspaceSelector} aria-label="Current workspace: Game Development">
          <span className={styles.workspaceName}>Game Development</span>
        </div>
      </div>

      {/* ── Current project card ─────────────────────────────────────── */}
      <div className={styles.section}>
        <span className={styles.sectionLabel}>CURRENT PROJECT</span>
        <button
          type="button"
          className={styles.projectCardBtn}
          onClick={() => navigate('/overview')}
          aria-label="Project: The Last Signal — click to view project overview"
        >
          <div className={styles.projectThumb} aria-hidden="true" />
          <div className={styles.projectInfo}>
            <span className={styles.projectName}>The Last Signal</span>
            <span className={styles.projectMeta}>Interactive Detective Story</span>
            <div className={styles.projectTags}>
              <span className={styles.tag}>Story</span>
              <span className={styles.tagVersion}>v0.4</span>
            </div>
          </div>
        </button>
      </div>

      {/* ── Navigation links ─────────────────────────────────────────── */}
      <nav aria-label="Workspaces" className={styles.nav}>
        <ul role="list" className={styles.navList}>
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive: active }) =>
                    [styles.navLink, active ? styles.navLinkActive : ''].join(' ')
                  }
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span className={styles.navIcon}>{item.icon}</span>
                  <span className={styles.navLabel}>{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ── Status bar ───────────────────────────────────────────────── */}
      <div className={styles.statusBar} role="status" aria-live="polite">
        <Activity size={12} aria-hidden="true" className={styles.statusIcon} />
        <span className={styles.statusText}>Ready</span>
      </div>
    </aside>
  );
}

/** BranchTone audio-waveform mark — SVG, matches screenshot top-left icon */
function BranchToneMark() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Stylised waveform bars — emerald */}
      <rect x="1" y="8" width="2.5" height="6" rx="1.25" fill="#29c98a" />
      <rect x="5" y="4" width="2.5" height="14" rx="1.25" fill="#29c98a" />
      <rect x="9" y="1" width="2.5" height="20" rx="1.25" fill="#29c98a" />
      <rect x="13" y="5" width="2.5" height="12" rx="1.25" fill="#29c98a" />
      <rect x="17" y="9" width="2.5" height="4" rx="1.25" fill="#29c98a" opacity="0.7" />
    </svg>
  );
}
