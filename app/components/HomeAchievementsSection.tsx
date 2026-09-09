'use client';

import Link from 'next/link';

export default function HomeAchievementsSection() {
  const milestones = [
    {
      year: '1980',
      tag: 'FOUNDING CHARTER',
      title: 'State-wide Coalition Established',
      desc: 'Formed as the registered apex association under Societies Registration Act XXI of 1860, uniting non-government teacher training institutions across Odisha under one voice.',
      icon: '🏛️',
    },
    {
      year: '2008',
      tag: 'ORISSA HIGH COURT',
      title: 'Writ Petition 10372 of 2008 & Interim Stay',
      desc: 'Successfully challenged arbitrary state derecognition orders in the High Court of Orissa, obtaining a landmark stay protecting the operations of 56+ training schools.',
      icon: '⚖️',
    },
    {
      year: '2010',
      tag: 'SUPREME COURT OF INDIA',
      title: 'National Recognition & Autonomy Upheld',
      desc: 'Carried the cause to the Supreme Court of India, securing decisive judicial protection for private secondary training colleges and teacher educators.',
      icon: '🛡️',
    },
    {
      year: '2020s',
      tag: 'INSTITUTIONAL CONTINUITY',
      title: '45,000+ Certified Teacher Graduates Protected',
      desc: 'Continuous coordination with the Board of Secondary Education (BSE) and NCTE, ensuring uninterrupted conduct of examinations and degree validation.',
      icon: '🎓',
    },
  ];

  return (
    <section className="section" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="wrap">
        <div className="head">
          <div className="head__rule"></div>
          <h2>Our Achievements &amp; Historical Milestones</h2>
          <p className="lede">
            For 45 years, AOPSTSMA has stood as the unyielding legal and institutional shield
            for private secondary training schools across Odisha.
          </p>
        </div>

        {/* Milestones 4-card grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.75rem',
            marginBottom: '3rem',
          }}
        >
          {milestones.map((m, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderTop: '4px solid #D97706',
                borderRadius: '6px',
                padding: '1.75rem 1.5rem',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 2px 8px rgba(11, 37, 69, 0.04)',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                <span style={{ fontSize: '1.75rem' }}>{m.icon}</span>
                <span
                  style={{
                    fontFamily: 'var(--display)',
                    fontSize: '1.4rem',
                    fontWeight: 700,
                    color: '#0B2545',
                  }}
                >
                  {m.year}
                </span>
              </div>

              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: '#B45309',
                  marginBottom: '0.45rem',
                }}
              >
                {m.tag}
              </span>

              <h3 style={{ fontSize: '1.1rem', color: '#0F172A', fontWeight: 600, marginBottom: '0.65rem' }}>
                {m.title}
              </h3>

              <p style={{ fontSize: '0.86rem', color: '#64748B', lineHeight: '1.6', margin: 0 }}>
                {m.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Call to View Full Legal Archive */}
        <div
          style={{
            backgroundColor: '#0B2545',
            color: '#FFFFFF',
            borderRadius: '8px',
            padding: '2.25rem 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.5rem',
            borderLeft: '5px solid #D97706',
          }}
        >
          <div>
            <h3 style={{ color: '#FFFFFF', fontSize: '1.25rem', marginBottom: '0.35rem', fontWeight: 600 }}>
              Need certified judgment papers or departmental precedents?
            </h3>
            <p style={{ color: '#CBD5E1', fontSize: '0.9rem', margin: 0, maxWidth: '60ch' }}>
              Our archive contains the complete chronology of Orissa High Court orders, stay notifications,
              and policy representations since 1980.
            </p>
          </div>

          <Link
            className="btn btn--primary"
            href="/achievements"
            style={{ whiteSpace: 'nowrap' }}
          >
            Explore Complete Legal Archives &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
