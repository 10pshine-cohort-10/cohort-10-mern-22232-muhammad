import { Clock } from 'lucide-react';
import type { JSX } from 'react';
import { Link } from 'react-router';
import { buttonVariants } from '@/components/ui/button-variants';

interface AuthComingSoonPageProps {
  title: string;
}

/**
 * Temporary destination for the account links until the authentication feature ships,
 * so visitors see an explicit "not available yet" state instead of a 404.
 */
export function AuthComingSoonPage({ title }: AuthComingSoonPageProps): JSX.Element {
  return (
    <section className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
      <span className="inline-flex size-12 items-center justify-center rounded-full bg-primary-soft text-primary">
        <Clock className="size-6" aria-hidden="true" />
      </span>
      <h1 className="mt-6 text-3xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-4 text-muted-foreground" role="status">
        Accounts are coming in the next release. Until then, take a look around the landing page.
      </p>
      <Link to="/" className={buttonVariants({ variant: 'secondary', className: 'mt-8' })}>
        Back to home
      </Link>
    </section>
  );
}
