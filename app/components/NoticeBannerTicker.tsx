'use client';

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
    badge: 'ONLINE PORTAL',
    badgeBg: '#D97706',
    title: 'Online Verification & Fee Portal for 2026 Batch candidates is live (Student Fee: ₹2,500)',
    date: '11 Sep 2026',
    link: '/pay',
    isNew: true,
  },
  {
    id: 'n-2',
    badge: 'HIGH COURT DECREE',
    badgeBg: '#15803D',
    title: 'High Court of Orissa landmark decree protects recognition status of 90 affiliated training institutions (W.P.(C) 5640/2009)',
    date: '28 Aug 2026',
    link: '/achievements',
    isNew: true,
  },
  {
    id: 'n-3',
    badge: 'GOVT. DIRECTIVE',
    badgeBg: '#2563EB',
    title: 'School & Mass Education Dept Clarification on Recognition & DIR Timelines (Memo S&ME/TE-1422/2026)',
    date: '20 Aug 2026',
    link: '/achievements',
  },
  {
    id: 'n-4',
    badge: 'ROSTER DASHBOARD',
    badgeBg: '#7C3AED',
    title: 'School Roster Dashboard active for CSV/Excel batch upload & annual dues payment (₹25,000)',
    date: '15 Aug 2026',
    link: '/school-login',
    isNew: true,
  },
  {
    id: 'n-5',
    badge: 'BSE NOTIFICATION',
    badgeBg: '#0D9488',
    title: 'Board of Secondary Education (BSE) Examination Schedule & Center Choice Allocation 2026',
    date: '08 Aug 2026',
    link: '/services',
  },
  {
    id: 'n-6',
    badge: 'ZONAL ADVISORY',
    badgeBg: '#C026D3',
    title: 'All 5 Zonal Conveners review meeting scheduled at Central Command Secretariat, Bhubaneswar',
    date: '02 Aug 2026',
    link: '/zones',
  },
];

export default function NoticeBannerTicker() {
  // Duplicate notices for seamless infinite CSS marquee loop
  const marqueeItems = [...NOTICES, ...NOTICES];

  return (
    <div className="marquee-ticker-bar" aria-label="Latest Association Notices">
      {/* FIXED LEFT BADGE WITH LIVE PULSE */}
      <div className="marquee-badge">
        <span className="marquee-badge__dot" />
        <span className="marquee-badge__text-desktop">⚡ LATEST NOTICES</span>
        <span className="marquee-badge__text-mobile">⚡ NOTICES</span>
      </div>

      {/* CONTINUOUS SCROLLING TRACK (PAUSES ON HOVER) */}
      <div className="marquee-content-wrap">
        <div className="marquee-track">
          {marqueeItems.map((item, idx) => (
            <Link
              key={`${item.id}-${idx}`}
              href={item.link}
              className="marquee-item"
              title={`${item.title} (Click to open)`}
            >
              <span className="marquee-tag" style={{ backgroundColor: item.badgeBg }}>
                {item.badge}
              </span>
              {item.isNew && <span className="marquee-new">NEW</span>}
              <span className="marquee-title">{item.title}</span>
              <span className="marquee-date">&bull; {item.date}</span>
              <span className="marquee-arrow">&rarr;</span>
              <span className="marquee-divider">|</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
