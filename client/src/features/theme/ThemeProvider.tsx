import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { readStorage, writeStorage } from '@/lib/storage';
import {
  isTheme,
  THEME_STORAGE_KEY,
  ThemeContext,
  type ResolvedTheme,
  type Theme,
  type ThemeContextValue,
} from './theme-context';

const DARK_QUERY = '(prefers-color-scheme: dark)';

function getSystemTheme(): ResolvedTheme {
  return window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light';
}

function getInitialTheme(defaultTheme: Theme): Theme {
  const stored = readStorage(THEME_STORAGE_KEY);
  return isTheme(stored) ? stored : defaultTheme;
}

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
}

/** Stores the theme preference, follows the OS setting when set to `system`, and toggles `<html class="dark">`. */
export function ThemeProvider({ children, defaultTheme = 'system' }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => getInitialTheme(defaultTheme));
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(getSystemTheme);

  useEffect(() => {
    const media = window.matchMedia(DARK_QUERY);
    const handleChange = (event: MediaQueryListEvent) =>
      setSystemTheme(event.matches ? 'dark' : 'light');
    media.addEventListener('change', handleChange);
    return () => media.removeEventListener('change', handleChange);
  }, []);

  const resolvedTheme: ResolvedTheme = theme === 'system' ? systemTheme : theme;

  useEffect(() => {
    document.documentElement.classList.toggle('dark', resolvedTheme === 'dark');
  }, [resolvedTheme]);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    writeStorage(THEME_STORAGE_KEY, next);
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
