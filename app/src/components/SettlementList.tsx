import { Link } from 'react-router-dom';
import type { Settlement } from '../types/settlement';

interface Props {
  settlements: Settlement[];
}

export default function SettlementList({ settlements }: Props) {
  if (settlements.length === 0) {
    return <p className="text-gray-600">No open settlements right now — check back later.</p>;
  }

  return (
    <ul className="space-y-4">
      {settlements.map((s) => (
        <li key={s.id} className="border border-gray-200 rounded-lg p-4">
          <Link to={`/settlements/${s.id}`} className="text-lg font-semibold text-blue-700 hover:underline">
            {s.name}
          </Link>
          <p className="text-gray-700 mt-1">{s.summary}</p>
          <p className="text-sm text-gray-500 mt-2">
            Claim deadline: <time dateTime={s.deadline}>{s.deadline}</time>
          </p>
        </li>
      ))}
    </ul>
  );
}
