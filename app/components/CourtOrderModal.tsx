'use client';

import { useEffect } from 'react';
import { DocumentRecord } from '@/lib/data/schools';

interface CourtOrderModalProps {
  doc: DocumentRecord | null;
  onClose: () => void;
}

export default function CourtOrderModal({ doc, onClose }: CourtOrderModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (doc) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [doc, onClose]);

  if (!doc) return null;

  const isCourtOrder = doc.category === 'court_order';
  const courtName = doc.court || (doc.title.includes('Supreme Court') ? 'SUPREME COURT OF INDIA' : 'IN THE HIGH COURT OF ORISSA AT CUTTACK');
  const caseRef = doc.ref.startsWith('WP') ? doc.ref : `W.P.(C) No. ${doc.ref} of ${doc.year || '2008'}`;
  const petitioner = doc.petitioner || 'All Orissa Private Secondary Training Schools Management Association (AOPSTSMA) & Ors.';
  const respondent = doc.respondent || 'State of Odisha, Dept. of School & Mass Education & Board of Secondary Education (BSE)';
  const bench = doc.bench || 'Hon’ble The Chief Justice & Hon’ble Bench';
  const orderDate = doc.date || `18th August ${doc.year || '2008'}`;
  const pdfFileName = doc.file || `court-order-${doc.ref.toLowerCase().replace(/[^a-z0-9]/g, '-')}.pdf`;

  const operativeText = doc.operativeParagraph || (
    isCourtOrder
      ? 'Heard learned counsel appearing for the petitioner association and learned Standing Counsel for the School & Mass Education Department. Issue notice returnable within four weeks. In the interim, the operation of the impugned departmental communication shall remain stayed so far as member institutions of the petitioner association are concerned. Opposite parties are directed not to take any coercive steps against member training schools and shall accept examination enrollment files in accordance with law.'
      : 'Government of Odisha has taken into consideration the representations submitted by the All Orissa Private Secondary Training Schools Management Association. It is hereby resolved that recognized private secondary training institutions shall be accorded provisional compliance extension for teacher training courses pending review by the Directorate.'
  );

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(6, 19, 36, 0.78)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
      }}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          maxWidth: '720px',
          width: '100%',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px -12px rgba(0,0,0,0.45)',
          border: '1px solid #CBD5E1',
          overflow: 'hidden',
          animation: 'modalSlideUp 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Top Header Bar */}
        <div
          style={{
            backgroundColor: '#0B2545',
            color: '#FFFFFF',
            padding: '1rem 1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '3px solid #D97706',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span style={{ fontSize: '1.3rem' }}>⚖️</span>
            <div>
              <h3 style={{ fontSize: '1rem', color: '#FFFFFF', margin: 0, fontFamily: 'var(--ui)', fontWeight: 600 }}>
                Certified Order Sheet &middot; Judicial Front Page
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#CBD5E1', margin: 0 }}>
                Official Record &middot; Legal Cell of AOPSTSMA
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              color: '#FFFFFF',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              fontSize: '1.1rem',
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer',
              transition: 'background 0.18s',
            }}
          >
            &times;
          </button>
        </div>

        {/* Scrollable Sheet Body (Authentic High Court Docket Styling) */}
        <div
          style={{
            padding: '2rem',
            overflowY: 'auto',
            backgroundColor: '#FFFEFA', // Legal paper warm ivory
            color: '#1E293B',
            fontFamily: 'Georgia, serif',
            lineHeight: '1.65',
          }}
        >
          {/* Official Emblem & Court Banner */}
          <div style={{ textAlign: 'center', borderBottom: '2px solid #0B2545', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
            <div
              style={{
                display: 'inline-block',
                width: '46px',
                height: '46px',
                border: '2px solid #D97706',
                borderRadius: '50%',
                lineHeight: '42px',
                fontSize: '1.4rem',
                color: '#0B2545',
                marginBottom: '0.5rem',
                backgroundColor: '#FFFBEB',
              }}
            >
              ⚖️
            </div>
            <h2
              style={{
                fontFamily: 'Georgia, serif',
                fontSize: '1.25rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                color: '#0B2545',
                margin: '0 0 0.35rem 0',
                textTransform: 'uppercase',
              }}
            >
              {courtName}
            </h2>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#D97706', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Civil Extraordinary Jurisdiction
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', marginTop: '0.5rem' }}>
              {caseRef}
            </div>
          </div>

          {/* Parties & Bench Box */}
          <div
            style={{
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '6px',
              padding: '1.25rem',
              marginBottom: '1.5rem',
              fontSize: '0.88rem',
              fontFamily: 'var(--ui)',
            }}
          >
            <div style={{ marginBottom: '0.75rem' }}>
              <span style={{ fontWeight: 700, color: '#0B2545', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                Petitioners:
              </span>
              <div style={{ color: '#0F172A', fontWeight: 600, marginTop: '0.2rem' }}>{petitioner}</div>
            </div>

            <div style={{ textAlign: 'center', fontWeight: 700, color: '#64748B', fontSize: '0.75rem', marginBlock: '0.4rem' }}>
              &mdash; VERSUS &mdash;
            </div>

            <div style={{ marginBottom: '0.75rem' }}>
              <span style={{ fontWeight: 700, color: '#0B2545', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                Opposite Parties:
              </span>
              <div style={{ color: '#0F172A', fontWeight: 600, marginTop: '0.2rem' }}>{respondent}</div>
            </div>

            <div style={{ borderTop: '1px dashed #CBD5E1', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.8rem', color: '#475569' }}>
              <div><b>Coram:</b> {bench}</div>
              <div><b>Certified Date:</b> {orderDate}</div>
            </div>
          </div>

          {/* Operative Order Extract */}
          <div style={{ marginBottom: '1.75rem' }}>
            <h4
              style={{
                fontFamily: 'var(--ui)',
                fontSize: '0.82rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#B45309',
                marginBottom: '0.75rem',
                borderLeft: '3px solid #D97706',
                paddingLeft: '0.5rem',
              }}
            >
              Certified Operative Order Extract
            </h4>
            <div
              style={{
                backgroundColor: '#FFFBEB',
                border: '1px solid #FDE68A',
                borderRadius: '4px',
                padding: '1.25rem',
                fontSize: '0.92rem',
                fontStyle: 'italic',
                color: '#78350F',
                lineHeight: '1.7',
              }}
            >
              &ldquo;{operativeText}&rdquo;
            </div>
          </div>

          {/* Certified Seal Note */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '0.85rem 1rem',
              backgroundColor: '#F1F5F9',
              borderRadius: '4px',
              fontSize: '0.78rem',
              color: '#475569',
              fontFamily: 'var(--ui)',
            }}
          >
            <span style={{ fontSize: '1.4rem' }}>🏛️</span>
            <div>
              <b>Certified Document Notice:</b> This official order sheet is maintained by the
              All Orissa Private Secondary Training Schools Management Association secretariat.
              Member schools can download the full signed PDF below.
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div
          style={{
            backgroundColor: '#F8FAFC',
            borderTop: '1px solid #E2E8F0',
            padding: '1rem 1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ fontSize: '0.8rem', color: '#64748B', fontFamily: 'var(--ui)' }}>
            Document Reference: <b style={{ color: '#0F172A' }}>{doc.ref}</b>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '0.65rem 1.15rem',
                borderRadius: '4px',
                border: '1px solid #CBD5E1',
                backgroundColor: '#FFFFFF',
                color: '#334155',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Close
            </button>

            <a
              href={`/assets/docs/${pdfFileName}`}
              download={pdfFileName}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.65rem 1.25rem',
                borderRadius: '4px',
                backgroundColor: '#D97706',
                color: '#FFFFFF',
                fontSize: '0.85rem',
                fontWeight: 600,
                textDecoration: 'none',
                boxShadow: '0 2px 6px rgba(217,119,6,0.25)',
              }}
            >
              <span>📥 Download Certified PDF</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
