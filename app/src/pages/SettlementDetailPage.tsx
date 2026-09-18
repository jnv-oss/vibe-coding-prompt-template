import { Link, useNavigate, useParams } from 'react-router-dom';
import Disclaimer from '../components/Disclaimer';
import EligibilityQuestionnaire from '../components/EligibilityQuestionnaire';
import { getSettlementById } from '../data/settlements';

export default function SettlementDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const settlement = id ? getSettlementById(id) : undefined;

  if (!settlement) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <p>Settlement not found.</p>
        <Link to="/" className="text-blue-700 hover:underline">
          Back to all settlements
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <Link to="/" className="text-blue-700 hover:underline">
        &larr; Back to all settlements
      </Link>
      <h1 className="text-2xl font-bold text-gray-900">{settlement.name}</h1>
      <Disclaimer />
      <p className="text-gray-700">{settlement.summary}</p>
      <p className="text-sm text-gray-500">
        Claim deadline: <time dateTime={settlement.deadline}>{settlement.deadline}</time> &middot;{' '}
        <a href={settlement.administratorUrl} target="_blank" rel="noreferrer" className="text-blue-700 hover:underline">
          official settlement site
        </a>
      </p>
      <EligibilityQuestionnaire
        questions={settlement.eligibilityQuestions}
        onEligible={() => navigate(`/settlements/${settlement.id}/claim`, { state: { eligible: true } })}
      />
    </div>
  );
}
