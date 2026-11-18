import '@testing-library/jest-dom';

// jsdom lacks matchMedia, which the theme provider relies on — provide a controllable fake.
type Listener = (event: MediaQueryListEvent) => void;

export interface MatchMediaController {
  setDark: (dark: boolean) => void;
}

const listeners = new Set<Listener>();
let prefersDark = false;

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  configurable: true,
  value: (query: string): MediaQueryList =>
    ({
      get matches() {
        return query.includes('dark') ? prefersDark : false;
      },
      media: query,
      onchange: null,
      addEventListener: (_type: string, listener: Listener) => listeners.add(listener),
      removeEventListener: (_type: string, listener: Listener) => listeners.delete(listener),
      addListener: (listener: Listener) => listeners.add(listener),
      removeListener: (listener: Listener) => listeners.delete(listener),
      dispatchEvent: () => true,
    }) as unknown as MediaQueryList,
});

/** Lets tests simulate the OS switching between light and dark mode. */
export const matchMediaController: MatchMediaController = {
  setDark(dark: boolean) {
    prefersDark = dark;
    listeners.forEach((listener) => listener({ matches: dark } as MediaQueryListEvent));
  },
};

beforeEach(() => {
  prefersDark = false;
  window.localStorage.clear();
  document.documentElement.classList.remove('dark');
});
