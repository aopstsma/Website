'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { INITIAL_STUDENTS, StudentRecord } from '@/lib/data/students';

export default function SchoolDashboardPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<string | null>(null);
  const [students, setStudents] = useState<StudentRecord[]>(INITIAL_STUDENTS);

  // Single Student Form State
  const [newStudentId, setNewStudentId] = useState('');
  const [newName, setNewName] = useState('');
  const [newMobile, setNewMobile] = useState('');
  const [newFee, setNewFee] = useState('25000');
  const [addMessage, setAddMessage] = useState<string | null>(null);

  // Active Tab for Student Addition: 'excel' vs 'manual'
  const [entryMode, setEntryMode] = useState<'excel' | 'manual'>('excel');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const u = sessionStorage.getItem('school_user');
      if (!u) {
        router.push('/school-login');
      } else {
        setUser(u);
      }
    }
  }, [router]);

  // Single Manual Student Add
  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentId.trim() || !newName.trim() || !newMobile.trim()) return;

    const newRecord: StudentRecord = {
      studentId: newStudentId.trim(),
      studentName: newName.trim(),
      mobileNumber: newMobile.trim(),
      zoneId: 'bhubaneswar',
      zoneName: 'Bhubaneswar Zone',
      schoolId: 'SCH-BBS-01',
      schoolName: 'Rajadhani School Of Education',
      district: 'Khordha',
      feeAmount: Number(newFee) || 25000,
      paymentStatus: 'Pending',
    };

    setStudents([newRecord, ...students]);
    setAddMessage(`✓ Successfully added ${newName} (${newStudentId}) to verified roster!`);

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
          const sFee = row[3] ? Number(row[3].trim().replace(/"/g, '')) : 25000;

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
              feeAmount: sFee || 25000,
              paymentStatus: 'Pending',
            });
          }
        }
      }

      if (parsedRecords.length > 0) {
        setStudents((prev) => [...parsedRecords, ...prev]);
        setAddMessage(`✓ Successfully imported ${parsedRecords.length} student records from Excel CSV file!`);
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
      'STU-2026-101,Aarav Sharma,9861099999,25000\n' +
      'STU-2026-102,Priya Mohanty,9437011111,25000\n';

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
            <span className="pay-badge">MEMBER SCHOOL MANAGEMENT DASHBOARD</span>
            <h1 style={{ fontSize: '2rem', color: '#0F172A', marginTop: '0.4rem' }}>
              Rajadhani School Of Education
            </h1>
            <p style={{ margin: 0, color: '#64748B', fontSize: '0.92rem' }}>
              Bhubaneswar Zone &middot; Khordha District &middot; Regd. Member No. SCH-BBS-01
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
                    justify: 'space-between',
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
            <h3>📊 School Roster Summary</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginTop: '1.25rem' }}>
              <div style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: '8px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                <span style={{ display: 'block', fontSize: '2.2rem', fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>
                  {students.length}
                </span>
                <small style={{ color: '#64748B', fontWeight: 600, textTransform: uppercaseText }}>Total Candidates</small>
              </div>

              <div style={{ background: '#FEF3C7', padding: '1.25rem', borderRadius: '8px', border: '1px solid #FDE68A', textAlign: 'center' }}>
                <span style={{ display: 'block', fontSize: '2.2rem', fontWeight: 800, color: '#D97706', lineHeight: 1 }}>
                  ₹{(students.length * 25000).toLocaleString('en-IN')}
                </span>
                <small style={{ color: '#B45309', fontWeight: 600, textTransform: uppercaseText }}>Fee Target</small>
              </div>
            </div>

            <div style={{ marginTop: '1.75rem', padding: '1rem', background: '#EFF6FF', borderLeft: '4px solid #3B82F6', borderRadius: '0 6px 6px 0', fontSize: '0.88rem', color: '#1E40AF' }}>
              ℹ️ <strong>Format Standardized & Sync Active</strong>
              <br />
              Students verify using <code>Student ID</code> + <code>Mobile Number</code>. Completed transactions automatically sync to Google Sheets.
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
              {students.map((s, idx) => (
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const uppercaseText: 'uppercase' = 'uppercase';
