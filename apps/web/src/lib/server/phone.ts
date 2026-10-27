/** Normalise Ugandan numbers to E.164. Accepts 07xx xxx xxx, 7xx..., +2567xx..., 2567xx... Returns null if invalid. */
export function normalisePhone(input: string): string | null {
  const d = input.replace(/[\s\-().]/g, '');
  const m = d.match(/^(?:\+?256|0)?(7\d{8}|3\d{8}|4\d{8})$/);
  return m ? `+256${m[1]}` : null;
}
