import Link from 'next/link';
import HeroSection from './components/HeroSection';
import HomeDocumentsSection from './components/HomeDocumentsSection';
import HomeNewsLettersSection from './components/HomeNewsLettersSection';
import HomeAchievementsSection from './components/HomeAchievementsSection';
import { ZONES, SCHOOLS } from '@/lib/data/schools';

export default function HomePage() {
  const schoolCount = SCHOOLS.length;

  const countByZone = (zoneId: string) => {
    return SCHOOLS.filter((s) => s.zone === zoneId).length;
  };

  return (
    <>
      {/* ============ 1. HERO SECTION WITH AUTHENTIC 3D ODISHA RELIEF MAP ============ */}
      <HeroSection />

      {/* ============ 2. QUICK PORTAL ACTIONS (4 SAAF-SAAF BOXES) ============ */}
      <div className="wrap" style={{ position: 'relative' }}>
        <div className="quick-portal-grid">
          <Link className="quick-card" href="/schools">
            <div className="quick-card__icon">🏫</div>
            <h3>School Directory</h3>
            <p>
              Search 90 member training schools across all 30 districts of Odisha with registration numbers and zone details.
            </p>
            <span className="quick-card__action">Browse Schools &rarr;</span>
          </Link>

          <Link className="quick-card" href="/achievements">
            <div className="quick-card__icon">⚖️</div>
            <h3>High Court Orders</h3>
            <p>
              Inspect certified front pages, stay orders, and writ petition decrees protecting member training institutions.
            </p>
            <span className="quick-card__action">View Legal Orders &rarr;</span>
          </Link>

          <Link className="quick-card" href="/services">
            <div className="quick-card__icon">💳</div>
            <h3>Fee &amp; Renewal Portal</h3>
            <p>
              Submit annual association dues, affiliation fees, and obtain instant digital payment receipts online.
            </p>
            <span className="quick-card__action">Pay Portal Fee &rarr;</span>
          </Link>

          <Link className="quick-card" href="/achievements">
            <div className="quick-card__icon">📢</div>
            <h3>Govt. Circulars &amp; News</h3>
            <p>
              Official circulars from the School &amp; Mass Education (S&amp;ME) Department and BSE Odisha exam updates.
            </p>
            <span className="quick-card__action">Read Circulars &rarr;</span>
          </Link>
        </div>
      </div>

      {/* ============ 3. OUR ACHIEVEMENTS & MILESTONES ============ */}
      <HomeAchievementsSection />

      {/* ============ 4. HIGH COURT ORDERS WITH FRONT-PAGE MODAL PREVIEW ============ */}
      <HomeDocumentsSection />

      {/* ============ 5. DEDICATED NEWS & DEPARTMENT LETTERS ============ */}
      <HomeNewsLettersSection />

      {/* ============ 6. FACTS STRIP ============ */}
      <section className="facts">
        <div className="wrap facts__grid">
          <div className="facts__item">
            <div className="facts__n">45</div>
            <div className="facts__l">Years of Unified Advocacy (Since 1980)</div>
          </div>
          <div className="facts__item">
            <div className="facts__n" id="stat-schools">{schoolCount}</div>
            <div className="facts__l">Affiliated Training Institutions</div>
          </div>
          <div className="facts__item">
            <div className="facts__n">5</div>
            <div className="facts__l">Administrative Regional Zones</div>
          </div>
          <div className="facts__item">
            <div className="facts__n">30</div>
            <div className="facts__l">Districts Covered across Odisha</div>
          </div>
        </div>
      </section>

      {/* ============ 7. WHAT WE DO ============ */}
      <section className="section">
        <div className="wrap">
          <div className="head">
            <div className="head__rule"></div>
            <h2>What the Association Does</h2>
            <p className="lede">
              A single training school rarely has the resources to fight an adverse
              departmental order or regulatory shift on its own. Standing together,
              member institutions have a unified legal shield and institutional voice.
            </p>
          </div>

          <div className="services">
            <article className="service">
              <h3>Legal Defense &amp; Representation</h3>
              <p>
                The association files, coordinates, and funds landmark litigations in the
                High Court of Orissa and the Supreme Court of India, ensuring member schools
                receive immediate stay orders and certified judicial relief.
              </p>
            </article>

            <article className="service">
              <h3>DIR Recognition &amp; Board Renewals</h3>
              <p>
                Authoritative guidance on DIR recognition timelines, NCTE compliance parameters,
                and regulatory submissions required by the Board of Secondary Education (BSE) Odisha.
              </p>
            </article>

            <article className="service">
              <h3>Policy Advocacy with Government</h3>
              <p>
                Formal representations to the Department of School and Mass Education (S&amp;ME)
                and higher authorities, protecting the rights and financial viability of private
                training schools.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ============ 8. FIVE REGIONAL ZONES ============ */}
      <section className="section section--light">
        <div className="wrap">
          <div className="head">
            <div className="head__rule"></div>
            <h2>Five Zones, One Association</h2>
            <p className="lede">
              Every member institution is affiliated through its designated regional zone.
              Select your zone to view affiliated institutions and regional coordinators.
            </p>
          </div>

          <div className="zone-grid" id="zone-grid">
            {ZONES.map((z) => {
              const n = countByZone(z.id);
              const label = n
                ? `${n} member ${n === 1 ? 'school' : 'schools'} listed`
                : 'Registry compiling';
              return (
                <Link
                  key={z.id}
                  className="zone-card"
                  href={`/schools?zone=${z.id}`}
                >
                  <h3>{z.name}</h3>
                  <p className="zone-card__dist">{z.districts}</p>
                  <span className="zone-card__n">{label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ 9. OFFICE BEARERS ============ */}
      <section className="section section--light">
        <div className="wrap">
          <div className="head">
            <div className="head__rule"></div>
            <h2>Association Leadership &amp; Secretariat</h2>
            <p className="lede">
              Reach out directly to the executive office bearers of the association for
              administrative guidance and urgent legal consultations.
            </p>
          </div>

          <div className="bearers" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            <div className="bearer" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '10px', overflow: 'hidden', padding: 0, boxShadow: '0 4px 16px rgba(11,37,69,0.06)' }}>
              <div style={{ position: 'relative', width: '100%', height: '240px' }}>
                <img
                  src="/assets/img/president-avatar.svg"
                  alt="Nirmal Kanta Mohanty - President"
                  style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#0B2545' }}
                />
              </div>
              <div style={{ padding: '1.25rem' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#D97706', textTransform: 'uppercase', letterSpacing: '0.06em' }}>President</span>
                <h3 style={{ fontSize: '1.2rem', color: '#0F172A', marginTop: '0.25rem' }}>Nirmal Kanta Mohanty</h3>
                <p style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '0.35rem' }}>
                  Executive Leadership &amp; Board Liaison
                </p>
              </div>
            </div>

            <div className="bearer" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '10px', overflow: 'hidden', padding: 0, boxShadow: '0 4px 16px rgba(11,37,69,0.06)' }}>
              <div style={{ position: 'relative', width: '100%', height: '240px' }}>
                <img
                  src="/assets/img/secretary-avatar.svg"
                  alt="Alia Pradhan - Secretary"
                  style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#07172C' }}
                />
              </div>
              <div style={{ padding: '1.25rem' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#D97706', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Secretary</span>
                <h3 style={{ fontSize: '1.2rem', color: '#0F172A', marginTop: '0.25rem' }}>Alia Pradhan</h3>
                <p style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '0.35rem' }}>
                  Secretariat Affairs &amp; Legal Cell
                </p>
              </div>
            </div>

            <div className="bearer" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '10px', overflow: 'hidden', padding: 0, boxShadow: '0 4px 16px rgba(11,37,69,0.06)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ position: 'relative', width: '100%', height: '240px', background: 'radial-gradient(circle at center, #1E3A8A 0%, #0B2545 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', padding: '1rem' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '2px solid #F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', marginBottom: '0.75rem', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
                  📞
                </div>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#FDE68A', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  STATE SECRETARIAT DESK
                </div>
                <div style={{ fontSize: '0.85rem', color: '#CBD5E1', marginTop: '0.2rem' }}>
                  Bhubaneswar, Odisha
                </div>
              </div>
              <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#D97706', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Central Helpline</span>
                  <h3 style={{ fontSize: '1.2rem', marginTop: '0.25rem' }}>
                    <a href="tel:+916370987576" style={{ textDecoration: 'none', color: '#0F172A', fontWeight: 800 }}>
                      +91 63709 87576
                    </a>
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '0.35rem', lineHeight: 1.5 }}>
                    Mon &ndash; Sat, 10:00 AM &ndash; 6:00 PM<br />
                    Direct Member School Advisory Cell
                  </p>
                </div>
                <a
                  href="tel:+916370987576"
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    marginTop: '1rem',
                    background: '#0B2545',
                    color: '#FFFFFF',
                    padding: '0.55rem 1rem',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    border: '1px solid #D97706',
                  }}
                >
                  📞 Call Central Office Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 10. CALLOUT BAND ============ */}
      <section className="band">
        <div className="wrap">
          <h2>Is your training institution missing from the official state registry?</h2>
          <Link className="btn btn--primary" href="/contact">
            Submit Institution Details &rarr;
          </Link>
        </div>
      </section>
    </>
  );
}
