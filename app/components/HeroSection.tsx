'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

// Client-only import — Three.js crashes if it runs on the server
const OdishaHeroMap = dynamic(() => import('./OdishaHeroMap'), { ssr: false });

export default function HeroSection() {
  const [selectedZone, setSelectedZone] = useState<string>('balasore');
  const router = useRouter();

  const zones = [
    {
      id: 'balasore',
      name: 'Baleswar Zone',
      schools: '40 Schools',
      badge: 'North Coastal & Tribal',
      districts: 'Mayurbhanj, Keonjhar, Balasore, Bhadrak',
      href: '/schools?zone=balasore',
      status: 'Active Registered Zone (40 Institutions)',
    },
    {
      id: 'central',
      name: 'Central Zone',
      schools: '24 Schools',
      badge: 'Judicial & Mahanadi Belt',
      districts: 'Cuttack, Kendrapara, Jajpur, Dhenkanal, Angul',
      href: '/schools?zone=central',
      status: 'High Court Jurisdiction (24 Institutions)',
    },
    {
      id: 'bhubaneswar',
      name: 'Bhubaneswar Zone',
      schools: '15 Schools',
      badge: 'State Capital HQ',
      districts: 'Khordha, Nayagarh, Puri',
      href: '/schools?zone=bhubaneswar',
      status: 'Central Command & Secretariat (15 Institutions)',
    },
    {
      id: 'sambalpur',
      name: 'Sambalpur Zone',
      schools: '9 Schools',
      badge: 'Western Range',
      districts: 'Sambalpur, Sundargarh, Bargarh, Jharsuguda',
      href: '/schools?zone=sambalpur',
      status: 'Western Educational Division (9 Institutions)',
    },
    {
      id: 'ganjam',
      name: 'Berhampur Zone',
      schools: '2 Schools',
      badge: 'Southern Coastal Range',
      districts: 'Ganjam, Gajapati, Southern Coastal Belt',
      href: '/schools?zone=ganjam',
      status: 'Southern Regional Registry (2 Institutions)',
    },
  ];

  const activeZone = zones.find((z) => z.id === selectedZone) || zones[0];

  const handleZoneHover = (zoneId: string) => {
    setSelectedZone(zoneId);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('aopstsma:zone-hover', { detail: { zoneId } }));
    }
  };

  return (
    <section className="hero">
      <div className="wrap hero__inner">
        {/* ============ LEFT COLUMN ============ */}
        <div className="hero__content">
          <div className="hero__est">
            <span className="hero__est-badge">ESTD. 1980</span>
            <span className="hero__est-text">
              🏛️ 45 YEARS OF ADVOCACY
            </span>
          </div>

          <h1 className="hero__title">
            All Orissa Private Secondary Training Schools{' '}
            <span className="hero__title-highlight">Management Association</span>
          </h1>

          <div className="hero__odia-title">
            <span>ସର୍ବ ଓଡ଼ିଶା ବେସରକାରୀ ମାଧ୍ୟମିକ ପ୍ରଶିକ୍ଷଣ ବିଦ୍ୟାଳୟ ପରିଚାଳନା ସଂଘ</span>
          </div>

          <p className="hero__sub">
            The premier state statutory association representing 90 recognized secondary
            training schools and teacher education institutions across all 30 districts of Odisha.
            Protecting institutional autonomy, securing landmark High Court judgments, and advocating for
            secondary teacher education.
          </p>

          {/* Trust Credentials Strip */}
          <div className="hero__trust-strip">
            <div className="hero__trust-item">
              <span className="hero__trust-icon">⚖️</span>
              <div>
                <b>High Court Landmark Decree</b>
                <small>W.P.(C) 5640/2009 Protected</small>
              </div>
            </div>
            <div className="hero__trust-item">
              <span className="hero__trust-icon">📜</span>
              <div>
                <b>Govt. Registered</b>
                <small>Act XXI of 1860 &middot; No. 1422/80</small>
              </div>
            </div>
            <div className="hero__trust-item">
              <span className="hero__trust-icon">🏫</span>
              <div>
                <b>90 Member Colleges</b>
                <small>5 Zones &middot; 30 Districts of Odisha</small>
              </div>
            </div>
          </div>

          <div className="hero__actions">
            <Link className="btn btn--primary hero__btn-primary" href="/services">
              <span>💳 Pay Annual Portal Fee</span>
            </Link>
            <Link className="btn btn--secondary hero__btn-secondary" href="/achievements">
              <span>⚖️ High Court Orders &amp; Judgments</span>
            </Link>
            <Link className="btn btn--ghost hero__btn-ghost" href="/schools">
              <span>🏫 Search 90 Member Schools</span>
            </Link>
          </div>
        </div>

        {/* ============ RIGHT COLUMN: CINEMATIC 3D MAP SHOWCASE ============ */}
        <div className="hero__brand-column">
          <div className="hero-3d-showcase">
            {/* Header Bar */}
            <div className="hero-3d-showcase__header">
              <div className="hero-3d-showcase__header-left">
                <Image
                  src="/assets/img/aopstsma-seal.jpg"
                  alt="AOPSTSMA Seal"
                  width={24}
                  height={24}
                  className="hero-3d-showcase__mini-seal"
                />
                <span className="hero-3d-showcase__live-dot"></span>
                <span>STATE NETWORK &middot; 3D TOPOGRAPHIC MODEL</span>
              </div>
              <span className="hero-3d-showcase__badge">INTERACTIVE 3D</span>
            </div>

            {/* 3D Map Canvas Viewport */}
            <div className="hero-3d-showcase__viewport">
              <OdishaHeroMap />
            </div>

            {/* Interactive Zone Navigation */}
            <div className="hero-3d-showcase__zones">
              <div className="hero-3d-showcase__zones-header">
                <h4>5 Administrative Zones &middot; 90 Institutions</h4>
                <p>Click or hover any zone to inspect &amp; focus 3D map:</p>
              </div>

              <div className="showcase-zones-grid">
                {zones.map((z) => (
                  <button
                    key={z.id}
                    type="button"
                    className={`showcase-zone-btn ${selectedZone === z.id ? 'is-selected' : ''}`}
                    onClick={() => handleZoneHover(z.id)}
                    onMouseEnter={() => handleZoneHover(z.id)}
                  >
                    <div className="showcase-zone-btn__top">
                      <span className="showcase-zone-btn__name">{z.name}</span>
                      <span className="showcase-zone-btn__badge">{z.badge}</span>
                    </div>
                    <span className="showcase-zone-btn__count">{z.schools}</span>
                  </button>
                ))}
              </div>

              {/* Active Zone Inspector */}
              <div className="showcase-zone-inspector">
                <div className="showcase-zone-inspector__info">
                  <div className="showcase-zone-inspector__headline">
                    <b>{activeZone.name}</b>
                    <span className="showcase-zone-inspector__status">
                      ● {activeZone.status}
                    </span>
                  </div>
                  <div className="showcase-zone-inspector__districts">
                    <span>Districts:</span> {activeZone.districts}
                  </div>
                </div>
                <button
                  type="button"
                  className="showcase-zone-inspector__btn"
                  onClick={() => router.push(activeZone.href)}
                >
                  View Schools &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
