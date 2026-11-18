import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FEATURES } from '@/features/landing/features';
import { RouteErrorPage } from '@/features/errors/RouteErrorPage';
import { renderRoute } from '@/test/render';

describe('app routes', () => {
  it('renders the landing page at /', () => {
    renderRoute({ route: '/' });

    expect(
      screen.getByRole('heading', { level: 1, name: /your thoughts, beautifully organized/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /start writing/i })).toHaveAttribute('href', '/signup');
    expect(screen.getByRole('link', { name: /already have an account/i })).toHaveAttribute(
      'href',
      '/login',
    );
  });

  it('lists every product feature', () => {
    renderRoute();

    for (const feature of FEATURES) {
      expect(screen.getByRole('heading', { level: 3, name: feature.title })).toBeInTheDocument();
    }
  });

  it('shows header navigation, skip link and footer', () => {
    renderRoute();

    expect(screen.getByRole('link', { name: 'NoteFlow home' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveAttribute('href', '#main');
    expect(screen.getByRole('navigation', { name: 'Main' })).toBeInTheDocument();
    expect(screen.getByText(/built by muhammad saim ayyaz/i)).toBeInTheDocument();
  });

  it('renders the 404 page for unknown URLs and links back home', async () => {
    renderRoute({ route: '/does/not/exist' });

    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument();

    await userEvent.click(screen.getByRole('link', { name: 'Back to home' }));

    expect(screen.getByRole('heading', { level: 1, name: /your thoughts/i })).toBeInTheDocument();
  });

  it('shows the error page when a route crashes', () => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    jest.spyOn(console, 'warn').mockImplementation(() => undefined);

    function Broken(): never {
      throw new Error('render failure');
    }

    renderRoute({
      routes: [{ path: '/', element: <Broken />, errorElement: <RouteErrorPage /> }],
    });

    expect(screen.getByRole('heading', { name: 'Something went wrong' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Refresh' })).toBeInTheDocument();
  });

  it('shows status details for route error responses', () => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    jest.spyOn(console, 'warn').mockImplementation(() => undefined);

    renderRoute({
      routes: [
        {
          path: '/',
          loader: () => {
            // React Router's convention: loaders throw a Response to signal an HTTP error.
            // eslint-disable-next-line @typescript-eslint/only-throw-error
            throw new Response(null, { status: 503, statusText: 'Service Unavailable' });
          },
          element: <p>never shown</p>,
          errorElement: <RouteErrorPage />,
        },
      ],
    });

    return screen
      .findByRole('heading', { name: '503 Service Unavailable' })
      .then((heading) => expect(heading).toBeInTheDocument());
  });
});
