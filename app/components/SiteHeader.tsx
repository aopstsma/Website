'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

import Image from 'next/image';

export default function SiteHeader() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Close nav on route change
  useEffect(() => {
    setIsMobileOpen(false);
    setIsLoginOpen(false);
  }, [pathname]);

  const toggleMobileMenu = () => {
    setIsMobileOpen((prev) => !prev);
  };

  const toggleLoginMenu = () => {
    setIsLoginOpen((prev) => !prev);
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About Us' },
    { href: '/zones', label: 'Zones' },
    { href: '/schools', label: 'Member Schools' },
    { href: '/achievements', label: 'Court Orders' },
    { href: '/services', label: 'Services' },
    { href: '/gallery', label: 'Gallery' },
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
            aria-expanded={isMobileOpen}
            aria-controls="primary-nav"
            onClick={toggleMobileMenu}
          >
            {isMobileOpen ? 'Close' : 'Menu'}
          </button>

          <nav
            className="nav"
            id="primary-nav"
            aria-label="Primary"
            data-open={isMobileOpen ? 'true' : 'false'}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? 'page' : undefined}
                onClick={() => setIsMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="header-actions" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <Link className="header-action-btn" href="/pay">
              <span>💳 Pay Fees</span>
            </Link>

            {/* DUAL LOGIN DROPDOWN MENU */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                className="header-action-btn header-action-btn--login"
                onClick={toggleLoginMenu}
                style={{
                  background: 'linear-gradient(135deg, #0B2545 0%, #133C6D 100%)',
                  color: '#FFF',
                  border: '1px solid rgba(217,119,6,0.5)',
                  cursor: 'pointer',
                  padding: '0.55rem 0.95rem',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <span>🔑 Login</span>
                <small style={{ fontSize: '0.65rem', color: '#FDE68A' }}>▼</small>
              </button>

              {isLoginOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    width: '230px',
                    background: '#FFFFFF',
                    borderRadius: '10px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.18)',
                    border: '1px solid #E2E8F0',
                    padding: '0.5rem',
                    zIndex: 100,
                  }}
                >
                  <Link
                    href="/school-login"
                    onClick={() => setIsLoginOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      color: '#0F172A',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                    }}
                  >
                    <span>🏫</span>
                    <div>
                      <div style={{ color: '#0B2545' }}>Member School Login</div>
                      <small style={{ color: '#64748B', fontWeight: 500, fontSize: '0.72rem', display: 'block' }}>
                        For 90 Recognized Institutions
                      </small>
                    </div>
                  </Link>

                  <div style={{ borderTop: '1px solid #F1F5F9', margin: '0.25rem 0' }} />

                  <Link
                    href="/admin-login"
                    onClick={() => setIsLoginOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      color: '#0F172A',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                    }}
                  >
                    <span>🏛️</span>
                    <div>
                      <div style={{ color: '#D97706' }}>State Admin Login</div>
                      <small style={{ color: '#64748B', fontWeight: 500, fontSize: '0.72rem', display: 'block' }}>
                        Central Secretariat Admin
                      </small>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
