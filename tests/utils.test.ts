import { describe, expect, it } from 'vitest';
import { cn } from '@/lib/utils';

describe('cn', () => {
  it('joins truthy class names', () => {
    expect(cn('px-2', false && 'hidden', 'font-bold')).toBe('px-2 font-bold');
  });

  it('lets the last conflicting Tailwind class win', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
  });
});
