import { SETTLEMENT_CATEGORY_LABELS, type SettlementCategory } from '../types/settlement';

interface Props {
  category: SettlementCategory | 'all';
  query: string;
  onCategoryChange: (category: SettlementCategory | 'all') => void;
  onQueryChange: (query: string) => void;
}

const CATEGORIES: (SettlementCategory | 'all')[] = ['all', ...(Object.keys(SETTLEMENT_CATEGORY_LABELS) as SettlementCategory[])];

function categoryLabel(category: SettlementCategory | 'all'): string {
  return category === 'all' ? 'All' : SETTLEMENT_CATEGORY_LABELS[category];
}

export default function SettlementFilterBar({ category, query, onCategoryChange, onQueryChange }: Props) {
  return (
    <div className="space-y-3">
      <input
        type="search"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Search settlements by name or keyword"
        aria-label="Search settlements"
        className="block w-full rounded-md border border-gray-300 px-3 py-2"
      />
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={category === c}
            onClick={() => onCategoryChange(c)}
            className={`px-3 py-1.5 rounded-full text-sm border ${
              category === c ? 'bg-blue-700 text-white border-blue-700' : 'border-gray-300 text-gray-700'
            }`}
          >
            {categoryLabel(c)}
          </button>
        ))}
      </div>
    </div>
  );
}
