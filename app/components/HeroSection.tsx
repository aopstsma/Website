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
    { id: 'balasore',    name: 'Balasore Zone',    schools: '30 Schools', badge: 'North Coastal',    districts: 'Balasore, Bhadrak, Jajpur',             href: '/schools?zone=balasore',    status: 'Verified Registry Active' },
    { id: 'cuttack',     name: 'Cuttack Zone',     schools: '18 Schools', badge: 'Central Judicial',  districts: 'Cuttack, Kendrapara, Jagatsinghpur',    href: '/schools?zone=cuttack',     status: 'High Court Jurisdiction' },
    { id: 'bhubaneswar', name: 'Bhubaneswar HQ',   schools: 'State HQ',   badge: 'Secretariat',      districts: 'Khordha, Puri, Nayagarh',               href: '/schools?zone=bhubaneswar', status: 'Central Command & Liaison' },
    { id: 'zone-four',   name: 'Baripada Zone',    schools: 'North Dist.', badge: 'Mayurbhanj',      districts: 'Mayurbhanj, Keonjhar',                   href: '/zones',                   status: 'Northern Tribal Belt' },
    { id: 'sambalpur',   name: 'Sambalpur Zone',   schools: '8 Schools',  badge: 'Western Range',    districts: 'Sambalpur, Bargarh, Jharsuguda, Sundargarh', href: '/schools?zone=sambalpur', status: 'Western Educational Division' },
    { id: 'berhampur',   name: 'Berhampur Zone',   schools: 'South Dist.', badge: 'Southern Range',  districts: 'Ganjam, Gajapati, Koraput, Rayagada',   href: '/schools?zone=berhampur',   status: 'Southern Coastal Division' },
  ];

  const activeZone = zones.find(z => z.id === selectedZone) || zones[0];

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
              🏛️ APEX INSTITUTIONAL ASSOCIATION &middot; 45 YEARS OF ADVOCACY
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
            The premier state statutory association representing 56+ recognized D.El.Ed &amp;
            B.Ed teacher education institutions across all 30 districts of Odisha. Protecting
            institutional autonomy, securing landmark High Court judgments, and advocating for
            secondary teacher education.
          </p>

          {/* Trust Credentials Strip */}
          <div className="hero__trust-strip">
            <div className="hero__trust-item">
              <span className="hero__trust-icon">⚖️</span>
              <div>
                <b>High Court Decree</b>
                <small>W.P.(C) 4410/2021 Protected</small>
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
                <b>56+ Colleges</b>
                <small>30 Districts of Odisha</small>
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
              <span>🏫 Search Member Schools</span>
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
                <span>LIVE ZONAL NETWORK &middot; 3D SATELLITE VIEW</span>
              </div>
              <span className="hero-3d-showcase__badge">INTERACTIVE</span>
            </div>

            {/* 3D Map Canvas */}
            <div className="hero-3d-showcase__viewport">
              <OdishaHeroMap />
            </div>

            {/* Interactive Zone Navigation */}
            <div className="hero-3d-showcase__zones">
              <div className="hero-3d-showcase__zones-header">
                <h4>Administrative Jurisdictions (6 Zones)</h4>
                <p>Select a zone to inspect &amp; highlight on map:</p>
              </div>

              <div className="showcase-zones-grid">
                {zones.map(z => (
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
