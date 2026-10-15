'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { INITIAL_STUDENTS, StudentRecord } from '@/lib/data/students';

export default function SchoolDashboardPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<string | null>(null);
  const [schoolInfo, setSchoolInfo] = useState({
    name: 'Rajadhani School Of Education',
    zone: 'bhubaneswar',
    authority: 'Authorized Signatory',
    mobile: '',
    scan: '',
  });
  const [students, setStudents] = useState<StudentRecord[]>(INITIAL_STUDENTS);

  // Single Student Form State
  const [newStudentId, setNewStudentId] = useState('');
  const [newName, setNewName] = useState('');
  const [newMobile, setNewMobile] = useState('');
  const [newFee, setNewFee] = useState('2500');
  const [addMessage, setAddMessage] = useState<string | null>(null);

  // Active Tab for Student Addition: 'excel' vs 'manual'
  const [entryMode, setEntryMode] = useState<'excel' | 'manual'>('excel');

  // Affiliation Fee State
  const [affiliationPaid, setAffiliationPaid] = useState<boolean>(false);
  const [affiliationReceipt, setAffiliationReceipt] = useState<{
    receiptNo: string;
    paidAt: string;
    amount: number;
  } | null>(null);
  const [payingAffiliation, setPayingAffiliation] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const u = sessionStorage.getItem('school_user');
      if (!u) {
        router.push('/school-login');
      } else {
        setUser(u);
        setSchoolInfo({
          name: sessionStorage.getItem('school_name') || u,
          zone: sessionStorage.getItem('school_zone') || 'bhubaneswar',
          authority: sessionStorage.getItem('school_authority') || 'Authorized Secretary',
          mobile: sessionStorage.getItem('school_mobile') || '',
          scan: sessionStorage.getItem('school_scan') || 'Verified Affiliation Document',
        });

        const savedAff = sessionStorage.getItem('school_affiliation_paid');
        if (savedAff) {
          try {
            const parsed = JSON.parse(savedAff);
            setAffiliationPaid(true);
            setAffiliationReceipt(parsed);
          } catch {
            // ignore
          }
        }
      }
    }
  }, [router]);

  const handlePayAffiliation = async () => {
    setPayingAffiliation(true);
    try {
      const res = await fetch('/api/order/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          purpose: 'college_affiliation_fee',
          feeCategory: 'affiliation',
          schoolCode: schoolInfo.name,
          payerPhone: schoolInfo.mobile,
        }),
      });
      const data = await res.json();
      const receipt = {
        receiptNo: data.receiptNo || `AFF-${Date.now().toString().slice(-6)}`,
        paidAt: new Date().toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        amount: 15000,
      };
      sessionStorage.setItem('school_affiliation_paid', JSON.stringify(receipt));
      setAffiliationPaid(true);
      setAffiliationReceipt(receipt);
      setShowCertificateModal(true);
    } catch (err) {
      console.error(err);
      alert('Payment initialization failed. Please try again.');
    } finally {
      setPayingAffiliation(false);
    }
  };

  // Single Manual Student Add
  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentId.trim() || !newName.trim() || !newMobile.trim()) return;

    const newRecord: StudentRecord = {
      studentId: newStudentId.trim(),
      studentName: newName.trim(),
      mobileNumber: newMobile.trim(),
      zoneId: schoolInfo.zone,
      zoneName: `${schoolInfo.zone.charAt(0).toUpperCase() + schoolInfo.zone.slice(1)} Zone`,
      schoolId: 'SCH-AUTH-01',
      schoolName: schoolInfo.name,
      district: 'Odisha',
      feeAmount: Number(newFee) || 2500,
      paymentStatus: 'Pending',
    };

    setStudents([newRecord, ...students]);
    setAddMessage(`✓ Successfully added ${newName} to verified roster!`);

    fetch('/api/students/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ students: [newRecord] }),
    }).catch(console.error);

    setNewStudentId('');
    setNewName('');
    setNewMobile('');

    setTimeout(() => setAddMessage(null), 4000);
  };

  // Excel / CSV File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      if (!content) return;

      const lines = content.split(/\r\n|\n/);
      const parsedRecords: StudentRecord[] = [];

      // Parse CSV rows (Header line 0 skipped)
      for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(',');
        if (row.length >= 3 && row[0].trim()) {
          const sId = row[0].trim().replace(/"/g, '');
          const sName = row[1].trim().replace(/"/g, '');
          const sMobile = row[2].trim().replace(/"/g, '');
          const sFee = row[3] ? Number(row[3].trim().replace(/"/g, '')) : 2500;

          if (sId && sName && sMobile) {
            parsedRecords.push({
              studentId: sId,
              studentName: sName,
              mobileNumber: sMobile,
              zoneId: 'bhubaneswar',
              zoneName: 'Bhubaneswar Zone',
              schoolId: 'SCH-BBS-01',
              schoolName: 'Rajadhani School Of Education',
              district: 'Khordha',
              feeAmount: sFee || 2500,
              paymentStatus: 'Pending',
            });
          }
        }
      }

      if (parsedRecords.length > 0) {
        setStudents((prev) => [...parsedRecords, ...prev]);
        setAddMessage(`✓ Successfully imported ${parsedRecords.length} student records from Excel CSV file!`);

        fetch('/api/students/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ students: parsedRecords }),
        }).catch(console.error);
      } else {
        alert('Could not parse student records. Please ensure your file follows the standard template format.');
      }
    };

    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Download Standard CSV Template
  const downloadTemplate = () => {
    const csvContent =
      'Student ID,Student Name,Mobile Number,Fee Payable\n' +
      'STU-2026-101,Aarav Sharma,9861099999,2500\n' +
      'STU-2026-102,Priya Mohanty,9437011111,2500\n';

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'AOPSTSMA_Student_Roster_Template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('school_user');
    }
    router.push('/school-login');
  };

  if (!user) return null;

  return (
    <div className="section" style={{ minHeight: '80vh' }}>
      <div className="wrap">
        {/* DASHBOARD HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '2px solid #E2E8F0' }}>
          <div>
            <span className="pay-badge">AUTHENTICATED MEMBER INSTITUTION DASHBOARD</span>
            <h1 style={{ fontSize: '2rem', color: '#0F172A', marginTop: '0.4rem' }}>
              {schoolInfo.name}
            </h1>
            <p style={{ margin: 0, color: '#64748B', fontSize: '0.92rem' }}>
              {schoolInfo.zone.charAt(0).toUpperCase() + schoolInfo.zone.slice(1)} Zone &middot; Authorized Signatory: <strong>{schoolInfo.authority}</strong> {schoolInfo.mobile ? `(${schoolInfo.mobile})` : ''}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link className="btn btn--ghost" href="/pay">
              💳 Test Student Verification
            </Link>
            <button type="button" onClick={handleLogout} className="btn" style={{ background: '#EF4444', color: '#FFF' }}>
              🚪 Sign Out
            </button>
          </div>
        </div>

        <div className="pay-card-grid" style={{ marginBottom: '2.5rem' }}>
          {/* STUDENT ENTRY MODES (EXCEL VS MANUAL) */}
          <div className="pay-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3>Update Student Roster</h3>
              <div style={{ display: 'flex', gap: '0.4rem', background: '#F1F5F9', padding: '0.2rem', borderRadius: '6px' }}>
                <button
                  type="button"
                  onClick={() => setEntryMode('excel')}
                  style={{
                    border: 'none',
                    padding: '0.4rem 0.85rem',
                    borderRadius: '4px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: entryMode === 'excel' ? '#0B2545' : 'transparent',
                    color: entryMode === 'excel' ? '#FFFFFF' : '#475569',
                  }}
                >
                  📁 Bulk Excel Upload
                </button>
                <button
                  type="button"
                  onClick={() => setEntryMode('manual')}
                  style={{
                    border: 'none',
                    padding: '0.4rem 0.85rem',
                    borderRadius: '4px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: entryMode === 'manual' ? '#0B2545' : 'transparent',
                    color: entryMode === 'manual' ? '#FFFFFF' : '#475569',
                  }}
                >
                  ✍️ Single Manual Entry
                </button>
              </div>
            </div>

            {addMessage && (
              <div style={{ padding: '0.75rem 1rem', background: '#D1FAE5', color: '#065F46', borderRadius: '6px', fontSize: '0.88rem', fontWeight: 600, marginBottom: '1.25rem' }}>
                {addMessage}
              </div>
            )}

            {/* EXCEL UPLOAD OPTION */}
            {entryMode === 'excel' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <p style={{ fontSize: '0.88rem', color: '#64748B', margin: 0 }}>
                  Upload your formatted student Excel/CSV roster. Ensure columns match the mandatory Association format.
                </p>

                <button
                  type="button"
                  onClick={downloadTemplate}
                  style={{
                    background: '#FEF3C7',
                    border: '1px solid #FDE68A',
                    color: '#B45309',
                    padding: '0.65rem 1rem',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>📥 Download Standard Excel/CSV Template (.csv)</span>
                  <span style={{ fontSize: '0.75rem', background: '#D97706', color: '#FFF', padding: '0.15rem 0.45rem', borderRadius: '3px' }}>REQUIRED FORMAT</span>
                </button>

                <div
                  style={{
                    border: '2px dashed #CBD5E1',
                    borderRadius: '8px',
                    padding: '2rem 1.5rem',
                    textAlign: 'center',
                    background: '#F8FAFC',
                    cursor: 'pointer',
                  }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📊</div>
                  <b style={{ color: '#0F172A', display: 'block', marginBottom: '0.25rem' }}>Click to Upload Student Roster Excel File</b>
                  <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Supports .csv / .xlsx formatted files</span>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".csv, .xlsx, .xls"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                </div>
              </div>
            ) : (
              /* SINGLE MANUAL FORM ENTRY OPTION */
              <form onSubmit={handleAddStudent} className="pay-form">
                <div className="form-group">
                  <label htmlFor="stuId">Student ID / Roll No *</label>
                  <input
                    type="text"
                    id="stuId"
                    placeholder="e.g. STU-2026-006"
                    value={newStudentId}
                    onChange={(e) => setNewStudentId(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="stuName">Full Student Name *</label>
                  <input
                    type="text"
                    id="stuName"
                    placeholder="e.g. Ananya Das"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="stuMobile">Mobile Number *</label>
                  <input
                    type="tel"
                    id="stuMobile"
                    placeholder="e.g. 9861099999"
                    value={newMobile}
                    onChange={(e) => setNewMobile(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="feeAmt">Fee Payable (₹) *</label>
                  <input
                    type="number"
                    id="feeAmt"
                    value={newFee}
                    onChange={(e) => setNewFee(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="verify-btn">
                  ✅ Add Student Record
                </button>
              </form>
            )}
          </div>

          {/* SCHOOL SUMMARY STATS */}
          <div className="pay-card summary-card">
            <h3>📊 Roster & Membership Fees Summary</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.85rem', marginTop: '1rem' }}>
              <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                <span style={{ display: 'block', fontSize: '1.8rem', fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>
                  {students.length}
                </span>
                <small style={{ color: '#64748B', fontWeight: 600, textTransform: uppercaseText }}>Total Candidates</small>
              </div>

              <div style={{ background: '#FEF3C7', padding: '1rem', borderRadius: '8px', border: '1px solid #FDE68A', textAlign: 'center' }}>
                <span style={{ display: 'block', fontSize: '1.8rem', fontWeight: 800, color: '#D97706', lineHeight: 1 }}>
                  ₹{(students.length * 2500).toLocaleString('en-IN')}
                </span>
                <small style={{ color: '#B45309', fontWeight: 600, textTransform: uppercaseText }}>Candidate Fee Target (₹2,500/ea)</small>
              </div>
            </div>

            {/* INSTITUTIONAL AFFILIATION FEE BOX (Payable by School / College) */}
            <div style={{
              marginTop: '1rem',
              padding: '1.15rem',
              background: affiliationPaid ? '#F0FDF4' : '#FFFBEB',
              border: `2px solid ${affiliationPaid ? '#10B981' : '#F59E0B'}`,
              borderRadius: '10px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '1.25rem' }}>🏛️</span>
                    <b style={{ color: '#0F172A', fontSize: '0.98rem' }}>Institutional Affiliation Fee (2026-27)</b>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '0.15rem 0.55rem',
                      borderRadius: '4px',
                      background: affiliationPaid ? '#D1FAE5' : '#FEF3C7',
                      color: affiliationPaid ? '#065F46' : '#92400E',
                    }}>
                      {affiliationPaid ? 'PAID & CERTIFIED ✓' : 'FEE DUE'}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748B' }}>
                    Official Annual Affiliation &amp; Institutional Inspection Fee under AOPSTSMA State Authority
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0B2545', display: 'block' }}>₹15,000</span>
                  <small style={{ color: '#64748B', fontSize: '0.72rem' }}>Mandatory College Fee</small>
                </div>
              </div>

              <div style={{ marginTop: '0.9rem', display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                {affiliationPaid ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setShowCertificateModal(true)}
                      style={{
                        padding: '0.55rem 1.15rem',
                        background: '#047857',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '6px',
                        fontWeight: 700,
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        boxShadow: '0 2px 8px rgba(4, 120, 87, 0.25)',
                      }}
                    >
                      📜 View &amp; Print Affiliation Certificate
                    </button>
                    <span style={{ fontSize: '0.78rem', color: '#047857', fontWeight: 600 }}>
                      Receipt: {affiliationReceipt?.receiptNo} ({affiliationReceipt?.paidAt})
                    </span>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={handlePayAffiliation}
                    disabled={payingAffiliation}
                    style={{
                      padding: '0.65rem 1.25rem',
                      background: 'linear-gradient(135deg, #0B2545 0%, #1E40AF 100%)',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '6px',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(11, 37, 69, 0.25)',
                    }}
                  >
                    {payingAffiliation ? 'Initializing Gateway...' : '💳 Pay ₹15,000 Affiliation Fee via Gateway'}
                  </button>
                )}
              </div>
            </div>

            <div style={{ marginTop: '1.25rem', padding: '0.85rem', background: '#EFF6FF', borderLeft: '4px solid #3B82F6', borderRadius: '0 6px 6px 0', fontSize: '0.82rem', color: '#1E40AF' }}>
              ℹ️ <strong>Roster Verification Active</strong>
              <br />
              Students pay ₹2,500 online using <code>Student Name</code> + <code>Mobile Number</code>. Completed transactions automatically sync to Google Sheets.
            </div>
          </div>
        </div>

        {/* VERIFIED STUDENT ROSTER TABLE */}
        <h3 style={{ fontSize: '1.35rem', color: '#0F172A', marginBottom: '1rem' }}>
          Verified Student Roster ({students.length} Candidates)
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table className="school-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Student ID</th>
                <th>Student Name</th>
                <th>Mobile Number</th>
                <th>Zone</th>
                <th>Fee Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '2.5rem', color: '#64748B' }}>
                    No student records found in roster. Use the "Upload Excel / CSV" or "Add Single Student" form above to add candidates.
                  </td>
                </tr>
              ) : (
                students.map((s, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td><code>{s.studentId}</code></td>
                    <td style={{ fontWeight: 700, color: '#0F172A' }}>{s.studentName}</td>
                    <td>+91 {s.mobileNumber}</td>
                    <td>{s.zoneName}</td>
                    <td style={{ fontWeight: 700, color: '#B45309' }}>₹{s.feeAmount.toLocaleString('en-IN')}</td>
                    <td>
                      <span style={{
                        padding: '0.2rem 0.6rem',
                        borderRadius: '4px',
                        fontSize: '0.78rem',
                        fontWeight: 800,
                        background: s.paymentStatus === 'Paid' ? '#D1FAE5' : '#FEF3C7',
                        color: s.paymentStatus === 'Paid' ? '#065F46' : '#B45309',
                      }}>
                        {s.paymentStatus === 'Paid' ? 'PAID ✓' : 'PENDING PAYMENT'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* AFFILIATION CERTIFICATE MODAL */}
        {showCertificateModal && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(6, 19, 36, 0.85)',
              backdropFilter: 'blur(8px)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
            }}
            onClick={() => setShowCertificateModal(false)}
          >
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                maxWidth: '700px',
                width: '100%',
                maxHeight: '92vh',
                overflowY: 'auto',
                boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
                border: '4px double #D97706',
                padding: '2.5rem',
                position: 'relative',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Certificate Header */}
              <div style={{ textAlign: 'center', borderBottom: '2px solid #E2E8F0', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '2rem' }}>🏛️</span>
                <h2 style={{ fontSize: '1.25rem', color: '#0B2545', margin: '0.35rem 0 0.15rem 0', fontWeight: 900, letterSpacing: '0.5px' }}>
                  ALL ORISSA PRIVATE SECONDARY TRAINING SCHOOLS MANAGEMENT ASSOCIATION
                </h2>
                <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>
                  Societies Registration Act XXI of 1860 &middot; Regd. No. 1422/80 &middot; Estd. 1980
                </div>
                <div style={{
                  display: 'inline-block',
                  marginTop: '0.75rem',
                  padding: '0.35rem 1rem',
                  background: 'linear-gradient(135deg, #0B2545 0%, #1E40AF 100%)',
                  color: '#FDE68A',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  borderRadius: '50px',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                }}>
                  Certificate of Institutional Affiliation (2026-2027)
                </div>
              </div>

              {/* Certificate Body */}
              <div style={{ lineHeight: 1.8, color: '#334155', fontSize: '0.95rem', textAlign: 'center', marginBottom: '2rem' }}>
                This is to certify that
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0B2545', margin: '0.6rem 0' }}>
                  {schoolInfo.name}
                </div>
                situated in <b style={{ color: '#0F172A' }}>{schoolInfo.zone.toUpperCase()} ZONE</b>, Odisha, has duly cleared all institutional inspection criteria and remitted the statutory Affiliation &amp; Inspection Fee of <b style={{ color: '#166534' }}>₹15,000.00</b> for the academic session 2026-2027.
              </div>

              {/* Verification Details Table */}
              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.65rem' }}>
                  <div>
                    <span style={{ color: '#64748B', display: 'block', fontSize: '0.72rem' }}>RECEIPT NUMBER</span>
                    <strong style={{ color: '#0F172A' }}>{affiliationReceipt?.receiptNo}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748B', display: 'block', fontSize: '0.72rem' }}>DATE OF ISSUE</span>
                    <strong style={{ color: '#0F172A' }}>{affiliationReceipt?.paidAt}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748B', display: 'block', fontSize: '0.72rem' }}>AFFILIATION STATUS</span>
                    <strong style={{ color: '#15803D' }}>ACTIVE &amp; RECOGNIZED ✓</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748B', display: 'block', fontSize: '0.72rem' }}>LEGAL PROTECTION</span>
                    <strong style={{ color: '#0B2545' }}>Orissa HC WP(C) 5640/2009</strong>
                  </div>
                </div>
              </div>

              {/* Signatures */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '1.5rem', borderTop: '1px dashed #CBD5E1' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: '#D97706', fontSize: '1.6rem', marginBottom: '0.2rem' }}>🛡️</div>
                  <small style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Official Seal of AOPSTSMA</small>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'serif', fontStyle: 'italic', fontSize: '1.1rem', color: '#0B2545', fontWeight: 700 }}>
                    Raj Kishore Jena
                  </div>
                  <div style={{ width: '130px', height: '1px', background: '#94A3B8', margin: '0.2rem auto' }} />
                  <small style={{ fontSize: '0.75rem', color: '#64748B', display: 'block', fontWeight: 600 }}>
                    General Secretary, AOPSTSMA
                  </small>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
                <button
                  type="button"
                  onClick={() => window.print()}
                  style={{
                    padding: '0.65rem 1.5rem',
                    background: '#0B2545',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  🖨️ Print Certificate
                </button>
                <button
                  type="button"
                  onClick={() => setShowCertificateModal(false)}
                  style={{
                    padding: '0.65rem 1.5rem',
                    background: '#E2E8F0',
                    color: '#334155',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const uppercaseText: 'uppercase' = 'uppercase';
