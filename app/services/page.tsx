import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Services and fees — AOPSTSMA',
  description:
    'Membership renewal, DIR deposit, legal assistance and court expenses for member schools.',
};

export default function ServicesPage() {
  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <h1>Services for member schools</h1>
          <p className="lede">What the association handles on behalf of its members, and what each costs.</p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="services reveal">
            <article className="service">
              <h3>Membership renewal</h3>
              <p className="service__fee">&#8377;2,500</p>
              <p>
                Annual renewal of association membership, which keeps a school on the zonal
                register and covers circulation of orders and notices.
              </p>
            </article>
            <article className="service">
              <h3>DIR deposit</h3>
              <p className="service__fee">&#8377;25,000</p>
              <p>
                Deposit held against a school&apos;s recognition file, refundable under the terms
                set by the association.
              </p>
            </article>
            <article className="service">
              <h3>Legal assistance</h3>
              <p className="service__fee">On the case</p>
              <p>
                Representation in matters affecting a member school&apos;s recognition or standing,
                taken up through the association&apos;s counsel.
              </p>
            </article>
            <article className="service">
              <h3>Court expenses</h3>
              <p className="service__fee">As incurred</p>
              <p>
                Filing fees, counsel fees and related costs, shared across the schools joined
                to a matter and accounted for to the membership.
              </p>
            </article>
          </div>

          <div className="note reveal" style={{ marginTop: '2.5rem' }}>
            Fees shown are from the association&apos;s current schedule. Confirm the applicable
            amount with the office before making any payment.
          </div>
        </div>
      </section>

      <section className="band">
        <div className="wrap">
          <h2>Ready to renew or join?</h2>
          <Link className="btn btn--primary" href="/contact">
            Contact the office
          </Link>
        </div>
      </section>
    </>
  );
}
