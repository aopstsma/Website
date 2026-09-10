'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

import Image from 'next/image';

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
            <span className="top-bar__badge">APEX STATUTORY BODY</span>
            <span className="top-bar__reg">Societies Regn. Act XXI of 1860 &middot; Regd. No. 1422/80</span>
            <span className="top-bar__divider">&bull;</span>
            <span className="top-bar__motto">ସ୍ୱୀକୃତି &bull; ସ୍ୱାୟତ୍ତତା &bull; ନ୍ୟାୟ (Estd. 1980)</span>
          </div>
          <div className="top-bar__right">
            <div className="top-bar__ticker">
              <span className="top-bar__ticker-dot"></span>
              <span className="top-bar__ticker-text">
                High Court of Orissa Landmark Precedent Protected &middot; 56+ D.El.Ed &amp; B.Ed Colleges
              </span>
            </div>
            <a className="top-bar__link" href="tel:+916370987576">
              <span>📞 Office: +91 63709 87576</span>
            </a>
            <span className="top-bar__location">📍 Bhubaneswar, Odisha</span>
          </div>
        </div>
      </div>

      {/* ============ MAIN NAVIGATION ============ */}
      <header className="site-header">
        <div className="wrap site-header__bar">
          <Link className="brand" href="/">
            <div className="brand__seal-wrap">
              <Image
                src="/assets/img/aopstsma-seal.jpg"
                alt="AOPSTSMA Official Emblem"
                width={50}
                height={50}
                priority
                className="brand__seal-img"
              />
            </div>
            <div className="brand__name">
              <div className="brand__title-row">
                <b>AOPSTSMA</b>
                <span className="brand__badge">ESTD. 1980</span>
              </div>
              <span className="brand__sub">All Orissa Private Secondary Training Schools Management Association</span>
            </div>
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

          <div className="header-actions">
            <Link className="header-action-btn" href="/services">
              <span>💳 Pay Portal Fee</span>
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
