'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { DOCUMENTS, DocumentRecord } from '@/lib/data/schools';
import CourtOrderModal from '../components/CourtOrderModal';

type FilterTab = 'all' | 'high_court' | 'supreme_court' | 'bse_orders' | 'achievements' | 'notices';

export default function AchievementsPage() {
  const [selectedDoc, setSelectedDoc] = useState<DocumentRecord | null>(null);
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDocs = useMemo(() => {
    return DOCUMENTS.filter((doc) => {
      // Tab matching
      if (activeTab === 'high_court' && doc.subCategory !== 'high_court') return false;
      if (activeTab === 'supreme_court' && doc.category !== 'supreme_court') return false;
      if (activeTab === 'bse_orders' && doc.category !== 'bse_order' && doc.category !== 'department_letter') return false;
      if (activeTab === 'achievements' && doc.category !== 'achievement') return false;
      if (activeTab === 'notices' && doc.category !== 'notice') return false;

      // Search matching
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesRef = doc.ref.toLowerCase().includes(q);
        const matchesTitle = doc.title.toLowerCase().includes(q);
        const matchesNote = doc.note.toLowerCase().includes(q);
        const matchesYear = doc.year.toLowerCase().includes(q);
        const matchesCourt = doc.court?.toLowerCase().includes(q);
        return matchesRef || matchesTitle || matchesNote || matchesYear || matchesCourt;
      }
      return true;
    });
  }, [activeTab, searchQuery]);

  const getBadgeClass = (category: DocumentRecord['category']) => {
    switch (category) {
      case 'court_order':
        return 'doc__badge doc__badge--court';
      case 'supreme_court':
        return 'doc__badge doc__badge--court';
      case 'bse_order':
      case 'department_letter':
        return 'doc__badge doc__badge--dept';
      case 'achievement':
        return 'doc__badge doc__badge--notice';
      case 'notice':
        return 'doc__badge doc__badge--notice';
      default:
        return 'doc__badge';
    }
  };

  const getCategoryIcon = (category: DocumentRecord['category']) => {
    switch (category) {
      case 'court_order':
        return '🏛️';
      case 'supreme_court':
        return '⚖️';
      case 'bse_order':
      case 'department_letter':
        return '📜';
      case 'achievement':
        return '🏆';
      default:
        return '📢';
    }
  };

  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <h1>The Legal Record &amp; Judicial Precedents</h1>
          <p className="lede">
            Authenticated High Court of Orissa judgments, Supreme Court SLP orders, BSE communicated circulars, and 45-year academic milestones.
          </p>
        </div>
      </section>

      {/* ============ FEATURED ACADEMIC ACHIEVEMENTS BANNER ============ */}
      <section className="section" style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', padding: '2.5rem 0' }}>
        <div className="wrap">
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#B45309' }}>
              ACADEMIC COUNCIL MILESTONES
            </span>
            <h2 style={{ fontSize: '1.75rem', color: '#0B2545', marginTop: '0.25rem' }}>
              Core Educational Achievements
            </h2>
            <p style={{ color: '#475569', fontSize: '0.95rem', maxWidth: '640px', margin: '0.5rem auto 0' }}>
              Beyond judicial protection, AOPSTSMA pioneered statewide curriculum standardization, decade-long exam archives, and digital access.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
              gap: '1.5rem',
            }}
          >
            {/* Card 1: Syllabus 2009 */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
                borderTop: '4px solid #D97706',
                padding: '1.5rem',
                boxShadow: '0 4px 12px rgba(11, 37, 69, 0.05)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '1.75rem' }}>📘</span>
                <div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#D97706', textTransform: 'uppercase' }}>
                    CURRICULUM BENCHMARK
                  </span>
                  <h3 style={{ fontSize: '1.15rem', color: '#0B2545', margin: 0 }}>Syllabus 2009 (45 Pages)</h3>
                </div>
              </div>
              <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                State-wide comprehensive 45-page standardized pedagogical curriculum formulated by AOPSTSMA for 2-year Secondary Training / C.T. education adopted across all member institutions.
              </p>
            </div>

            {/* Card 2: 10 Years CT Exam Q/A */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
                borderTop: '4px solid #2563EB',
                padding: '1.5rem',
                boxShadow: '0 4px 12px rgba(11, 37, 69, 0.05)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '1.75rem' }}>📝</span>
                <div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#2563EB', textTransform: 'uppercase' }}>
                    EXAMINATION BANK
                  </span>
                  <h3 style={{ fontSize: '1.15rem', color: '#0B2545', margin: 0 }}>10 Years CT Exam Q/A</h3>
                </div>
              </div>
              <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                A decade-long standardized Question &amp; Answer archive providing past Board examination papers, certified model answer keys, and pedagogical evaluation benchmarks for student preparation.
              </p>
            </div>

            {/* Card 3: Online Class Access */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
                borderTop: '4px solid #059669',
                padding: '1.5rem',
                boxShadow: '0 4px 12px rgba(11, 37, 69, 0.05)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '1.75rem' }}>💻</span>
                <div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase' }}>
                    DIGITAL LEARNING
                  </span>
                  <h3 style={{ fontSize: '1.15rem', color: '#0B2545', margin: 0 }}>Online Class &amp; Sample Questions</h3>
                </div>
              </div>
              <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                Digital learning portal access featuring online lectures, digital study material modules, and curated sample question papers accessible to enrolled candidates statewide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ COMPLETE LEGAL ARCHIVE WITH CATEGORY TABS ============ */}
      <section className="section">
        <div className="wrap">
          {/* Controls: Search and Tabs */}
          <div style={{ marginBottom: '2rem' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
                marginBottom: '1.5rem',
              }}
            >
              <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: '420px' }}>
                <input
                  type="text"
                  placeholder="🔍 Search orders by number, year, or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.92rem',
                    outline: 'none',
                    backgroundColor: '#FFFFFF',
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#64748B',
                      fontSize: '0.9rem',
                    }}
                  >
                    ✕
                  </button>
                )}
              </div>

              <div style={{ color: '#64748B', fontSize: '0.9rem' }}>
                Showing <strong>{filteredDocs.length}</strong> of <strong>{DOCUMENTS.length}</strong> records
              </div>
            </div>

            {/* Category Filter Pills */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem',
              }}
            >
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  border: '1px solid',
                  borderColor: activeTab === 'all' ? '#0B2545' : '#E2E8F0',
                  backgroundColor: activeTab === 'all' ? '#0B2545' : '#FFFFFF',
                  color: activeTab === 'all' ? '#FFFFFF' : '#475569',
                  fontWeight: activeTab === 'all' ? 700 : 500,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                All Records ({DOCUMENTS.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('high_court')}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  border: '1px solid',
                  borderColor: activeTab === 'high_court' ? '#0B2545' : '#E2E8F0',
                  backgroundColor: activeTab === 'high_court' ? '#0B2545' : '#FFFFFF',
                  color: activeTab === 'high_court' ? '#FFFFFF' : '#475569',
                  fontWeight: activeTab === 'high_court' ? 700 : 500,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                🏛️ Orissa High Court (6)
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('supreme_court')}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  border: '1px solid',
                  borderColor: activeTab === 'supreme_court' ? '#0B2545' : '#E2E8F0',
                  backgroundColor: activeTab === 'supreme_court' ? '#0B2545' : '#FFFFFF',
                  color: activeTab === 'supreme_court' ? '#FFFFFF' : '#475569',
                  fontWeight: activeTab === 'supreme_court' ? 700 : 500,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                ⚖️ Supreme Court (3)
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('bse_orders')}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  border: '1px solid',
                  borderColor: activeTab === 'bse_orders' ? '#0B2545' : '#E2E8F0',
                  backgroundColor: activeTab === 'bse_orders' ? '#0B2545' : '#FFFFFF',
                  color: activeTab === 'bse_orders' ? '#FFFFFF' : '#475569',
                  fontWeight: activeTab === 'bse_orders' ? 700 : 500,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                📜 BSE &amp; Govt Orders (3)
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('achievements')}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  border: '1px solid',
                  borderColor: activeTab === 'achievements' ? '#0B2545' : '#E2E8F0',
                  backgroundColor: activeTab === 'achievements' ? '#0B2545' : '#FFFFFF',
                  color: activeTab === 'achievements' ? '#FFFFFF' : '#475569',
                  fontWeight: activeTab === 'achievements' ? 700 : 500,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                🏆 Academic Milestones (3)
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('notices')}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  border: '1px solid',
                  borderColor: activeTab === 'notices' ? '#0B2545' : '#E2E8F0',
                  backgroundColor: activeTab === 'notices' ? '#0B2545' : '#FFFFFF',
                  color: activeTab === 'notices' ? '#FFFFFF' : '#475569',
                  fontWeight: activeTab === 'notices' ? 700 : 500,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                📢 Circulars (2)
              </button>
            </div>
          </div>

          {/* List of Documents */}
          <div className="docs" id="doc-list">
            {filteredDocs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px dashed #CBD5E1' }}>
                <p style={{ color: '#64748B', fontSize: '1rem', margin: 0 }}>
                  No records match your query. Try resetting the category filter or search term.
                </p>
              </div>
            ) : (
              filteredDocs.map((d, index) => {
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
                            {getCategoryIcon(d.category)} {d.badge}
                          </span>
                        ) : null}
                        {d.title}
                      </div>
                      <div className="doc__meta">{d.note}</div>
                      {d.court && (
                        <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '0.35rem' }}>
                          <strong>Authority:</strong> {d.court} {d.date ? `(${d.date})` : ''}
                        </div>
                      )}
                      {d.image && (
                        <div className="doc__cert-badge" style={{ marginTop: '0.5rem' }}>
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
                        {d.file ? '📥 Inspect & PDF' : '📋 View Details'} &rarr;
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="note reveal" style={{ marginTop: '2.5rem' }}>
            Official certified court documents and orders are stored securely in association headquarters archives.
            For certified physical copies or departmental verification, member institutions can contact the Central Legal Secretariat at{' '}
            <a href="tel:+916370987576" style={{ color: '#0B2545', fontWeight: 600 }}>+91 63709 87576</a> or via{' '}
            <a href="mailto:info@aopstsma.in" style={{ color: '#0B2545', fontWeight: 600 }}>info@aopstsma.in</a>.
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

