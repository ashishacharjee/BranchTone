/**
 * AppShell — Floating studio window matching the video design.
 * Features left icon sidebar dock, top bar, and main workspace canvas.
 */
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { AppleBackground } from '../components/AppleBackground';
import styles from './AppShell.module.css';

export function AppShell() {
  return (
    <div className={styles.shellWrapper}>
      <AppleBackground />
      <div className={styles.shell}>
        <Sidebar />
        <div className={styles.body}>
          <Topbar />
          <main
            id="main-content"
            className={styles.main}
            tabIndex={-1}
            aria-label="Workspace content"
          >
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
