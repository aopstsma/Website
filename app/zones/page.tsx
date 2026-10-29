import type { Metadata } from 'next';
import Link from 'next/link';
import { ZONES, SCHOOLS } from '@/lib/data/schools';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata('/zones', {
  title: '5 Administrative Zones of AOPSTSMA',
  description:
    'Five regional administrative zones of the All Orissa Private Secondary Training Schools Management Association — Baleswar, Central (Cuttack), Bhubaneswar, Sambalpur, and Berhampur — covering all 30 districts of Odisha.',
});

export default function ZonesPage() {
  const countByZone = (zoneId: string) => {
    return SCHOOLS.filter((s) => s.zone === zoneId).length;
  };

  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <h1>Five zones across Odisha</h1>
          <p className="lede">
            Every member school belongs to a designated administrative zone. Choose a zone to see the verified institutions listed under it.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="zone-grid reveal" id="zone-grid">
            {ZONES.map((z) => {
              const n = countByZone(z.id);
              const label = `${n} verified ${n === 1 ? 'school' : 'schools'} registered`;

              return (
                <Link
                  key={z.id}
                  className="zone-card"
                  href={`/schools?zone=${z.id}`}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <h3>{z.fullTitle || z.name}</h3>
                    {z.code && (
                      <span style={{
                        background: '#0B2545',
                        color: '#FDE68A',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        padding: '0.2rem 0.55rem',
                        borderRadius: '999px',
                      }}>
                        {z.code}
                      </span>
                    )}
                  </div>
                  <p className="zone-card__dist">{z.districts}</p>
                  {z.president && z.adminOfficer && (
                    <div style={{
                      fontSize: '0.78rem',
                      color: '#334155',
                      background: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                      padding: '0.55rem 0.7rem',
                      marginBottom: '0.65rem',
                      lineHeight: 1.5,
                    }}>
                      <div>👤 <strong>President:</strong> {z.president.name}</div>
                      <div>📋 <strong>Admin Officer:</strong> {z.adminOfficer.name}</div>
                      <div>🏛️ <strong>Centres:</strong> {z.centres?.length || 1} Exam {z.centres?.length === 1 ? 'Centre' : 'Centres'}</div>
                    </div>
                  )}
                  <span className="zone-card__n">{label} &middot; Click Here &rarr;</span>
                </Link>
              );
            })}
          </div>

          <div className="note reveal" style={{ marginTop: '2.5rem' }}>
            The association represents 90 recognized secondary training institutions across all 30 districts of Odisha.
            If your institution details require an update or renewal certificate, please{' '}
            <Link href="/contact" style={{ color: 'var(--brass-hi)' }}>
              contact the central secretariat
            </Link>.
          </div>
        </div>
      </section>
    </>
  );
}
