import type { Metadata } from 'next';
import ContactClient from './ContactClient';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata('/contact', {
  title: 'Contact Us — AOPSTSMA Central Secretariat',
  description:
    'Contact the AOPSTSMA Central Secretariat at Plot No. 4971/8, V.S.S. Nagar, Bhubaneswar, Odisha 751010. Helpline: +91 63709 87576. Email: info@aopstsma.in. Office hours: Mon–Sat, 10 AM – 6 PM.',
});

export default function ContactPage() {
  return (
    <>
      {/* PAGE HEADER */}
      <section className="page-head">
        <div className="wrap">
          <span className="pay-badge">OFFICIAL SECRETARIAT &amp; HELPLINE</span>
          <h1 style={{ marginTop: '0.4rem' }}>Association Secretariat &amp; Inquiry Portal</h1>
          <p className="lede">
            For recognized member school affiliations, student candidate roster verification, annual association fees, or urgent High Court legal defense guidance.
          </p>
        </div>
      </section>

      <section className="section" style={{ background: '#F8FAFC', minHeight: '80vh', padding: '2.5rem 0' }}>
        <div className="wrap">
          <ContactClient />
        </div>
      </section>
    </>
  );
}
