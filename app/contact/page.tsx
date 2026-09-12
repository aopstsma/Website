import type { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'Contact Us — AOPSTSMA Central Secretariat',
  description:
    'Official helpline and interactive inquiry portal for All Orissa Private Secondary Training Schools Management Association (Estd. 1980).',
};

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
