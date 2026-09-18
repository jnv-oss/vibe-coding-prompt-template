import { describe, expect, it } from 'vitest';
import { getActiveSettlements, getSettlementById } from './index';

describe('getActiveSettlements', () => {
  it('filters out settlements whose deadline has passed', () => {
    const now = new Date('2026-09-18');
    const active = getActiveSettlements(now);

    expect(active.some((s) => s.id === 'comcast-xfinity-data-breach-settlement-2026')).toBe(false);
    expect(active.length).toBeGreaterThanOrEqual(3);
  });

  it('sorts active settlements by soonest deadline first', () => {
    const now = new Date('2026-09-18');
    const active = getActiveSettlements(now);
    const deadlines = active.map((s) => s.deadline);
    const sorted = [...deadlines].sort();
    expect(deadlines).toEqual(sorted);
  });
});

describe('getSettlementById', () => {
  it('returns undefined for an unknown id', () => {
    expect(getSettlementById('does-not-exist')).toBeUndefined();
  });

  it('returns the matching settlement for a known id', () => {
    expect(getSettlementById('landsend-data-breach-settlement-2026')?.name).toContain("Lands' End");
  });
});
