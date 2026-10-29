import Link from 'next/link';
import Image from 'next/image';

export default function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="site-footer__grid">
          {/* COLUMN 1: BRAND & STATUTORY IDENTITY */}
          <div className="site-footer__brand-col">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  border: '2px solid #D97706',
                  background: '#FFFFFF',
                  padding: '2px',
                  flexShrink: 0,
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Image
                  src="/assets/img/aopstsma-seal.jpg"
                  alt="AOPSTSMA Official Seal"
                  width={46}
                  height={46}
                  style={{ borderRadius: '50%', objectFit: 'cover' }}
                />
              </div>
              <div>
                <div
                  style={{
                    fontSize: '1.15rem',
                    fontWeight: 900,
                    color: '#FFFFFF',
                    letterSpacing: '0.04em',
                    lineHeight: 1.2,
                  }}
                >
                  AOPSTSMA
                </div>
                <div
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: '#FBBF24',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    marginTop: '0.15rem',
                  }}
                >
                  Est. 1980 &middot; Regd. No. 1422/80
                </div>
              </div>
            </div>

            <p style={{ fontSize: '0.88rem', color: '#CBD5E1', lineHeight: 1.65, margin: '0 0 0.9rem 0' }}>
              All Orissa Private Secondary Training Schools Management Association (AOPSTSMA). The apex
              body representing recognized Secondary &amp; C.T. Training Institutions across 5 zones of
              Odisha.
            </p>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                background: 'rgba(251, 191, 36, 0.1)',
                border: '1px solid rgba(251, 191, 36, 0.3)',
                borderRadius: '6px',
                padding: '0.4rem 0.75rem',
                fontSize: '0.74rem',
                color: '#FDE68A',
                fontWeight: 600,
              }}
            >
              🏛️ Registered under Societies Registration Act XXI of 1860
            </div>
          </div>

          {/* COLUMN 2: QUICK NAVIGATION */}
          <div className="site-footer__col">
            <h4>Quick Navigation</h4>
            <ul className="site-footer__list">
              <li><Link href="/about">About the Association</Link></li>
              <li><Link href="/zones">Explore 5 Regional Zones</Link></li>
              <li><Link href="/schools">School &amp; Batch Directory (90)</Link></li>
              <li><Link href="/students">Student Registration &amp; Videos</Link></li>
              <li><Link href="/achievements">High Court Orders &amp; Records</Link></li>
              <li><Link href="/contact">Contact Us &amp; Helpdesk</Link></li>
            </ul>
          </div>

          {/* COLUMN 3: MEMBER & LEGAL LINKS */}
          <div className="site-footer__col">
            <h4>Member &amp; Legal Links</h4>
            <ul className="site-footer__list">
              <li><Link href="/pay">Online Fee &amp; Payment Portal</Link></li>
              <li><Link href="/student-login">Student Dashboard Login</Link></li>
              <li><Link href="/school-login">School Secretary Login</Link></li>
              <li><Link href="/admin-login">Administration Panel</Link></li>
              <li><Link href="/privacy-policy">Privacy Policy</Link></li>
              <li><Link href="/terms">Terms &amp; Conditions</Link></li>
            </ul>
          </div>

          {/* COLUMN 4: ASSOCIATION SECRETARIAT */}
          <div className="site-footer__col">
            <h4>Association Secretariat</h4>
            <div className="site-footer__contact-box">
              <a href="tel:+916370987576" className="site-footer__contact-item">
                <span>📞</span>
                <div>
                  <small>Official Helpline</small>
                  <strong>+91 63709 87576</strong>
                </div>
              </a>
              <a href="mailto:info@aopstsma.in" className="site-footer__contact-item">
                <span>✉️</span>
                <div>
                  <small>Official Email</small>
                  <strong>info@aopstsma.in</strong>
                </div>
              </a>
              <div className="site-footer__address">
                <span>📍</span>
                <div>
                  <strong style={{ color: '#FDE68A', display: 'block', marginBottom: '0.15rem' }}>
                    Registered Office:
                  </strong>
                  Plot No. 4971/8, V.S.S. Nagar, Bhubaneswar, Khordha, Odisha &ndash; 751010, India
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT & INLINE LINKS BAR */}
        <div className="site-footer__base">
          <div className="site-footer__copy">
            &copy; {currentYear} <strong>AOPSTSMA</strong> &middot; All Orissa Private Secondary Training
            Schools Management Association. All rights reserved.
          </div>
          <div className="site-footer__bottom-links">
            <Link href="/privacy-policy">Privacy Policy</Link>
            <span className="site-footer__dot">&bull;</span>
            <Link href="/terms">Terms &amp; Conditions</Link>
            <span className="site-footer__dot">&bull;</span>
            <Link href="/contact">Contact Us</Link>
            <span className="site-footer__dot">&bull;</span>
            <span style={{ color: '#FBBF24', fontWeight: 700 }}>www.aopstsma.in</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
