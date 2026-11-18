import { render, type RenderResult } from '@testing-library/react';
import { createMemoryRouter, RouterProvider, type RouteObject } from 'react-router';
import { routes as appRoutes } from '@/app/routes';
import { ThemeProvider } from '@/features/theme/ThemeProvider';

interface RenderRouteOptions {
  route?: string;
  routes?: RouteObject[];
}

/** Renders the app's route table (or custom routes) in memory at the given URL, with all providers. */
export function renderRoute({
  route = '/',
  routes = appRoutes,
}: RenderRouteOptions = {}): RenderResult {
  const router = createMemoryRouter(routes, { initialEntries: [route] });
  return render(
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>,
  );
}
