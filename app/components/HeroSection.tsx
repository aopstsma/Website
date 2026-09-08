'use client';

import { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

// Client-only dynamic import of OdishaHeroMap to prevent any SSR canvas issues
const OdishaHeroMap = dynamic(() => import('./OdishaHeroMap'), { ssr: false });

export default function HeroSection() {
  const [activeZone, setActiveZone] = useState<string | null>(null);
  const router = useRouter();

  const zones = [
    { id: 'balasore', name: 'Balasore', count: '30', href: '/schools?zone=balasore' },
    { id: 'cuttack', name: 'Cuttack', count: '18', href: '/schools?zone=cuttack' },
    { id: 'bhubaneswar', name: 'Bhubaneswar', count: '—', href: '/schools?zone=bhubaneswar' },
    { id: 'zone-four', name: 'Fourth zone', count: 'pending', href: '/zones' },
    { id: 'sambalpur', name: 'Sambalpur', count: '8', href: '/schools?zone=sambalpur' },
    { id: 'berhampur', name: 'Berhampur', count: '—', href: '/schools?zone=berhampur' },
  ];

  return (
    <section className="hero">
      <OdishaHeroMap activeZone={activeZone} />
      <div className="wrap hero__inner">
        <div>
          <p className="hero__est">Established 1980</p>
          <h1>The training schools of Odisha, standing <em>together</em>.</h1>
          <p className="hero__sub">
            For forty-five years this association has represented private secondary
            training schools across the state &mdash; carrying their case through the
            High Court and the Supreme Court, and speaking for them where decisions
            are made.
          </p>
          <div className="hero__actions">
            <Link className="btn btn--primary" href="/schools">Find your school</Link>
            <Link className="btn btn--ghost" href="/achievements">Read the legal record</Link>
          </div>
        </div>

        <div className="zone-rail">
          <p className="zone-rail__title">SIX ZONES</p>
          {zones.map((z) => (
            <button
              key={z.id}
              type="button"
              data-zone={z.id}
              className={activeZone === z.id ? 'is-active' : ''}
              onMouseEnter={() => setActiveZone(z.id)}
              onMouseLeave={() => setActiveZone(null)}
              onFocus={() => setActiveZone(z.id)}
              onBlur={() => setActiveZone(null)}
              onClick={() => router.push(z.href)}
            >
              {z.name} <span>{z.count}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
