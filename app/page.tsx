import Link from 'next/link';
import HeroSection from './components/HeroSection';
import HomeDocumentsSection from './components/HomeDocumentsSection';
import { ZONES, SCHOOLS } from '@/lib/data/schools';

export default function HomePage() {
  const schoolCount = SCHOOLS.length;

  const countByZone = (zoneId: string) => {
    return SCHOOLS.filter((s) => s.zone === zoneId).length;
  };

  return (
    <>
      <HeroSection />

      {/* ============ FACTS ============ */}
      <section className="facts">
        <div className="wrap facts__grid">
          <div className="facts__item">
            <div className="facts__n">45</div>
            <div className="facts__l">Years representing member schools</div>
          </div>
          <div className="facts__item">
            <div className="facts__n" id="stat-schools">{schoolCount}</div>
            <div className="facts__l">Schools listed in the directory</div>
          </div>
          <div className="facts__item">
            <div className="facts__n">6</div>
            <div className="facts__l">Zones covering the state</div>
          </div>
          <div className="facts__item">
            <div className="facts__n">3</div>
            <div className="facts__l">Writ petitions carried to judgment</div>
          </div>
        </div>
      </section>

      {/* ============ WHAT WE DO ============ */}
      <section className="section section--light">
        <div className="wrap">
          <div className="head reveal">
            <div className="head__rule"></div>
            <h2>What the association does</h2>
            <p className="lede">
              A single training school rarely has the time or the resources to fight a
              departmental order on its own. Together, they do.
            </p>
          </div>

          <div className="services reveal">
            <article className="service">
              <h3>Legal representation</h3>
              <p>
                The association files and funds cases on behalf of member schools, from the
                Orissa High Court through to the Supreme Court, and circulates every order it
                obtains to the full membership.
              </p>
            </article>
            <article className="service">
              <h3>Recognition and renewal</h3>
              <p>
                Guidance on DIR recognition, renewal timelines and the paperwork the Board
                of Secondary Education expects, so a school is never caught out by a deadline
                it did not know about.
              </p>
            </article>
            <article className="service">
              <h3>A voice with government</h3>
              <p>
                Representations to the School and Mass Education Department and the Board,
                made on behalf of all member schools rather than one at a time.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ============ ZONES ============ */}
      <section className="section">
        <div className="wrap">
          <div className="head reveal">
            <div className="head__rule"></div>
            <h2>Six zones, one association</h2>
            <p className="lede">
              Every member school belongs to a zone. Choose yours to see the
              schools listed under it.
            </p>
          </div>
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
        </div>
      </section>

      {/* ============ RECORDS, LETTERS & NEWS SHOWCASE ============ */}
      <HomeDocumentsSection />

      {/* ============ OFFICE BEARERS ============ */}
      <section className="section section--light">
        <div className="wrap">
          <div className="head reveal">
            <div className="head__rule"></div>
            <h2>Who to speak to</h2>
          </div>
          <div className="bearers reveal">
            <div className="bearer">
              <span>President</span>
              <h3>Nirmal Kant Mohanty</h3>
            </div>
            <div className="bearer">
              <span>Secretary</span>
              <h3>Aba Pradhan</h3>
            </div>
            <div className="bearer">
              <span>Association office</span>
              <h3>
                <a href="tel:+916370987576" style={{ textDecoration: 'none' }}>
                  63709 87576
                </a>
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* ============ BAND ============ */}
      <section className="band">
        <div className="wrap">
          <h2>Is your school missing from the directory?</h2>
          <Link className="btn btn--primary" href="/contact">
            Send us your details
          </Link>
        </div>
      </section>
    </>
  );
}
