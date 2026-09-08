import type { Metadata } from 'next';
import { DOCUMENTS } from '@/lib/data/schools';

export const metadata: Metadata = {
  title: 'Legal records — AOPSTSMA',
  description:
    'Court orders, departmental letters and association notices obtained on behalf of member schools.',
};

export default function AchievementsPage() {
  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <h1>The legal record</h1>
          <p className="lede">
            Every order, letter and notice the association has obtained on behalf of its member schools, kept in one place.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="docs reveal" id="doc-list">
            {DOCUMENTS.map((d, index) => {
              const hasFile = Boolean(d.file);
              const Tag = hasFile ? 'a' : 'div';
              const fileProps = hasFile
                ? { href: `/assets/docs/${d.file}`, download: true }
                : {};
              const action = hasFile ? 'Download PDF' : 'Copy on request';

              return (
                <Tag key={index} className="doc" {...fileProps}>
                  <span className="doc__ref">
                    {d.ref}
                    {d.year ? (
                      <>
                        <br />
                        {d.year}
                      </>
                    ) : null}
                  </span>
                  <span>
                    <span className="doc__title">{d.title}</span>
                    <span className="doc__meta">{d.note}</span>
                  </span>
                  <span className="doc__get">{action}</span>
                </Tag>
              );
            })}
          </div>

          <div className="note reveal" style={{ marginTop: '2.5rem' }}>
            Scanned copies are being uploaded. Until a record shows a download link, member
            schools can request a copy from the association office on 63709 87576 or by email.
          </div>
        </div>
      </section>

      <section className="section section--light">
        <div className="wrap" style={{ maxWidth: '820px' }}>
          <div className="head reveal">
            <div className="head__rule"></div>
            <h2>Why these matter</h2>
          </div>
          <div className="stack reveal">
            <p>
              Each of these documents changed something for member schools &mdash; a
              recognition restored, a deadline extended, a departmental instruction clarified.
              Together they are the record of what the association has been able to secure since
              the first petition was filed in 2008.
            </p>
            <p>
              Member schools are encouraged to keep copies on file. When a local
              authority questions a school&apos;s standing, the relevant order is often the fastest
              answer.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
