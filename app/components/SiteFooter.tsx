import Link from 'next/link';

export default function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="site-footer__grid">
          <div>
            <h4>THE ASSOCIATION</h4>
            <p style={{ fontSize: 'var(--t-sm)' }}>
              All Orissa Private Secondary Training Schools Management Association.
              Representing private secondary training schools across Odisha since 1980.
            </p>
          </div>
          <div>
            <h4>PAGES</h4>
            <ul>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/zones">Zones</Link></li>
              <li><Link href="/schools">Member schools</Link></li>
              <li><Link href="/achievements">Legal records</Link></li>
            </ul>
          </div>
          <div>
            <h4>MEMBERS</h4>
            <ul>
              <li><Link href="/services">Services and fees</Link></li>
              <li><Link href="/contact">Join the association</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4>REACH US</h4>
            <ul>
              <li><a href="tel:+916370987576">63709 87576</a></li>
              <li><a href="mailto:info.aopstsma@gmail.com">info.aopstsma@gmail.com</a></li>
            </ul>
          </div>
        </div>
        <div className="site-footer__base">
          <span>&copy; <span>{currentYear}</span> AOPSTSMA. All rights reserved.</span>
          <span>aopstsma.in</span>
        </div>
      </div>
    </footer>
  );
}
