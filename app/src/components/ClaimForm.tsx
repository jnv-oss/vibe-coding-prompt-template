import { useState } from 'react';
import type { ClaimField } from '../types/settlement';
import {
  clearSavedProfile,
  hasSavedProfile,
  loadSavedProfile,
  saveProfile,
  SAVED_PROFILE_FIELDS,
  type SavedProfileField,
} from '../lib/savedProfile';

interface Props {
  fields: ClaimField[];
  onSubmit: (values: Record<string, string>) => void;
}

function isSavedProfileField(id: string): id is SavedProfileField {
  return (SAVED_PROFILE_FIELDS as readonly string[]).includes(id);
}

export default function ClaimForm({ fields, onSubmit }: Props) {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const saved = loadSavedProfile();
    const initial: Record<string, string> = {};
    for (const f of fields) {
      if (isSavedProfileField(f.id) && saved[f.id]) initial[f.id] = saved[f.id]!;
    }
    return initial;
  });
  const [remember, setRemember] = useState(hasSavedProfile());
  const [savedProfileExists, setSavedProfileExists] = useState(hasSavedProfile());

  const requiredFieldsFilled = fields
    .filter((f) => !f.optional)
    .every((f) => (values[f.id] ?? '').trim().length > 0);

  function setField(id: string, value: string) {
    setValues((prev) => ({ ...prev, [id]: value }));
  }

  function handleClear() {
    clearSavedProfile();
    setSavedProfileExists(false);
    setRemember(false);
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (remember) saveProfile(values);
        else clearSavedProfile();
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

      <div className="border border-gray-200 rounded-md p-4 space-y-2">
        <label className="flex items-start gap-2">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="mt-1"
          />
          <span className="text-sm text-gray-700">
            Remember my name, email, and mailing address on this device for next time. Only stored in
            this browser, never sent anywhere — don't check this on a public or shared computer.
          </span>
        </label>
        {savedProfileExists && (
          <button
            type="button"
            onClick={handleClear}
            className="text-sm text-red-700 hover:underline"
          >
            Clear saved info from this device
          </button>
        )}
      </div>

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
