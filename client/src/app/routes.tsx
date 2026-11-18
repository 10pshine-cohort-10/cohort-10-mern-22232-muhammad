import type { RouteObject } from 'react-router';
import { AuthComingSoonPage } from '@/features/auth/AuthComingSoonPage';
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
      // Placeholders until the authentication feature replaces them with real forms.
      { path: 'login', element: <AuthComingSoonPage title="Log in" /> },
      { path: 'signup', element: <AuthComingSoonPage title="Create your account" /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
];
