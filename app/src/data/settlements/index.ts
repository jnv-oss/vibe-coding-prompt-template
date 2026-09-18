import type { ClaimField, Settlement, SettlementCategory } from '../../types/settlement';
import { SETTLEMENT_CATEGORY_LABELS } from '../../types/settlement';
import landsEnd from './landsend-data-breach-settlement-2026.json';
import situsAmc from './situsamc-data-incident-settlement-2026.json';
import deereRepair from './deere-repair-settlement-2026.json';
import comcastXfinity from './comcast-xfinity-data-breach-settlement-2026.json';
import fairchildPixel from './fairchild-medical-center-pixel-settlement-2026.json';
import hyundaiKiaAcu from './hyundai-kia-airbag-control-unit-settlement-2027.json';
import nonbankAtm from './nonbank-atm-surcharge-settlement-2027.json';

const VALID_FIELD_TYPES: ReadonlySet<ClaimField['type']> = new Set(['text', 'email', 'date']);
const VALID_CATEGORIES: ReadonlySet<SettlementCategory> = new Set(
  Object.keys(SETTLEMENT_CATEGORY_LABELS) as SettlementCategory[],
);

// JSON imports widen literal fields (e.g. claimFields[].type, category) to
// `string`, so a plain assignment to `Settlement` can't check them. This
// still fails fast — at import time, not silently — if a settlement file
// uses a claim field type or category outside the supported set, which is
// the malformed-JSON case the Tech Design calls out.
function asSettlement(raw: Settlement): Settlement {
  for (const field of raw.claimFields) {
    if (!VALID_FIELD_TYPES.has(field.type)) {
      throw new Error(`Settlement "${raw.id}" has claim field "${field.id}" with unsupported type "${field.type}"`);
    }
  }
  if (!VALID_CATEGORIES.has(raw.category)) {
    throw new Error(`Settlement "${raw.id}" has unsupported category "${raw.category}"`);
  }
  return raw;
}

const allSettlements: Settlement[] = [
  landsEnd,
  situsAmc,
  deereRepair,
  comcastXfinity,
  fairchildPixel,
  hyundaiKiaAcu,
  nonbankAtm,
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
