import { cn } from './cn';

describe('cn', () => {
  it('joins truthy class names and drops falsy ones', () => {
    const isActive = false;
    expect(cn('a', isActive && 'b', undefined, null, 'c')).toBe('a c');
  });

  it('lets later Tailwind utilities override conflicting earlier ones', () => {
    expect(cn('px-2 py-1 text-sm', 'px-4')).toBe('py-1 text-sm px-4');
  });
});
