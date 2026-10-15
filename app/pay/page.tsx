import type { Metadata } from 'next';
import PayClient from './PayClient';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata('/pay', {
  title: 'Online Fee Payment & Legal Defense Portal — AOPSTSMA',
  description:
    'Official online fee payment and verification gateway for AOPSTSMA. Pay student candidate examination & registration (₹2,500) and High Court / Supreme Court legal defense fund fees securely.',
});

export default function PayPage() {
  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <h1>Pay Portal Fee</h1>
          <p className="lede">
            Official online fee payment gateway for recognized member institutions and enrolled candidates.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <PayClient />
        </div>
      </section>
    </>
  );
}
