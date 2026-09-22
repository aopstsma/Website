import crypto from 'crypto';

export interface SessionPayload {
  role: 'school' | 'student' | 'admin';
  id: string; // school name, student ID, or admin username
  name: string;
  zone?: string;
  mobile: string;
  authorityName?: string;
  issuedAt: number;
  expiresAt: number;
}

const JWT_SECRET = process.env.JWT_SECRET || 'aopstsma-secure-auth-secret-session-2026';

/**
 * Creates a base64url signed token (HMAC-SHA256)
 */
export function createSessionToken(
  data: Omit<SessionPayload, 'issuedAt' | 'expiresAt'>,
  ttlHours = 24
): string {
  const payload: SessionPayload = {
    ...data,
    issuedAt: Date.now(),
    expiresAt: Date.now() + ttlHours * 60 * 60 * 1000,
  };

  const encodedHeader = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64url');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

/**
 * Validates a signed session token and returns the payload if valid
 */
export function verifySessionToken(token: string): { valid: boolean; payload?: SessionPayload; error?: string } {
  try {
    if (!token || typeof token !== 'string') {
      return { valid: false, error: 'No token provided' };
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
      return { valid: false, error: 'Malformed token structure' };
    }

    const [header, payload, signature] = parts;
    const expectedSig = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${header}.${payload}`)
      .digest('base64url');

    if (signature !== expectedSig) {
      return { valid: false, error: 'Invalid token signature' };
    }

    const decodedPayload: SessionPayload = JSON.parse(
      Buffer.from(payload, 'base64url').toString('utf8')
    );

    if (Date.now() > decodedPayload.expiresAt) {
      return { valid: false, error: 'Session expired' };
    }

    return { valid: true, payload: decodedPayload };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Token verification failed';
    return { valid: false, error: message };
  }
}
