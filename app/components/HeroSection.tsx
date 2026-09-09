'use client';

import { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

// Client-only dynamic import of OdishaHeroMap
const OdishaHeroMap = dynamic(() => import('./OdishaHeroMap'), { ssr: false });

export default function HeroSection() {
  const [activeZone, setActiveZone] = useState<string | null>(null);
  const router = useRouter();

  const zones = [
    { id: 'balasore', name: 'Balasore Zone', count: '30 Schools', href: '/schools?zone=balasore' },
    { id: 'cuttack', name: 'Cuttack Zone', count: '18 Schools', href: '/schools?zone=cuttack' },
    { id: 'bhubaneswar', name: 'Bhubaneswar HQ', count: 'Capital', href: '/schools?zone=bhubaneswar' },
    { id: 'zone-four', name: 'Baripada Zone', count: 'North Dist.', href: '/zones' },
    { id: 'sambalpur', name: 'Sambalpur Zone', count: '8 Schools', href: '/schools?zone=sambalpur' },
    { id: 'berhampur', name: 'Berhampur Zone', count: 'South Dist.', href: '/schools?zone=berhampur' },
  ];

  const handleZoneHover = (zoneId: string | null) => {
    setActiveZone(zoneId);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('aopstsma:zone-hover', { detail: { zoneId } })
      );
    }
  };

  return (
    <section className="hero">
      <OdishaHeroMap />

      <div className="wrap hero__inner">
        <div>
          <div className="hero__est">
            <span>🏛️ APEX INSTITUTIONAL ASSOCIATION &middot; ESTD. 1980</span>
          </div>

          <h1>
            All Orissa Private Secondary Training Schools Management Association
          </h1>

          <p className="hero__sub">
            The premier state association representing 56+ recognized D.El.Ed &amp; B.Ed
            teacher education institutions across all 30 districts of Odisha. Protecting
            institutional autonomy, securing High Court judgments, and advocating for
            secondary teacher education.
          </p>

          <div className="hero__actions">
            <Link className="btn btn--primary" href="/services">
              💳 Pay Annual Portal Fee
            </Link>
            <Link className="btn btn--secondary" href="/achievements">
              ⚖️ High Court Orders &amp; Judgments
            </Link>
            <Link className="btn btn--ghost" href="/schools">
              🏫 Search Member Schools
            </Link>
          </div>
        </div>

        {/* 3D Map interactive Zone Navigator */}
        <div className="hero-map-container">
          <div className="zone-rail">
            <div className="zone-rail__title">
              Interactive 3D Zone Map
            </div>
            <p style={{ fontSize: '0.75rem', color: '#94A3B8', marginBottom: '0.75rem' }}>
              Hover over a zone to highlight on the 3D relief model:
            </p>
            <div className="zone-rail__grid">
              {zones.map((z) => (
                <button
                  key={z.id}
                  type="button"
                  data-zone={z.id}
                  className={activeZone === z.id ? 'is-active' : ''}
                  onMouseEnter={() => handleZoneHover(z.id)}
                  onMouseLeave={() => handleZoneHover(null)}
                  onFocus={() => handleZoneHover(z.id)}
                  onBlur={() => handleZoneHover(null)}
                  onClick={() => router.push(z.href)}
                >
                  <span>{z.name}</span>
                  <span>{z.count}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
