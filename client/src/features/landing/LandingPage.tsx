import type { JSX } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { buttonVariants } from '@/components/ui/button-variants';
import { FeatureGrid } from './FeatureGrid';
import { ProductPreview } from './ProductPreview';

export function LandingPage(): JSX.Element {
  return (
    <>
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-40 -z-10 mx-auto h-[28rem] max-w-4xl rounded-full bg-primary/15 blur-3xl"
        />
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-16 text-center sm:px-6 sm:pt-24">
          <p className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="size-1.5 rounded-full bg-success" aria-hidden="true" />
            Private, fast and beautifully simple
          </p>
          <h1 className="mx-auto max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
            Your thoughts, <span className="text-primary">beautifully organized.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-pretty text-muted-foreground">
            NoteFlow is a calm, focused space to capture ideas, plan your work and find anything in
            seconds â€” with rich text, tags, instant search and real-time sync.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/signup" className={buttonVariants({ size: 'lg' })}>
              Start writing â€” itâ€™s free
              <ArrowRight aria-hidden="true" />
            </Link>
            <Link to="/login" className={buttonVariants({ variant: 'secondary', size: 'lg' })}>
              I already have an account
            </Link>
          </div>
        </div>
        <ProductPreview />
      </section>
      <FeatureGrid />
    </>
  );
}
