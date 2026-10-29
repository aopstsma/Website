'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ZONES, SCHOOLS, getSchoolFullDetails, DOCUMENTS } from '@/lib/data/schools';
import { INITIAL_STUDENTS, StudentRecord } from '@/lib/data/students';
import { INITIAL_VIDEOS, VideoClip, VideoAccessLevel } from '@/lib/data/videos';

type AdminTab =
  | 'overview'
  | 'zones_leadership'
  | 'schools_officials'
  | 'batches'
  | 'students_payments'
  | 'videos'
  | 'announcements'
  | 'roles_audit';

export type AdminRole =
  | 'Super Administrator'
  | 'Association Administrator'
  | 'Zone Administrator'
  | 'School Administrator';

interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: AdminRole;
  action: string;
  details: string;
}

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [adminRole, setAdminRole] = useState<AdminRole>('Super Administrator');
  const [assignedZone, setAssignedZone] = useState<string>('all');

  // Configurable Registration Fee
  const [registrationFee, setRegistrationFee] = useState<number>(2500);
  const [feeSavedMsg, setFeeSavedMsg] = useState<string | null>(null);

  // Students & Payments State
  const [students, setStudents] = useState<StudentRecord[]>(INITIAL_STUDENTS);
  const [studentQuery, setStudentQuery] = useState<string>('');
  const [studentZoneFilter, setStudentZoneFilter] = useState<string>('all');
  const [studentStatusFilter, setStudentStatusFilter] = useState<string>('all');

  // Schools Management State
  const [customSchools, setCustomSchools] = useState<
    {
      name: string;
      zone: string;
      district: string;
      category: 'Secondary School' | 'Training School';
      secretaryName: string;
      secretaryPhone: string;
      invigilatorName: string;
      active: boolean;
    }[]
  >(() =>
    SCHOOLS.map((s, idx) => {
      const full = getSchoolFullDetails(s, s.slNo || idx + 1);
      return {
        name: s.name,
        zone: s.zone,
        district: s.district,
        category: s.name.toLowerCase().includes('training')
          ? 'Training School'
          : 'Secondary School',
        secretaryName: full.secretary.name,
        secretaryPhone: full.secretary.phone,
        invigilatorName: full.invigilators[0]?.name || 'Zonal Invigilator',
        active: true,
      };
    })
  );
  const [schoolSearch, setSchoolSearch] = useState<string>('');
  const [newSchoolName, setNewSchoolName] = useState<string>('');
  const [newSchoolZone, setNewSchoolZone] = useState<string>('balasore');
  const [newSchoolDist, setNewSchoolDist] = useState<string>('');
  const [newSchoolCategory, setNewSchoolCategory] = useState<'Secondary School' | 'Training School'>('Training School');
  const [newSchoolSecy, setNewSchoolSecy] = useState<string>('');
  const [newSchoolPhone, setNewSchoolPhone] = useState<string>('');

  // Zone Leadership State
  const [zoneLeaders, setZoneLeaders] = useState(() =>
    ZONES.map((z) => ({
      id: z.id,
      name: z.name,
      schoolCount: z.schoolCount,
      presidentName: z.president?.name || `President (${z.name})`,
      presidentDesignation: z.president?.designation || `President (${z.name})`,
      presidentPhone: z.president?.phone || '+91 63709 87576',
      adminName: z.adminOfficer?.name || `Administrative Officer (${z.name})`,
      adminDesignation: z.adminOfficer?.designation || 'Administrative Officer',
      adminPhone: z.adminOfficer?.phone || '+91 63709 87576',
    }))
  );

  // Batch Directory State
  const [batches, setBatches] = useState([
    {
      id: 'BAT-1989',
      batchName: '1989–1990 Batch (1st Batch)',
      category: '1989–1990',
      schoolsCovered: 'All 90 Affiliated Member Schools',
      recordsStatus: 'Verified Descriptive Rolls (DR) & Marksheets Archived',
      authorizedContact: 'Central Secretariat & Zonal Administrative Officers',
      announcement: 'Certified verification copies available for High Court W.P.(C) 5640/2009 compliance.',
    },
    {
      id: 'BAT-1990',
      batchName: '1990–1991 Batch (2nd Batch)',
      category: '1990–1991',
      schoolsCovered: 'All 90 Affiliated Member Schools',
      recordsStatus: 'Verified Descriptive Rolls (DR) & Marksheets Archived',
      authorizedContact: 'Central Secretariat & Zonal Administrative Officers',
      announcement: 'Batch enrollment records authenticated under BSE Odisha communicated orders.',
    },
    {
      id: 'BAT-1991',
      batchName: '1991–1992 Batch (3rd Batch)',
      category: '1991–1992',
      schoolsCovered: 'All 90 Affiliated Member Schools',
      recordsStatus: 'Verified Descriptive Rolls (DR) & Marksheets Archived',
      authorizedContact: 'Central Secretariat & Zonal Administrative Officers',
      announcement: 'Eligible for online student portal registration and digital admit card issuance.',
    },
    {
      id: 'BAT-1992',
      batchName: '1992–1993 & Other Batches',
      category: '1992–1993 / Other',
      schoolsCovered: 'All 90 Affiliated Member Schools',
      recordsStatus: 'Supplementary & Subsequent Batch Registry Active',
      authorizedContact: 'Central Secretariat & Zonal Administrative Officers',
      announcement: 'Additional batch submissions open through authorized School Secretaries.',
    },
  ]);
  const [newBatchTitle, setNewBatchTitle] = useState('');
  const [newBatchSchool, setNewBatchSchool] = useState('All Member Schools');
  const [newBatchNote, setNewBatchNote] = useState('');

  // Video Library State
  const [videos, setVideos] = useState<VideoClip[]>(INITIAL_VIDEOS);
  const [newVidTitle, setNewVidTitle] = useState('');
  const [newVidZone, setNewVidZone] = useState<'all' | 'balasore' | 'central' | 'bhubaneswar' | 'sambalpur' | 'ganjam'>('all');
  const [newVidAccess, setNewVidAccess] = useState<VideoAccessLevel>('student');
  const [newVidDuration, setNewVidDuration] = useState('30:00');
  const [newVidLocation, setNewVidLocation] = useState('Bhubaneswar');

  // Announcements State
  const [notices, setNotices] = useState(() =>
    DOCUMENTS.filter((d) => d.category === 'notice' || d.category === 'bse_order').map((d) => ({
      ref: d.ref,
      date: d.date || d.year,
      title: d.title,
      note: d.note,
    }))
  );
  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticeBody, setNewNoticeBody] = useState('');

  // Audit Log State
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([
    {
      id: 'AUD-1001',
      timestamp: '2026-10-29 10:15 AM',
      actor: 'AOPSTSMA Central Admin',
      role: 'Super Administrator',
      action: 'SYSTEM_INIT',
      details: 'Initialized 5 Zones, 90 Member Schools, 50 Video Clips & Student Payment Registry.',
    },
  ]);

  const addAuditLog = (action: string, details: string) => {
    const entry: AuditEntry = {
      id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        dateStyle: 'short',
        timeStyle: 'short',
      }),
      actor: 'Authorized Admin',
      role: adminRole,
      action,
      details,
    };
    setAuditLogs((prev) => [entry, ...prev]);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedFee = localStorage.getItem('aopstsma_reg_fee');
      if (savedFee && !Number.isNaN(Number(savedFee))) {
        setRegistrationFee(Number(savedFee));
      }
      const savedRole = sessionStorage.getItem('admin_role') as AdminRole | null;
      if (savedRole) {
        setAdminRole(savedRole);
      }
    }
  }, []);

  // Filtered Students
  const filteredStudents = useMemo(() => {
    const q = studentQuery.trim().toLowerCase();
    return students.filter((s) => {
      const zoneOk =
        (assignedZone === 'all' || s.zoneId === assignedZone) &&
        (studentZoneFilter === 'all' || s.zoneId === studentZoneFilter);
      const statusOk = studentStatusFilter === 'all' || s.paymentStatus === studentStatusFilter;
      const textOk =
        !q ||
        s.studentName.toLowerCase().includes(q) ||
        s.studentId.toLowerCase().includes(q) ||
        s.schoolName.toLowerCase().includes(q) ||
        s.mobileNumber.includes(q);
      return zoneOk && statusOk && textOk;
    });
  }, [students, studentQuery, studentZoneFilter, studentStatusFilter, assignedZone]);

  // Filtered Schools
  const filteredSchools = useMemo(() => {
    const q = schoolSearch.trim().toLowerCase();
    return customSchools.filter((s) => {
      const zoneOk = assignedZone === 'all' || s.zone === assignedZone;
      const textOk =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.district.toLowerCase().includes(q) ||
        s.zone.toLowerCase().includes(q);
      return zoneOk && textOk;
    });
  }, [customSchools, schoolSearch, assignedZone]);

  // Analytics Totals
  const paidStudentsCount = students.filter((s) => s.paymentStatus === 'Paid').length;
  const pendingStudentsCount = students.filter((s) => s.paymentStatus === 'Pending').length;
  const totalRevenue = students
    .filter((s) => s.paymentStatus === 'Paid')
    .reduce((acc, s) => acc + s.feeAmount, 0);

  // Export CSV Handler
  const handleExportStudentsCSV = () => {
    const headers = [
      'Registration_No',
      'Student_Name',
      'Mobile',
      'Zone',
      'School_Name',
      'District',
      'Fee_Amount',
      'Payment_Status',
      'Transaction_ID',
    ];
    const rows = filteredStudents.map((s) => [
      s.studentId,
      `"${s.studentName}"`,
      s.mobileNumber,
      s.zoneName,
      `"${s.schoolName}"`,
      s.district,
      s.feeAmount,
      s.paymentStatus,
      s.transactionId || 'PENDING',
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `aopstsma-students-report-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addAuditLog('EXPORT_CSV', `Exported ${filteredStudents.length} student records to CSV.`);
  };

  // Toggle Payment Verification & Issue Registration Number
  const handleVerifyStudentPayment = (studentId: string) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.studentId !== studentId) return s;
        const newStatus = s.paymentStatus === 'Paid' ? 'Pending' : 'Paid';
        return {
          ...s,
          paymentStatus: newStatus,
          transactionId:
            newStatus === 'Paid'
              ? `TXN-VERIFIED-${Math.floor(100000 + Math.random() * 900000)}`
              : undefined,
          paidAt: newStatus === 'Paid' ? new Date().toLocaleDateString('en-IN') : undefined,
        };
      })
    );
    addAuditLog(
      'PAYMENT_STATUS_UPDATE',
      `Updated payment verification status for Student ID ${studentId}.`
    );
  };

  // Add School Handler
  const handleAddSchool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSchoolName.trim()) return;
    setCustomSchools((prev) => [
      {
        name: newSchoolName.trim(),
        zone: newSchoolZone,
        district: newSchoolDist.trim() || 'Odisha',
        category: newSchoolCategory,
        secretaryName: newSchoolSecy.trim() || `Secretary (${newSchoolName.trim()})`,
        secretaryPhone: newSchoolPhone.trim() || '+91 63709 87576',
        invigilatorName: 'Zonal Centre Invigilator',
        active: true,
      },
      ...prev,
    ]);
    addAuditLog('ADD_SCHOOL', `Added ${newSchoolCategory}: ${newSchoolName.trim()} (${newSchoolZone}).`);
    setNewSchoolName('');
    setNewSchoolDist('');
    setNewSchoolSecy('');
    setNewSchoolPhone('');
  };

  // Add Batch Handler
  const handleAddBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBatchTitle.trim()) return;
    setBatches((prev) => [
      ...prev,
      {
        id: `BAT-${Date.now().toString().slice(-4)}`,
        batchName: newBatchTitle.trim(),
        category: newBatchTitle.trim(),
        schoolsCovered: newBatchSchool.trim(),
        recordsStatus: 'Active Batch Registry',
        authorizedContact: 'Central Secretariat & Zonal Officers',
        announcement: newBatchNote.trim() || 'Batch directory record published by administrator.',
      },
    ]);
    addAuditLog('ADD_BATCH', `Added batch record: ${newBatchTitle.trim()}.`);
    setNewBatchTitle('');
    setNewBatchNote('');
  };

  // Add Video Handler
  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVidTitle.trim()) return;
    const nextNum = videos.length + 1;
    const newClip: VideoClip = {
      id: `VID-AOP-${String(nextNum).padStart(3, '0')}`,
      clipNumber: nextNum,
      title: newVidTitle.trim(),
      description: 'Official educational clip published via AOPSTSMA Administration Panel.',
      duration: newVidDuration || '30:00',
      category: 'Pedagogy & C.T. Curriculum',
      topic: 'Association Curriculum Session',
      zoneId: newVidZone,
      zoneName: ZONES.find((z) => z.id === newVidZone)?.name || 'All Odisha (State HQ)',
      location: newVidLocation || 'Bhubaneswar',
      shootDay: 13,
      accessLevel: newVidAccess,
      status: 'published',
      thumbnail: '/assets/img/aopstsma-seal.jpg',
    };
    const updated = [newClip, ...videos];
    setVideos(updated);
    addAuditLog('PUBLISH_VIDEO', `Published video clip #${nextNum}: ${newClip.title} (${newVidAccess}).`);
    setNewVidTitle('');
  };

  // Add Notice Handler
  const handleAddNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoticeTitle.trim()) return;
    const refCode = `AN/${new Date().getFullYear()}-${notices.length + 1}`;
    setNotices((prev) => [
      {
        ref: refCode,
        date: new Date().toLocaleDateString('en-IN'),
        title: newNoticeTitle.trim(),
        note: newNoticeBody.trim() || 'Official association notice.',
      },
      ...prev,
    ]);
    addAuditLog('PUBLISH_NOTICE', `Published announcement ${refCode}: ${newNoticeTitle.trim()}.`);
    setNewNoticeTitle('');
    setNewNoticeBody('');
  };

  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span
                className="pay-badge"
                style={{ color: '#FDE68A', borderColor: 'rgba(253, 230, 138, 0.4)' }}
              >
                AOPSTSMA CENTRAL ADMINISTRATION PANEL
              </span>
              <h1>Administration &amp; Governance Portal</h1>
              <p className="lede">
                Manage 5 Zones, Member Schools, Leadership Directory, Batches, Student Registrations, Payments, Video Library &amp; Audit Logs.
              </p>
            </div>

            {/* Active Role Switcher (Demonstrating Role-Based Access Control) */}
            <div
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(253,230,138,0.4)',
                borderRadius: '12px',
                padding: '0.75rem 1rem',
                color: '#FFFFFF',
              }}
            >
              <label
                htmlFor="roleSwitcher"
                style={{ display: 'block', fontSize: '0.7rem', color: '#FDE68A', fontWeight: 800, textTransform: 'uppercase' }}
              >
                🛡️ Active Role &amp; Jurisdiction
              </label>
              <div style={{ display: 'flex', gap: '0.45rem', marginTop: '0.35rem', flexWrap: 'wrap' }}>
                <select
                  id="roleSwitcher"
                  value={adminRole}
                  onChange={(e) => {
                    const r = e.target.value as AdminRole;
                    setAdminRole(r);
                    if (r === 'Zone Administrator' && assignedZone === 'all') {
                      setAssignedZone('balasore');
                    } else if (r === 'Super Administrator' || r === 'Association Administrator') {
                      setAssignedZone('all');
                    }
                  }}
                  style={{
                    padding: '0.35rem 0.6rem',
                    borderRadius: '6px',
                    border: 'none',
                    fontWeight: 800,
                    fontSize: '0.78rem',
                    color: '#0B2545',
                  }}
                >
                  <option value="Super Administrator">Super Administrator (Full Control)</option>
                  <option value="Association Administrator">Association Administrator</option>
                  <option value="Zone Administrator">Zone Administrator</option>
                  <option value="School Administrator">School Administrator</option>
                </select>

                {adminRole === 'Zone Administrator' && (
                  <select
                    aria-label="Assigned Zone"
                    value={assignedZone}
                    onChange={(e) => setAssignedZone(e.target.value)}
                    style={{
                      padding: '0.35rem 0.6rem',
                      borderRadius: '6px',
                      border: 'none',
                      fontWeight: 800,
                      fontSize: '0.78rem',
                      color: '#0B2545',
                    }}
                  >
                    {ZONES.map((z) => (
                      <option key={z.id} value={z.id}>
                        {z.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ backgroundColor: '#F8FAFC', minHeight: '80vh' }}>
        <div className="wrap">
          {/* =================================================================
              ADMIN NAVIGATION TABS (ALL 8 MODULES FROM SECTION 9)
             ================================================================= */}
          <div
            style={{
              display: 'flex',
              gap: '0.4rem',
              flexWrap: 'wrap',
              background: '#E2E8F0',
              padding: '0.45rem',
              borderRadius: '10px',
              marginBottom: '1.75rem',
            }}
          >
            {[
              { id: 'overview', label: '📊 Overview & Reports' },
              { id: 'zones_leadership', label: '🏛️ Zones & Leadership' },
              { id: 'schools_officials', label: '🏫 Schools & Officials' },
              { id: 'batches', label: '🎓 Batch Directory' },
              { id: 'students_payments', label: '💳 Students & Payments' },
              { id: 'videos', label: '🎬 Video Library' },
              { id: 'announcements', label: '📢 Notices & Content' },
              { id: 'roles_audit', label: '🔐 Roles & Audit Log' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id as AdminTab)}
                style={{
                  flex: '1 1 auto',
                  padding: '0.6rem 0.85rem',
                  borderRadius: '7px',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  background: activeTab === t.id ? '#0B2545' : 'transparent',
                  color: activeTab === t.id ? '#FDE68A' : '#334155',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* =================================================================
              MODULE 1: WEBSITE OVERVIEW & ANALYTICS (SECTION 9 & 14)
             ================================================================= */}
          {activeTab === 'overview' && (
            <div>
              {/* KPI Cards */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1rem',
                  marginBottom: '1.75rem',
                }}
              >
                {[
                  { label: 'Total Regional Zones', value: '5 Zones', sub: '30 Districts of Odisha', color: '#1E40AF' },
                  {
                    label: 'Registered Member Schools',
                    value: `${customSchools.filter((s) => s.active).length} Active`,
                    sub: '87 Provisional / 90 Directory',
                    color: '#0B2545',
                  },
                  {
                    label: 'Registered Students',
                    value: `${students.length}`,
                    sub: `${paidStudentsCount} Paid • ${pendingStudentsCount} Pending`,
                    color: '#059669',
                  },
                  {
                    label: 'Verified Fee Collection',
                    value: `₹${totalRevenue.toLocaleString('en-IN')}`,
                    sub: `Configurable Fee: ₹${registrationFee}`,
                    color: '#D97706',
                  },
                  {
                    label: 'Educational Video Library',
                    value: `${videos.length} Clips`,
                    sub: 'Student Portal Video Library',
                    color: '#7E22CE',
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderTop: `4px solid ${stat.color}`,
                      borderRadius: '12px',
                      padding: '1.15rem',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                    }}
                  >
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>
                      {stat.label}
                    </div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 900, color: stat.color, margin: '0.25rem 0' }}>
                      {stat.value}
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#475569', fontWeight: 600 }}>{stat.sub}</div>
                  </div>
                ))}
              </div>

              {/* Zone-wise School & Student Breakdown Table */}
              <div
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '14px',
                  padding: '1.35rem',
                  marginBottom: '1.5rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', color: '#0B2545', margin: 0 }}>
                      Zone-Wise Schools &amp; Student Registrations Breakdown
                    </h3>
                    <small style={{ color: '#64748B' }}>
                      Includes provisional planning figures (87 total) &amp; verified directory registry (90 total).
                    </small>
                  </div>
                  <button type="button" onClick={handleExportStudentsCSV} className="school-click-here-btn">
                    📥 Export Authorized CSV Report
                  </button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table className="school-table">
                    <thead>
                      <tr>
                        <th>Zone Name</th>
                        <th>Planning Note Schools (87)</th>
                        <th>Active Directory Schools</th>
                        <th>Registered Students</th>
                        <th>Zone President</th>
                        <th>Administrative Officer</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { id: 'balasore', name: '1. Baleswar Zone', plan: 40 },
                        { id: 'central', name: '2. Central Zone (Cuttack)', plan: 21 },
                        { id: 'bhubaneswar', name: '3. Bhubaneswar Zone', plan: 15 },
                        { id: 'sambalpur', name: '4. Sambalpur Zone', plan: 9 },
                        { id: 'ganjam', name: '5. Berhampur Zone', plan: 2 },
                      ].map((row) => {
                        const dirCount = customSchools.filter((s) => s.zone === row.id && s.active).length;
                        const stuCount = students.filter((s) => s.zoneId === row.id).length;
                        const leader = zoneLeaders.find((z) => z.id === row.id);
                        return (
                          <tr key={row.id}>
                            <td style={{ fontWeight: 800, color: '#0B2545' }}>{row.name}</td>
                            <td style={{ fontWeight: 700 }}>{row.plan} Schools</td>
                            <td style={{ fontWeight: 800, color: '#0369A1' }}>{dirCount} Schools</td>
                            <td style={{ fontWeight: 800, color: '#059669' }}>{stuCount} Students</td>
                            <td>{leader?.presidentName}</td>
                            <td>{leader?.adminName}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              MODULE 2: ZONES & ASSOCIATION LEADERSHIP MANAGEMENT
             ================================================================= */}
          {activeTab === 'zones_leadership' && (
            <div
              style={{
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '14px',
                padding: '1.5rem',
              }}
            >
              <h3 style={{ fontSize: '1.25rem', color: '#0B2545', marginBottom: '0.35rem' }}>
                Association &amp; Zonal Leadership Management
              </h3>
              <p style={{ fontSize: '0.86rem', color: '#64748B', marginBottom: '1.25rem' }}>
                Hierarchy: <strong>AOPSTSMA Main Association &darr; Zone &darr; Zone President &amp; Administrative Officer &darr; Schools &darr; School Officials</strong>
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {zoneLeaders.map((zl, idx) => (
                  <div
                    key={zl.id}
                    style={{
                      background: '#F8FAFC',
                      border: '1.5px solid #CBD5E1',
                      borderRadius: '12px',
                      padding: '1.15rem',
                    }}
                  >
                    <div style={{ fontWeight: 900, color: '#0B2545', fontSize: '1.05rem', marginBottom: '0.75rem' }}>
                      🏛️ {zl.name}
                    </div>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                        gap: '0.85rem',
                      }}
                    >
                      <div>
                        <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#166534' }}>
                          Zone President Name
                        </label>
                        <input
                          type="text"
                          value={zl.presidentName}
                          onChange={(e) => {
                            const val = e.target.value;
                            setZoneLeaders((prev) =>
                              prev.map((item, i) => (i === idx ? { ...item, presidentName: val } : item))
                            );
                          }}
                          style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#166534' }}>
                          President Mobile / WhatsApp
                        </label>
                        <input
                          type="text"
                          value={zl.presidentPhone}
                          onChange={(e) => {
                            const val = e.target.value;
                            setZoneLeaders((prev) =>
                              prev.map((item, i) => (i === idx ? { ...item, presidentPhone: val } : item))
                            );
                          }}
                          style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#9A3412' }}>
                          Administrative Officer Name
                        </label>
                        <input
                          type="text"
                          value={zl.adminName}
                          onChange={(e) => {
                            const val = e.target.value;
                            setZoneLeaders((prev) =>
                              prev.map((item, i) => (i === idx ? { ...item, adminName: val } : item))
                            );
                          }}
                          style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#9A3412' }}>
                          Admin Officer Mobile / WhatsApp
                        </label>
                        <input
                          type="text"
                          value={zl.adminPhone}
                          onChange={(e) => {
                            const val = e.target.value;
                            setZoneLeaders((prev) =>
                              prev.map((item, i) => (i === idx ? { ...item, adminPhone: val } : item))
                            );
                          }}
                          style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() =>
                  addAuditLog('UPDATE_LEADERSHIP', 'Updated Zonal President & Administrative Officer records.')
                }
                className="btn btn--primary"
                style={{ marginTop: '1.25rem' }}
              >
                💾 Save Leadership Directory Changes
              </button>
            </div>
          )}

          {/* =================================================================
              MODULE 3: SCHOOLS & OFFICIALS MANAGEMENT
             ================================================================= */}
          {activeTab === 'schools_officials' && (
            <div>
              {/* Add New School Form */}
              <div
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '14px',
                  padding: '1.35rem',
                  marginBottom: '1.5rem',
                }}
              >
                <h3 style={{ fontSize: '1.15rem', color: '#0B2545', marginBottom: '0.85rem' }}>
                  ➕ Add New Member School &amp; Officials
                </h3>
                <form
                  onSubmit={handleAddSchool}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(185px, 1fr))',
                    gap: '0.75rem',
                    alignItems: 'end',
                  }}
                >
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>School Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Utkal Training School"
                      value={newSchoolName}
                      onChange={(e) => setNewSchoolName(e.target.value)}
                      required
                      style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>Category *</label>
                    <select
                      value={newSchoolCategory}
                      onChange={(e) =>
                        setNewSchoolCategory(e.target.value as 'Secondary School' | 'Training School')
                      }
                      style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}
                    >
                      <option value="Training School">Training School</option>
                      <option value="Secondary School">Secondary School</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>Zone *</label>
                    <select
                      value={newSchoolZone}
                      onChange={(e) => setNewSchoolZone(e.target.value)}
                      style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}
                    >
                      {ZONES.map((z) => (
                        <option key={z.id} value={z.id}>
                          {z.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>District *</label>
                    <input
                      type="text"
                      placeholder="e.g. Cuttack"
                      value={newSchoolDist}
                      onChange={(e) => setNewSchoolDist(e.target.value)}
                      style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>Secretary Name</label>
                    <input
                      type="text"
                      placeholder="Secretary Full Name"
                      value={newSchoolSecy}
                      onChange={(e) => setNewSchoolSecy(e.target.value)}
                      style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}
                    />
                  </div>
                  <button type="submit" className="school-click-here-btn" style={{ padding: '0.6rem 1rem' }}>
                    ➕ Add School Record
                  </button>
                </form>
              </div>

              {/* Search & Manage Schools Table */}
              <div
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '14px',
                  padding: '1.35rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.15rem', color: '#0B2545', margin: 0 }}>
                    School &amp; Officials Registry ({filteredSchools.length} Institutions)
                  </h3>
                  <input
                    type="search"
                    placeholder="Filter schools by name, district or zone..."
                    value={schoolSearch}
                    onChange={(e) => setSchoolSearch(e.target.value)}
                    style={{
                      padding: '0.55rem 0.9rem',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      minWidth: '260px',
                    }}
                  />
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table className="school-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>School Name &amp; Category</th>
                        <th>Zone &amp; District</th>
                        <th>School Secretary</th>
                        <th>Invigilator / Representative</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSchools.map((s, idx) => (
                        <tr key={`${s.name}-${idx}`} style={{ opacity: s.active ? 1 : 0.55 }}>
                          <td>{idx + 1}</td>
                          <td>
                            <div style={{ fontWeight: 800, color: '#0B2545' }}>{s.name}</div>
                            <span
                              style={{
                                display: 'inline-block',
                                fontSize: '0.68rem',
                                fontWeight: 800,
                                background: '#EFF6FF',
                                color: '#1E40AF',
                                padding: '0.1rem 0.45rem',
                                borderRadius: '4px',
                              }}
                            >
                              {s.category}
                            </span>
                          </td>
                          <td>
                            <strong>{s.zone.toUpperCase()}</strong> &middot; {s.district}
                          </td>
                          <td>
                            <div>{s.secretaryName}</div>
                            <small style={{ color: '#64748B' }}>{s.secretaryPhone}</small>
                          </td>
                          <td>{s.invigilatorName}</td>
                          <td>
                            <span
                              style={{
                                background: s.active ? '#D1FAE5' : '#FEE2E2',
                                color: s.active ? '#065F46' : '#991B1B',
                                padding: '0.2rem 0.55rem',
                                borderRadius: '999px',
                                fontSize: '0.72rem',
                                fontWeight: 800,
                              }}
                            >
                              {s.active ? 'Active' : 'Deactivated'}
                            </span>
                          </td>
                          <td>
                            <button
                              type="button"
                              onClick={() => {
                                setCustomSchools((prev) =>
                                  prev.map((item) =>
                                    item.name === s.name ? { ...item, active: !item.active } : item
                                  )
                                );
                                addAuditLog(
                                  s.active ? 'DEACTIVATE_SCHOOL' : 'ACTIVATE_SCHOOL',
                                  `${s.active ? 'Deactivated' : 'Activated'} school: ${s.name}`
                                );
                              }}
                              style={{
                                background: s.active ? '#FEE2E2' : '#D1FAE5',
                                color: s.active ? '#991B1B' : '#065F46',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '0.35rem 0.65rem',
                                fontSize: '0.74rem',
                                fontWeight: 800,
                                cursor: 'pointer',
                              }}
                            >
                              {s.active ? 'Deactivate' : 'Activate'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              MODULE 4: BATCH DIRECTORY MANAGEMENT (SECTION 5)
             ================================================================= */}
          {activeTab === 'batches' && (
            <div
              style={{
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '14px',
                padding: '1.5rem',
              }}
            >
              <h3 style={{ fontSize: '1.2rem', color: '#0B2545', marginBottom: '0.35rem' }}>
                Academic Batch Directory Management (1989–1990 to 1992–1993 &amp; Other Batches)
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '1.25rem' }}>
                Add additional batches and update available records, authorized contacts, and batch announcements.
              </p>

              <form
                onSubmit={handleAddBatch}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '0.75rem',
                  alignItems: 'end',
                  background: '#F8FAFC',
                  padding: '1rem',
                  borderRadius: '10px',
                  marginBottom: '1.25rem',
                }}
              >
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>Batch Name / Academic Year *</label>
                  <input
                    type="text"
                    placeholder="e.g. 1993–1994 Special Batch"
                    value={newBatchTitle}
                    onChange={(e) => setNewBatchTitle(e.target.value)}
                    required
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>Related School / Scope</label>
                  <input
                    type="text"
                    value={newBatchSchool}
                    onChange={(e) => setNewBatchSchool(e.target.value)}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>Batch Announcement</label>
                  <input
                    type="text"
                    placeholder="Verification status or notice"
                    value={newBatchNote}
                    onChange={(e) => setNewBatchNote(e.target.value)}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}
                  />
                </div>
                <button type="submit" className="school-click-here-btn" style={{ padding: '0.6rem 1rem' }}>
                  ➕ Add Batch Record
                </button>
              </form>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                {batches.map((b) => (
                  <div
                    key={b.id}
                    style={{
                      background: '#F0F9FF',
                      border: '1.5px solid #0284C7',
                      borderRadius: '12px',
                      padding: '1.1rem',
                    }}
                  >
                    <span className="pay-badge">{b.category}</span>
                    <h4 style={{ fontSize: '1.05rem', color: '#0B2545', margin: '0.35rem 0' }}>{b.batchName}</h4>
                    <div style={{ fontSize: '0.82rem', color: '#334155', lineHeight: 1.6 }}>
                      <div>🏫 <strong>Schools:</strong> {b.schoolsCovered}</div>
                      <div>📂 <strong>Records:</strong> {b.recordsStatus}</div>
                      <div>👤 <strong>Contact:</strong> {b.authorizedContact}</div>
                      <div>📢 <strong>Notice:</strong> {b.announcement}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =================================================================
              MODULE 5: STUDENT REGISTRATION & PAYMENT MANAGEMENT (SECTION 6 & 9)
             ================================================================= */}
          {activeTab === 'students_payments' && (
            <div>
              {/* Configurable Registration Fee Control */}
              <div
                style={{
                  background: '#FFFFFF',
                  border: '2px solid #D97706',
                  borderRadius: '14px',
                  padding: '1.25rem',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem',
                }}
              >
                <div>
                  <span className="pay-badge">CONFIGURABLE STUDENT REGISTRATION FEE</span>
                  <h3 style={{ fontSize: '1.15rem', color: '#0B2545', margin: '0.25rem 0 0' }}>
                    Student Portal Registration &amp; Examination Fee Configuration
                  </h3>
                  <small style={{ color: '#64748B' }}>
                    Changes apply across the Student Registration Portal (`/students`) and Payment Gateway (`/pay`).
                  </small>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 800, color: '#0B2545' }}>Fee Amount (₹):</span>
                  <input
                    type="number"
                    min={0}
                    value={registrationFee}
                    onChange={(e) => setRegistrationFee(Number(e.target.value))}
                    style={{
                      width: '120px',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '8px',
                      border: '1.5px solid #0B2545',
                      fontWeight: 900,
                      fontSize: '1rem',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        localStorage.setItem('aopstsma_reg_fee', String(registrationFee));
                      }
                      setFeeSavedMsg(`✓ Updated to ₹${registrationFee}`);
                      addAuditLog('UPDATE_FEE', `Updated Student Registration Fee to ₹${registrationFee}.`);
                      setTimeout(() => setFeeSavedMsg(null), 3000);
                    }}
                    className="school-click-here-btn"
                  >
                    💾 Update Fee
                  </button>
                  {feeSavedMsg && (
                    <span style={{ color: '#059669', fontWeight: 800, fontSize: '0.82rem' }}>{feeSavedMsg}</span>
                  )}
                </div>
              </div>

              {/* Student Registry & Server-Verified Payment Status Table */}
              <div
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '14px',
                  padding: '1.35rem',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                    marginBottom: '1rem',
                  }}
                >
                  <h3 style={{ fontSize: '1.15rem', color: '#0B2545', margin: 0 }}>
                    Student Registrations &amp; Verified Payment Status ({filteredStudents.length})
                  </h3>

                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <input
                      type="search"
                      placeholder="Search name, Reg No, mobile..."
                      value={studentQuery}
                      onChange={(e) => setStudentQuery(e.target.value)}
                      style={{ padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}
                    />
                    <select
                      value={studentZoneFilter}
                      onChange={(e) => setStudentZoneFilter(e.target.value)}
                      style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}
                    >
                      <option value="all">All Zones</option>
                      {ZONES.map((z) => (
                        <option key={z.id} value={z.id}>
                          {z.name}
                        </option>
                      ))}
                    </select>
                    <select
                      value={studentStatusFilter}
                      onChange={(e) => setStudentStatusFilter(e.target.value)}
                      style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}
                    >
                      <option value="all">All Status</option>
                      <option value="Paid">Paid (Verified)</option>
                      <option value="Pending">Pending</option>
                    </select>
                    <button type="button" onClick={handleExportStudentsCSV} className="school-click-here-btn">
                      📥 Export CSV
                    </button>
                  </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table className="school-table">
                    <thead>
                      <tr>
                        <th>Reg. Number</th>
                        <th>Student Name &amp; Mobile</th>
                        <th>Zone &amp; School</th>
                        <th>Fee</th>
                        <th>Gateway Status</th>
                        <th>Verify / Refund Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map((stu) => (
                        <tr key={stu.studentId}>
                          <td style={{ fontFamily: 'monospace', fontWeight: 800, color: '#0B2545' }}>
                            {stu.studentId}
                          </td>
                          <td>
                            <div style={{ fontWeight: 800 }}>{stu.studentName}</div>
                            <small style={{ color: '#64748B' }}>+91 {stu.mobileNumber}</small>
                          </td>
                          <td>
                            <div>{stu.schoolName}</div>
                            <small style={{ color: '#0369A1', fontWeight: 700 }}>{stu.zoneName}</small>
                          </td>
                          <td style={{ fontWeight: 800 }}>₹{stu.feeAmount}</td>
                          <td>
                            <span
                              style={{
                                background: stu.paymentStatus === 'Paid' ? '#D1FAE5' : '#FEF3C7',
                                color: stu.paymentStatus === 'Paid' ? '#065F46' : '#92400E',
                                padding: '0.2rem 0.6rem',
                                borderRadius: '999px',
                                fontSize: '0.74rem',
                                fontWeight: 800,
                              }}
                            >
                              {stu.paymentStatus === 'Paid' ? '✓ Server Verified' : '⏳ Pending Gateway'}
                            </span>
                            {stu.transactionId && (
                              <div style={{ fontSize: '0.68rem', color: '#64748B', marginTop: '2px' }}>
                                {stu.transactionId}
                              </div>
                            )}
                          </td>
                          <td>
                            <button
                              type="button"
                              onClick={() => handleVerifyStudentPayment(stu.studentId)}
                              style={{
                                background: stu.paymentStatus === 'Paid' ? '#F1F5F9' : '#059669',
                                color: stu.paymentStatus === 'Paid' ? '#475569' : '#FFFFFF',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '0.35rem 0.7rem',
                                fontSize: '0.74rem',
                                fontWeight: 800,
                                cursor: 'pointer',
                              }}
                            >
                              {stu.paymentStatus === 'Paid' ? 'Mark Refund / Pending' : '✓ Confirm Gateway Payment'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              MODULE 6: VIDEO LIBRARY MANAGEMENT (50 CLIPS)
             ================================================================= */}
          {activeTab === 'videos' && (
            <div
              style={{
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '14px',
                padding: '1.5rem',
              }}
            >
              <h3 style={{ fontSize: '1.2rem', color: '#0B2545', marginBottom: '0.75rem' }}>
                Educational Video Library Management ({videos.length} Clips)
              </h3>

              <form
                onSubmit={handleAddVideo}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '0.75rem',
                  alignItems: 'end',
                  background: '#F8FAFC',
                  padding: '1rem',
                  borderRadius: '10px',
                  marginBottom: '1.25rem',
                }}
              >
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>Video Clip Title *</label>
                  <input
                    type="text"
                    placeholder="e.g. C.T. Pedagogy Lecture"
                    value={newVidTitle}
                    onChange={(e) => setNewVidTitle(e.target.value)}
                    required
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>Zone</label>
                  <select
                    value={newVidZone}
                    onChange={(e) =>
                      setNewVidZone(
                        e.target.value as 'all' | 'balasore' | 'central' | 'bhubaneswar' | 'sambalpur' | 'ganjam'
                      )
                    }
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}
                  >
                    <option value="all">All Odisha (State HQ)</option>
                    {ZONES.map((z) => (
                      <option key={z.id} value={z.id}>
                        {z.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>Access Permission</label>
                  <select
                    value={newVidAccess}
                    onChange={(e) => setNewVidAccess(e.target.value as VideoAccessLevel)}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}
                  >
                    <option value="public">Public Video</option>
                    <option value="student">Registered Student Only</option>
                    <option value="member">Authorized Member Only</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>Location &amp; Duration</label>
                  <input
                    type="text"
                    value={newVidLocation}
                    onChange={(e) => setNewVidLocation(e.target.value)}
                    placeholder="Location"
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}
                  />
                </div>
                <button type="submit" className="school-click-here-btn" style={{ padding: '0.6rem 1rem' }}>
                  ➕ Publish Video Clip
                </button>
              </form>

              <div style={{ overflowX: 'auto' }}>
                <table className="school-table">
                  <thead>
                    <tr>
                      <th>Clip #</th>
                      <th>Title &amp; Category</th>
                      <th>Zone / Location</th>
                      <th>Duration</th>
                      <th>Access Control</th>
                    </tr>
                  </thead>
                  <tbody>
                    {videos.slice(0, 15).map((v) => (
                      <tr key={v.id}>
                        <td style={{ fontWeight: 800 }}>#{String(v.clipNumber).padStart(2, '0')}</td>
                        <td>
                          <div style={{ fontWeight: 800, color: '#0B2545' }}>{v.title}</div>
                          <small style={{ color: '#64748B' }}>{v.category}</small>
                        </td>
                        <td>
                          {v.zoneName} &middot; {v.location}
                        </td>
                        <td>{v.duration}</td>
                        <td>
                          <span
                            style={{
                              background:
                                v.accessLevel === 'public'
                                  ? '#DBEAFE'
                                  : v.accessLevel === 'student'
                                  ? '#D1FAE5'
                                  : '#F3E8FF',
                              color:
                                v.accessLevel === 'public'
                                  ? '#1E40AF'
                                  : v.accessLevel === 'student'
                                  ? '#065F46'
                                  : '#6B21A8',
                              padding: '0.2rem 0.55rem',
                              borderRadius: '999px',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              textTransform: 'uppercase',
                            }}
                          >
                            {v.accessLevel}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ marginTop: '0.85rem', textAlign: 'right' }}>
                <Link href="/students" className="school-click-here-btn">
                  Open Student Portal Video Library &rarr;
                </Link>
              </div>
            </div>
          )}

          {/* =================================================================
              MODULE 7: ANNOUNCEMENTS & NOTICES MANAGEMENT
             ================================================================= */}
          {activeTab === 'announcements' && (
            <div
              style={{
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '14px',
                padding: '1.5rem',
              }}
            >
              <h3 style={{ fontSize: '1.2rem', color: '#0B2545', marginBottom: '0.75rem' }}>
                Publish Official Announcements &amp; Notices
              </h3>

              <form
                onSubmit={handleAddNotice}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1.5fr auto',
                  gap: '0.75rem',
                  alignItems: 'end',
                  background: '#F8FAFC',
                  padding: '1rem',
                  borderRadius: '10px',
                  marginBottom: '1.25rem',
                }}
              >
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>Announcement Title *</label>
                  <input
                    type="text"
                    placeholder="e.g. Circular: Annual DR Verification 2026"
                    value={newNoticeTitle}
                    onChange={(e) => setNewNoticeTitle(e.target.value)}
                    required
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>Details / Summary</label>
                  <input
                    type="text"
                    placeholder="Enter notice instructions for zones, schools and students"
                    value={newNoticeBody}
                    onChange={(e) => setNewNoticeBody(e.target.value)}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}
                  />
                </div>
                <button type="submit" className="school-click-here-btn" style={{ padding: '0.6rem 1rem' }}>
                  📢 Publish Notice
                </button>
              </form>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {notices.map((n) => (
                  <div
                    key={n.ref}
                    style={{
                      background: '#F8FAFC',
                      border: '1px solid #CBD5E1',
                      borderRadius: '10px',
                      padding: '0.9rem 1.1rem',
                    }}
                  >
                    <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#D97706' }}>
                      REF: {n.ref} &middot; {n.date}
                    </div>
                    <h4 style={{ fontSize: '1rem', color: '#0B2545', margin: '0.2rem 0' }}>{n.title}</h4>
                    <p style={{ fontSize: '0.84rem', color: '#475569', margin: 0 }}>{n.note}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =================================================================
              MODULE 8: USER ROLES, PERMISSIONS & AUDIT LOG (SECTION 9 & 10)
             ================================================================= */}
          {activeTab === 'roles_audit' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
              {/* 5 Role-Based Access Control Matrix */}
              <div
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '14px',
                  padding: '1.5rem',
                }}
              >
                <h3 style={{ fontSize: '1.2rem', color: '#0B2545', marginBottom: '0.75rem' }}>
                  Role-Based Access Control (RBAC) Matrix
                </h3>
                <div style={{ overflowX: 'auto' }}>
                  <table className="school-table">
                    <thead>
                      <tr>
                        <th>Role</th>
                        <th>Scope &amp; Jurisdiction</th>
                        <th>Authorized Server Permissions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ fontWeight: 800, color: '#0B2545' }}>1. Super Administrator</td>
                        <td>State-Wide (All 5 Zones)</td>
                        <td>Full control over website configuration, users, zones, schools, payments, fees &amp; content.</td>
                      </tr>
                      <tr>
                        <td style={{ fontWeight: 800, color: '#0B2545' }}>2. Association Administrator</td>
                        <td>Central Secretariat</td>
                        <td>Manage association information, leadership, school records, notices &amp; authorized reports.</td>
                      </tr>
                      <tr>
                        <td style={{ fontWeight: 800, color: '#0B2545' }}>3. Zone Administrator</td>
                        <td>Assigned Regional Zone</td>
                        <td>Manage schools, secretaries &amp; centre invigilators within their assigned zone.</td>
                      </tr>
                      <tr>
                        <td style={{ fontWeight: 800, color: '#0B2545' }}>4. School Administrator</td>
                        <td>Assigned Member School</td>
                        <td>Manage permitted school profile, upload student DR rolls &amp; view school payment status.</td>
                      </tr>
                      <tr>
                        <td style={{ fontWeight: 800, color: '#0B2545' }}>5. Registered Student</td>
                        <td>Individual Candidate Account</td>
                        <td>Manage own profile, view Registration Number, download Admit Card &amp; watch student videos.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Administrative Audit Log */}
              <div
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '14px',
                  padding: '1.5rem',
                }}
              >
                <h3 style={{ fontSize: '1.2rem', color: '#0B2545', marginBottom: '0.75rem' }}>
                  Administrative Action Audit Log ({auditLogs.length} Events)
                </h3>
                <div style={{ overflowX: 'auto' }}>
                  <table className="school-table">
                    <thead>
                      <tr>
                        <th>Audit ID</th>
                        <th>Timestamp</th>
                        <th>Role</th>
                        <th>Action Type</th>
                        <th>Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {auditLogs.map((log) => (
                        <tr key={log.id}>
                          <td style={{ fontFamily: 'monospace', fontWeight: 800 }}>{log.id}</td>
                          <td>{log.timestamp}</td>
                          <td style={{ fontWeight: 700 }}>{log.role}</td>
                          <td>
                            <span
                              style={{
                                background: '#EFF6FF',
                                color: '#1E40AF',
                                padding: '0.18rem 0.5rem',
                                borderRadius: '4px',
                                fontSize: '0.72rem',
                                fontWeight: 800,
                              }}
                            >
                              {log.action}
                            </span>
                          </td>
                          <td>{log.details}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

