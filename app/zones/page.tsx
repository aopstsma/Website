import type { Metadata } from 'next';
import Link from 'next/link';
import { ZONES, SCHOOLS } from '@/lib/data/schools';

export const metadata: Metadata = {
  title: 'Zones — AOPSTSMA',
  description:
    'The five administrative zones of the All Orissa Private Secondary Training Schools Management Association and the districts each covers.',
};

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
                  <h3>{z.name}</h3>
                  <p className="zone-card__dist">{z.districts}</p>
                  <span className="zone-card__n">{label}</span>
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
