import type { Metadata } from 'next';
import PayClient from './PayClient';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata('/pay', {
  title: 'Online Fee Payment Portal — AOPSTSMA',
  description:
    'Official online fee payment and student verification gateway for AOPSTSMA member schools. Pay student registration (₹2,500), affiliation inspection (₹15,000), and recognition renewal (₹10,000) fees securely.',
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
