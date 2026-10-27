import { describe, it, expect } from 'vitest';
import { inQuietHours, shouldDeliverNow } from './notify';
describe('quiet hours', () => {
  it('handles ranges crossing midnight', () => {
    expect(inQuietHours(23 * 60, '21:00', '06:00')).toBe(true);
    expect(inQuietHours(2 * 60, '21:00', '06:00')).toBe(true);
    expect(inQuietHours(12 * 60, '21:00', '06:00')).toBe(false);
    expect(inQuietHours(6 * 60, '21:00', '06:00')).toBe(false);
  });
  it('same-day range and unset', () => {
    expect(inQuietHours(13 * 60, '12:00', '14:00')).toBe(true);
    expect(inQuietHours(13 * 60, null, null)).toBe(false);
  });
  it('emergency overrides quiet hours; others wait', () => {
    expect(shouldDeliverNow('emergency', 23 * 60, '21:00', '06:00')).toBe(true);
    expect(shouldDeliverNow('important', 23 * 60, '21:00', '06:00')).toBe(false);
    expect(shouldDeliverNow('normal', 12 * 60, '21:00', '06:00')).toBe(true);
  });
});
