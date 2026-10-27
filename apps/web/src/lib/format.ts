/** "16:00", 90 -> "4:00 – 5:30 pm" */
export function slotRange(start: string, minutes: number): string {
  const [h, m] = start.split(':').map(Number);
  const s = h! * 60 + m!, end = s + minutes;
  const t = (mins: number) => `${((Math.floor(mins / 60) + 11) % 12) + 1}:${String(mins % 60).padStart(2, '0')}`;
  const ap = (mins: number) => (Math.floor(mins / 60) % 24 >= 12 ? 'pm' : 'am');
  return `${t(s)}${ap(s) === ap(end) ? '' : ' ' + ap(s)} – ${t(end % 1440)} ${ap(end)}`;
}
export const hm = (minutes: number) => `${Math.floor(minutes / 60)}h ${String(minutes % 60).padStart(2, '0')}m`;
export const pct = (m: number, goalHours: number) => (goalHours ? Math.min(100, Math.round((m / (goalHours * 60)) * 100)) : 0);
export const greeting = (d = new Date()) => (d.getHours() < 12 ? 'Good morning' : d.getHours() < 17 ? 'Good afternoon' : 'Good evening');
/** "16:00" -> "4:00 pm" */
export const clock = (hhmm: string) => { const [h, m] = hhmm.split(':').map(Number); return `${((h! + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h! >= 12 ? 'pm' : 'am'}`; };
