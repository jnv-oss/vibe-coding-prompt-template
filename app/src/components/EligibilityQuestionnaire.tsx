import { useState } from 'react';
import type { EligibilityQuestion } from '../types/settlement';

type Answer = 'yes' | 'no';

interface Props {
  questions: EligibilityQuestion[];
  onEligible: () => void;
}

export default function EligibilityQuestionnaire({ questions, onEligible }: Props) {
  const [answers, setAnswers] = useState<Record<string, Answer>>({});

  const disqualified = questions.some((q) => q.required && answers[q.id] === 'no');
  const allAnswered = questions.every((q) => answers[q.id] !== undefined);
  const canContinue = allAnswered && !disqualified;

  function answer(id: string, value: Answer) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }

  if (disqualified) {
    return (
      <div className="border border-red-300 bg-red-50 text-red-900 rounded-md p-4">
        <p className="font-medium">Based on your answers, you don't appear to be eligible for this settlement.</p>
        <p className="text-sm mt-1">
          If you believe this is incorrect, visit the settlement's official site directly to check current
          eligibility rules.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {questions.map((q) => (
        <fieldset key={q.id} className="border border-gray-200 rounded-md p-4">
          <legend className="font-medium text-gray-900">{q.text}</legend>
          <div className="flex gap-3 mt-2">
            <button
              type="button"
              aria-pressed={answers[q.id] === 'yes'}
              onClick={() => answer(q.id, 'yes')}
              className={`px-4 py-1.5 rounded-md border ${
                answers[q.id] === 'yes' ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300'
              }`}
            >
              Yes
            </button>
            <button
              type="button"
              aria-pressed={answers[q.id] === 'no'}
              onClick={() => answer(q.id, 'no')}
              className={`px-4 py-1.5 rounded-md border ${
                answers[q.id] === 'no' ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300'
              }`}
            >
              No
            </button>
          </div>
        </fieldset>
      ))}
      <button
        type="button"
        disabled={!canContinue}
        onClick={onEligible}
        className="px-5 py-2 rounded-md bg-blue-700 text-white font-medium disabled:bg-gray-300 disabled:text-gray-500"
      >
        Continue to claim form
      </button>
    </div>
  );
}
