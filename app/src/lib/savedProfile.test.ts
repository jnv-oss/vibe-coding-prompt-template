import { beforeEach, describe, expect, it } from 'vitest';
import { clearSavedProfile, hasSavedProfile, loadSavedProfile, saveProfile } from './savedProfile';

beforeEach(() => {
  localStorage.clear();
});

describe('saveProfile / loadSavedProfile', () => {
  it('returns an empty profile when nothing has been saved', () => {
    expect(loadSavedProfile()).toEqual({});
    expect(hasSavedProfile()).toBe(false);
  });

  it('round-trips the allowed profile fields', () => {
    saveProfile({ fullName: 'Jane Doe', email: 'jane@example.com', mailingAddress: '1 Main St' });
    expect(loadSavedProfile()).toEqual({
      fullName: 'Jane Doe',
      email: 'jane@example.com',
      mailingAddress: '1 Main St',
    });
    expect(hasSavedProfile()).toBe(true);
  });

  it('never persists settlement-specific identifier fields', () => {
    saveProfile({ fullName: 'Jane Doe', email: 'jane@example.com', vin: 'SOME-VIN', noticeId: 'ABC123' });
    expect(loadSavedProfile()).toEqual({ fullName: 'Jane Doe', email: 'jane@example.com' });
  });

  it('ignores corrupted stored data instead of throwing', () => {
    localStorage.setItem('claimfinder:savedProfile:v1', 'not json');
    expect(loadSavedProfile()).toEqual({});
  });
});

describe('clearSavedProfile', () => {
  it('removes a previously saved profile', () => {
    saveProfile({ fullName: 'Jane Doe' });
    expect(hasSavedProfile()).toBe(true);
    clearSavedProfile();
    expect(hasSavedProfile()).toBe(false);
  });
});
