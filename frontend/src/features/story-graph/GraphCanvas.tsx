import { useMemo, useCallback, useState, useRef } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Maximize2, Share2, ZoomIn, Check } from 'lucide-react';
import { PassageNode } from './PassageNode';
import type { Node, Edge, ReactFlowInstance } from '@xyflow/react';
import { getPassages, getStoryEdges, getRoutes, getRoute } from '../../services/fixtures';
import styles from './GraphCanvas.module.css';

interface GraphCanvasProps {
  selectedRouteId: string | null;
  selectedPassageId: string | null;
  onSelectRoute: (routeId: string) => void;
  onSelectPassage: (passageId: string) => void;
}

const nodeTypes = {
  passageNode: PassageNode,
};

// Fixed layout coordinates directly reproducing references/branchtone-master-ui.png topology
const NODE_COORDINATES: Record<string, { x: number; y: number }> = {
  'P-001': { x: 30, y: 155 },
  'P-002': { x: 285, y: 55 },
  'P-003': { x: 285, y: 255 },
  'P-004': { x: 555, y: 155 },
  'P-005': { x: 795, y: 155 },
};

export function GraphCanvas({
  selectedRouteId,
  selectedPassageId,
  onSelectRoute,
  onSelectPassage,
}: GraphCanvasProps) {
  const currentRouteId = selectedRouteId ?? 'route_b';
  const routes = getRoutes();
  const passages = getPassages();
  const edges = getStoryEdges();

  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const activeRoute = getRoute(currentRouteId);
  const activePassageIds = useMemo(
    () => new Set(activeRoute ? activeRoute.passage_path : ['P-001', 'P-003', 'P-004', 'P-005']),
    [activeRoute],
  );

  const handleZoomFit = useCallback(() => {
    if (rfInstance) {
      rfInstance.fitView({ padding: 0.15, duration: 300 });
      setToastMessage('Reset zoom to fit');
      setTimeout(() => setToastMessage(null), 1500);
    }
  }, [rfInstance]);

  const handleToggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      canvasRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }, []);

  const handleShareGraph = useCallback(async () => {
    const url = `${window.location.origin}/story-graph?route=${currentRouteId}&passage=${selectedPassageId ?? 'P-003'}`;
    try {
      await navigator.clipboard.writeText(url);
      setToastMessage('Link copied to clipboard!');
    } catch {
      setToastMessage('Deep-link: ' + url);
    }
    setTimeout(() => setToastMessage(null), 2500);
  }, [currentRouteId, selectedPassageId]);

  // Generate React Flow nodes from fixtures
  const flowNodes: Node[] = useMemo(() => {
    return passages.map((passage) => {
      const coords = NODE_COORDINATES[passage.passage_id] ?? { x: 100, y: 100 };
      const isSelected = passage.passage_id === selectedPassageId;
      const isOnActiveRoute = activePassageIds.has(passage.passage_id);

      return {
        id: passage.passage_id,
        type: 'passageNode',
        position: coords,
        data: {
          passage,
          isSelected,
          isOnActiveRoute,
          onSelect: onSelectPassage,
        },
      };
    });
  }, [passages, selectedPassageId, activePassageIds, onSelectPassage]);

  // Generate React Flow edges with route highlighting and cue issue semantics
  const flowEdges: Edge[] = useMemo(() => {
    return edges.map((e) => {
      const isOnActiveRoute = e.route_ids.includes(currentRouteId);
      const isAirVentIssueEdge = e.edge_id === 'edge_lobby_airvent' && currentRouteId === 'route_b';

      let strokeColor = 'rgba(176, 198, 193, 0.2)';
      let strokeWidth = 1.5;
      let strokeDasharray: string | undefined = undefined;
      let animated = false;

      if (isOnActiveRoute) {
        if (isAirVentIssueEdge) {
          // Red stroke for Lobby -> Air Vent cue activation issue on Route B (NOT a structural error)
          strokeColor = '#F04F75';
          strokeWidth = 2.2;
          animated = true;
        } else {
          // Emerald stroke for valid route transitions
          strokeColor = '#29C98A';
          strokeWidth = 2;
          strokeDasharray = '5 5';
          animated = true;
        }
      }

      return {
        id: e.edge_id,
        source: e.source_passage_id,
        target: e.target_passage_id,
        type: 'default', // Smooth bezier curve
        animated,
        style: {
          stroke: strokeColor,
          strokeWidth,
          strokeDasharray,
          filter: isOnActiveRoute
            ? isAirVentIssueEdge
              ? 'drop-shadow(0 0 8px rgba(240, 79, 117, 0.65))'
              : 'drop-shadow(0 0 8px rgba(3, 195, 123, 0.5))'
            : undefined,
          transition: 'stroke 0.2s ease, stroke-width 0.2s ease, filter 0.2s ease',
        },
      };
    });
  }, [edges, currentRouteId]);

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      onSelectPassage(node.id);
    },
    [onSelectPassage],
  );

  return (
    <div className={styles.canvasWrap} ref={canvasRef} role="region" aria-label="Story graph canvas">
      {/* ── Toast Notification ─────────────────────────────────────── */}
      {toastMessage && (
        <div className={styles.toast} role="status">
          <Check size={13} style={{ display: 'inline', marginRight: '6px' }} aria-hidden="true" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── Top Toolbar ───────────────────────────────────────────── */}
      <div className={styles.toolbar}>
        {/* Route Selector Pills */}
        <div className={styles.routeSelector} role="group" aria-label="Route selector">
          <span className={styles.routeLabel}>Routes:</span>
          {routes.map((r) => {
            const isActive = r.route_id === currentRouteId;
            return (
              <button
                key={r.route_id}
                type="button"
                className={[styles.routePill, isActive ? styles.routePillActive : ''].join(' ')}
                onClick={() => onSelectRoute(r.route_id)}
                aria-pressed={isActive}
                aria-label={`Select ${r.name}`}
              >
                <span className={styles.pillBadge}>{r.route_code}</span>
                <span>{r.name}</span>
              </button>
            );
          })}
        </div>

        {/* Viewport controls (active) */}
        <div className={styles.toolbarActions} role="group" aria-label="Graph viewport actions">
          <button
            type="button"
            className={styles.actionBtn}
            onClick={handleZoomFit}
            title="Reset Zoom / Fit View"
            aria-label="Reset zoom and fit view"
          >
            <ZoomIn size={13} aria-hidden="true" />
            <span>Fit</span>
          </button>
          <button
            type="button"
            className={styles.actionBtn}
            onClick={handleToggleFullscreen}
            title="Toggle fullscreen mode"
            aria-label="Toggle fullscreen"
          >
            <Maximize2 size={13} aria-hidden="true" />
          </button>
          <button
            type="button"
            className={styles.actionBtn}
            onClick={handleShareGraph}
            title="Copy deep-link URL to clipboard"
            aria-label="Share graph"
          >
            <Share2 size={13} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* ── Flow Canvas ────────────────────────────────────────────── */}
      <div className={styles.flowContainer}>
        <ReactFlow
          nodes={flowNodes}
          edges={flowEdges}
          nodeTypes={nodeTypes}
          onNodeClick={handleNodeClick}
          onInit={setRfInstance}
          fitView
          fitViewOptions={{ padding: 0.15 }}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={true}
          panOnDrag={true}
          zoomOnScroll={true}
          minZoom={0.5}
          maxZoom={1.5}
          proOptions={{ hideAttribution: true }}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={24}
            size={1}
            color="rgba(176, 198, 193, 0.08)"
          />
        </ReactFlow>
      </div>

      {/* ── Legend ─────────────────────────────────────────────────── */}
      <div className={styles.legend} aria-label="Graph legend">
        <span className={styles.legendItem}>
          <span className={styles.legendDotValid} aria-hidden="true" />
          Valid
        </span>
        <span className={styles.legendItem}>
          <span className={styles.legendDotIssue} aria-hidden="true" />
          Issue
        </span>
        <span className={styles.legendItem}>
          <span className={styles.legendDashed} aria-hidden="true" />
          Route path
        </span>
      </div>
    </div>
  );
}
