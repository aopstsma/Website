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
    { href: '/about', label: 'About' },
    { href: '/zones', label: 'Zones' },
    { href: '/schools', label: 'Member schools' },
    { href: '/achievements', label: 'Legal records' },
    { href: '/services', label: 'Services' },
    { href: '/contact', label: 'Contact' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="site-header">
      <div className="wrap site-header__bar">
        <Link className="brand" href="/">
          <span className="brand__seal">1980</span>
          <span className="brand__name">
            <b>AOPSTSMA</b>
            <span>ALL ORISSA &middot; SINCE 1980</span>
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
      </div>
    </header>
  );
}
