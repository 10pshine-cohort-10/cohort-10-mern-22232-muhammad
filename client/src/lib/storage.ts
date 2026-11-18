/**
 * Safe wrappers around localStorage: private browsing modes or blocked storage
 * can make access throw, and the UI must keep working in that case.
 */
export function readStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeStorage(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Storage unavailable — preference simply won't persist.
  }
}
