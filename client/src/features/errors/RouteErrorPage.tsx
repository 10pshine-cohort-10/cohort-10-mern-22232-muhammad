import type { JSX } from 'react';
import { isRouteErrorResponse, Link, useRouteError } from 'react-router';
import { buttonVariants } from '@/components/ui/button-variants';

/** Shown by the router when rendering a route throws, instead of a blank screen. */
export function RouteErrorPage(): JSX.Element {
  const error = useRouteError();
  const title = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : 'Something went wrong';

  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col items-center justify-center px-4 text-center">
      <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-4 text-muted-foreground">
        An unexpected error occurred. Please try again — if it keeps happening, refresh the page.
      </p>
      <div className="mt-8 flex gap-3">
        <button
          type="button"
          onClick={() => window.location.reload()}
          className={buttonVariants({ variant: 'secondary' })}
        >
          Refresh
        </button>
        <Link to="/" className={buttonVariants()}>
          Back to home
        </Link>
      </div>
    </main>
  );
}
