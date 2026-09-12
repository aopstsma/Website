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
          <div className="bearers reveal" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginTop: '1.5rem' }}>
            <div className="bearer" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '2.25rem 1.5rem', boxShadow: '0 4px 20px rgba(11,37,69,0.06)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div style={{
                position: 'relative',
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                padding: '4px',
                background: 'linear-gradient(135deg, #10B981 0%, #059669 50%, #047857 100%)',
                boxShadow: '0 8px 24px rgba(5, 150, 105, 0.25)',
                marginBottom: '1rem'
              }}>
                <div style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '3px solid #FFFFFF',
                  background: '#0F291E'
                }}>
                  <img
                    src="/assets/img/president-nirmal-kanta-mohanty.jpg"
                    alt="Nirmal Kanta Mohanty - President"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              </div>
              <span style={{
                display: 'inline-block',
                fontSize: '0.75rem',
                fontWeight: 800,
                color: '#047857',
                background: '#ECFDF5',
                border: '1px solid #A7F3D0',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                padding: '0.3rem 0.85rem',
                borderRadius: '20px',
                marginBottom: '0.5rem'
              }}>
                President
              </span>
              <h3 style={{ fontSize: '1.3rem', color: '#0F172A', marginTop: '0.25rem', fontWeight: 800 }}>
                Nirmal Kanta Mohanty
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '0.35rem', lineHeight: 1.5 }}>
                Executive Leadership &amp; Board Liaison
              </p>
              <span style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '0.5rem', borderTop: '1px solid #F1F5F9', paddingTop: '0.5rem', width: '100%' }}>
                All Orissa Private Secondary Training Schools Management Association
              </span>
            </div>

            <div className="bearer" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '2.25rem 1.5rem', boxShadow: '0 4px 20px rgba(11,37,69,0.06)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div style={{
                position: 'relative',
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                padding: '4px',
                background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 50%, #1E3A8A 100%)',
                boxShadow: '0 8px 24px rgba(29, 78, 216, 0.25)',
                marginBottom: '1rem'
              }}>
                <div style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '3px solid #FFFFFF',
                  background: '#0A2540'
                }}>
                  <img
                    src="/assets/img/secretary-alia-pradhan.jpg"
                    alt="Alia Pradhan - Secretary"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              </div>
              <span style={{
                display: 'inline-block',
                fontSize: '0.75rem',
                fontWeight: 800,
                color: '#1D4ED8',
                background: '#EFF6FF',
                border: '1px solid #BFDBFE',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                padding: '0.3rem 0.85rem',
                borderRadius: '20px',
                marginBottom: '0.5rem'
              }}>
                Secretary
              </span>
              <h3 style={{ fontSize: '1.3rem', color: '#0F172A', marginTop: '0.25rem', fontWeight: 800 }}>
                Alia Pradhan
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '0.35rem', lineHeight: 1.5 }}>
                Secretariat Affairs &amp; Legal Cell
              </p>
              <span style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '0.5rem', borderTop: '1px solid #F1F5F9', paddingTop: '0.5rem', width: '100%' }}>
                All Orissa Private Secondary Training Schools Management Association
              </span>
            </div>
          </div>

          {/* REGISTERED CENTRAL HEADQUARTERS & OFFICE ADDRESS */}
          <div className="reveal" style={{ marginTop: '3.5rem', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '2rem', boxShadow: '0 4px 20px rgba(11,37,69,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1.8rem' }}>🏛️</span>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#D97706', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  CENTRAL HEADQUARTERS &middot; REGD. NO. 1422/80
                </span>
                <h3 style={{ fontSize: '1.35rem', color: '#0F172A', margin: '0.2rem 0 0' }}>
                  Registered State Secretariat &amp; Office Address
                </h3>
              </div>
            </div>
            <p style={{ fontSize: '0.95rem', color: '#334155', lineHeight: 1.7, margin: '0 0 1rem 0' }}>
              The association operates throughout Odisha with its permanent statutory headquarters located at:
            </p>
            <div style={{ background: '#F8FAFC', borderLeft: '4px solid #D97706', padding: '1rem 1.25rem', borderRadius: '0 8px 8px 0', marginBottom: '1.25rem' }}>
              <strong style={{ display: 'block', fontSize: '1.05rem', color: '#0B2545', marginBottom: '0.25rem' }}>
                Plot No. 4971/8, V.S.S. Nagar, Bhubaneswar, Khordha, Odisha &ndash; 751010, India
              </strong>
              <span style={{ fontSize: '0.85rem', color: '#64748B' }}>
                Central legal cell, executive registry, and regional zone liaison office.
              </span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', fontSize: '0.88rem', color: '#475569' }}>
              <div>📞 <strong>Helpline:</strong> <a href="tel:+916370987576" style={{ color: '#0B2545', textDecoration: 'none' }}>+91 63709 87576</a></div>
              <div>✉️ <strong>Official Email:</strong> <a href="mailto:info@aopstsma.in" style={{ color: '#0B2545', textDecoration: 'none' }}>info@aopstsma.in</a></div>
              <div>🕒 <strong>Hours:</strong> Mon &ndash; Sat, 10:00 AM &ndash; 6:00 PM</div>
            </div>
          </div>

          <div className="note reveal" style={{ marginTop: '2.5rem' }}>
            The full list of zone representatives and executive committee members is being
            compiled. Member schools can reach the association office on 63709 87576 in the
            meantime.
          </div>
        </div>
      </section>
    </>
  );
}
