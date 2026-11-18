import type { JSX } from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme, type Theme } from './theme-context';

const NEXT_THEME: Record<Theme, Theme> = {
  light: 'dark',
  dark: 'system',
  system: 'light',
};

const LABELS: Record<Theme, string> = {
  light: 'Light theme',
  dark: 'Dark theme',
  system: 'System theme',
};

const ICONS = {
  light: Sun,
  dark: Moon,
  system: Monitor,
} as const;

/** Cycles light → dark → system. The label announces the current theme and the next action. */
export function ThemeToggle(): JSX.Element {
  const { theme, setTheme } = useTheme();
  const Icon = ICONS[theme];
  const next = NEXT_THEME[theme];

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(next)}
      aria-label={`${LABELS[theme]} (switch to ${LABELS[next].toLowerCase()})`}
      title={LABELS[theme]}
    >
      <Icon aria-hidden="true" />
    </Button>
  );
}
