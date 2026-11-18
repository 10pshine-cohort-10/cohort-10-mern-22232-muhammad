import { readStorage, writeStorage } from './storage';

describe('storage helpers', () => {
  it('writes and reads values from localStorage', () => {
    writeStorage('key', 'value');
    expect(readStorage('key')).toBe('value');
  });

  it('returns null for missing keys', () => {
    expect(readStorage('missing')).toBeNull();
  });

  it('never throws when storage is unavailable', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('SecurityError');
    });
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });

    expect(readStorage('key')).toBeNull();
    expect(() => writeStorage('key', 'value')).not.toThrow();
  });
});
