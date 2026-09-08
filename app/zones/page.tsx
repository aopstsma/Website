import type { Metadata } from 'next';
import Link from 'next/link';
import { ZONES, SCHOOLS } from '@/lib/data/schools';

export const metadata: Metadata = {
  title: 'Zones — AOPSTSMA',
  description:
    'The six zones of the All Orissa Private Secondary Training Schools Management Association and the districts each covers.',
};

export default function ZonesPage() {
  const countByZone = (zoneId: string) => {
    return SCHOOLS.filter((s) => s.zone === zoneId).length;
  };

  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <h1>Six zones across Odisha</h1>
          <p className="lede">
            Every member school belongs to a zone. Choose a zone to see the schools listed under it.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="zone-grid reveal" id="zone-grid">
            {ZONES.map((z) => {
              const n = countByZone(z.id);
              const label = n
                ? `${n} member ${n === 1 ? 'school' : 'schools'} listed`
                : 'List being compiled';

              return (
                <Link
                  key={z.id}
                  className="zone-card"
                  href={`/schools?zone=${z.id}`}
                  data-pending={z.pending ? 'true' : undefined}
                >
                  <h3>{z.name}</h3>
                  <p className="zone-card__dist">{z.districts}</p>
                  <span className="zone-card__n">{label}</span>
                </Link>
              );
            })}
          </div>

          <div className="note reveal" style={{ marginTop: '2.5rem' }}>
            School lists for the Bhubaneswar and Berhampur zones are still being compiled, and
            the fourth zone is awaiting confirmation of its name. If your school belongs to one
            of these and is not yet listed, please{' '}
            <Link href="/contact" style={{ color: 'var(--brass-hi)' }}>
              send us your details
            </Link>.
          </div>
        </div>
      </section>
    </>
  );
}
