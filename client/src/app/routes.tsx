import type { RouteObject } from 'react-router';
import { NotFoundPage } from '@/features/errors/NotFoundPage';
import { RouteErrorPage } from '@/features/errors/RouteErrorPage';
import { LandingPage } from '@/features/landing/LandingPage';
import { PublicLayout } from './layouts/PublicLayout';

/** Route table, kept separate from the router instance so tests can mount it in memory. */
export const routes: RouteObject[] = [
  {
    element: <PublicLayout />,
    errorElement: <RouteErrorPage />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
];
