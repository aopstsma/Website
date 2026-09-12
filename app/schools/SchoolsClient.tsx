'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ZONES, SCHOOLS } from '@/lib/data/schools';

export default function SchoolsClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [query, setQuery] = useState('');
  const rawParam = searchParams.get('zone') || 'all';
  const normalizedZone = rawParam === 'cuttack' ? 'central' : rawParam === 'berhampur' ? 'ganjam' : rawParam;
  const [selectedZone, setSelectedZone] = useState(normalizedZone);

  useEffect(() => {
    const p = searchParams.get('zone') || 'all';
    setSelectedZone(p === 'cuttack' ? 'central' : p === 'berhampur' ? 'ganjam' : p);
  }, [searchParams]);

  const zoneName = (id: string) => {
    const found = ZONES.find((z) => z.id === id);
    return found ? found.name : id;
  };

  const chips = [
    { id: 'all', label: `All (${SCHOOLS.length})` },
    { id: 'balasore', label: 'Baleswar (40)' },
    { id: 'central', label: 'Central (24)' },
    { id: 'bhubaneswar', label: 'Bhubaneswar (15)' },
    { id: 'sambalpur', label: 'Sambalpur (9)' },
    { id: 'ganjam', label: 'Berhampur (2)' },
  ];

  const filteredSchools = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SCHOOLS.filter((s) => {
      const zoneOk = selectedZone === 'all' || s.zone === selectedZone;
      const textOk =
        !q ||
        s.name.toLowerCase().includes(q) ||
        (s.district || '').toLowerCase().includes(q) ||
        zoneName(s.zone).toLowerCase().includes(q);
      return zoneOk && textOk;
    });
  }, [query, selectedZone]);

  const handleChipClick = (zoneId: string) => {
    setSelectedZone(zoneId);
    if (zoneId === 'all') {
      router.replace('/schools', { scroll: false });
    } else {
      router.replace(`/schools?zone=${zoneId}`, { scroll: false });
    }
  };

  return (
    <div className="schools-directory-wrap">
      {/* SEARCH AND ZONE FILTER CHIPS */}
      <div className="filters schools-filter-bar">
        <label className="visually-hidden" htmlFor="school-search">
          Search member schools
        </label>
        <div className="search-input-wrap" style={{ position: 'relative', flex: '1 1 300px' }}>
          <input
            type="search"
            id="school-search"
            placeholder="Search 90 schools by name, district or zone..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.8rem 1.1rem',
              borderRadius: '8px',
              border: '1px solid #CBD5E1',
              fontSize: '0.95rem',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
            }}
          />
        </div>

        <div className="chips-row">
          {chips.map((chip) => (
            <button
              key={chip.id}
              type="button"
              className="chip"
              data-filter={chip.id}
              aria-pressed={selectedZone === chip.id}
              onClick={() => handleChipClick(chip.id)}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* COUNTER STRIP */}
      <div className="schools-count-strip">
        <span className="count-tag">
          {filteredSchools.length
            ? `Showing ${filteredSchools.length} of ${SCHOOLS.length} verified member schools`
            : 'No matching institutions'}
        </span>
        {selectedZone !== 'all' && (
          <button
            type="button"
            onClick={() => handleChipClick('all')}
            style={{
              background: 'none',
              border: 'none',
              color: '#D97706',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            Clear Filter &times;
          </button>
        )}
      </div>

      {/* MOBILE-ONLY LUXURY INSTITUTION CARDS (Screens < 768px) */}
      <div className="schools-mobile-cards">
        {filteredSchools.length > 0 ? (
          filteredSchools.map((s, idx) => (
            <div key={idx} className="school-card-mobile">
              <div className="school-card-mobile__head">
                <span className="school-card-mobile__num">
                  #{String(s.slNo || idx + 1).padStart(2, '0')}
                </span>
                <button
                  type="button"
                  onClick={() => handleChipClick(s.zone)}
                  className="school-card-mobile__zone"
                >
                  🏛️ {zoneName(s.zone)}
                </button>
              </div>

              <h3 className="school-card-mobile__name">{s.name}</h3>

              <div className="school-card-mobile__meta">
                <span className="school-card-mobile__district">
                  📍 {s.district || 'Odisha'}
                </span>
                <span className="school-card-mobile__status">
                  ✓ Recognized Member
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="school-empty-mobile">
            <p>No institutions match &ldquo;{query}&rdquo; in this zone.</p>
            <button type="button" className="btn btn--primary" onClick={() => { setQuery(''); handleChipClick('all'); }}>
              Reset Search &amp; Zone
            </button>
          </div>
        )}
      </div>

      {/* DESKTOP/TABLET TABLE VIEW (Screens >= 768px) */}
      <div className="schools-desktop-table-wrap">
        <table className="school-table">
          <thead>
            <tr>
              <th style={{ width: '70px', textAlign: 'center' }}>#</th>
              <th>Institution / School Name</th>
              <th>Association Zone</th>
              <th>District Jurisdiction</th>
            </tr>
          </thead>
          <tbody id="school-rows">
            {filteredSchools.length > 0 ? (
              filteredSchools.map((s, idx) => (
                <tr key={idx}>
                  <td style={{ textAlign: 'center', color: '#64748B', fontWeight: 700 }}>
                    {String(s.slNo || idx + 1).padStart(2, '0')}
                  </td>
                  <td style={{ fontWeight: 700, color: '#0B2545', fontSize: '1rem' }}>
                    {s.name}
                  </td>
                  <td>
                    <Link
                      href={`/schools?zone=${s.zone}`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleChipClick(s.zone);
                      }}
                      className="table-zone-link"
                    >
                      {zoneName(s.zone)}
                    </Link>
                  </td>
                  <td style={{ color: '#475569', fontWeight: 500 }}>
                    📍 {s.district || 'Odisha'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="school-empty">
                  No institutions match &ldquo;{query}&rdquo; in this zone. Check your spelling or select &ldquo;All&rdquo;.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="note" style={{ marginTop: '2.5rem' }}>
        Official member school register as compiled and verified by the All Orissa Private Secondary Training Schools Management Association.
        If your school details need updating, please contact the central secretariat at <a href="mailto:info@aopstsma.in" style={{ color: '#0B2545', fontWeight: 700 }}>info@aopstsma.in</a>.
      </div>
    </div>
  );
}
