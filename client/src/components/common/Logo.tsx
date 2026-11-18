import type { JSX } from 'react';
import { Link } from 'react-router';
import { cn } from '@/lib/cn';

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps): JSX.Element {
  return (
    <Link
      to="/"
      className={cn(
        'inline-flex items-center gap-2 rounded-md font-semibold tracking-tight',
        className,
      )}
      aria-label="NoteFlow home"
    >
      <svg viewBox="0 0 32 32" className="size-7" aria-hidden="true">
        <rect width="32" height="32" rx="8" className="fill-primary" />
        <path
          d="M10 9h8l4 4v10a1 1 0 0 1-1 1H10a1 1 0 0 1-1-1V10a1 1 0 0 1 1-1z"
          className="fill-primary-foreground"
        />
        <path
          d="M12.5 16h7M12.5 19.5h5"
          className="stroke-primary"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
      <span className="text-lg">NoteFlow</span>
    </Link>
  );
}
