// Deliberate, narrow exception to "never persist form data" (see AGENTS.md
// Gotchas): only these reusable identity/contact fields can be saved, only
// on this device, and only when the user explicitly opts in via the
// "remember my info" checkbox in ClaimForm. Settlement-specific identifiers
// (notice IDs, VINs, class member IDs, ...) are never part of this — they
// belong to one settlement's notice, not to a reusable profile.
export const SAVED_PROFILE_FIELDS = ['fullName', 'email', 'mailingAddress'] as const;
export type SavedProfileField = (typeof SAVED_PROFILE_FIELDS)[number];
export type SavedProfile = Partial<Record<SavedProfileField, string>>;

const STORAGE_KEY = 'claimfinder:savedProfile:v1';

export function loadSavedProfile(): SavedProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return {};
    const profile: SavedProfile = {};
    for (const field of SAVED_PROFILE_FIELDS) {
      const value = (parsed as Record<string, unknown>)[field];
      if (typeof value === 'string') profile[field] = value;
    }
    return profile;
  } catch {
    // Private browsing, storage disabled, or corrupted data — treat as empty.
    return {};
  }
}

export function saveProfile(values: Record<string, string>): void {
  const profile: SavedProfile = {};
  for (const field of SAVED_PROFILE_FIELDS) {
    if (values[field]) profile[field] = values[field];
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // Storage unavailable — saving is best-effort, never blocks the claim flow.
  }
}

export function clearSavedProfile(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to do if storage isn't available.
  }
}

export function hasSavedProfile(): boolean {
  return Object.keys(loadSavedProfile()).length > 0;
}
