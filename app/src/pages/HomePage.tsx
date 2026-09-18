import { useState } from 'react';
import Disclaimer from '../components/Disclaimer';
import SettlementList from '../components/SettlementList';
import SettlementFilterBar from '../components/SettlementFilterBar';
import { getActiveSettlements } from '../data/settlements';
import { filterSettlements } from '../lib/filterSettlements';
import type { SettlementCategory } from '../types/settlement';

export default function HomePage() {
  const settlements = getActiveSettlements();
  const [category, setCategory] = useState<SettlementCategory | 'all'>('all');
  const [query, setQuery] = useState('');
  const filtered = filterSettlements(settlements, { category, query });

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Open class action settlements</h1>
      <Disclaimer />
      <SettlementFilterBar
        category={category}
        query={query}
        onCategoryChange={setCategory}
        onQueryChange={setQuery}
      />
      {filtered.length === 0 && settlements.length > 0 ? (
        <p className="text-gray-600">No settlements match your filters.</p>
      ) : (
        <SettlementList settlements={filtered} />
      )}
    </div>
  );
}
