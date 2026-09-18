import { useState } from 'react';
import type { ClaimField } from '../types/settlement';

interface Props {
  fields: ClaimField[];
  onSubmit: (values: Record<string, string>) => void;
}

export default function ClaimForm({ fields, onSubmit }: Props) {
  const [values, setValues] = useState<Record<string, string>>({});

  const requiredFieldsFilled = fields
    .filter((f) => !f.optional)
    .every((f) => (values[f.id] ?? '').trim().length > 0);

  function setField(id: string, value: string) {
    setValues((prev) => ({ ...prev, [id]: value }));
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(values);
      }}
    >
      {fields.map((f) => (
        <label key={f.id} className="block">
          <span className="text-gray-900 font-medium">
            {f.label}
            {f.optional ? <span className="text-gray-400 font-normal"> (optional)</span> : null}
          </span>
          <input
            type={f.type === 'date' ? 'date' : f.type}
            value={values[f.id] ?? ''}
            onChange={(e) => setField(f.id, e.target.value)}
            required={!f.optional}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </label>
      ))}
      <button
        type="submit"
        disabled={!requiredFieldsFilled}
        className="px-5 py-2 rounded-md bg-blue-700 text-white font-medium disabled:bg-gray-300 disabled:text-gray-500"
      >
        Preview my claim
      </button>
    </form>
  );
}
