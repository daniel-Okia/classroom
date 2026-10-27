import { describe, it, expect } from 'vitest';
import { shortCode, normaliseCode, qrToken, hasAccessAfterJoin } from './joincodes';
import { buildSchedule, studyStatus } from './schedule';

describe('join codes', () => {
  it('uses unambiguous characters', () => { for (let i = 0; i < 200; i++) expect(shortCode()).toMatch(/^[A-HJKMNP-Z2-9]{4}-[A-HJKMNP-Z2-9]{4}$/); });
  it('normalises typed input', () => expect(normaliseCode('k7qm 4txd')).toBe('K7QM-4TXD'));
  it('qr tokens are unique and URL-safe', () => { const a = qrToken(), b = qrToken(); expect(a).not.toBe(b); expect(a).toMatch(/^[\w-]{22}$/); });
  it('QR/code alone never grants access', () => {
    expect(hasAccessAfterJoin(undefined)).toBe(false);
    expect(hasAccessAfterJoin({ status: 'pending', guardianId: 'g', childId: 'c', schoolId: 's' })).toBe(false);
    expect(hasAccessAfterJoin({ status: 'rejected', guardianId: 'g', childId: 'c', schoolId: 's' })).toBe(false);
    expect(hasAccessAfterJoin({ status: 'approved', guardianId: 'g', childId: 'c', schoolId: 's' })).toBe(true);
  });
});

describe('schedule', () => {
  const base = { startDate: '2026-12-01', endDate: '2026-12-14', weeklyHourGoal: 10, slotStart: '16:00', slotMinutes: 90 };
  it('skips Sundays by default', () => {
    const r = buildSchedule(base);
    expect(r.sessions).toHaveLength(12);
    expect(r.sessions.every((s) => new Date(s.date + 'T00:00:00Z').getUTCDay() !== 0)).toBe(true);
  });
  it('rejects slots outside 1-2 hours', () => {
    expect(() => buildSchedule({ ...base, slotMinutes: 30 })).toThrow();
    expect(() => buildSchedule({ ...base, slotMinutes: 150 })).toThrow();
  });
  it('reports when the goal cannot be met rather than stretching slots', () => {
    expect(buildSchedule({ ...base, weeklyHourGoal: 20 }).meetsGoal).toBe(false);
    expect(buildSchedule(base).meetsGoal).toBe(false); // 6 days x 90 min = 9h < 10h
    expect(buildSchedule({ ...base, weeklyHourGoal: 9 }).meetsGoal).toBe(true);
  });
  it('study status', () => {
    expect(studyStatus(0, 10, 2)).toBe('not_started');
    expect(studyStatus(300, 10, 2)).toBe('on_track');
    expect(studyStatus(60, 10, 4)).toBe('behind');
  });
});
