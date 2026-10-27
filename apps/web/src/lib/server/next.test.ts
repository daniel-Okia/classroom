import { describe, it, expect } from 'vitest';
import { safeNext, loginUrl } from './next';
describe('post-login redirect', () => {
  it('accepts same-site paths with a query', () => { expect(safeNext('/join?c=K7QM-4TXD')).toBe('/join?c=K7QM-4TXD'); expect(safeNext('/school/setup')).toBe('/school/setup'); });
  it('refuses other sites, protocol-relative URLs and login loops', () => {
    for (const bad of ['https://evil.example', '//evil.example', '/\\evil.example', 'javascript:alert(1)', '/login?next=/', '', null, undefined, 42]) expect(safeNext(bad)).toBeNull();
  });
  it('builds a login link that remembers the page, but not for the home page', () => {
    expect(loginUrl(new URL('http://x/join?c=AB-12'))).toBe('/login?next=%2Fjoin%3Fc%3DAB-12');
    expect(loginUrl(new URL('http://x/'))).toBe('/login');
  });
});
