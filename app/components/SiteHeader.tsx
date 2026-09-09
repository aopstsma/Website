'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function SiteHeader() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Close nav on route change or resize
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About Us' },
    { href: '/zones', label: '6 Zones' },
    { href: '/schools', label: 'Member Schools' },
    { href: '/achievements', label: 'Court Orders & Records' },
    { href: '/services', label: 'Services' },
    { href: '/contact', label: 'Contact' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* ============ TOP OFFICIAL ANNOUNCEMENT BAR ============ */}
      <div className="top-bar">
        <div className="wrap top-bar__inner">
          <div className="top-bar__left">
            <span className="top-bar__badge">GOVT REGD</span>
            <span>Societies Registration Act XXI of 1860 &middot; Regd. No. 1422/80</span>
          </div>
          <div className="top-bar__right">
            <a className="top-bar__link" href="tel:+916370987576">
              <span>📞 Office: +91 63709 87576</span>
            </a>
            <span style={{ opacity: 0.3 }}>|</span>
            <span className="top-bar__link">
              <span>📍 Bhubaneswar, Odisha</span>
            </span>
          </div>
        </div>
      </div>

      {/* ============ MAIN NAVIGATION ============ */}
      <header className="site-header">
        <div className="wrap site-header__bar">
          <Link className="brand" href="/">
            <span className="brand__seal">1980</span>
            <span className="brand__name">
              <b>AOPSTSMA</b>
              <span>ALL ORISSA &middot; ESTD. 1980</span>
            </span>
          </Link>

          <button
            className="nav-toggle"
            aria-expanded={isOpen}
            aria-controls="primary-nav"
            onClick={toggleMenu}
          >
            {isOpen ? 'Close' : 'Menu'}
          </button>

          <nav
            className="nav"
            id="primary-nav"
            aria-label="Primary"
            data-open={isOpen ? 'true' : 'false'}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? 'page' : undefined}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Link className="header-action-btn" href="/services">
            <span>💳 Pay Portal Fee</span>
          </Link>
        </div>
      </header>
    </>
  );
}
