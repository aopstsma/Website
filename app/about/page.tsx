import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About — AOPSTSMA',
  description:
    'The history, purpose and office bearers of the All Orissa Private Secondary Training Schools Management Association, established 1980.',
};

export default function AboutPage() {
  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <h1>Forty-five years of standing for private training schools</h1>
          <p className="lede">What the association is, why it was formed, and who runs it.</p>
        </div>
      </section>

      <section className="section">
        <div className="wrap" style={{ maxWidth: '820px' }}>
          <div className="stack reveal">
            <p>
              The association was formed in 1980, when private secondary training schools
              across Odisha found that decisions affecting every one of them were being taken
              without anyone in the room to speak for them. Individually, a school in Derabis
              or Saleibahal had little chance of being heard. Collectively, they could be.
            </p>

            <p>
              Since then the association has done three things: represented member schools
              in court, kept them informed of orders and departmental letters that affect their
              recognition, and put their case to the School and Mass Education Department and
              the Board of Secondary Education.
            </p>

            <p>
              Member schools are organised into six zones covering the state. Each zone
              maintains its own list of schools, and zone representatives carry local matters to
              the association office.
            </p>
          </div>

          <div className="head reveal" style={{ marginTop: '4rem' }}>
            <div className="head__rule"></div>
            <h2>Office bearers</h2>
          </div>
          <div className="bearers reveal">
            <div className="bearer">
              <span>President</span>
              <h3>Nirmal Kant Mohanty</h3>
            </div>
            <div className="bearer">
              <span>Secretary</span>
              <h3>Aba Pradhan</h3>
            </div>
          </div>

          <div className="note reveal" style={{ marginTop: '3rem' }}>
            The full list of zone representatives and executive committee members is being
            compiled. Member schools can reach the association office on 63709 87576 in the
            meantime.
          </div>
        </div>
      </section>
    </>
  );
}
