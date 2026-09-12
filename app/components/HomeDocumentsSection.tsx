'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { DOCUMENTS, DocumentRecord } from '@/lib/data/schools';
import CourtOrderModal from './CourtOrderModal';

type FilterCategory = 'all' | 'court_order' | 'department_letter' | 'notice';

export default function HomeDocumentsSection() {
  const [filter, setFilter] = useState<FilterCategory>('all');
  const [selectedDoc, setSelectedDoc] = useState<DocumentRecord | null>(null);

  const tabs: { id: FilterCategory; label: string; count: number }[] = [
    { id: 'all', label: 'All Legal Records', count: DOCUMENTS.length },
    {
      id: 'court_order',
      label: 'High Court Orders',
      count: DOCUMENTS.filter((d) => d.category === 'court_order').length,
    },
    {
      id: 'department_letter',
      label: 'Govt & BSE Letters',
      count: DOCUMENTS.filter((d) => d.category === 'department_letter').length,
    },
    {
      id: 'notice',
      label: 'Association Circulars',
      count: DOCUMENTS.filter((d) => d.category === 'notice').length,
    },
  ];

  const displayedDocs =
    filter === 'all'
      ? DOCUMENTS.slice(0, 6)
      : DOCUMENTS.filter((d) => d.category === filter);

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
    <section className="section section--deep">
      <div className="wrap">
        <div className="head">
          <div className="head__rule"></div>
          <h2>High Court Orders &amp; Legal Records</h2>
          <p className="lede">
            Certified judgments, stay orders, and writ petitions from the High Court of
            Orissa and the Supreme Court. Click on any record to view its certified front page
            scan and download the official PDF copy.
          </p>
        </div>

        {/* Category filter tabs */}
        <div className="filters" style={{ marginBottom: '2rem' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className="chip"
              data-filter={tab.id}
              aria-pressed={filter === tab.id}
              onClick={() => setFilter(tab.id)}
            >
              {tab.label} <span style={{ opacity: 0.75, fontSize: 'var(--t-xs)' }}>({tab.count})</span>
            </button>
          ))}
        </div>

        {/* List of documents with Front-Page Preview on Click */}
        <div className="docs" id="doc-list">
          {displayedDocs.map((d, index) => {
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
                    <span className={getBadgeClass(d.category)}>
                      {d.badge || d.category.replace('_', ' ')}
                    </span>
                    {d.title}
                  </div>
                  <div className="doc__meta">{d.note}</div>
                  {d.image && (
                    <div className="doc__cert-badge">
                      <span>📜</span> Official Scanned Front Page &amp; Coram Sheet Available
                    </div>
                  )}
                </div>

                <div className="doc__actions">
                  {d.image && (
                    <div className="doc-scan-thumb">
                      <Image
                        src={d.image}
                        alt={`Thumbnail of ${d.title}`}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                  )}

                  <span className="doc__get">
                    👁️ Inspect Order &rarr;
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: '2.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <Link className="btn btn--primary" href="/achievements">
            View All Court Judgments &amp; Archives &rarr;
          </Link>
          <span style={{ fontSize: 'var(--t-sm)', color: '#475569', fontWeight: 500 }}>
            Maintained under custody of AOPSTSMA Legal Affairs Secretariat
          </span>
        </div>
      </div>

      {/* Modal for Front-Page Preview & Download */}
      <CourtOrderModal doc={selectedDoc} onClose={() => setSelectedDoc(null)} />
    </section>
  );
}
