import { Link } from 'react-router-dom';
import { SETTLEMENT_CATEGORY_LABELS, type Settlement } from '../types/settlement';
import { daysUntil, isClosingSoon } from '../lib/deadline';

interface Props {
  settlements: Settlement[];
}

export default function SettlementList({ settlements }: Props) {
  if (settlements.length === 0) {
    return <p className="text-gray-600">No open settlements right now — check back later.</p>;
  }

  return (
    <ul className="space-y-4">
      {settlements.map((s) => {
        const closingSoon = isClosingSoon(s.deadline);
        return (
          <li key={s.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between gap-3">
              <Link to={`/settlements/${s.id}`} className="text-lg font-semibold text-blue-700 hover:underline">
                {s.name}
              </Link>
              {closingSoon && (
                <span className="shrink-0 rounded-full bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-1">
                  Closing in {daysUntil(s.deadline)} day{daysUntil(s.deadline) === 1 ? '' : 's'}
                </span>
              )}
            </div>
            <span className="inline-block mt-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1">
              {SETTLEMENT_CATEGORY_LABELS[s.category]}
            </span>
            <p className="text-gray-700 mt-1">{s.summary}</p>
            <p className="text-sm text-gray-500 mt-2">
              Claim deadline: <time dateTime={s.deadline}>{s.deadline}</time>
            </p>
          </li>
        );
      })}
    </ul>
  );
}
