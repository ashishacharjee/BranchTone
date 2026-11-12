import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkspaceStore } from '../stores/workspace';
import { playAuditionTone, playCueTriggerSound } from '../services/synth';

interface UseKeyboardShortcutsOptions {
  onOpenTour?: () => void;
  onOpenShortcuts?: () => void;
  onCloseModals?: () => void;
}

export function useKeyboardShortcuts({
  onOpenTour,
  onOpenShortcuts,
  onCloseModals,
}: UseKeyboardShortcutsOptions = {}) {
  const navigate = useNavigate();
  const selectedRouteId = useWorkspaceStore((s) => s.selectedRouteId);
  const setSelectedRoute = useWorkspaceStore((s) => s.setSelectedRoute);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Ignore if user is typing inside an input or textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      if (e.key === 'Escape') {
        onCloseModals?.();
        return;
      }

      if (e.key === '1') {
        e.preventDefault();
        navigate('/');
      } else if (e.key === '2') {
        e.preventDefault();
        navigate('/story-graph');
      } else if (e.key === '3') {
        e.preventDefault();
        navigate('/narrative-map');
      } else if (e.key === '4') {
        e.preventDefault();
        navigate('/cue-library');
      } else if (e.key === '5') {
        e.preventDefault();
        navigate('/route-lab');
      } else if (e.key === '6') {
        e.preventDefault();
        navigate('/validation-centre');
      } else if (e.key === '7') {
        e.preventDefault();
        navigate('/reports');
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        const nextRoute = selectedRouteId === 'route_b' ? 'route_a' : 'route_b';
        setSelectedRoute(nextRoute);
      } else if (e.key === ' ') {
        e.preventDefault();
        playAuditionTone(440, 0.18);
        setTimeout(() => {
          playCueTriggerSound(selectedRouteId === 'route_b');
        }, 220);
      } else if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        onOpenTour?.();
      } else if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        onOpenShortcuts?.();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, selectedRouteId, setSelectedRoute, onOpenTour, onOpenShortcuts, onCloseModals]);
}
