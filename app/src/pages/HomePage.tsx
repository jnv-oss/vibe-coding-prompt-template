import Disclaimer from '../components/Disclaimer';
import SettlementList from '../components/SettlementList';
import { getActiveSettlements } from '../data/settlements';

export default function HomePage() {
  const settlements = getActiveSettlements();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Open class action settlements</h1>
      <Disclaimer />
      <SettlementList settlements={settlements} />
    </div>
  );
}
