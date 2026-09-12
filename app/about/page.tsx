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
          <div className="bearers reveal" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem', marginTop: '1.5rem' }}>
            <div className="bearer" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '10px', overflow: 'hidden', padding: 0, boxShadow: '0 4px 16px rgba(11,37,69,0.06)' }}>
              <div style={{ position: 'relative', width: '100%', height: '260px' }}>
                <img
                  src="/assets/img/president-avatar.svg"
                  alt="Nirmal Kanta Mohanty - President"
                  style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#0B2545' }}
                />
              </div>
              <div style={{ padding: '1.25rem' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#D97706', textTransform: 'uppercase', letterSpacing: '0.06em' }}>President</span>
                <h3 style={{ fontSize: '1.2rem', color: '#0F172A', marginTop: '0.25rem' }}>Nirmal Kanta Mohanty</h3>
                <p style={{ fontSize: '0.82rem', color: '#64748B', margin: '0.4rem 0 0' }}>All Orissa Private Secondary Training Schools Management Association</p>
              </div>
            </div>

            <div className="bearer" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '10px', overflow: 'hidden', padding: 0, boxShadow: '0 4px 16px rgba(11,37,69,0.06)' }}>
              <div style={{ position: 'relative', width: '100%', height: '260px' }}>
                <img
                  src="/assets/img/secretary-avatar.svg"
                  alt="Alia Pradhan - Secretary"
                  style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#07172C' }}
                />
              </div>
              <div style={{ padding: '1.25rem' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#D97706', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Secretary</span>
                <h3 style={{ fontSize: '1.2rem', color: '#0F172A', marginTop: '0.25rem' }}>Alia Pradhan</h3>
                <p style={{ fontSize: '0.82rem', color: '#64748B', margin: '0.4rem 0 0' }}>All Orissa Private Secondary Training Schools Management Association</p>
              </div>
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
