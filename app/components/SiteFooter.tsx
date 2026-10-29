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
              <li style={{ marginBottom: '0.5rem' }}><Link href="/zones">Explore 5 Regional Zones</Link></li>
              <li style={{ marginBottom: '0.5rem' }}><Link href="/schools">School &amp; Batch Directory</Link></li>
              <li style={{ marginBottom: '0.5rem' }}><Link href="/students">Student Registration Portal</Link></li>
              <li style={{ marginBottom: '0.5rem' }}><Link href="/videos">Educational Video Library (50 Clips)</Link></li>
              <li style={{ marginBottom: '0.5rem' }}><Link href="/achievements">High Court Orders &amp; Records</Link></li>
            </ul>
          </div>

          <div>
            <h4>Member &amp; Legal Links</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}><Link href="/pay">Online Fee &amp; Legal Portal</Link></li>
              <li style={{ marginBottom: '0.5rem' }}><Link href="/admin-login">Administration Panel</Link></li>
              <li style={{ marginBottom: '0.5rem' }}><Link href="/privacy-policy">Privacy Policy</Link></li>
              <li style={{ marginBottom: '0.5rem' }}><Link href="/terms">Terms &amp; Conditions</Link></li>
              <li style={{ marginBottom: '0.5rem' }}><Link href="/contact">Contact Us &amp; Helpdesk</Link></li>
            </ul>
          </div>

          <div>
            <h4>Association Secretariat</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="tel:+916370987576">📞 +91 63709 87576</a>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="mailto:info@aopstsma.in">✉️ info@aopstsma.in</a>
              </li>
              <li style={{ marginBottom: '0.5rem', color: '#CBD5E1', fontSize: '0.85rem', lineHeight: 1.5 }}>
                📍 <strong>Registered Office:</strong><br />
                Plot No. 4971/8, V.S.S. Nagar,<br />
                Bhubaneswar, Khordha,<br />
                Odisha &ndash; 751010, India
              </li>
            </ul>
          </div>
        </div>

        <div className="site-footer__base">
          <span>&copy; {currentYear} AOPSTSMA &middot; All Orissa Private Secondary Training Schools Management Association.</span>
          <span>
            <Link href="/privacy-policy" style={{ textDecoration: 'underline', marginRight: '0.75rem' }}>
              Privacy Policy
            </Link>
            &middot;
            <Link href="/terms" style={{ textDecoration: 'underline', margin: '0 0.75rem' }}>
              Terms &amp; Conditions
            </Link>
            &middot; aopstsma.in
          </span>
        </div>
      </div>
    </footer>
  );
}
