'use client';

import { useState } from 'react';
import Image from 'next/image';
import { DOCUMENTS, DocumentRecord } from '@/lib/data/schools';
import CourtOrderModal from '../components/CourtOrderModal';

export default function AchievementsPage() {
  const [selectedDoc, setSelectedDoc] = useState<DocumentRecord | null>(null);

  const getBadgeClass = (category: DocumentRecord['category']) => {
    switch (category) {
      case 'court_order':
        return 'doc__badge doc__badge--court';
      case 'department_letter':
        return 'doc__badge doc__badge--dept';
      case 'notice':
        return 'doc__badge doc__badge--notice';
      default:
        return 'doc__badge';
    }
  };

  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <h1>The Legal Record &amp; Judicial Precedents</h1>
          <p className="lede">
            Authenticated High Court judgments, certified writ orders, and government departmental circulars secured on behalf of member schools.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="docs reveal" id="doc-list">
            {DOCUMENTS.map((d, index) => {
              return (
                <div
                  key={index}
                  className="doc"
                  role="button"
                  tabIndex={0}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedDoc(d)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedDoc(d);
                    }
                  }}
                >
                  <div className="doc__ref">
                    <span>{d.ref}</span>
                    {d.year ? (
                      <span className="doc__year">{d.year}</span>
                    ) : null}
                  </div>

                  <div className="doc__content" style={{ flex: 1, minWidth: 0 }}>
                    <div className="doc__title">
                      {d.badge ? (
                        <span className={getBadgeClass(d.category)}>
                          {d.badge}
                        </span>
                      ) : null}
                      {d.title}
                    </div>
                    <div className="doc__meta">{d.note}</div>
                    {d.image && (
                      <div className="doc__cert-badge">
                        <span>📜</span> Certified Scanned Front Page Available &middot; Click to inspect
                      </div>
                    )}
                  </div>

                  <div className="doc__actions">
                    {d.image && (
                      <div className="doc-scan-thumb">
                        <Image
                          src={d.image}
                          alt={`Scanned preview of ${d.title}`}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                    )}

                    <span className="doc__get">
                      {d.file ? '📥 Inspect & PDF' : '📋 Request Copy'} &rarr;
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="note reveal" style={{ marginTop: '2.5rem' }}>
            Official certified court documents and orders are stored securely. For certified physical copies or departmental verification,
            member institutions can contact the central legal cell at +91 63709 87576 or via info.aopstsma@gmail.com.
          </div>
        </div>
      </section>

      <section className="section section--light">
        <div className="wrap" style={{ maxWidth: '840px' }}>
          <div className="head reveal">
            <div className="head__rule"></div>
            <h2>Why These Precedents Matter</h2>
          </div>
          <div className="stack reveal">
            <p>
              Each of these landmark judgments transformed the operational landscape for private secondary training schools across Odisha &mdash;
              restoring student examination eligibility, preventing arbitrary fee forfeitures, and clarifying departmental recognition frameworks.
            </p>
            <p>
              Member schools are strongly encouraged to retain copies in their institutional archives. When local authorities or educational officers
              question an institution’s standing, these High Court judgments by Hon’ble Justice M. M. Das provide definitive, binding protection.
            </p>
          </div>
        </div>
      </section>

      {/* Modal for Front-Page Inspection & Verified PDF Download */}
      <CourtOrderModal doc={selectedDoc} onClose={() => setSelectedDoc(null)} />
    </>
  );
}
