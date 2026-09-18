import type { ClaimField, Settlement } from '../../types/settlement';
import airlineBaggage from './example-airline-baggage-fee-2026.json';
import socialAppPrivacy from './example-social-app-data-privacy-2026.json';
import streamingPriceFixing from './example-streaming-price-fixing-2027.json';
import expiredRetailer from './example-expired-retailer-2020.json';

const VALID_FIELD_TYPES: ReadonlySet<ClaimField['type']> = new Set(['text', 'email', 'date']);

// JSON imports widen literal fields (e.g. claimFields[].type) to `string`, so
// a plain assignment to `Settlement` can't check them. This still fails fast
// — at import time, not silently — if a settlement file uses a claim field
// type outside the supported set, which is the malformed-JSON case the Tech
// Design calls out.
function asSettlement(raw: Settlement): Settlement {
  for (const field of raw.claimFields) {
    if (!VALID_FIELD_TYPES.has(field.type)) {
      throw new Error(`Settlement "${raw.id}" has claim field "${field.id}" with unsupported type "${field.type}"`);
    }
  }
  return raw;
}

const allSettlements: Settlement[] = [
  airlineBaggage,
  socialAppPrivacy,
  streamingPriceFixing,
  expiredRetailer,
].map((s) => asSettlement(s as Settlement));

export default allSettlements;

export function getActiveSettlements(now: Date = new Date()): Settlement[] {
  return allSettlements
    .filter((s) => new Date(s.deadline) >= now)
    .sort((a, b) => a.deadline.localeCompare(b.deadline));
}

export function getSettlementById(id: string): Settlement | undefined {
  return allSettlements.find((s) => s.id === id);
}
