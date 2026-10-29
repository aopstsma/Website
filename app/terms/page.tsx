import type { Metadata } from 'next';
import Link from 'next/link';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata('/terms', {
  title: 'Terms & Conditions — AOPSTSMA Official Portal',
  description:
    'Terms and Conditions governing student registration, online fee payments, educational video access, and directory usage on aopstsma.in.',
});

export default function TermsPage() {
  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <h1>Terms &amp; Conditions</h1>
          <p className="lede">
            Official rules governing portal usage, student registration, payment verification, and video library access.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap" style={{ maxWidth: '820px' }}>
          <div className="stack">
            <h2>1. Institutional Portal Usage</h2>
            <p>
              By accessing <strong>www.aopstsma.in</strong>, students, school secretaries, zonal officials, and
              visitors agree to abide by the rules of the All Orissa Private Secondary Training Schools Management
              Association (Regd. No. 1422/80).
            </p>

            <h2>2. Student Registration &amp; Payment Verification</h2>
            <p>
              Student registration requires valid selection of zone, affiliated member school, candidate details, and
              OTP mobile verification. A payment screenshot alone is never treated as proof of payment; registration
              numbers are generated only after gateway/server payment confirmation.
            </p>

            <h2>3. Refund &amp; Failed Payment Policy</h2>
            <p>
              In case of duplicate deductions or failed gateway transactions where an amount is debited, candidates may
              submit the transaction reference ID to the Central Accounts Desk (<a href="mailto:info@aopstsma.in" style={{ fontWeight: 700 }}>info@aopstsma.in</a>) for verification and reconciliation.
            </p>

            <h2>4. Educational Video Library Intellectual Property</h2>
            <p>
              All 50 educational video clips, study materials, and the 45-page curriculum hosted on the portal are for
              authorized educational use by registered trainees and member institutions. Unauthorized redistribution is
              prohibited.
            </p>

            <div style={{ marginTop: '1.5rem' }}>
              <Link href="/" className="btn btn--primary">
                &larr; Return to Homepage
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

