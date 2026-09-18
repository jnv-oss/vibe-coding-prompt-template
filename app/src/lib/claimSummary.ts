import type { ClaimField } from '../types/settlement';

export function buildClaimSummaryText(
  settlementName: string,
  fields: ClaimField[],
  values: Record<string, string>,
  administratorUrl: string,
): string {
  return [
    `ClaimFinder claim summary — ${settlementName}`,
    '',
    'This is a preview only. ClaimFinder is not a law firm, does not provide',
    'legal advice, and has not submitted this claim anywhere. Review this',
    'summary, then submit your claim yourself at the official settlement site:',
    administratorUrl,
    '',
    ...fields.map((f) => `${f.label}: ${(values[f.id] ?? '').trim() || '(missing)'}`),
  ].join('\n');
}

export function claimSummaryFilename(settlementId: string): string {
  return `claimfinder-${settlementId}-claim-summary.txt`;
}

// Native Blob + <a download> — no PDF library added just for this; a plain
// text file carries the same information the on-screen preview shows.
export function downloadClaimSummary(settlementId: string, text: string): void {
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = claimSummaryFilename(settlementId);
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
