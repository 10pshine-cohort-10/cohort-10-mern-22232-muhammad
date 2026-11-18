import type { JSX } from 'react';
import { Link } from 'react-router';
import { buttonVariants } from '@/components/ui/button-variants';

export function NotFoundPage(): JSX.Element {
  return (
    <section className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
      <p className="text-sm font-semibold text-primary">404</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-4 text-muted-foreground">
        The page you’re looking for doesn’t exist or has been moved.
      </p>
      <Link to="/" className={buttonVariants({ className: 'mt-8' })}>
        Back to home
      </Link>
    </section>
  );
}
