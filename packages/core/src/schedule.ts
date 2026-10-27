export interface PackageInput {
  startDate: string;          // YYYY-MM-DD
  endDate: string;            // inclusive
  weeklyHourGoal: number;
  slotStart: string;          // HH:MM, student's chosen daily slot
  slotMinutes: number;        // 60..120
  restDays?: number[];        // 0=Sun..6=Sat; default [0] (Sunday rest)
}
export interface PlannedSession { date: string; start: string; minutes: number }

const addDays = (d: Date, n: number) => new Date(d.getTime() + n * 86400000);
const iso = (d: Date) => d.toISOString().slice(0, 10);

/**
 * Builds the daily schedule. A slot must be 1-2 hours (brief). Weeks are Mon-Sun; study days
 * fall on non-rest days. If the weekly goal needs more minutes than slots provide, the shortfall
 * is reported rather than silently stretching slots beyond 2 hours.
 */
export function buildSchedule(p: PackageInput): { sessions: PlannedSession[]; weeklyMinutesAvailable: number; meetsGoal: boolean } {
  if (p.slotMinutes < 60 || p.slotMinutes > 120) throw new RangeError('slotMinutes must be between 60 and 120');
  const rest = new Set(p.restDays ?? [0]);
  const start = new Date(`${p.startDate}T00:00:00Z`), end = new Date(`${p.endDate}T00:00:00Z`);
  if (end < start) throw new RangeError('endDate before startDate');
  const sessions: PlannedSession[] = [];
  for (let d = start; d <= end; d = addDays(d, 1)) {
    if (!rest.has(d.getUTCDay())) sessions.push({ date: iso(d), start: p.slotStart, minutes: p.slotMinutes });
  }
  const studyDaysPerWeek = 7 - rest.size;
  const weeklyMinutesAvailable = studyDaysPerWeek * p.slotMinutes;
  return { sessions, weeklyMinutesAvailable, meetsGoal: weeklyMinutesAvailable >= p.weeklyHourGoal * 60 };
}

export type Status = 'on_track' | 'behind' | 'not_started';

/** Teacher dashboard status. Based on minutes studied vs pro-rata goal; never exposed to families as "behind". */
export function studyStatus(minutesStudied: number, weeklyGoalHours: number, dayOfWeekIndex: number /*0=Mon..6=Sun*/): Status {
  if (minutesStudied <= 0) return 'not_started';
  const expected = (weeklyGoalHours * 60 * (dayOfWeekIndex + 1)) / 7;
  return minutesStudied >= expected * 0.75 ? 'on_track' : 'behind';
}
