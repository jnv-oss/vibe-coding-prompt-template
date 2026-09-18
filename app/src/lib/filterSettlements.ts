import type { Settlement, SettlementCategory } from '../types/settlement';

export interface SettlementFilters {
  category?: SettlementCategory | 'all';
  query?: string;
}

export function filterSettlements(settlements: Settlement[], filters: SettlementFilters): Settlement[] {
  const category = filters.category ?? 'all';
  const query = (filters.query ?? '').trim().toLowerCase();

  return settlements.filter((s) => {
    if (category !== 'all' && s.category !== category) return false;
    if (query && !s.name.toLowerCase().includes(query) && !s.summary.toLowerCase().includes(query)) {
      return false;
    }
    return true;
  });
}
