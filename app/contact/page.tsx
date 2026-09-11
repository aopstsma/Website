import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us — AOPSTSMA',
  description:
    'Reach out to All Orissa Private Secondary Training Schools Management Association central secretariat, regional zonal offices, or submit inquiry online.',
};

export default function ContactPage() {
  return (
    <>
      {/* PAGE HEADER */}
      <section className="page-head">
        <div className="wrap">
          <span className="pay-badge">OFFICIAL SECRETARIAT & HELPLINE</span>
          <h1 style={{ marginTop: '0.4rem' }}>Contact Association Office</h1>
          <p className="lede">
            For member school affiliations, student roster verification, annual association fees, or urgent High Court legal guidance.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2.5rem',
              alignItems: 'start',
            }}
          >
            {/* DIRECT CONTACT CHANNELS & ZONAL DIRECTORY */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div
                style={{
                  background: 'linear-gradient(135deg, #0B2545 0%, #133C6D 100%)',
                  borderRadius: '14px',
                  padding: '2rem',
                  color: '#FFFFFF',
                  boxShadow: '0 10px 30px rgba(11,37,69,0.15)',
                  border: '1px solid #D97706',
                }}
              >
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    color: '#FDE68A',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  CENTRAL SECRETARIAT HELPLINE
                </span>
                <h2 style={{ fontSize: '1.6rem', color: '#FFF', marginTop: '0.3rem', marginBottom: '1.5rem' }}>
                  Reach Us Directly
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <a
                    href="tel:+916370987576"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      background: 'rgba(255, 255, 255, 0.08)',
                      padding: '1rem 1.25rem',
                      borderRadius: '10px',
                      textDecoration: 'none',
                      color: '#FFF',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      transition: 'transform 0.2s ease',
                    }}
                  >
                    <span style={{ fontSize: '1.8rem' }}>📞</span>
                    <div>
                      <small style={{ display: 'block', fontSize: '0.72rem', color: '#94A3B8', fontWeight: 700 }}>
                        PHONE / WHATSAPP HELPLINE
                      </small>
                      <strong style={{ fontSize: '1.2rem', color: '#FDE68A' }}>+91 63709 87576</strong>
                    </div>
                  </a>

                  <a
                    href="mailto:info.aopstsma@gmail.com"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      background: 'rgba(255, 255, 255, 0.08)',
                      padding: '1rem 1.25rem',
                      borderRadius: '10px',
                      textDecoration: 'none',
                      color: '#FFF',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                    }}
                  >
                    <span style={{ fontSize: '1.8rem' }}>✉️</span>
                    <div>
                      <small style={{ display: 'block', fontSize: '0.72rem', color: '#94A3B8', fontWeight: 700 }}>
                        OFFICIAL EMAIL ADDRESS
                      </small>
                      <strong style={{ fontSize: '1.05rem', color: '#FFF' }}>info.aopstsma@gmail.com</strong>
                    </div>
                  </a>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      background: 'rgba(255, 255, 255, 0.08)',
                      padding: '1rem 1.25rem',
                      borderRadius: '10px',
                      color: '#FFF',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                    }}
                  >
                    <span style={{ fontSize: '1.8rem' }}>📍</span>
                    <div>
                      <small style={{ display: 'block', fontSize: '0.72rem', color: '#94A3B8', fontWeight: 700 }}>
                        STATE HEADQUARTERS
                      </small>
                      <strong style={{ fontSize: '1rem', color: '#FFF' }}>
                        Executive Secretariat, Bhubaneswar, Odisha
                      </strong>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    marginTop: '1.75rem',
                    padding: '0.85rem 1rem',
                    background: 'rgba(217, 119, 6, 0.2)',
                    borderRadius: '8px',
                    borderLeft: '4px solid #D97706',
                    fontSize: '0.82rem',
                    color: '#FDE68A',
                  }}
                >
                  ⚡ <strong>Urgent Legal / Departmental Matters:</strong> Direct phone consultation with office bearers is available Monday to Saturday (10:00 AM – 6:00 PM).
                </div>
              </div>

              {/* ZONAL REGIONAL HELPLINES */}
              <div
                style={{
                  background: '#FFFFFF',
                  borderRadius: '14px',
                  padding: '1.75rem',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                }}
              >
                <h3 style={{ fontSize: '1.15rem', color: '#0F172A', marginBottom: '1rem' }}>
                  📍 Regional Zonal Contact Desks
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.85rem' }}>
                  <div style={{ background: '#F8FAFC', padding: '0.75rem 0.9rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <strong style={{ display: 'block', fontSize: '0.85rem', color: '#0F172A' }}>Bhubaneswar Zone</strong>
                    <span style={{ fontSize: '0.78rem', color: '#64748B' }}>Khordha & Central Dist.</span>
                  </div>
                  <div style={{ background: '#F8FAFC', padding: '0.75rem 0.9rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <strong style={{ display: 'block', fontSize: '0.85rem', color: '#0F172A' }}>Cuttack Zone</strong>
                    <span style={{ fontSize: '0.78rem', color: '#64748B' }}>Cuttack & Coastal Dist.</span>
                  </div>
                  <div style={{ background: '#F8FAFC', padding: '0.75rem 0.9rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <strong style={{ display: 'block', fontSize: '0.85rem', color: '#0F172A' }}>Balasore Zone</strong>
                    <span style={{ fontSize: '0.78rem', color: '#64748B' }}>North Coastal Belt</span>
                  </div>
                  <div style={{ background: '#F8FAFC', padding: '0.75rem 0.9rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <strong style={{ display: 'block', fontSize: '0.85rem', color: '#0F172A' }}>Berhampur Zone</strong>
                    <span style={{ fontSize: '0.78rem', color: '#64748B' }}>Southern Odisha Range</span>
                  </div>
                </div>
              </div>
            </div>

            {/* INTERACTIVE MESSAGE FORM */}
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: '14px',
                padding: '2.25rem',
                border: '1px solid #E2E8F0',
                boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
              }}
            >
              <div style={{ marginBottom: '1.5rem' }}>
                <span className="pay-badge">ONLINE INQUIRY</span>
                <h2 style={{ fontSize: '1.6rem', color: '#0F172A', marginTop: '0.3rem' }}>
                  Send an Official Message
                </h2>
                <p style={{ fontSize: '0.88rem', color: '#64748B', margin: 0 }}>
                  Fill out the form below. Secretariat desk responds within 24 working hours.
                </p>
              </div>

              <form action="mailto:info.aopstsma@gmail.com" method="POST" className="pay-form">
                <div className="form-group">
                  <label htmlFor="f-name">Your Full Name *</label>
                  <input id="f-name" name="name" type="text" placeholder="e.g. Principal / Secretary Name" required />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                  <div className="form-group">
                    <label htmlFor="f-phone">Mobile Number *</label>
                    <input id="f-phone" name="phone" type="tel" placeholder="e.g. 9861099999" required />
                  </div>

                  <div className="form-group">
                    <label htmlFor="f-zone">Regional Zone</label>
                    <select id="f-zone" name="zone" defaultValue="Bhubaneswar">
                      <option value="Bhubaneswar">Bhubaneswar Zone</option>
                      <option value="Cuttack">Cuttack Zone</option>
                      <option value="Balasore">Balasore Zone</option>
                      <option value="Berhampur">Berhampur Zone</option>
                      <option value="Sambalpur">Sambalpur Zone</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="f-school">Training Institution / School Name</label>
                  <input id="f-school" name="school" type="text" placeholder="e.g. Rajadhani School Of Education" />
                </div>

                <div className="form-group">
                  <label htmlFor="f-msg">How Can the Association Help You? *</label>
                  <textarea
                    id="f-msg"
                    name="message"
                    rows={4}
                    placeholder="Describe your inquiry regarding student verification, school recognition, annual fees, or legal assistance..."
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="verify-btn"
                  style={{
                    width: '100%',
                    padding: '0.95rem',
                    fontSize: '1rem',
                    fontWeight: 700,
                    borderRadius: '8px',
                    cursor: 'pointer',
                  }}
                >
                  📨 Submit Official Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

