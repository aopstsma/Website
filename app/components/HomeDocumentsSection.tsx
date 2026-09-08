'use client';

import { useState } from 'react';
import Link from 'next/link';
import { DOCUMENTS, DocumentRecord } from '@/lib/data/schools';

type FilterCategory = 'all' | 'court_order' | 'department_letter' | 'notice';

export default function HomeDocumentsSection() {
  const [filter, setFilter] = useState<FilterCategory>('all');

  const tabs: { id: FilterCategory; label: string; count: number }[] = [
    { id: 'all', label: 'All Updates', count: DOCUMENTS.length },
    {
      id: 'court_order',
      label: 'Court Orders',
      count: DOCUMENTS.filter((d) => d.category === 'court_order').length,
    },
    {
      id: 'department_letter',
      label: 'Department Letters',
      count: DOCUMENTS.filter((d) => d.category === 'department_letter').length,
    },
    {
      id: 'notice',
      label: 'News & Circulars',
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
        <div className="head reveal">
          <div className="head__rule"></div>
          <h2>Court Orders, Letters & News</h2>
          <p className="lede">
            High Court judgments, departmental orders and association circulars,
            kept in the open where every member school can access them.
          </p>
        </div>

        {/* Category filter tabs */}
        <div className="filters reveal" style={{ marginBottom: '2.2rem' }}>
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

        {/* List of documents */}
        <div className="docs reveal" id="doc-list">
          {displayedDocs.map((d, index) => {
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
                  <span className="doc__title">
                    <span className={getBadgeClass(d.category)}>
                      {d.badge || d.category.replace('_', ' ')}
                    </span>
                    {d.title}
                  </span>
                  <span className="doc__meta">{d.note}</span>
                </span>
                <span className="doc__get">{action}</span>
              </Tag>
            );
          })}
        </div>

        <div style={{ marginTop: '2.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <Link className="btn btn--ghost" href="/achievements">
            View all legal records & archives &rarr;
          </Link>
          <span style={{ fontSize: 'var(--t-sm)', color: 'var(--body-dark)', opacity: 0.8 }}>
            Certified copies of High Court petitions and departmental correspondence
          </span>
        </div>
      </div>
    </section>
  );
}
