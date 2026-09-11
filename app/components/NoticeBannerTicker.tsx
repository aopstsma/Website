'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface NoticeItem {
  id: string;
  badge: string;
  badgeBg: string;
  title: string;
  date: string;
  link: string;
  isNew?: boolean;
}

const NOTICES: NoticeItem[] = [
  {
    id: 'n-1',
    badge: 'PAYMENT NOTICE',
    badgeBg: '#D97706',
    title: 'Online Verification & Fee Portal for 2026 Batch candidates is live (Student Fee: ₹2,500)',
    date: '11 Sep 2026',
    link: '/pay',
    isNew: true,
  },
  {
    id: 'n-2',
    badge: 'LEGAL ORDER',
    badgeBg: '#15803D',
    title: 'High Court of Orissa Order protects recognition status of 90 affiliated training institutions',
    date: '28 Aug 2026',
    link: '/achievements',
    isNew: true,
  },
  {
    id: 'n-3',
    badge: 'MEMBER SCHOOLS',
    badgeBg: '#2563EB',
    title: 'School Roster Dashboard active for CSV/Excel uploads & annual association fee payment (₹25,000)',
    date: '15 Aug 2026',
    link: '/school-login',
  },
  {
    id: 'n-4',
    badge: 'ZONAL MEETING',
    badgeBg: '#7C3AED',
    title: 'Berhampur & Bhubaneswar Zonal Committee meeting scheduled for regional coordinators',
    date: '02 Aug 2026',
    link: '/zones',
  },
];

export default function NoticeBannerTicker() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % NOTICES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const current = NOTICES[currentIndex];

  return (
    <div
      style={{
        background: 'linear-gradient(90deg, #07172C 0%, #0B2545 50%, #133C6D 100%)',
        borderBottom: '1px solid #D97706',
        color: '#FFFFFF',
        padding: '0.65rem 0',
        fontSize: '0.88rem',
      }}
    >
      <div className="wrap" style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'nowrap' }}>
        {/* FLASHING BADGE */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: '#D97706',
            color: '#FFFFFF',
            fontWeight: 800,
            fontSize: '0.72rem',
            padding: '0.25rem 0.65rem',
            borderRadius: '4px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          LATEST ANNOUNCEMENTS
        </div>

        {/* ROTATING TICKER CONTENT */}
        <div style={{ flex: 1, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', transition: 'all 0.4s ease' }}>
            <span
              style={{
                background: current.badgeBg,
                color: '#FFF',
                fontSize: '0.68rem',
                fontWeight: 700,
                padding: '0.15rem 0.45rem',
                borderRadius: '3px',
                whiteSpace: 'nowrap',
              }}
            >
              {current.badge}
            </span>
            {current.isNew && (
              <span
                style={{
                  background: '#EF4444',
                  color: '#FFF',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  padding: '0.1rem 0.35rem',
                  borderRadius: '3px',
                }}
              >
                NEW
              </span>
            )}
            <span style={{ fontWeight: 500, color: '#F8FAFC' }}>{current.title}</span>
            <span style={{ color: '#94A3B8', fontSize: '0.78rem' }}>&middot; {current.date}</span>
          </div>
        </div>

        {/* TICKER CONTROLS & LINK */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
          <Link
            href={current.link}
            style={{
              color: '#FDE68A',
              fontWeight: 700,
              fontSize: '0.82rem',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.2rem',
            }}
          >
            View Details &rarr;
          </Link>
          <div style={{ display: 'flex', gap: '0.2rem' }}>
            {NOTICES.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                style={{
                  width: idx === currentIndex ? '16px' : '6px',
                  height: '6px',
                  borderRadius: '3px',
                  background: idx === currentIndex ? '#D97706' : 'rgba(255,255,255,0.3)',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                aria-label={`Notice ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
