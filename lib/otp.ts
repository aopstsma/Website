import crypto from 'crypto';

interface OTPSession {
  otpHash: string;
  expiresAt: number;
  attempts: number;
  metadata?: Record<string, unknown>;
}

// In-memory OTP storage cache (persists within node process; can be mapped to Supabase table `otp_sessions`)
const otpStore = new Map<string, OTPSession>();

/**
 * Generate a cryptographically random 6-digit numeric OTP
 */
export function generateNumericOTP(length = 6): string {
  const digits = '0123456789';
  let otp = '';
  const randomBytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    otp += digits[randomBytes[i] % 10];
  }
  return otp;
}

/**
 * Hash OTP using SHA-256 with optional salt
 */
function hashOTP(otp: string, identifier: string): string {
  const secret = process.env.JWT_SECRET || 'aopstsma-otp-secret-salt-2026';
  return crypto
    .createHmac('sha256', secret)
    .update(`${identifier}:${otp}`)
    .digest('hex');
}

/**
 * Clean up expired OTP entries periodically
 */
function cleanupExpiredSessions(): void {
  const now = Date.now();
  for (const [id, session] of otpStore.entries()) {
    if (session.expiresAt < now) {
      otpStore.delete(id);
    }
  }
}

/**
 * Store an OTP for a given phone or email
 */
export function createAndStoreOTP(
  identifier: string,
  ttlSeconds = 300, // 5 minutes
  metadata?: Record<string, unknown>
): { otp: string; expiresAt: number } {
  cleanupExpiredSessions();
  const cleanId = identifier.trim().toLowerCase();
  const otp = generateNumericOTP(6);
  const otpHash = hashOTP(otp, cleanId);
  const expiresAt = Date.now() + ttlSeconds * 1000;

  otpStore.set(cleanId, {
    otpHash,
    expiresAt,
    attempts: 0,
    metadata,
  });

  return { otp, expiresAt };
}

/**
 * Verify an input OTP
 */
export function verifyOTP(
  identifier: string,
  inputOtp: string
): { valid: boolean; reason?: string; metadata?: Record<string, unknown> } {
  cleanupExpiredSessions();
  const cleanId = identifier.trim().toLowerCase();
  const session = otpStore.get(cleanId);

  if (!session) {
    return { valid: false, reason: 'OTP expired or not requested. Please request a new OTP.' };
  }

  if (Date.now() > session.expiresAt) {
    otpStore.delete(cleanId);
    return { valid: false, reason: 'OTP has expired. Please request a new OTP.' };
  }

  if (session.attempts >= 5) {
    otpStore.delete(cleanId);
    return { valid: false, reason: 'Maximum verification attempts exceeded. Please request a new OTP.' };
  }

  session.attempts += 1;
  const inputHash = hashOTP(inputOtp.trim(), cleanId);

  if (inputHash === session.otpHash) {
    const meta = session.metadata;
    otpStore.delete(cleanId); // Single-use consumption
    return { valid: true, metadata: meta };
  }

  return { valid: false, reason: 'Invalid OTP. Please check and try again.' };
}

/**
 * Dispatch SMS via configured provider or console in dev mode
 */
export async function sendSMSOTP(
  mobileNumber: string,
  otp: string
): Promise<{ success: boolean; mode: 'provider' | 'dev'; demoCode?: string; message: string }> {
  const cleanPhone = mobileNumber.replace(/\D/g, '').slice(-10);
  const apiKey = process.env.SMS_API_KEY;

  console.log(`\n======================================================`);
  console.log(`🔔 [AOPSTSMA OTP DISPATCH] Mobile: +91-${cleanPhone}`);
  console.log(`🔑 SECURE OTP CODE: [ ${otp} ] (Valid for 5 mins)`);
  console.log(`======================================================\n`);

  if (!apiKey) {
    return {
      success: true,
      mode: 'dev',
      demoCode: otp,
      message: `Development mode: OTP generated and logged to server console.`,
    };
  }

  try {
    // Standard 2Factor / MSG91 HTTP integration hook
    // If 2Factor URL is specified:
    const res = await fetch(`https://2factor.in/API/V1/${apiKey}/SMS/${cleanPhone}/${otp}/AOPSTSMA_LOGIN`, {
      method: 'GET',
    });
    const data = await res.json();
    return {
      success: data.Status === 'Success',
      mode: 'provider',
      message: data.Details || 'OTP sent successfully via SMS gateway.',
    };
  } catch (err) {
    console.error('Failed to send SMS via provider:', err);
    return {
      success: true,
      mode: 'dev',
      demoCode: otp,
      message: 'Provider error; fallback demo code generated for testing.',
    };
  }
}
