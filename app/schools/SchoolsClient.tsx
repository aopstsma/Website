'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
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
  const schoolSectionRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState('');
  const rawParam = searchParams.get('zone') || 'balasore';
  const normalizedZone =
    rawParam === 'cuttack'
      ? 'central'
      : rawParam === 'berhampur'
      ? 'ganjam'
      : rawParam === 'all'
      ? 'all'
      : rawParam;

  const [selectedZone, setSelectedZone] = useState(normalizedZone);

  // Default to Baleswar Zone -> Sugo Secondary Training School (as shown in Notebook Page 1)
  const defaultBaleswarSchool = useMemo(
    () =>
      SCHOOLS.find((s) => s.zone === 'balasore' && s.name.toLowerCase().includes('sugo')) ||
      SCHOOLS.find((s) => s.zone === 'balasore') ||
      SCHOOLS[0],
    []
  );

  const [activeSchool, setActiveSchool] = useState<School>(defaultBaleswarSchool);
  const [showBatches, setShowBatches] = useState<boolean>(true);
  const [activeBatchIdx, setActiveBatchIdx] = useState<number>(0);
  const [activeCentreIdx, setActiveCentreIdx] = useState<number>(0);
  const [modalSchool, setModalSchool] = useState<SchoolFullDetails | null>(null);
  const [candidateQuery, setCandidateQuery] = useState<string>('');

  useEffect(() => {
    const p = searchParams.get('zone');
    if (!p) return;
    const norm = p === 'cuttack' ? 'central' : p === 'berhampur' ? 'ganjam' : p;
    setSelectedZone(norm);

    if (norm !== 'all') {
      const firstInZone = SCHOOLS.find((s) => s.zone === norm);
      if (firstInZone) {
        setActiveSchool(firstInZone);
        setActiveCentreIdx(0);
      }
    }
  }, [searchParams]);

  const zoneName = (id: string) => {
    const found = ZONES.find((z) => z.id === id);
    return found ? found.name : id;
  };

  // Ordered 1 to 5 exactly as written in the notebook:
  // 1 - BALESWAR - 40 School
  // 2 - CENTRAL - 24 School
  // 3 - Bhubaneswar - 15 School
  // 4 - Sambalpur - 9 School
  // 5 - Berhampur - 2 School
  const orderedZones = [
    { num: 1, id: 'balasore', title: 'BALESWAR', count: 40 },
    { num: 2, id: 'central', title: 'CENTRAL', count: 24 },
    { num: 3, id: 'bhubaneswar', title: 'Bhubaneswar', count: 15 },
    { num: 4, id: 'sambalpur', title: 'Sambalpur', count: 9 },
    { num: 5, id: 'ganjam', title: 'Berhampur', count: 2 },
  ];

  const chips = [
    { id: 'all', label: `All (${SCHOOLS.length})` },
    { id: 'balasore', label: '1. Baleswar (40)' },
    { id: 'central', label: '2. Central (24)' },
    { id: 'bhubaneswar', label: '3. Bhubaneswar (15)' },
    { id: 'sambalpur', label: '4. Sambalpur (9)' },
    { id: 'ganjam', label: '5. Berhampur (2)' },
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

  const activeDetails = useMemo(
    () => getSchoolFullDetails(activeSchool, activeSchool.slNo || 1),
    [activeSchool]
  );

  const activeZoneObj = useMemo(
    () => getZoneDetails(activeSchool.zone),
    [activeSchool]
  );

  const schoolsInChartZone = useMemo(
    () => SCHOOLS.filter((s) => s.zone === activeSchool.zone),
    [activeSchool.zone]
  );

  const handleZoneSelect = (zoneId: string) => {
    setSelectedZone(zoneId);
    if (zoneId !== 'all') {
      const firstSchool = SCHOOLS.find((s) => s.zone === zoneId);
      if (firstSchool) {
        setActiveSchool(firstSchool);
        setActiveCentreIdx(0);
      }
      router.replace(`/schools?zone=${zoneId}`, { scroll: false });
    } else {
      router.replace('/schools', { scroll: false });
    }
  };

  const handleSchoolClick = (school: School, idx: number, openPopup = false) => {
    setActiveSchool(school);
    setActiveCentreIdx(0);
    setShowBatches(true);
    const full = getSchoolFullDetails(school, school.slNo || idx + 1);
    if (openPopup) {
      setModalSchool(full);
    } else if (schoolSectionRef.current) {
      schoolSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const currentInvigilator =
    activeDetails.invigilators[activeCentreIdx] || activeDetails.invigilators[0];

  return (
    <div className="schools-directory-wrap">
      {/* =====================================================================
          1. AOPSTSMA SCHOOL SECTION FLOWCHART (MATCHING NOTEBOOK PAGE 1)
         ===================================================================== */}
      <div className="czc-flowchart-shell">
        {/* TOP: AOPSTSMA -> SCHOOL SECTION -> ( Logo ) */}
        <div style={{ textAlign: 'center', marginBottom: '0.75rem' }}>
          <div
            style={{
              fontSize: '0.78rem',
              fontWeight: 800,
              letterSpacing: '0.12em',
              color: '#1E40AF',
              textTransform: 'uppercase',
            }}
          >
            AOPSTSMA
          </div>
          <h2
            style={{
              fontSize: 'clamp(1.25rem, 2.5vw, 1.65rem)',
              fontWeight: 900,
              color: '#0B2545',
              textDecoration: 'underline',
              textDecorationColor: '#D97706',
              marginTop: '0.15rem',
            }}
          >
            SCHOOL SECTION
          </h2>

          {/* ( Logo ) Circle */}
          <div
            style={{
              display: 'inline-flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginTop: '0.65rem',
            }}
          >
            <div
              style={{
                width: '74px',
                height: '74px',
                borderRadius: '50%',
                border: '3px solid #0B2545',
                outline: '2px solid #D97706',
                background: '#FFFFFF',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 6px 18px rgba(11,37,69,0.15)',
                overflow: 'hidden',
              }}
            >
              <Image
                src="/assets/img/aopstsma-seal.jpg"
                alt="AOPSTSMA Logo"
                width={66}
                height={66}
                style={{ borderRadius: '50%', objectFit: 'cover' }}
              />
            </div>
            <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#1E40AF', lineHeight: 1, marginTop: '0.35rem' }}>
              &darr;
            </span>
          </div>
        </div>

        {/* [ ZONE ] (Select from 5 Zone) */}
        <div
          style={{
            maxWidth: '780px',
            margin: '0 auto 1.25rem',
            background: '#FFFFFF',
            border: '2px solid #0B2545',
            borderRadius: '14px',
            padding: '1.1rem 1.25rem',
            boxShadow: '0 6px 20px rgba(11,37,69,0.06)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.65rem',
              flexWrap: 'wrap',
              marginBottom: '0.85rem',
            }}
          >
            <span
              style={{
                border: '2px solid #0B2545',
                background: '#0B2545',
                color: '#FDE68A',
                fontWeight: 900,
                fontSize: '0.88rem',
                padding: '0.3rem 1.1rem',
                borderRadius: '6px',
                letterSpacing: '0.06em',
              }}
            >
              ZONE
            </span>
            <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#334155' }}>
              (Select from 5 Zone)
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
              gap: '0.55rem',
            }}
          >
            {orderedZones.map((z) => {
              const isSelected = activeZoneObj.id === z.id;
              return (
                <button
                  key={z.id}
                  type="button"
                  onClick={() => handleZoneSelect(z.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.9rem',
                    borderRadius: '8px',
                    border: isSelected ? '2px solid #D97706' : '1.5px solid #CBD5E1',
                    background: isSelected
                      ? 'linear-gradient(135deg, #0B2545 0%, #1E3A8A 100%)'
                      : '#F8FAFC',
                    color: isSelected ? '#FFFFFF' : '#0F172A',
                    fontWeight: 800,
                    fontSize: '0.86rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span>
                    {z.num} &ndash; {z.title}
                  </span>
                  <span
                    style={{
                      background: isSelected ? '#FDE68A' : '#E2E8F0',
                      color: '#0B2545',
                      padding: '0.15rem 0.55rem',
                      borderRadius: '999px',
                      fontSize: '0.75rem',
                      fontWeight: 900,
                    }}
                  >
                    {z.count} School
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* SELECTED ZONE BRANCH (President & Administrative Officer) */}
        <div
          style={{
            marginBottom: '1.5rem',
          }}
        >
          {/* Selected Zone -> President & Administrative Officer */}
          <div
            style={{
              background: '#FFFFFF',
              border: '2px solid #1E40AF',
              borderRadius: '14px',
              padding: '1.25rem',
            }}
          >
            {/* Selected Zone Header Box */}
            <div style={{ textAlign: 'center', marginBottom: '0.85rem' }}>
              <div
                style={{
                  display: 'inline-block',
                  border: '2px solid #0B2545',
                  background: '#EFF6FF',
                  color: '#0B2545',
                  fontWeight: 900,
                  fontSize: '1.05rem',
                  padding: '0.4rem 1.5rem',
                  borderRadius: '8px',
                }}
              >
                {activeZoneObj.name} ({activeZoneObj.schoolCount} Schools)
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#1E40AF', marginTop: '0.2rem' }}>
                &darr;
              </div>
            </div>

            {/* Two Officer Boxes: President (Left) & Administrative Officer (Right) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1rem',
              }}
            >
              {/* PRESIDENT BOX */}
              <div className="czc-officer-card czc-officer-card--president">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div>
                    <span className="czc-role-badge">Zonal President</span>
                    <h3 className="czc-officer-title">President</h3>
                  </div>
                </div>

                <div
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #86EFAC',
                    borderRadius: '8px',
                    padding: '0.65rem 0.8rem',
                    fontSize: '0.83rem',
                    lineHeight: 1.65,
                  }}
                >
                  <div>
                    &ndash; <strong>Name:</strong> {activeZoneObj.president?.name}
                  </div>
                  <div>
                    &ndash; <strong>Designation:</strong> {activeZoneObj.president?.designation}
                  </div>
                  <div>
                    &ndash; <strong>Mobile:</strong>{' '}
                    <a
                      href={`tel:${(activeZoneObj.president?.phone || '+916370987576').replace(/\s+/g, '')}`}
                      style={{ color: '#0B2545', fontWeight: 700 }}
                    >
                      {activeZoneObj.president?.phone}
                    </a>
                  </div>
                  <div>
                    &ndash; <strong>Whatsapp:</strong>{' '}
                    <a
                      href={`https://wa.me/${activeZoneObj.president?.whatsapp || '916370987576'}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#15803D', fontWeight: 800, textDecoration: 'underline' }}
                    >
                      Chat on WhatsApp ({activeZoneObj.president?.phone})
                    </a>
                  </div>
                </div>
              </div>

              {/* ADMINISTRATIVE OFFICER BOX */}
              <div className="czc-officer-card czc-officer-card--admin">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div>
                    <span className="czc-role-badge">Zonal Administration</span>
                    <h3 className="czc-officer-title">Administrative Officer</h3>
                  </div>
                </div>

                <div
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #FDBA74',
                    borderRadius: '8px',
                    padding: '0.65rem 0.8rem',
                    fontSize: '0.83rem',
                    lineHeight: 1.65,
                  }}
                >
                  <div>
                    &ndash; <strong>Name:</strong> {activeZoneObj.adminOfficer?.name}
                  </div>
                  <div>
                    &ndash; <strong>Designation:</strong> {activeZoneObj.adminOfficer?.designation}
                  </div>
                  <div>
                    &ndash; <strong>Mobile:</strong>{' '}
                    <a
                      href={`tel:${(activeZoneObj.adminOfficer?.phone || '+916370987576').replace(/\s+/g, '')}`}
                      style={{ color: '#0B2545', fontWeight: 700 }}
                    >
                      {activeZoneObj.adminOfficer?.phone}
                    </a>
                  </div>
                  <div>
                    &ndash; <strong>Whatsapp:</strong>{' '}
                    <a
                      href={`https://wa.me/${activeZoneObj.adminOfficer?.whatsapp || '916370987576'}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#15803D', fontWeight: 800, textDecoration: 'underline' }}
                    >
                      Chat on WhatsApp ({activeZoneObj.adminOfficer?.phone})
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================================
            [ SCHOOL ] SECTION -> SUGO SECONDARY TRAINING SCHOOL ( CLICK ) -> SEE THE BATCH
            & BELOW: SECRETARY (Name, Designation, Mobile, WP, AT, PO, Dist, Pin) + INVIGILATOR (Name, Designation, Mobile, Center)
           =================================================================== */}
        <div
          ref={schoolSectionRef}
          style={{
            background: '#FFFFFF',
            border: '2px solid #0284C7',
            borderRadius: '16px',
            padding: '1.35rem',
            boxShadow: '0 8px 26px rgba(2,132,199,0.1)',
          }}
        >
          {/* Top Row: [ School ] + Selected School Name + ( Click ) ---> See the Batch */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.15fr 1fr',
              gap: '1.25rem',
              alignItems: 'center',
              paddingBottom: '1.15rem',
              borderBottom: '2px dashed #BAE6FD',
              marginBottom: '1.25rem',
            }}
            className="notebook-school-top-grid"
          >
            {/* Left: [ School ] Box + Dropdown + ( Click ) */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.55rem' }}>
                <span
                  style={{
                    border: '2px solid #0B2545',
                    background: '#0B2545',
                    color: '#FFFFFF',
                    fontWeight: 900,
                    fontSize: '0.8rem',
                    padding: '0.22rem 0.85rem',
                    borderRadius: '6px',
                  }}
                >
                  School
                </span>
                <span style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 700 }}>
                  Code: {activeDetails.schoolCode} &middot; {activeZoneObj.name}
                </span>
              </div>

              <h3
                style={{
                  fontSize: 'clamp(1.15rem, 2.2vw, 1.45rem)',
                  fontWeight: 900,
                  color: '#0B2545',
                  margin: '0 0 0.65rem 0',
                  textDecoration: 'underline',
                  textDecorationColor: '#0284C7',
                }}
              >
                🏫 {activeDetails.name}
              </h3>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                <select
                  aria-label="Select School"
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
                  onClick={() => setShowBatches((prev) => !prev)}
                  style={{
                    border: '2px solid #0B2545',
                    background: '#FEF3C7',
                    color: '#0B2545',
                    fontWeight: 900,
                    fontSize: '0.86rem',
                    padding: '0.5rem 1.15rem',
                    borderRadius: '999px',
                    cursor: 'pointer',
                    boxShadow: '0 3px 10px rgba(217,119,6,0.2)',
                  }}
                >
                  ( Click ) &mdash; See the Batch &rarr;
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const noble = SCHOOLS.find((s) =>
                      s.name.toLowerCase().includes('noble c.t')
                    );
                    if (noble) {
                      setSelectedZone('bhubaneswar');
                      setActiveSchool(noble);
                      setActiveCentreIdx(0);
                      setShowBatches(true);
                    }
                  }}
                  style={{
                    border: '2px solid #15803D',
                    background: '#DCFCE7',
                    color: '#14532D',
                    fontWeight: 900,
                    fontSize: '0.8rem',
                    padding: '0.45rem 0.95rem',
                    borderRadius: '999px',
                    cursor: 'pointer',
                  }}
                >
                  📄 View Orissa Noble C.T. School (115 Candidates PDF)
                </button>
              </div>
            </div>

            {/* Right: See the Batch -> 1989-1990, 1990-1991, 1991-1992, 1992-1993 Other Batch */}
            <div
              style={{
                background: '#F0F9FF',
                border: '2px solid #0284C7',
                borderRadius: '12px',
                padding: '0.9rem 1rem',
              }}
            >
              <div
                style={{
                  fontSize: '0.82rem',
                  fontWeight: 900,
                  color: '#0369A1',
                  marginBottom: '0.55rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                🎓 See the Batch ({activeDetails.name})
              </div>
              {showBatches && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.42rem' }}>
                  {activeDetails.batches.map((b, idx) => (
                    <button
                      key={b.order}
                      type="button"
                      onClick={() => setActiveBatchIdx(idx)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: activeBatchIdx === idx ? '#0B2545' : '#FFFFFF',
                        color: activeBatchIdx === idx ? '#FDE68A' : '#0F172A',
                        border:
                          activeBatchIdx === idx ? '1.5px solid #D97706' : '1px solid #BAE6FD',
                        borderRadius: '8px',
                        padding: '0.45rem 0.75rem',
                        fontWeight: 800,
                        fontSize: '0.84rem',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      <span>&rarr; {b.batchLabel}</span>
                      <span style={{ fontSize: '0.72rem', opacity: 0.9 }}>✓ Verified</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* BELOW SCHOOL: 2 SIDE-BY-SIDE CARDS:
              1. Secretary (- Name, - Designation, - Mobile, - WP, - AT, - PO, - Dist, - Pin)
              2. Invigilator (- Name, - Designation, - Mobile, - Center)
          */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {/* LEFT CARD: SECRETARY */}
            <div className="czc-secretary-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div>
                  <span className="czc-role-badge">School Head / Authority</span>
                  <h4 className="czc-officer-title" style={{ fontSize: '1.15rem' }}>
                    Secretary
                  </h4>
                  <small style={{ color: '#6B21A8', fontWeight: 700 }}>
                    ID: {activeDetails.secretary.idCardNo}
                  </small>
                </div>
              </div>

              <div
                style={{
                  background: '#FFFFFF',
                  border: '1.5px solid #C084FC',
                  borderRadius: '10px',
                  padding: '0.85rem 1rem',
                  fontSize: '0.86rem',
                  lineHeight: 1.75,
                }}
              >
                <div>
                  &ndash; <strong>Name:</strong> {activeDetails.secretary.name}
                </div>
                <div>
                  &ndash; <strong>Designation:</strong> {activeDetails.secretary.designation}
                </div>
                <div>
                  &ndash; <strong>Mobile:</strong>{' '}
                  <a
                    href={`tel:${activeDetails.secretary.phone.replace(/\s+/g, '')}`}
                    style={{ color: '#0B2545', fontWeight: 800 }}
                  >
                    {activeDetails.secretary.phone}
                  </a>
                </div>
                <div>
                  &ndash; <strong>WP (WhatsApp):</strong>{' '}
                  <a
                    href={`https://wa.me/${activeDetails.secretary.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#15803D', fontWeight: 800, textDecoration: 'underline' }}
                  >
                    {activeDetails.secretary.phone} (Click to WhatsApp)
                  </a>
                </div>
                <hr style={{ border: 'none', borderTop: '1px dashed #D8B4FE', margin: '0.45rem 0' }} />
                <div>
                  &ndash; <strong>AT:</strong> {activeDetails.address.at}
                </div>
                <div>
                  &ndash; <strong>PO:</strong> {activeDetails.address.po}
                </div>
                {activeDetails.address.via && (
                  <div>
                    &ndash; <strong>Via:</strong> {activeDetails.address.via}
                  </div>
                )}
                <div>
                  &ndash; <strong>Dist:</strong> {activeDetails.address.dist}
                </div>
                {activeDetails.address.circle && (
                  <div>
                    &ndash; <strong>Circle / Block:</strong> {activeDetails.address.circle} /{' '}
                    {activeDetails.address.block || activeDetails.address.educationalDistrict}
                  </div>
                )}
                {activeDetails.address.telegraphOffice && (
                  <div>
                    &ndash; <strong>Nearest Telegraph Office:</strong>{' '}
                    {activeDetails.address.telegraphOffice}
                  </div>
                )}
                {activeDetails.address.landline && (
                  <div>
                    &ndash; <strong>School Telephone:</strong> {activeDetails.address.landline}
                  </div>
                )}
                <div>
                  &ndash; <strong>Pin:</strong> {activeDetails.address.pin}
                </div>
              </div>
            </div>

            {/* RIGHT CARD: INVIGILATOR */}
            <div className="czc-invigilator-card">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div>
                    <span className="czc-role-badge">↑ Reports to Administrative Officer</span>
                    <h4 className="czc-officer-title" style={{ fontSize: '1.15rem' }}>
                      Invigilator
                    </h4>
                  </div>
                </div>

                {/* Centre 1 / 2 / 3 Switcher */}
                <div className="czc-centre-tabs">
                  {activeDetails.invigilators.map((inv, idx) => (
                    <button
                      key={inv.idCardNo}
                      type="button"
                      onClick={() => setActiveCentreIdx(idx)}
                      className={`czc-centre-tab ${activeCentreIdx === idx ? 'is-active' : ''}`}
                    >
                      Center #{inv.centreNo}
                    </button>
                  ))}
                </div>
              </div>

              {currentInvigilator && (
                <div
                  style={{
                    background: '#FFFFFF',
                    border: '1.5px solid #F472B6',
                    borderRadius: '10px',
                    padding: '0.85rem 1rem',
                    fontSize: '0.86rem',
                    lineHeight: 1.8,
                  }}
                >
                  <div>
                    &ndash; <strong>Name:</strong> {currentInvigilator.name}
                  </div>
                  <div>
                    &ndash; <strong>Designation:</strong> {currentInvigilator.designation}
                  </div>
                  <div>
                    &ndash; <strong>Mobile:</strong>{' '}
                    <a
                      href={`tel:${currentInvigilator.phone.replace(/\s+/g, '')}`}
                      style={{ color: '#0B2545', fontWeight: 800 }}
                    >
                      {currentInvigilator.phone}
                    </a>{' '}
                    &middot;{' '}
                    <a
                      href={`https://wa.me/${currentInvigilator.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#15803D', fontWeight: 800, textDecoration: 'underline' }}
                    >
                      WhatsApp
                    </a>
                  </div>
                  <div>
                    &ndash; <strong>Center:</strong>{' '}
                    <span style={{ color: '#9D174D', fontWeight: 800 }}>
                      {currentInvigilator.centreName}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* OFFICIAL B.S.E. EXAM FORM NO. 29 — DESCRIPTIVE ROLL (DR) CANDIDATE LIST */}
          {activeDetails.candidates && activeDetails.candidates.length > 0 && (
            <div
              style={{
                marginTop: '1.35rem',
                background: '#F8FAFC',
                border: '2px solid #0B2545',
                borderRadius: '14px',
                padding: '1.2rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.85rem',
                  marginBottom: '1rem',
                  paddingBottom: '0.85rem',
                  borderBottom: '2px solid #CBD5E1',
                }}
              >
                <div>
                  <span
                    style={{
                      display: 'inline-block',
                      background: '#15803D',
                      color: '#FFFFFF',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '0.2rem 0.65rem',
                      borderRadius: '999px',
                      marginBottom: '0.3rem',
                    }}
                  >
                    ✓ VERIFIED B.S.E. EXAM FORM NO. 29 &bull; DATED {activeDetails.drFormDate || '22/06/2009'}
                  </span>
                  <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#0B2545', fontWeight: 900 }}>
                    📋 Descriptive Roll (DR) of {activeDetails.candidates.length} Candidates —{' '}
                    {activeDetails.name}
                  </h4>
                  <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: '#475569' }}>
                    Board of Secondary Education, Orissa &bull; Certified by Headmaster{' '}
                    <strong>{activeDetails.secretary.name}</strong> &bull; Tel:{' '}
                    <strong>{activeDetails.address.landline || '0674-2397022'}</strong>
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                  <input
                    type="search"
                    placeholder="Search 115 candidates by name or roll..."
                    value={candidateQuery}
                    onChange={(e) => setCandidateQuery(e.target.value)}
                    style={{
                      padding: '0.5rem 0.85rem',
                      borderRadius: '8px',
                      border: '1.5px solid #94A3B8',
                      fontSize: '0.84rem',
                      minWidth: '250px',
                    }}
                  />
                  {activeDetails.drFormPdf && (
                    <a
                      href={activeDetails.drFormPdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        background: '#0B2545',
                        color: '#FDE68A',
                        fontWeight: 800,
                        fontSize: '0.82rem',
                        padding: '0.55rem 1rem',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        border: '1.5px solid #D97706',
                      }}
                    >
                      📥 View / Download Original PDF (7 Pages)
                    </a>
                  )}
                </div>
              </div>

              <div style={{ maxHeight: '380px', overflowY: 'auto', borderRadius: '10px', border: '1px solid #CBD5E1' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', background: '#FFFFFF' }}>
                  <thead style={{ position: 'sticky', top: 0, background: '#0B2545', color: '#FFFFFF', zIndex: 1 }}>
                    <tr>
                      <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left' }}>Sl. No.</th>
                      <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left' }}>DR Roll No.</th>
                      <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left' }}>Candidate Name</th>
                      <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left' }}>DR List Type</th>
                      <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left' }}>PDF Page</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeDetails.candidates
                      .filter((c) => {
                        const q = candidateQuery.trim().toLowerCase();
                        if (!q) return true;
                        return (
                          c.name.toLowerCase().includes(q) ||
                          c.rollLabel.toLowerCase().includes(q) ||
                          c.listType.toLowerCase().includes(q) ||
                          String(c.slNo).includes(q)
                        );
                      })
                      .map((c, idx) => (
                        <tr
                          key={`${c.slNo}-${idx}`}
                          style={{
                            borderBottom: '1px solid #E2E8F0',
                            background: idx % 2 === 0 ? '#FFFFFF' : '#F8FAFC',
                          }}
                        >
                          <td style={{ padding: '0.5rem 0.75rem', fontWeight: 800, color: '#64748B' }}>
                            #{String(c.slNo).padStart(3, '0')}
                          </td>
                          <td style={{ padding: '0.5rem 0.75rem', fontWeight: 800, color: '#1E40AF' }}>
                            {c.rollLabel}
                          </td>
                          <td style={{ padding: '0.5rem 0.75rem', fontWeight: 800, color: '#0B2545' }}>
                            {c.name}
                          </td>
                          <td style={{ padding: '0.5rem 0.75rem', color: '#334155' }}>{c.listType}</td>
                          <td style={{ padding: '0.5rem 0.75rem', fontWeight: 700, color: '#0369A1' }}>
                            Page {c.pageNo} of 7
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
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
              onClick={() => handleZoneSelect(chip.id)}
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
            ? `Showing ${filteredSchools.length} of ${SCHOOLS.length} verified member schools — Click any school to inspect Secretary, Invigilator & Batches`
            : 'No matching institutions'}
        </span>
        {selectedZone !== 'all' && (
          <button
            type="button"
            onClick={() => handleZoneSelect('all')}
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
            Show All 90 Schools &times;
          </button>
        )}
      </div>

      {/* MOBILE-ONLY LUXURY INSTITUTION CARDS */}
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
                    onClick={() => handleZoneSelect(s.zone)}
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
                    lineHeight: 1.5,
                  }}
                >
                  <div>
                    📍 <strong>AT:</strong> {full.address.at} | <strong>PO:</strong> {full.address.po} |{' '}
                    <strong>Dist:</strong> {full.address.dist} &ndash; <strong>{full.address.pin}</strong>
                  </div>
                  <div>
                    🎓 <strong>Batches:</strong> 1989–90, 1990–91, 1991–92, 1992–93
                  </div>
                </div>

                <div className="school-card-mobile__meta">
                  <button
                    type="button"
                    onClick={() => handleSchoolClick(s, idx, true)}
                    className={`school-click-here-btn ${isSelected ? 'is-selected' : ''}`}
                  >
                    ( Click ) &mdash; See Batch, Secretary &amp; Invigilator
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
                handleZoneSelect('all');
              }}
            >
              Reset Search &amp; Zone
            </button>
          </div>
        )}
      </div>

      {/* DESKTOP/TABLET TABLE VIEW */}
      <div className="schools-desktop-table-wrap">
        <table className="school-table">
          <thead>
            <tr>
              <th style={{ width: '64px', textAlign: 'center' }}>#</th>
              <th>School Name</th>
              <th>Zone</th>
              <th>AT / PO / Dist / Pin</th>
              <th>See the Batch</th>
              <th style={{ textAlign: 'center' }}>Action</th>
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
                    onClick={() => handleSchoolClick(s, idx, true)}
                  >
                    <td style={{ textAlign: 'center', color: '#64748B', fontWeight: 700 }}>
                      {String(s.slNo || idx + 1).padStart(2, '0')}
                    </td>
                    <td>
                      <div style={{ fontWeight: 800, color: '#0B2545', fontSize: '0.98rem', display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                        <span>{s.name}</span>
                        {full.candidates && full.candidates.length > 0 && (
                          <span
                            style={{
                              background: '#DCFCE7',
                              color: '#14532D',
                              border: '1px solid #16A34A',
                              borderRadius: '999px',
                              padding: '0.1rem 0.55rem',
                              fontSize: '0.7rem',
                              fontWeight: 900,
                            }}
                          >
                            📄 {full.candidates.length} Candidates + BSE Form 29 PDF
                          </span>
                        )}
                      </div>
                      <small style={{ color: '#64748B', fontWeight: 600 }}>
                        Code: {full.schoolCode} &middot; Secretary: {full.secretary.name}
                      </small>
                    </td>
                    <td>
                      <Link
                        href={`/schools?zone=${s.zone}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          handleZoneSelect(s.zone);
                        }}
                        className="table-zone-link"
                      >
                        {zoneName(s.zone)}
                      </Link>
                    </td>
                    <td style={{ color: '#334155', fontSize: '0.84rem' }}>
                      <div>
                        <strong>AT:</strong> {full.address.at}, <strong>PO:</strong> {full.address.po}
                      </div>
                      <div>
                        <strong>Dist:</strong> {full.address.dist} &ndash;{' '}
                        <strong>Pin:</strong> {full.address.pin}
                      </div>
                    </td>
                    <td style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0369A1' }}>
                      1989–1990 &bull; 1990–1991
                      <br />
                      1991–1992 &bull; 1992–1993
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSchoolClick(s, idx, true);
                        }}
                        className={`school-click-here-btn ${isSelected ? 'is-selected' : ''}`}
                      >
                        ( Click )
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
          3. POPUP MODAL WHEN ANY SCHOOL'S "( CLICK )" IS PRESSED
         ===================================================================== */}
      {modalSchool && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${modalSchool.name} Details`}
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
              maxWidth: '940px',
              width: '100%',
              maxHeight: '92vh',
              overflowY: 'auto',
              padding: '1.5rem',
              boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
            }}
          >
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
                <h2 style={{ fontSize: 'clamp(1.2rem, 2.4vw, 1.6rem)', color: '#0B2545', margin: 0 }}>
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

            {/* See the Batch */}
            <div
              style={{
                background: '#F0F9FF',
                border: '1.5px solid #0284C7',
                borderRadius: '12px',
                padding: '0.9rem 1rem',
                marginBottom: '1.25rem',
              }}
            >
              <div style={{ fontWeight: 900, fontSize: '0.85rem', color: '#0369A1', marginBottom: '0.5rem' }}>
                🎓 See the Batch:
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
                  gap: '0.5rem',
                }}
              >
                {modalSchool.batches.map((b) => (
                  <div
                    key={b.order}
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #BAE6FD',
                      borderRadius: '8px',
                      padding: '0.5rem 0.75rem',
                      fontWeight: 800,
                      fontSize: '0.84rem',
                      color: '#0B2545',
                    }}
                  >
                    &rarr; {b.batchLabel}
                  </div>
                ))}
              </div>
            </div>

            {/* Secretary & Invigilator Side by Side */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1.15rem',
              }}
            >
              {/* Secretary */}
              <div className="czc-secretary-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div>
                    <span className="czc-role-badge">School Authority</span>
                    <h4 className="czc-officer-title">Secretary</h4>
                  </div>
                </div>
                <div
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #C084FC',
                    borderRadius: '8px',
                    padding: '0.75rem 0.9rem',
                    fontSize: '0.85rem',
                    lineHeight: 1.75,
                  }}
                >
                  <div>&ndash; <strong>Name:</strong> {modalSchool.secretary.name}</div>
                  <div>&ndash; <strong>Designation:</strong> {modalSchool.secretary.designation}</div>
                  <div>&ndash; <strong>Mobile:</strong> {modalSchool.secretary.phone}</div>
                  <div>&ndash; <strong>WP:</strong> {modalSchool.secretary.phone}</div>
                  <div>&ndash; <strong>AT:</strong> {modalSchool.address.at}</div>
                  <div>&ndash; <strong>PO:</strong> {modalSchool.address.po}</div>
                  {modalSchool.address.via && (
                    <div>&ndash; <strong>Via:</strong> {modalSchool.address.via}</div>
                  )}
                  <div>&ndash; <strong>Dist:</strong> {modalSchool.address.dist}</div>
                  {modalSchool.address.circle && (
                    <div>
                      &ndash; <strong>Circle / Block:</strong> {modalSchool.address.circle} /{' '}
                      {modalSchool.address.block || modalSchool.address.educationalDistrict}
                    </div>
                  )}
                  {modalSchool.address.telegraphOffice && (
                    <div>
                      &ndash; <strong>Telegraph Office:</strong> {modalSchool.address.telegraphOffice}
                    </div>
                  )}
                  {modalSchool.address.landline && (
                    <div>&ndash; <strong>Telephone:</strong> {modalSchool.address.landline}</div>
                  )}
                  <div>&ndash; <strong>Pin:</strong> {modalSchool.address.pin}</div>
                </div>
              </div>

              {/* Invigilator */}
              <div className="czc-invigilator-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div>
                    <span className="czc-role-badge">↑ Reports to Administrative Officer</span>
                    <h4 className="czc-officer-title">Invigilator</h4>
                  </div>
                </div>
                {modalSchool.invigilators.map((inv) => (
                  <div
                    key={inv.idCardNo}
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #F472B6',
                      borderRadius: '8px',
                      padding: '0.65rem 0.85rem',
                      fontSize: '0.84rem',
                      lineHeight: 1.65,
                    }}
                  >
                    <div>&ndash; <strong>Name:</strong> {inv.name}</div>
                    <div>&ndash; <strong>Designation:</strong> {inv.designation}</div>
                    <div>&ndash; <strong>Mobile:</strong> {inv.phone}</div>
                    <div>&ndash; <strong>Center:</strong> {inv.centreName}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* MODAL: OFFICIAL B.S.E. EXAM FORM NO. 29 CANDIDATE ROLL */}
            {modalSchool.candidates && modalSchool.candidates.length > 0 && (
              <div
                style={{
                  marginTop: '1.25rem',
                  background: '#F8FAFC',
                  border: '2px solid #0B2545',
                  borderRadius: '14px',
                  padding: '1.1rem',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                    marginBottom: '0.85rem',
                    paddingBottom: '0.75rem',
                    borderBottom: '2px solid #CBD5E1',
                  }}
                >
                  <div>
                    <span
                      style={{
                        display: 'inline-block',
                        background: '#15803D',
                        color: '#FFFFFF',
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        padding: '0.18rem 0.6rem',
                        borderRadius: '999px',
                        marginBottom: '0.25rem',
                      }}
                    >
                      ✓ VERIFIED B.S.E. EXAM FORM NO. 29 &bull; DATED {modalSchool.drFormDate || '22/06/2009'}
                    </span>
                    <h4 style={{ margin: 0, fontSize: '1.05rem', color: '#0B2545', fontWeight: 900 }}>
                      📋 Descriptive Roll (DR) of {modalSchool.candidates.length} Candidates
                    </h4>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                    <input
                      type="search"
                      placeholder="Search candidate name or roll..."
                      value={candidateQuery}
                      onChange={(e) => setCandidateQuery(e.target.value)}
                      style={{
                        padding: '0.45rem 0.75rem',
                        borderRadius: '8px',
                        border: '1.5px solid #94A3B8',
                        fontSize: '0.82rem',
                        minWidth: '220px',
                      }}
                    />
                    {modalSchool.drFormPdf && (
                      <a
                        href={modalSchool.drFormPdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          background: '#0B2545',
                          color: '#FDE68A',
                          fontWeight: 800,
                          fontSize: '0.8rem',
                          padding: '0.5rem 0.9rem',
                          borderRadius: '8px',
                          textDecoration: 'none',
                          border: '1.5px solid #D97706',
                        }}
                      >
                        📥 Open Official PDF (7 Pages)
                      </a>
                    )}
                  </div>
                </div>

                <div style={{ maxHeight: '320px', overflowY: 'auto', borderRadius: '8px', border: '1px solid #CBD5E1' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', background: '#FFFFFF' }}>
                    <thead style={{ position: 'sticky', top: 0, background: '#0B2545', color: '#FFFFFF', zIndex: 1 }}>
                      <tr>
                        <th style={{ padding: '0.55rem 0.7rem', textAlign: 'left' }}>Sl. No.</th>
                        <th style={{ padding: '0.55rem 0.7rem', textAlign: 'left' }}>DR Roll No.</th>
                        <th style={{ padding: '0.55rem 0.7rem', textAlign: 'left' }}>Candidate Name</th>
                        <th style={{ padding: '0.55rem 0.7rem', textAlign: 'left' }}>DR List Type</th>
                        <th style={{ padding: '0.55rem 0.7rem', textAlign: 'left' }}>PDF Page</th>
                      </tr>
                    </thead>
                    <tbody>
                      {modalSchool.candidates
                        .filter((c) => {
                          const q = candidateQuery.trim().toLowerCase();
                          if (!q) return true;
                          return (
                            c.name.toLowerCase().includes(q) ||
                            c.rollLabel.toLowerCase().includes(q) ||
                            c.listType.toLowerCase().includes(q) ||
                            String(c.slNo).includes(q)
                          );
                        })
                        .map((c, idx) => (
                          <tr
                            key={`modal-${c.slNo}-${idx}`}
                            style={{
                              borderBottom: '1px solid #E2E8F0',
                              background: idx % 2 === 0 ? '#FFFFFF' : '#F8FAFC',
                            }}
                          >
                            <td style={{ padding: '0.45rem 0.7rem', fontWeight: 800, color: '#64748B' }}>
                              #{String(c.slNo).padStart(3, '0')}
                            </td>
                            <td style={{ padding: '0.45rem 0.7rem', fontWeight: 800, color: '#1E40AF' }}>
                              {c.rollLabel}
                            </td>
                            <td style={{ padding: '0.45rem 0.7rem', fontWeight: 800, color: '#0B2545' }}>
                              {c.name}
                            </td>
                            <td style={{ padding: '0.45rem 0.7rem', color: '#334155' }}>{c.listType}</td>
                            <td style={{ padding: '0.45rem 0.7rem', fontWeight: 700, color: '#0369A1' }}>
                              Page {c.pageNo} of 7
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
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
