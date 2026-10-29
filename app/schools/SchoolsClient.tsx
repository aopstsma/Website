'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ZONES,
  SCHOOLS,
  School,
  getZoneDetails,
  getSchoolFullDetails,
  SchoolFullDetails,
} from '@/lib/data/schools';

export default function SchoolsClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const chartRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState('');
  const rawParam = searchParams.get('zone') || 'all';
  const normalizedZone =
    rawParam === 'cuttack' ? 'central' : rawParam === 'berhampur' ? 'ganjam' : rawParam;
  const [selectedZone, setSelectedZone] = useState(normalizedZone);

  // Default featured school: Jagannath Secondary Training School (Central Zone Cuttack)
  const defaultCentralSchool = useMemo(
    () =>
      SCHOOLS.find((s) => s.zone === 'central' && s.name.toLowerCase().includes('jagannath')) ||
      SCHOOLS[0],
    []
  );

  const [activeSchool, setActiveSchool] = useState<School>(defaultCentralSchool);
  const [activeBatchIdx, setActiveBatchIdx] = useState<number>(0);
  const [activeCentreIdx, setActiveCentreIdx] = useState<number>(0);
  const [modalSchool, setModalSchool] = useState<SchoolFullDetails | null>(null);

  useEffect(() => {
    const p = searchParams.get('zone') || 'all';
    const norm = p === 'cuttack' ? 'central' : p === 'berhampur' ? 'ganjam' : p;
    setSelectedZone(norm);

    if (norm !== 'all') {
      const firstInZone =
        norm === 'central'
          ? defaultCentralSchool
          : SCHOOLS.find((s) => s.zone === norm);
      if (firstInZone) {
        setActiveSchool(firstInZone);
        setActiveCentreIdx(0);
      }
    }
  }, [searchParams, defaultCentralSchool]);

  const zoneName = (id: string) => {
    const found = ZONES.find((z) => z.id === id);
    return found ? found.name : id;
  };

  const chips = [
    { id: 'all', label: `All (${SCHOOLS.length})` },
    { id: 'central', label: 'Central Cuttack (24)' },
    { id: 'balasore', label: 'Baleswar (40)' },
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

  // Active school full details & zone hierarchy details
  const activeDetails = useMemo(
    () => getSchoolFullDetails(activeSchool, activeSchool.slNo || 1),
    [activeSchool]
  );
  const activeZoneObj = useMemo(
    () => getZoneDetails(activeSchool.zone),
    [activeSchool]
  );

  // Schools in currently displayed chart zone for quick dropdown switching
  const schoolsInChartZone = useMemo(
    () => SCHOOLS.filter((s) => s.zone === activeSchool.zone),
    [activeSchool.zone]
  );

  const handleChipClick = (zoneId: string) => {
    setSelectedZone(zoneId);
    if (zoneId !== 'all') {
      const firstSchool =
        zoneId === 'central'
          ? defaultCentralSchool
          : SCHOOLS.find((s) => s.zone === zoneId);
      if (firstSchool) {
        setActiveSchool(firstSchool);
        setActiveCentreIdx(0);
      }
    }
    if (zoneId === 'all') {
      router.replace('/schools', { scroll: false });
    } else {
      router.replace(`/schools?zone=${zoneId}`, { scroll: false });
    }
  };

  const handleSelectSchoolFromDirectory = (school: School, idx: number, openModal = true) => {
    setActiveSchool(school);
    setActiveCentreIdx(0);
    setActiveBatchIdx(0);
    const full = getSchoolFullDetails(school, school.slNo || idx + 1);
    if (openModal) {
      setModalSchool(full);
    } else if (chartRef.current) {
      chartRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const currentInvigilator =
    activeDetails.invigilators[activeCentreIdx] || activeDetails.invigilators[0];

  return (
    <div className="schools-directory-wrap">
      {/* =====================================================================
          1. INTERACTIVE ZONAL & SCHOOL DETAILS HIERARCHY CHART (CZC & ALL ZONES)
         ===================================================================== */}
      <div className="czc-flowchart-shell" ref={chartRef}>
        {/* Zone Selector Strip inside Chart */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.65rem',
            marginBottom: '1rem',
            paddingBottom: '0.85rem',
            borderBottom: '1px solid #DBEAFE',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span
              style={{
                background: '#0B2545',
                color: '#FDE68A',
                fontSize: '0.72rem',
                fontWeight: 800,
                padding: '0.25rem 0.65rem',
                borderRadius: '6px',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              🏛️ Interactive Zone &amp; School Hierarchy
            </span>
            <span style={{ fontSize: '0.82rem', color: '#475569', fontWeight: 600 }}>
              Select any zone or school to inspect President, Admin Officer, Secretary, Batches &amp; Invigilators:
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
            {ZONES.map((z) => {
              const isSelected = activeZoneObj.id === z.id;
              return (
                <button
                  key={z.id}
                  type="button"
                  onClick={() => {
                    const targetSchool =
                      z.id === 'central'
                        ? defaultCentralSchool
                        : SCHOOLS.find((s) => s.zone === z.id) || defaultCentralSchool;
                    setActiveSchool(targetSchool);
                    setActiveCentreIdx(0);
                  }}
                  style={{
                    padding: '0.32rem 0.7rem',
                    borderRadius: '999px',
                    border: isSelected ? '1.5px solid #D97706' : '1px solid #CBD5E1',
                    background: isSelected ? '#0B2545' : '#FFFFFF',
                    color: isSelected ? '#FDE68A' : '#334155',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  {z.code} &middot; {z.name.replace(' Zone', '')}
                </button>
              );
            })}
          </div>
        </div>

        {/* TOP HEADER BANNER: == Central Zone Cuttack (CZC) == */}
        <div className="czc-title-banner">
          <span className="czc-title-lines" aria-hidden="true" />
          <div className="czc-title-pill">
            {activeZoneObj.fullTitle || `${activeZoneObj.name} (${activeZoneObj.code || 'CZC'})`}
          </div>
          <span className="czc-title-lines" aria-hidden="true" />
        </div>

        {/* REPORTING HIERARCHY PILLS (From Sketch: Reports to Association / Reports to President) */}
        <div className="czc-reports-top-bar">
          <span className="czc-report-pill">
            ↗ Zonal President <strong>Reports to Association (AOPSTSMA State HQ)</strong>
          </span>
          <span className="czc-report-pill">
            ← Administrative Officer <strong>Reports to Zonal President</strong>
          </span>
          <span className="czc-report-pill">
            ↑ Centre Invigilators <strong>Report to Administrative Officer</strong>
          </span>
        </div>

        {/* TOP ROW: PRESIDENT (Left) <-- [ LOGO / CZC ] --> ADMINISTRATIVE OFFICER (Right) */}
        <div className="czc-top-grid">
          {/* LEFT BOX: ZONAL PRESIDENT */}
          <div className="czc-officer-card czc-officer-card--president">
            <div className="czc-officer-top">
              <div className="czc-photo-box">
                <img
                  src={activeZoneObj.president?.photo || '/assets/img/president-nirmal-kanta-mohanty.jpg'}
                  alt={activeZoneObj.president?.name || 'Zonal President'}
                />
                <span className="czc-photo-tag">PHOTO / ID</span>
              </div>
              <div className="czc-officer-info">
                <span className="czc-role-badge">↗ Reports to Association</span>
                <h3 className="czc-officer-title">
                  {activeZoneObj.president?.designation || `President (${activeZoneObj.name})`}
                </h3>
                <div className="czc-officer-name">
                  👤 {activeZoneObj.president?.name || 'Zonal President'}
                </div>
                <div className="czc-officer-subrole">
                  ✦ {activeZoneObj.president?.subRole || 'Incharge Additional President'} &middot; ID:{' '}
                  {activeZoneObj.president?.idCardNo}
                </div>
              </div>
            </div>

            <div className="czc-phone-strip">
              <div className="czc-phone-icon-group">
                <span style={{ fontSize: '1.15rem' }}>📱</span>
                <div>
                  <small style={{ display: 'block', fontSize: '0.66rem', color: '#475569' }}>
                    Mobile # (WhatsApp)
                  </small>
                  <span>{activeZoneObj.president?.phone || '+91 63709 87576'}</span>
                </div>
              </div>
              <div className="czc-phone-actions">
                <a
                  href={`tel:${(activeZoneObj.president?.phone || '+916370987576').replace(/\s+/g, '')}`}
                  className="czc-mini-btn czc-mini-btn--call"
                >
                  📞 Call
                </a>
                <a
                  href={`https://wa.me/${activeZoneObj.president?.whatsapp || '916370987576'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="czc-mini-btn czc-mini-btn--wa"
                >
                  💬 WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* CENTER HUB: LOGO + CZC CIRCLE EMBLEM */}
          <div className="czc-center-hub">
            <span className="czc-logo-pill">Logo</span>
            <div className="czc-emblem-row">
              <span className="czc-arrow-horiz" title="Connected to Zonal President">
                &larr;
              </span>
              <div className="czc-circle-emblem">
                <strong>{activeZoneObj.code || 'CZC'}</strong>
                <small>AOPSTSMA</small>
              </div>
              <span className="czc-arrow-horiz" title="Connected to Administrative Officer">
                &rarr;
              </span>
            </div>
            <span
              style={{
                fontSize: '0.7rem',
                fontWeight: 800,
                color: '#1E40AF',
                background: '#EFF6FF',
                padding: '0.15rem 0.55rem',
                borderRadius: '999px',
                border: '1px solid #BFDBFE',
              }}
            >
              &larr; Admin Reports to President
            </span>
          </div>

          {/* RIGHT BOX: ADMINISTRATIVE OFFICER */}
          <div className="czc-officer-card czc-officer-card--admin">
            <div className="czc-officer-top">
              <div className="czc-photo-box">
                <img
                  src={activeZoneObj.adminOfficer?.photo || '/assets/img/secretary-alia-pradhan.jpg'}
                  alt={activeZoneObj.adminOfficer?.name || 'Administrative Officer'}
                />
                <span className="czc-photo-tag">PHOTO / ID</span>
              </div>
              <div className="czc-officer-info">
                <span className="czc-role-badge">&larr; Reports to President</span>
                <h3 className="czc-officer-title">
                  {activeZoneObj.adminOfficer?.designation || 'Name Administrative Officer'}
                </h3>
                <div className="czc-officer-name">
                  👤 {activeZoneObj.adminOfficer?.name || 'Administrative Officer'}
                </div>
                <div className="czc-officer-subrole">
                  ✦ {activeZoneObj.adminOfficer?.subRole || 'Name Incharge Officer'} &middot; ID:{' '}
                  {activeZoneObj.adminOfficer?.idCardNo}
                </div>
              </div>
            </div>

            <div className="czc-phone-strip">
              <div className="czc-phone-icon-group">
                <span style={{ fontSize: '1.15rem' }}>📱</span>
                <div>
                  <small style={{ display: 'block', fontSize: '0.66rem', color: '#475569' }}>
                    Phone No / WhatsApp
                  </small>
                  <span>{activeZoneObj.adminOfficer?.phone || '+91 63709 87576'}</span>
                </div>
              </div>
              <div className="czc-phone-actions">
                <a
                  href={`tel:${(activeZoneObj.adminOfficer?.phone || '+916370987576').replace(/\s+/g, '')}`}
                  className="czc-mini-btn czc-mini-btn--call"
                >
                  📞 Call
                </a>
                <a
                  href={`https://wa.me/${activeZoneObj.adminOfficer?.whatsapp || '916370987576'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="czc-mini-btn czc-mini-btn--wa"
                >
                  💬 WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* VERTICAL STEM FROM CZC LOGO TO SELECTED SCHOOL CLOUD */}
        <div className="czc-stem-down" />

        {/* MIDDLE HUB: SELECTED SCHOOL (e.g. Jagannath Secondary Training School -> [Click Here ✓]) */}
        <div className="czc-school-cloud">
          <span className="czc-school-cloud-tag">
            {activeDetails.zoneName} &middot; Code: {activeDetails.schoolCode}
          </span>
          <h3>🏫 {activeDetails.name}</h3>

          <div className="czc-school-picker-row">
            <label htmlFor="czc-school-dropdown" className="visually-hidden">
              Choose member school in {activeZoneObj.name}
            </label>
            <select
              id="czc-school-dropdown"
              className="czc-school-select"
              value={activeSchool.name}
              onChange={(e) => {
                const found = SCHOOLS.find(
                  (s) => s.name === e.target.value && s.zone === activeSchool.zone
                );
                if (found) {
                  setActiveSchool(found);
                  setActiveCentreIdx(0);
                }
              }}
            >
              {schoolsInChartZone.map((s, i) => (
                <option key={`${s.zone}-${i}`} value={s.name}>
                  #{String(s.slNo || i + 1).padStart(2, '0')} — {s.name} ({s.district})
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => setModalSchool(activeDetails)}
              className="czc-click-here-badge"
              style={{ cursor: 'pointer' }}
            >
              ✓ Click Here &mdash; Open Full School Card
            </button>
          </div>
        </div>

        {/* VERTICAL STEM + HORIZONTAL TREE BRANCH BAR */}
        <div className="czc-stem-down" />
        <div className="czc-branch-bar" />

        {/* BOTTOM 3-COLUMN HIERARCHY:
            1. Secretary + Address (Sch At/PO, Dist, Pin)
            2. Academic Batches (1st 89-90, 2nd 90-91, 3rd 91-92, Others 92-93)
            3. Invigilator / Inspector (Centre-wise 1, 2, 3 -> Reports to Admin Officer)
        */}
        <div className="czc-bottom-branches">
          {/* BRANCH 1 (LEFT): SECRETARY + SCHOOL ADDRESS */}
          <div className="czc-secretary-card">
            <div className="czc-officer-top">
              <div className="czc-photo-box">
                <img src={activeDetails.secretary.photo} alt={activeDetails.secretary.name} />
                <span className="czc-photo-tag">ID / PHOTO</span>
              </div>
              <div className="czc-officer-info">
                <span className="czc-role-badge">School Authority</span>
                <h4 className="czc-officer-title">Name Secretary</h4>
                <div className="czc-officer-name">👤 {activeDetails.secretary.name}</div>
                <div className="czc-officer-subrole">
                  🪪 ID Card: <strong>{activeDetails.secretary.idCardNo}</strong>
                </div>
              </div>
            </div>

            <div className="czc-phone-strip">
              <div className="czc-phone-icon-group">
                <span style={{ fontSize: '1.15rem' }}>📱</span>
                <div>
                  <small style={{ display: 'block', fontSize: '0.66rem', color: '#475569' }}>
                    Mobile / WhatsApp
                  </small>
                  <span>{activeDetails.secretary.phone}</span>
                </div>
              </div>
              <div className="czc-phone-actions">
                <a
                  href={`tel:${activeDetails.secretary.phone.replace(/\s+/g, '')}`}
                  className="czc-mini-btn czc-mini-btn--call"
                >
                  📞 Call
                </a>
                <a
                  href={`https://wa.me/${activeDetails.secretary.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="czc-mini-btn czc-mini-btn--wa"
                >
                  💬 WhatsApp
                </a>
              </div>
            </div>

            {/* SCHOOL ADDRESS BOX (Sch At / PO / Dist / Pin) */}
            <div className="czc-address-box">
              <div className="czc-address-title">📍 School Address Details (Sch At / PO / Dist / Pin)</div>
              <div className="czc-address-row">
                <span>Sch At / P.O. &ndash;</span>
                <b>{activeDetails.address.atPo}</b>
              </div>
              <div className="czc-address-row">
                <span>Dist &ndash;</span>
                <b>{activeDetails.address.dist}</b>
              </div>
              <div className="czc-address-row">
                <span>PIN Code &ndash;</span>
                <b>{activeDetails.address.pin}</b>
              </div>
            </div>
          </div>

          {/* BRANCH 2 (CENTER): 4 HISTORICAL ACADEMIC BATCHES (89-90 to 92-93) */}
          <div className="czc-batches-card">
            <div className="czc-batches-head">🎓 Recognized Training Batches</div>
            <div className="czc-batch-list">
              {activeDetails.batches.map((b, idx) => (
                <button
                  key={b.order}
                  type="button"
                  onClick={() => setActiveBatchIdx(idx)}
                  className={`czc-batch-item ${activeBatchIdx === idx ? 'is-active' : ''}`}
                >
                  <span className="czc-batch-order">{b.order}</span>
                  <span className="czc-batch-session">{b.session}</span>
                </button>
              ))}
            </div>

            <div
              style={{
                marginTop: '0.75rem',
                background: '#F0F9FF',
                border: '1px solid #BAE6FD',
                borderRadius: '8px',
                padding: '0.6rem 0.75rem',
                fontSize: '0.76rem',
                color: '#0C4A6E',
                lineHeight: 1.45,
              }}
            >
              <strong style={{ display: 'block', color: '#0369A1', marginBottom: '0.15rem' }}>
                ✓ {activeDetails.batches[activeBatchIdx]?.order} ({activeDetails.batches[activeBatchIdx]?.batchLabel})
              </strong>
              {activeDetails.batches[activeBatchIdx]?.remarks} under{' '}
              <strong>{activeDetails.name}</strong>.
            </div>
          </div>

          {/* BRANCH 3 (RIGHT): INVIGILATOR / INSPECTOR (CENTRE-WISE, REPORTS TO ADMIN OFFICER) */}
          <div className="czc-invigilator-card">
            <div className="czc-upward-report-banner">
              <span>↑ Reports Directly To:</span>
              <strong>Administrative Officer ({activeZoneObj.code || 'CZC'})</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.35rem' }}>
              <span className="czc-role-badge">
                Centre-Wise (Not School) &middot; {activeDetails.invigilators.length} Centres
              </span>
              <small style={{ fontSize: '0.7rem', color: '#831843', fontWeight: 700 }}>
                (May be 1, 2, or 3 according to Centres)
              </small>
            </div>

            {/* CENTRE SWITCHER TABS (Centre 1, Centre 2, Centre 3) */}
            <div className="czc-centre-tabs">
              {activeDetails.invigilators.map((inv, idx) => (
                <button
                  key={inv.idCardNo}
                  type="button"
                  onClick={() => setActiveCentreIdx(idx)}
                  className={`czc-centre-tab ${activeCentreIdx === idx ? 'is-active' : ''}`}
                >
                  Centre #{inv.centreNo}
                </button>
              ))}
            </div>

            {currentInvigilator && (
              <div className="czc-centre-detail-box">
                <div className="czc-officer-top">
                  <div className="czc-photo-box">
                    <img src={currentInvigilator.photo} alt={currentInvigilator.name} />
                    <span className="czc-photo-tag">PHOTO</span>
                  </div>
                  <div className="czc-officer-info">
                    <h4 className="czc-officer-title" style={{ fontSize: '0.95rem' }}>
                      Name Inspector / Invigilator
                    </h4>
                    <div className="czc-officer-name">👤 {currentInvigilator.name}</div>
                    <div className="czc-officer-subrole">
                      🏷️ Designation: <strong>{currentInvigilator.designation}</strong>
                    </div>
                    <div className="czc-officer-subrole" style={{ color: '#9D174D' }}>
                      🏛️ Centre: <strong>{currentInvigilator.centreName}</strong>
                    </div>
                  </div>
                </div>

                <div className="czc-phone-strip" style={{ marginTop: '0.65rem' }}>
                  <div className="czc-phone-icon-group">
                    <span style={{ fontSize: '1.1rem' }}>📱</span>
                    <div>
                      <small style={{ display: 'block', fontSize: '0.65rem', color: '#475569' }}>
                        Mobile / WhatsApp
                      </small>
                      <span>{currentInvigilator.phone}</span>
                    </div>
                  </div>
                  <div className="czc-phone-actions">
                    <a
                      href={`tel:${currentInvigilator.phone.replace(/\s+/g, '')}`}
                      className="czc-mini-btn czc-mini-btn--call"
                    >
                      📞 Call
                    </a>
                    <a
                      href={`https://wa.me/${currentInvigilator.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="czc-mini-btn czc-mini-btn--wa"
                    >
                      💬 WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* BOTTOM EMAIL STRIP (As shown at the bottom of Image 1) */}
        <div className="czc-email-footer">
          <span style={{ fontSize: '1.25rem' }}>✉️</span>
          <span>
            Email &rarr;{' '}
            <a
              href={`mailto:${activeDetails.secretary.email}`}
              style={{ color: '#6B21A8', textDecoration: 'underline', fontWeight: 800 }}
            >
              {activeDetails.secretary.email}
            </a>
          </span>
          <span style={{ color: '#94A3B8' }}>|</span>
          <span>
            Zonal Desk:{' '}
            <a
              href={`mailto:${activeZoneObj.email || 'info@aopstsma.in'}`}
              style={{ color: '#0B2545', textDecoration: 'underline', fontWeight: 800 }}
            >
              {activeZoneObj.email || 'info@aopstsma.in'}
            </a>
          </span>
        </div>
      </div>

      {/* =====================================================================
          2. SEARCH AND ZONE FILTER CHIPS FOR ALL 90 SCHOOLS
         ===================================================================== */}
      <div className="filters schools-filter-bar">
        <label className="visually-hidden" htmlFor="school-search">
          Search member schools
        </label>
        <div
          className="search-input-wrap"
          style={{
            position: 'relative',
            flex: '1 1 240px',
            minWidth: 0,
            width: '100%',
            maxWidth: '100%',
          }}
        >
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
            ? `Showing ${filteredSchools.length} of ${SCHOOLS.length} verified member schools — Click any school to view full details`
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
          filteredSchools.map((s, idx) => {
            const full = getSchoolFullDetails(s, s.slNo || idx + 1);
            const isSelected = activeSchool.name === s.name && activeSchool.zone === s.zone;
            return (
              <div
                key={`${s.zone}-${idx}`}
                className="school-card-mobile"
                style={{
                  border: isSelected ? '2px solid #0284C7' : undefined,
                }}
              >
                <div className="school-card-mobile__head">
                  <span className="school-card-mobile__num">
                    #{String(s.slNo || idx + 1).padStart(2, '0')} &middot; {full.schoolCode}
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

                <div
                  style={{
                    fontSize: '0.8rem',
                    color: '#475569',
                    margin: '0.35rem 0 0.65rem 0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.2rem',
                  }}
                >
                  <span>
                    📍 <strong>At/P.O.:</strong> {full.address.atPo}, <strong>Dist:</strong>{' '}
                    {full.address.dist} &ndash; <strong>{full.address.pin}</strong>
                  </span>
                  <span>
                    🎓 <strong>Batches:</strong> 89–90, 90–91, 91–92, 92–93
                  </span>
                </div>

                <div
                  className="school-card-mobile__meta"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '0.5rem',
                    flexWrap: 'wrap',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => handleSelectSchoolFromDirectory(s, idx, true)}
                    className={`school-click-here-btn ${isSelected ? 'is-selected' : ''}`}
                  >
                    ✓ Click Here &mdash; View All Details
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="school-empty-mobile">
            <p>No institutions match &ldquo;{query}&rdquo; in this zone.</p>
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => {
                setQuery('');
                handleChipClick('all');
              }}
            >
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
              <th style={{ width: '64px', textAlign: 'center' }}>#</th>
              <th>Institution / School Name</th>
              <th>Association Zone</th>
              <th>At/P.O., District &amp; PIN</th>
              <th>Batches</th>
              <th style={{ textAlign: 'center' }}>School Details</th>
            </tr>
          </thead>
          <tbody id="school-rows">
            {filteredSchools.length > 0 ? (
              filteredSchools.map((s, idx) => {
                const full = getSchoolFullDetails(s, s.slNo || idx + 1);
                const isSelected = activeSchool.name === s.name && activeSchool.zone === s.zone;
                return (
                  <tr
                    key={`${s.zone}-${idx}`}
                    style={{
                      background: isSelected ? '#F0F9FF' : undefined,
                      cursor: 'pointer',
                    }}
                    onClick={() => handleSelectSchoolFromDirectory(s, idx, true)}
                  >
                    <td style={{ textAlign: 'center', color: '#64748B', fontWeight: 700 }}>
                      {String(s.slNo || idx + 1).padStart(2, '0')}
                    </td>
                    <td>
                      <div style={{ fontWeight: 800, color: '#0B2545', fontSize: '0.98rem' }}>
                        {s.name}
                      </div>
                      <small style={{ color: '#64748B', fontWeight: 600 }}>
                        Code: {full.schoolCode} &middot; Secy ID: {full.secretary.idCardNo}
                      </small>
                    </td>
                    <td>
                      <Link
                        href={`/schools?zone=${s.zone}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          handleChipClick(s.zone);
                        }}
                        className="table-zone-link"
                      >
                        {zoneName(s.zone)}
                      </Link>
                    </td>
                    <td style={{ color: '#334155', fontSize: '0.86rem' }}>
                      <div>
                        📍 <strong>{full.address.dist}</strong> &ndash; {full.address.pin}
                      </div>
                      <small style={{ color: '#64748B' }}>At/P.O.: {full.address.atPo}</small>
                    </td>
                    <td style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0369A1' }}>
                      89–90 &bull; 90–91
                      <br />
                      91–92 &bull; 92–93
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectSchoolFromDirectory(s, idx, true);
                        }}
                        className={`school-click-here-btn ${isSelected ? 'is-selected' : ''}`}
                      >
                        ✓ Click Here
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="school-empty">
                  No institutions match &ldquo;{query}&rdquo; in this zone. Check your spelling or
                  select &ldquo;All&rdquo;.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* =====================================================================
          3. FULL SCHOOL DETAILS MODAL (OPENS WHEN ANY SCHOOL'S "CLICK HERE" IS CLICKED)
         ===================================================================== */}
      {modalSchool && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${modalSchool.name} Full Details`}
          onClick={() => setModalSchool(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(6, 19, 36, 0.78)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            overflowY: 'auto',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#FFFFFF',
              borderRadius: '18px',
              border: '2px solid #D97706',
              maxWidth: '980px',
              width: '100%',
              maxHeight: '92vh',
              overflowY: 'auto',
              padding: '1.5rem',
              boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
              position: 'relative',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '1rem',
                borderBottom: '2px solid #E2E8F0',
                paddingBottom: '1rem',
                marginBottom: '1.25rem',
              }}
            >
              <div>
                <span
                  style={{
                    display: 'inline-block',
                    background: '#0B2545',
                    color: '#FDE68A',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    padding: '0.22rem 0.7rem',
                    borderRadius: '999px',
                    marginBottom: '0.35rem',
                  }}
                >
                  {modalSchool.zoneName} &middot; {modalSchool.schoolCode}
                </span>
                <h2 style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.65rem)', color: '#0B2545', margin: 0 }}>
                  🏫 {modalSchool.name}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setModalSchool(null)}
                style={{
                  background: '#F1F5F9',
                  border: '1px solid #CBD5E1',
                  borderRadius: '8px',
                  padding: '0.45rem 0.85rem',
                  fontWeight: 800,
                  color: '#0F172A',
                  cursor: 'pointer',
                }}
              >
                ✕ Close
              </button>
            </div>

            {/* Zonal Command Summary inside Modal */}
            {(() => {
              const z = getZoneDetails(modalSchool.zoneId);
              return (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                    gap: '1rem',
                    marginBottom: '1.25rem',
                  }}
                >
                  {/* Zonal President */}
                  <div className="czc-officer-card czc-officer-card--president">
                    <div className="czc-officer-top">
                      <div className="czc-photo-box">
                        <img
                          src={z.president?.photo || '/assets/img/president-nirmal-kanta-mohanty.jpg'}
                          alt={z.president?.name || 'President'}
                        />
                        <span className="czc-photo-tag">PHOTO</span>
                      </div>
                      <div className="czc-officer-info">
                        <span className="czc-role-badge">↗ Reports to Association</span>
                        <h4 className="czc-officer-title">{z.president?.designation}</h4>
                        <div className="czc-officer-name">👤 {z.president?.name}</div>
                        <div className="czc-officer-subrole">📱 {z.president?.phone}</div>
                      </div>
                    </div>
                  </div>

                  {/* Administrative Officer */}
                  <div className="czc-officer-card czc-officer-card--admin">
                    <div className="czc-officer-top">
                      <div className="czc-photo-box">
                        <img
                          src={z.adminOfficer?.photo || '/assets/img/secretary-alia-pradhan.jpg'}
                          alt={z.adminOfficer?.name || 'Administrative Officer'}
                        />
                        <span className="czc-photo-tag">PHOTO / ID</span>
                      </div>
                      <div className="czc-officer-info">
                        <span className="czc-role-badge">&larr; Reports to President</span>
                        <h4 className="czc-officer-title">{z.adminOfficer?.designation}</h4>
                        <div className="czc-officer-name">👤 {z.adminOfficer?.name}</div>
                        <div className="czc-officer-subrole">📱 {z.adminOfficer?.phone}</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* 3 Branches inside Modal: Secretary & Address | Batches | Centre-wise Invigilators */}
            <div className="czc-bottom-branches">
              {/* Secretary + Address */}
              <div className="czc-secretary-card">
                <div className="czc-officer-top">
                  <div className="czc-photo-box">
                    <img src={modalSchool.secretary.photo} alt={modalSchool.secretary.name} />
                    <span className="czc-photo-tag">ID / PHOTO</span>
                  </div>
                  <div className="czc-officer-info">
                    <span className="czc-role-badge">School Secretary</span>
                    <h4 className="czc-officer-title">{modalSchool.secretary.name}</h4>
                    <div className="czc-officer-subrole">
                      🪪 ID: <strong>{modalSchool.secretary.idCardNo}</strong>
                    </div>
                    <div className="czc-officer-subrole">📱 {modalSchool.secretary.phone}</div>
                  </div>
                </div>

                <div className="czc-address-box">
                  <div className="czc-address-title">📍 School Address (Sch At / PO / Dist / Pin)</div>
                  <div className="czc-address-row">
                    <span>Sch At / P.O. &ndash;</span>
                    <b>{modalSchool.address.atPo}</b>
                  </div>
                  <div className="czc-address-row">
                    <span>Dist &ndash;</span>
                    <b>{modalSchool.address.dist}</b>
                  </div>
                  <div className="czc-address-row">
                    <span>PIN &ndash;</span>
                    <b>{modalSchool.address.pin}</b>
                  </div>
                </div>
              </div>

              {/* 4 Academic Batches */}
              <div className="czc-batches-card">
                <div className="czc-batches-head">🎓 Recognized Batches</div>
                <div className="czc-batch-list">
                  {modalSchool.batches.map((b) => (
                    <div key={b.order} className="czc-batch-item is-active">
                      <span className="czc-batch-order">{b.order}</span>
                      <span className="czc-batch-session">{b.session}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Centre-wise Invigilators */}
              <div className="czc-invigilator-card">
                <div className="czc-upward-report-banner">
                  <span>↑ Reports To:</span>
                  <strong>Administrative Officer ({modalSchool.zoneShortCode})</strong>
                </div>
                <span className="czc-role-badge">
                  Centre-Wise Invigilators (1, 2, or 3 Centres)
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {modalSchool.invigilators.map((inv) => (
                    <div key={inv.idCardNo} className="czc-centre-detail-box">
                      <div style={{ fontWeight: 800, fontSize: '0.82rem', color: '#831843' }}>
                        🏛️ Centre #{inv.centreNo}: {inv.centreName}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#0F172A', marginTop: '0.2rem' }}>
                        👤 <strong>{inv.name}</strong> ({inv.designation})
                      </div>
                      <div style={{ fontSize: '0.76rem', color: '#475569', marginTop: '0.15rem' }}>
                        📱 Mobile/WhatsApp: <strong>{inv.phone}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="czc-email-footer" style={{ marginTop: '1rem' }}>
              <span>✉️ Email &rarr; {modalSchool.secretary.email}</span>
            </div>
          </div>
        </div>
      )}

      <div className="note" style={{ marginTop: '2.5rem' }}>
        Official member school register as compiled and verified by the All Orissa Private Secondary
        Training Schools Management Association. If your school details need updating, please
        contact the central secretariat at{' '}
        <a href="mailto:info@aopstsma.in" style={{ color: '#0B2545', fontWeight: 700 }}>
          info@aopstsma.in
        </a>
        .
      </div>
    </div>
  );
}
