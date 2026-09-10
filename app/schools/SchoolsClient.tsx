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
  // Normalize alias zones if any
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
    { id: 'ganjam', label: 'Ganjam (2)' },
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
    <>
      <div className="filters">
        <label className="visually-hidden" htmlFor="school-search">
          Search member schools
        </label>
        <input
          type="search"
          id="school-search"
          placeholder="Search 90 schools by name, district or zone..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
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

      <p className="school-count" id="school-count">
        {filteredSchools.length
          ? `Showing ${filteredSchools.length} of ${SCHOOLS.length} verified member schools`
          : ''}
      </p>

      <table className="school-table">
        <thead>
          <tr>
            <th style={{ width: '60px' }}>#</th>
            <th>School Name</th>
            <th>Zone</th>
            <th>District</th>
          </tr>
        </thead>
        <tbody id="school-rows">
          {filteredSchools.length > 0 ? (
            filteredSchools.map((s, idx) => (
              <tr key={idx}>
                <td style={{ color: '#64748B', fontWeight: 600 }}>{s.slNo || idx + 1}</td>
                <td data-l="School" style={{ fontWeight: 600, color: '#0B2545' }}>{s.name}</td>
                <td data-l="Zone">
                  <Link
                    href={`/schools?zone=${s.zone}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleChipClick(s.zone);
                    }}
                    style={{ textDecoration: 'none', color: '#D97706', fontWeight: 600 }}
                  >
                    {zoneName(s.zone)}
                  </Link>
                </td>
                <td data-l="District">{s.district || 'Odisha'}</td>
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

      <div className="note" style={{ marginTop: '2.5rem' }}>
        Official member school register as compiled and verified by the All Orissa Private Secondary Training Schools Management Association.
        If your school details need updating, please contact the central secretariat.
      </div>
    </>
  );
}
