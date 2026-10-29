import type { Metadata } from 'next';
import Link from 'next/link';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata('/privacy-policy', {
  title: 'Privacy Policy — AOPSTSMA Official Portal',
  description:
    'Privacy Policy and data protection guidelines of the All Orissa Private Secondary Training Schools Management Association (AOPSTSMA).',
});

export default function PrivacyPolicyPage() {
  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <h1>Privacy Policy</h1>
          <p className="lede">
            Data handling, student registration privacy, and official contact protection guidelines for AOPSTSMA.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap" style={{ maxWidth: '820px' }}>
          <div className="stack">
            <h2>1. Overview &amp; Scope</h2>
            <p>
              The All Orissa Private Secondary Training Schools Management Association (AOPSTSMA, Regd. No. 1422/80)
              operates <strong>www.aopstsma.in</strong> to connect member secondary training schools, zonal leadership,
              and registered teacher trainees across Odisha.
            </p>

            <h2>2. Information Collected</h2>
            <p>
              When students or member institutions register or verify records on the portal, we collect only the
              information necessary for institutional verification: candidate full name, mobile number (for OTP
              authentication), selected zone, member school, batch year, and server-verified payment references.
            </p>

            <h2>3. Payment Security</h2>
            <p>
              All online fee payments are processed through encrypted payment gateways (such as Razorpay). AOPSTSMA
              does not store card numbers, UPI PINs, or banking passwords on its servers. Registration numbers are
              issued strictly upon confirmed payment verification.
            </p>

            <h2>4. Protection of Official &amp; Student Records</h2>
            <p>
              Student descriptive rolls (DR) and personal contact numbers are protected by role-based access control
              and are never sold or shared with unauthorized third parties. Only authorized association and zonal
              administrators may publish or update official directory contacts.
            </p>

            <h2>5. Contact Secretariat</h2>
            <p>
              For privacy or data correction requests, contact the Central Secretariat at Plot No. 4971/8, V.S.S. Nagar,
              Bhubaneswar – 751010 or email{' '}
              <a href="mailto:info@aopstsma.in" style={{ color: '#0B2545', fontWeight: 700 }}>
                info@aopstsma.in
              </a>
              .
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

