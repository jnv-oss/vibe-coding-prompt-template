const MS_PER_DAY = 24 * 60 * 60 * 1000;

export const CLOSING_SOON_DAYS = 14;

export function daysUntil(deadline: string, now: Date = new Date()): number {
  // Same parsing as getActiveSettlements' filter (new Date(deadline)), so
  // "closing soon" and "still active" agree on what counts as expired.
  const deadlineDate = new Date(deadline);
  return Math.ceil((deadlineDate.getTime() - now.getTime()) / MS_PER_DAY);
}

export function isClosingSoon(deadline: string, now: Date = new Date()): boolean {
  const days = daysUntil(deadline, now);
  return days >= 0 && days <= CLOSING_SOON_DAYS;
}
