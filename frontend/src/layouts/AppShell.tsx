/**
 * AppShell — the full-height application frame.
 * Contains: Sidebar (left), Topbar (top), main content area (Outlet).
 * Matches the DESIGN.md §3 desktop shell specification.
 */
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { AppleBackground } from '../components/AppleBackground';
import styles from './AppShell.module.css';

export function AppShell() {
  return (
    <div className={styles.shell}>
      <AppleBackground />
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
  );
}
