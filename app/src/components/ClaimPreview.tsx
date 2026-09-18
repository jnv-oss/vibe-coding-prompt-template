import type { ClaimField } from '../types/settlement';
import { buildClaimSummaryText, downloadClaimSummary } from '../lib/claimSummary';

interface Props {
  settlementId: string;
  settlementName: string;
  fields: ClaimField[];
  values: Record<string, string>;
  administratorUrl: string;
  onBack: () => void;
}

export default function ClaimPreview({
  settlementId,
  settlementName,
  fields,
  values,
  administratorUrl,
  onBack,
}: Props) {
  return (
    <div className="space-y-4">
      <p className="text-gray-700">
        Review the information below. This is a preview only — nothing has been sent anywhere.
      </p>
      <dl className="border border-gray-200 rounded-md divide-y divide-gray-200">
        {fields.map((f) => {
          const value = values[f.id];
          const filled = (value ?? '').trim().length > 0;
          return (
            <div key={f.id} className="flex justify-between px-4 py-2">
              <dt className="text-gray-600">{f.label}</dt>
              <dd className={filled ? 'text-gray-900' : 'text-red-600'}>{filled ? value : 'Missing — please go back'}</dd>
            </div>
          );
        })}
      </dl>
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={onBack} className="px-4 py-2 rounded-md border border-gray-300">
          Back
        </button>
        <button
          type="button"
          onClick={() =>
            downloadClaimSummary(
              settlementId,
              buildClaimSummaryText(settlementName, fields, values, administratorUrl),
            )
          }
          className="px-4 py-2 rounded-md border border-gray-300"
        >
          Download claim summary
        </button>
        <a
          href={administratorUrl}
          target="_blank"
          rel="noreferrer"
          className="px-4 py-2 rounded-md bg-blue-700 text-white font-medium"
        >
          Go submit on the official site
        </a>
      </div>
    </div>
  );
}
