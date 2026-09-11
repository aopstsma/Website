import type { Metadata } from 'next';
import PayClient from './PayClient';

export const metadata: Metadata = {
  title: 'Pay Portal Fee — AOPSTSMA',
  description:
    'Official student verification and institutional fee payment gateway for All Orissa Private Secondary Training Schools Management Association.',
};

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
