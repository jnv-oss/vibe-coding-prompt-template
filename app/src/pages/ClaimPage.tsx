import { useState } from 'react';
import { Link, Navigate, useLocation, useParams } from 'react-router-dom';
import Disclaimer from '../components/Disclaimer';
import ClaimForm from '../components/ClaimForm';
import ClaimPreview from '../components/ClaimPreview';
import { getSettlementById } from '../data/settlements';

export default function ClaimPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const settlement = id ? getSettlementById(id) : undefined;
  const [values, setValues] = useState<Record<string, string> | null>(null);

  if (!settlement) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <p>Settlement not found.</p>
        <Link to="/">Back to all settlements</Link>
      </div>
    );
  }

  // Guards against reaching the claim form without passing the eligibility
  // gate on the detail page (e.g. a direct link) — never skip the check.
  const eligible = (location.state as { eligible?: boolean } | null)?.eligible === true;
  if (!eligible) {
    return <Navigate to={`/settlements/${settlement.id}`} replace />;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <Link to={`/settlements/${settlement.id}`} className="text-blue-700 hover:underline">
        &larr; Back to {settlement.name}
      </Link>
      <h1 className="text-2xl font-bold text-gray-900">Claim form preview</h1>
      <Disclaimer />
      {values === null ? (
        <ClaimForm fields={settlement.claimFields} onSubmit={setValues} />
      ) : (
        <ClaimPreview
          settlementId={settlement.id}
          settlementName={settlement.name}
          fields={settlement.claimFields}
          values={values}
          administratorUrl={settlement.administratorUrl}
          onBack={() => setValues(null)}
        />
      )}
    </div>
  );
}
