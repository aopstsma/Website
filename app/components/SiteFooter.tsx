import Link from 'next/link';

export default function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="site-footer__grid">
          <div>
            <h4>All Orissa Secondary Training Schools Association</h4>
            <p style={{ fontSize: 'var(--t-sm)', color: '#94A3B8', lineHeight: '1.6' }}>
              All Orissa Private Secondary Training Schools Management Association (AOPSTSMA).
              The apex body representing recognized D.El.Ed &amp; B.Ed secondary training institutions
              across 30 districts of Odisha since 1980.
            </p>
            <p style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.75rem' }}>
              Registered under Societies Registration Act XXI of 1860 &middot; Regd. No. 1422/80
            </p>
          </div>

          <div>
            <h4>Quick Navigation</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}><Link href="/about">About the Association</Link></li>
              <li style={{ marginBottom: '0.5rem' }}><Link href="/zones">Regional Zones</Link></li>
              <li style={{ marginBottom: '0.5rem' }}><Link href="/schools">Member School Registry</Link></li>
              <li style={{ marginBottom: '0.5rem' }}><Link href="/achievements">High Court Orders &amp; Records</Link></li>
            </ul>
          </div>

          <div>
            <h4>Member Services</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}><Link href="/services">Annual Portal &amp; Fee Dues</Link></li>
              <li style={{ marginBottom: '0.5rem' }}><Link href="/contact">Affiliation &amp; Enrollment</Link></li>
              <li style={{ marginBottom: '0.5rem' }}><Link href="/services">Legal Representation Aid</Link></li>
              <li style={{ marginBottom: '0.5rem' }}><Link href="/contact">Helpdesk &amp; Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4>Association Secretariat</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="tel:+916370987576">📞 +91 63709 87576</a>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="mailto:info.aopstsma@gmail.com">✉️ info.aopstsma@gmail.com</a>
              </li>
              <li style={{ marginBottom: '0.5rem', color: '#94A3B8' }}>
                📍 Bhubaneswar, Odisha, India
              </li>
            </ul>
          </div>
        </div>

        <div className="site-footer__base">
          <span>&copy; {currentYear} AOPSTSMA &middot; All Orissa Private Secondary Training Schools Management Association.</span>
          <span>Official Institutional Portal &middot; aopstsma.in</span>
        </div>
      </div>
    </footer>
  );
}
