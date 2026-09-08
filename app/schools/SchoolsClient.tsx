'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ZONES, SCHOOLS } from '@/lib/data/schools';

export default function SchoolsClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [query, setQuery] = useState('');
  const activeZoneParam = searchParams.get('zone') || 'all';
  const [selectedZone, setSelectedZone] = useState(activeZoneParam);

  useEffect(() => {
    setSelectedZone(searchParams.get('zone') || 'all');
  }, [searchParams]);

  const zoneName = (id: string) => {
    const found = ZONES.find((z) => z.id === id);
    return found ? found.name : id;
  };

  const chips = [
    { id: 'all', label: 'All' },
    { id: 'balasore', label: 'Balasore' },
    { id: 'cuttack', label: 'Cuttack' },
    { id: 'bhubaneswar', label: 'Bhubaneswar' },
    { id: 'sambalpur', label: 'Sambalpur' },
    { id: 'berhampur', label: 'Berhampur' },
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
          placeholder="Search a school, district or zone"
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
          ? `Showing ${filteredSchools.length} of ${SCHOOLS.length} schools`
          : ''}
      </p>

      <table className="school-table">
        <thead>
          <tr>
            <th>School</th>
            <th>Zone</th>
            <th>District</th>
          </tr>
        </thead>
        <tbody id="school-rows">
          {filteredSchools.length > 0 ? (
            filteredSchools.map((s, idx) => (
              <tr key={idx}>
                <td>{s.name}</td>
                <td data-l="Zone">{zoneName(s.zone)}</td>
                <td data-l="District">{s.district || '—'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="empty">
                No school matches that search. Try a zone name, a district, or part of the school name.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="note reveal" style={{ marginTop: '2.5rem' }}>
        This directory is drawn from the association&apos;s zonal records. Contact details for
        each school are being added. If an entry is wrong or your school is missing,{' '}
        <Link href="/contact" style={{ color: 'var(--brass-hi)' }}>
          tell us
        </Link>{' '}
        and we will correct it.
      </div>
    </>
  );
}
