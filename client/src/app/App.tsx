import { createBrowserRouter, RouterProvider } from 'react-router';
import { ThemeProvider } from '@/features/theme/ThemeProvider';
import { routes } from './routes';

const router = createBrowserRouter(routes);

export function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
