'use client';

import { useState } from 'react';
import CourtOrderModal from './CourtOrderModal';
import { DocumentRecord } from '@/lib/data/schools';

interface NewsLetterItem {
  id: string;
  memoNo: string;
  date: string;
  department: string;
  badge: string;
  title: string;
  summary: string;
  file?: string;
}

export default function HomeNewsLettersSection() {
  const [selectedLetter, setSelectedLetter] = useState<DocumentRecord | null>(null);

  const newsItems: NewsLetterItem[] = [
    {
      id: 'sme-2026-01',
      memoNo: 'S&ME/TE-1422/2026',
      date: '14 Feb 2026',
      department: 'School & Mass Education Dept, Govt. of Odisha',
      badge: 'Govt. Resolution',
      title: 'Clarification on Recognition & DIR Extension Timelines for Private Training Schools',
      summary: 'State Government directive regarding provisional affiliation continuity and verification protocol for secondary teacher education institutions across all 30 districts.',
    },
    {
      id: 'bse-2025-18',
      memoNo: 'BSE/D.El.Ed/892/2025',
      date: '18 Nov 2025',
      department: 'Board of Secondary Education, Odisha (Cuttack)',
      badge: 'Board Notification',
      title: 'Examination Center Allocation & Student Enrollment Schedule 2025-26',
      summary: 'Guidelines for affiliated private secondary training colleges on submitting final student rolls and center choice verification for semester examinations.',
    },
    {
      id: 'te-scert-44',
      memoNo: 'DTE-SCERT/OD/319/2025',
      date: '02 Aug 2025',
      department: 'Directorate of Teacher Education & SCERT, Odisha',
      badge: 'Curriculum Circular',
      title: 'Standardized Internship & Practical Training Modules for D.El.Ed/B.Ed',
      summary: 'Updated syllabus guidelines for pedagogical practice teaching in recognized schools, in alignment with National Education guidelines.',
    },
    {
      id: 'aopstsma-cir-28',
      memoNo: 'AOPSTSMA/GEN-SEC/28/2025',
      date: '24 May 2025',
      department: 'Association Central Secretariat, Bhubaneswar',
      badge: 'Zonal Advisory',
      title: 'Mandatory Zonal Meeting on High Court Writ Compliance & Renewal Filing',
      summary: 'All 6 Zonal Conveners and institutional headmasters directed to align renewal paperwork as per the latest interim directions of the Orissa High Court.',
    }
  ];

  const handleOpenPreview = (item: NewsLetterItem) => {
    setSelectedLetter({
      ref: item.memoNo,
      year: item.date.split(' ').pop() || '2026',
      file: item.file || '',
      date: item.date,
      title: item.title,
      note: `${item.department} — ${item.summary}`,
      category: 'department_letter',
      badge: item.badge,
      court: item.department.toUpperCase(),
      petitioner: 'Member Secondary Training Institutions of Odisha',
      respondent: 'Department of School & Mass Education / BSE Odisha',
      bench: 'Executive Directorate & Secretarial Authority',
      operativeParagraph: item.summary,
    });
  };

  return (
    <section className="section" style={{ backgroundColor: '#F8FAFC', borderTop: '1px solid #E2E8F0' }}>
      <div className="wrap">
        <div className="head">
          <div className="head__rule" style={{ background: 'linear-gradient(90deg, #133E87, #0B2545)' }}></div>
          <h2>Department Letters &amp; Official Circulars</h2>
          <p className="lede">
            Timely administrative notifications, Directorate circulars, and Board of Secondary Education (BSE)
            directives concerning member training institutions.
          </p>
        </div>

        {/* News & Letters Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
            gap: '1.5rem',
          }}
        >
          {newsItems.map((item) => (
            <article
              key={item.id}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderTop: '4px solid #133E87',
                borderRadius: '6px',
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 2px 8px rgba(11, 37, 69, 0.05)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '2px',
                    backgroundColor: '#EBF2FA',
                    color: '#0B2545',
                  }}
                >
                  {item.badge}
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B' }}>
                  📅 {item.date}
                </span>
              </div>

              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#D97706', marginBottom: '0.35rem', letterSpacing: '0.02em' }}>
                Memo: {item.memoNo}
              </div>

              <h3 style={{ fontSize: '1.15rem', color: '#0F172A', fontWeight: 600, marginBottom: '0.75rem', lineHeight: '1.3' }}>
                {item.title}
              </h3>

              <div style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 600, marginBottom: '0.65rem' }}>
                🏛️ {item.department}
              </div>

              <p style={{ fontSize: '0.86rem', color: '#64748B', lineHeight: '1.55', marginBottom: '1.5rem' }}>
                {item.summary}
              </p>

              <div style={{ marginTop: 'auto', display: 'flex', gap: '0.75rem', borderTop: '1px solid #F1F5F9', paddingTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => handleOpenPreview(item)}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#133E87',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    padding: 0,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  👁️ View Order Sheet &rarr;
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Modal for viewing letter details */}
      <CourtOrderModal doc={selectedLetter} onClose={() => setSelectedLetter(null)} />
    </section>
  );
}
