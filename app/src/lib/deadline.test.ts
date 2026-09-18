import { describe, expect, it } from 'vitest';
import { CLOSING_SOON_DAYS, daysUntil, isClosingSoon } from './deadline';

describe('daysUntil', () => {
  it('returns 0 for a deadline that is today', () => {
    expect(daysUntil('2026-09-18', new Date('2026-09-18'))).toBe(0);
  });

  it('returns a positive count for a future deadline', () => {
    expect(daysUntil('2026-10-02', new Date('2026-09-18'))).toBe(14);
  });

  it('returns a negative count for a deadline that has passed', () => {
    expect(daysUntil('2026-09-01', new Date('2026-09-18'))).toBe(-17);
  });
});

describe('isClosingSoon', () => {
  it('is true right at the threshold', () => {
    const now = new Date('2026-09-18');
    expect(isClosingSoon('2026-10-02', now)).toBe(true); // exactly CLOSING_SOON_DAYS away
    expect(CLOSING_SOON_DAYS).toBe(14);
  });

  it('is false just past the threshold', () => {
    const now = new Date('2026-09-18');
    expect(isClosingSoon('2026-10-03', now)).toBe(false); // 15 days away
  });

  it('is false for an already-expired deadline', () => {
    const now = new Date('2026-09-18');
    expect(isClosingSoon('2026-09-01', now)).toBe(false);
  });

  it('is true for a deadline that is today', () => {
    const now = new Date('2026-09-18');
    expect(isClosingSoon('2026-09-18', now)).toBe(true);
  });
});
