import { act, render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { matchMediaController } from '@/test/setup';
import { isTheme, THEME_STORAGE_KEY, useTheme } from './theme-context';
import { ThemeProvider } from './ThemeProvider';
import { ThemeToggle } from './ThemeToggle';

function ThemeProbe() {
  const { theme, resolvedTheme } = useTheme();
  return (
    <p>
      {theme}:{resolvedTheme}
    </p>
  );
}

function renderWithTheme(defaultTheme?: 'light' | 'dark' | 'system') {
  return render(
    <ThemeProvider defaultTheme={defaultTheme}>
      <ThemeToggle />
      <ThemeProbe />
    </ThemeProvider>,
  );
}

describe('ThemeProvider', () => {
  it('follows the OS preference when set to system', () => {
    matchMediaController.setDark(true);
    renderWithTheme();

    expect(screen.getByText('system:dark')).toBeInTheDocument();
    expect(document.documentElement).toHaveClass('dark');
  });

  it('reacts when the OS preference changes', () => {
    renderWithTheme();
    expect(screen.getByText('system:light')).toBeInTheDocument();

    act(() => matchMediaController.setDark(true));

    expect(screen.getByText('system:dark')).toBeInTheDocument();
  });

  it('restores a saved preference from localStorage', () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, 'dark');
    renderWithTheme();

    expect(screen.getByText('dark:dark')).toBeInTheDocument();
  });

  it('ignores invalid saved values', () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, 'purple');
    renderWithTheme('light');

    expect(screen.getByText('light:light')).toBeInTheDocument();
  });

  it('cycles light → dark → system with the toggle and persists the choice', async () => {
    renderWithTheme('light');
    const toggle = () => screen.getByRole('button', { name: /theme/i });

    expect(toggle()).toHaveAccessibleName('Light theme (switch to dark theme)');

    await userEvent.click(toggle());
    expect(screen.getByText('dark:dark')).toBeInTheDocument();
    expect(document.documentElement).toHaveClass('dark');
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');

    await userEvent.click(toggle());
    expect(screen.getByText('system:light')).toBeInTheDocument();
    expect(document.documentElement).not.toHaveClass('dark');

    await userEvent.click(toggle());
    expect(screen.getByText('light:light')).toBeInTheDocument();
  });

  it('useTheme throws a helpful error outside the provider', () => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() => renderHook(() => useTheme())).toThrow(/inside <ThemeProvider>/);
  });

  it('isTheme validates values', () => {
    expect(isTheme('light')).toBe(true);
    expect(isTheme('system')).toBe(true);
    expect(isTheme('blue')).toBe(false);
    expect(isTheme(null)).toBe(false);
  });
});
