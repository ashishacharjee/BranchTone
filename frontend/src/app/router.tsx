/**
 * BranchTone application router.
 * Seven independent workspace routes inside one shared AppShell.
 * (PRD.md §3 — each workspace is an independent route in the shared shell)
 */
import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from '../layouts/AppShell';
import { OverviewPage } from '../features/overview/OverviewPage';
import { StoryGraphPage } from '../features/story-graph/StoryGraphPage';
import { NarrativeMapPage } from '../features/narrative-map/NarrativeMapPage';
import { CueLibraryPage } from '../features/cue-library/CueLibraryPage';
import { RouteLabPage } from '../features/route-lab/RouteLabPage';
import { ValidationCentrePage } from '../features/validation-centre/ValidationCentrePage';
import { ReportsPage } from '../features/reports/ReportsPage';
import { MasterStudioShowcase } from '../features/master-studio/MasterStudioShowcase';

export const router = createBrowserRouter(
  [
    {
      path: '/studio',
      element: <MasterStudioShowcase />,
    },
    {
      path: '/',
      element: <AppShell />,
      children: [
        {
          index: true,
          element: <StoryGraphPage />,
        },
        {
          path: 'overview',
          element: <OverviewPage />,
        },
        {
          path: 'story-graph',
          element: <StoryGraphPage />,
        },
        {
          path: 'narrative-map',
          element: <NarrativeMapPage />,
        },
        {
          path: 'cue-library',
          element: <CueLibraryPage />,
        },
        {
          path: 'route-lab',
          element: <RouteLabPage />,
        },
        {
          path: 'validation-centre',
          element: <ValidationCentrePage />,
        },
        {
          path: 'reports',
          element: <ReportsPage />,
        },
      ],
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
    },
  },
);
