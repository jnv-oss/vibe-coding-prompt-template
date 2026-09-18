import { describe, expect, it } from 'vitest';
import { buildClaimSummaryText, claimSummaryFilename } from './claimSummary';

const fields = [
  { id: 'fullName', label: 'Full legal name', type: 'text' as const },
  { id: 'email', label: 'Email address', type: 'email' as const },
  { id: 'vin', label: 'Vehicle Identification Number (VIN)', type: 'text' as const, optional: true },
];

describe('buildClaimSummaryText', () => {
  it('includes the settlement name, official site link, and every filled field', () => {
    const text = buildClaimSummaryText(
      'Test Settlement',
      fields,
      { fullName: 'Jane Doe', email: 'jane@example.com' },
      'https://example-settlement-administrator.test/',
    );

    expect(text).toContain('Test Settlement');
    expect(text).toContain('https://example-settlement-administrator.test/');
    expect(text).toContain('Full legal name: Jane Doe');
    expect(text).toContain('Email address: jane@example.com');
  });

  it('marks a missing field explicitly rather than leaving it blank', () => {
    const text = buildClaimSummaryText('Test Settlement', fields, { fullName: 'Jane Doe' }, 'https://x.test/');
    expect(text).toContain('Vehicle Identification Number (VIN): (missing)');
  });

  it('states this is a preview that has not been submitted anywhere', () => {
    const text = buildClaimSummaryText('Test Settlement', fields, {}, 'https://x.test/');
    expect(text.toLowerCase()).toContain('preview only');
    expect(text.toLowerCase()).toContain('has not submitted this claim anywhere');
  });
});

describe('claimSummaryFilename', () => {
  it('builds a filename scoped to the settlement id', () => {
    expect(claimSummaryFilename('landsend-data-breach-settlement-2026')).toBe(
      'claimfinder-landsend-data-breach-settlement-2026-claim-summary.txt',
    );
  });
});
