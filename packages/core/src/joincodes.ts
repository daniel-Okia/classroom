import { randomBytes } from 'node:crypto';

// No 0/O/1/I/L so codes survive being read aloud or copied from a poster.
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

/** Short join code, e.g. "K7QM-4TXD". ~40 bits; always rate limited and never grants access by itself. */
export function shortCode(len = 8): string {
  const bytes = randomBytes(len);
  let out = '';
  for (let i = 0; i < len; i++) {
    out += ALPHABET[bytes[i]! % ALPHABET.length];
    if (i === len / 2 - 1) out += '-';
  }
  return out;
}

export const normaliseCode = (s: string): string => s.toUpperCase().replace(/[^A-Z0-9]/g, '').replace(/^(.{4})(.+)$/, '$1-$2');

/** Opaque QR token (128-bit). Stored hashed; the QR URL carries only this. */
export const qrToken = (): string => randomBytes(16).toString('base64url');

export type JoinStatus = 'pending' | 'approved' | 'rejected';
export interface JoinRequest { status: JoinStatus; guardianId: string; childId: string; schoolId: string }

/**
 * Resolving a QR token or code yields only a school/class reference.
 * Access exists only once a school admin has approved the request.
 */
export function hasAccessAfterJoin(req: JoinRequest | undefined): boolean {
  return req?.status === 'approved';
}
