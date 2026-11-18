import type { JSX } from 'react';
import { Link } from 'react-router';
import { Logo } from '@/components/common/Logo';
import { buttonVariants } from '@/components/ui/button-variants';
import { ThemeToggle } from '@/features/theme/ThemeToggle';

export function SiteHeader(): JSX.Element {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <nav aria-label="Main" className="flex items-center gap-1 sm:gap-2">
          <ThemeToggle />
          <Link to="/login" className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
            Log in
          </Link>
          <Link to="/signup" className={buttonVariants({ size: 'sm' })}>
            Get started
          </Link>
        </nav>
      </div>
    </header>
  );
}
