import Razorpay from 'razorpay';

/**
 * Server-side Razorpay instance.
 * Strictly initialized with server secret keys from environment variables.
 * Complies with SPEC.md Section 5.8: Secrets stay out of client bundles.
 */
const key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_placeholder';
const key_secret = process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder';

export const razorpay = new Razorpay({
  key_id,
  key_secret,
});

export const isRazorpayConfigured = Boolean(
  process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID &&
  process.env.RAZORPAY_KEY_SECRET &&
  !process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID.includes('placeholder')
);
