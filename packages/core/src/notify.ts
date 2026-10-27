export type Priority = 'normal' | 'important' | 'emergency';

const mins = (hhmm: string) => { const [h, m] = hhmm.split(':').map(Number); return h! * 60 + m!; };

/** True when `nowMinutes` (minutes after local midnight) is inside quiet hours. Handles ranges that cross midnight. */
export function inQuietHours(nowMinutes: number, from?: string | null, to?: string | null): boolean {
  if (!from || !to) return false;
  const a = mins(from), b = mins(to);
  if (a === b) return false;
  return a < b ? nowMinutes >= a && nowMinutes < b : nowMinutes >= a || nowMinutes < b;
}

/** Emergency notices always go out immediately; everything else waits for quiet hours to end. */
export function shouldDeliverNow(priority: Priority, nowMinutes: number, quietFrom?: string | null, quietTo?: string | null): boolean {
  return priority === 'emergency' || !inQuietHours(nowMinutes, quietFrom, quietTo);
}

/** SMS needs recorded consent; emergency notices still respect opt-out. */
export function mayUseSms(smsConsent: boolean): boolean { return smsConsent; }
