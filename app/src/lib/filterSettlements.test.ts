import { describe, expect, it } from 'vitest';
import { filterSettlements } from './filterSettlements';
import type { Settlement } from '../types/settlement';

function settlement(overrides: Partial<Settlement>): Settlement {
  return {
    id: 'test',
    name: 'Test Settlement',
    administratorUrl: 'https://example-settlement-administrator.test/',
    deadline: '2099-01-01',
    category: 'data-breach',
    summary: 'A test settlement summary.',
    eligibilityQuestions: [],
    claimFields: [],
    ...overrides,
  };
}

const breach = settlement({ id: 'breach', name: 'Acme Data Breach Settlement', category: 'data-breach' });
const antitrust = settlement({
  id: 'antitrust',
  name: 'Acme Antitrust Settlement',
  category: 'antitrust',
  summary: 'Resolves claims about repair monopoly pricing.',
});
const all = [breach, antitrust];

describe('filterSettlements', () => {
  it('returns everything when no filters are set', () => {
    expect(filterSettlements(all, {})).toEqual(all);
  });

  it('returns everything for category "all"', () => {
    expect(filterSettlements(all, { category: 'all' })).toEqual(all);
  });

  it('filters by category', () => {
    expect(filterSettlements(all, { category: 'antitrust' })).toEqual([antitrust]);
  });

  it('filters by a case-insensitive query matching the name', () => {
    expect(filterSettlements(all, { query: 'ACME DATA' })).toEqual([breach]);
  });

  it('filters by a query matching the summary', () => {
    expect(filterSettlements(all, { query: 'repair monopoly' })).toEqual([antitrust]);
  });

  it('combines category and query filters', () => {
    expect(filterSettlements(all, { category: 'data-breach', query: 'antitrust' })).toEqual([]);
  });

  it('returns an empty array when nothing matches', () => {
    expect(filterSettlements(all, { query: 'nonexistent keyword' })).toEqual([]);
  });
});
