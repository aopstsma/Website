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

  // 1. DR Deposit State (₹25,000 - Directorate Registration)
  const [drDepositPaid, setDrDepositPaid] = useState<boolean>(false);
  const [drDepositReceipt, setDrDepositReceipt] = useState<{
    receiptNo: string;
    paidAt: string;
    amount: number;
  } | null>(null);
  const [payingDrDeposit, setPayingDrDeposit] = useState(false);
  const [showDrCertificateModal, setShowDrCertificateModal] = useState(false);

  // 2. Legal Assist State (Preset / Custom)
  const [legalAssistAmount, setLegalAssistAmount] = useState<number>(5000);
  const [legalAssistCustom, setLegalAssistCustom] = useState<string>('');
  const [payingLegalAssist, setPayingLegalAssist] = useState(false);
  const [legalAssistReceipt, setLegalAssistReceipt] = useState<{
    receiptNo: string;
    paidAt: string;
    amount: number;
  } | null>(null);

  // 3. Court Expenses State (Preset / Custom)
  const [courtExpensesAmount, setCourtExpensesAmount] = useState<number>(10000);
  const [courtExpensesCustom, setCourtExpensesCustom] = useState<string>('');
  const [payingCourtExpenses, setPayingCourtExpenses] = useState(false);
  const [courtExpensesReceipt, setCourtExpensesReceipt] = useState<{
    receiptNo: string;
    paidAt: string;
    amount: number;
  } | null>(null);

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

        // Load saved DR Deposit
        const savedDr = sessionStorage.getItem('school_dr_deposit_paid') || sessionStorage.getItem('school_affiliation_paid');
        if (savedDr) {
          try {
            const parsed = JSON.parse(savedDr);
            setDrDepositPaid(true);
            setDrDepositReceipt(parsed);
          } catch {
            // ignore
          }
        }
        // Load saved Legal Assist
        const savedLegal = sessionStorage.getItem('school_legal_assist_paid');
        if (savedLegal) {
          try {
            setLegalAssistReceipt(JSON.parse(savedLegal));
          } catch {
            // ignore
          }
        }
        // Load saved Court Expenses
        const savedCourt = sessionStorage.getItem('school_court_expenses_paid');
        if (savedCourt) {
          try {
            setCourtExpensesReceipt(JSON.parse(savedCourt));
          } catch {
            // ignore
          }
        }
      }
    }
  }, [router]);

  // Handler 1: Pay DR Deposit (₹25,000)
  const handlePayDrDeposit = async () => {
    setPayingDrDeposit(true);
    try {
      const res = await fetch('/api/order/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          purpose: 'dr_deposit',
          feeCategory: 'dr_deposit',
          schoolCode: schoolInfo.name,
          payerPhone: schoolInfo.mobile,
          studentName: schoolInfo.authority,
        }),
      });
      const data = await res.json();
      const receipt = {
        receiptNo: data.receiptNo || `DR-${Date.now().toString().slice(-6)}`,
        paidAt: new Date().toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        amount: 25000,
      };
      sessionStorage.setItem('school_dr_deposit_paid', JSON.stringify(receipt));
      setDrDepositPaid(true);
      setDrDepositReceipt(receipt);
      setShowDrCertificateModal(true);
    } catch (err) {
      console.error(err);
      alert('DR Deposit gateway initialization failed. Please try again.');
    } finally {
      setPayingDrDeposit(false);
    }
  };

  // Handler 2: Pay Legal Assist
  const handlePayLegalAssist = async () => {
    const finalAmt = legalAssistCustom && Number(legalAssistCustom) > 0
      ? Number(legalAssistCustom)
      : legalAssistAmount;
    setPayingLegalAssist(true);
    try {
      const res = await fetch('/api/order/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          purpose: 'legal_assist',
          feeCategory: 'legal_assist',
          customAmount: finalAmt,
          schoolCode: schoolInfo.name,
          payerPhone: schoolInfo.mobile,
          studentName: `${schoolInfo.name} (Legal Assist)`,
        }),
      });
      const data = await res.json();
      const receipt = {
        receiptNo: data.receiptNo || `AST-${Date.now().toString().slice(-6)}`,
        paidAt: new Date().toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        amount: finalAmt,
      };
      sessionStorage.setItem('school_legal_assist_paid', JSON.stringify(receipt));
      setLegalAssistReceipt(receipt);
      alert(`✓ Legal Assist Contribution of ₹${finalAmt.toLocaleString('en-IN')} successfully processed! Receipt: ${receipt.receiptNo}`);
    } catch (err) {
      console.error(err);
      alert('Legal assist payment failed. Please try again.');
    } finally {
      setPayingLegalAssist(false);
    }
  };

  // Handler 3: Pay Court Expenses
  const handlePayCourtExpenses = async () => {
    const finalAmt = courtExpensesCustom && Number(courtExpensesCustom) > 0
      ? Number(courtExpensesCustom)
      : courtExpensesAmount;
    setPayingCourtExpenses(true);
    try {
      const res = await fetch('/api/order/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          purpose: 'court_expenses',
          feeCategory: 'court_expenses',
          customAmount: finalAmt,
          schoolCode: schoolInfo.name,
          payerPhone: schoolInfo.mobile,
          studentName: `${schoolInfo.name} (Court Expenses)`,
        }),
      });
      const data = await res.json();
      const receipt = {
        receiptNo: data.receiptNo || `CRT-${Date.now().toString().slice(-6)}`,
        paidAt: new Date().toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        amount: finalAmt,
      };
      sessionStorage.setItem('school_court_expenses_paid', JSON.stringify(receipt));
      setCourtExpensesReceipt(receipt);
      alert(`✓ Court Expenses Contribution of ₹${finalAmt.toLocaleString('en-IN')} successfully processed! Receipt: ${receipt.receiptNo}`);
    } catch (err) {
      console.error(err);
      alert('Court expenses payment failed. Please try again.');
    } finally {
      setPayingCourtExpenses(false);
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

          {/* SCHOOL SUMMARY STATS & INSTITUTIONAL PAYMENTS HUB */}
          <div className="pay-card summary-card">
            <h3>🏛️ Institutional Payments &amp; Deposits Center</h3>

            {/* 1. DR DEPOSIT BY SCHOOL (₹25,000) */}
            <div style={{
              marginTop: '1rem',
              padding: '1.15rem',
              background: drDepositPaid ? '#F0FDF4' : '#FFFBEB',
              border: `2px solid ${drDepositPaid ? '#10B981' : '#D97706'}`,
              borderRadius: '10px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '1.25rem' }}>🏫</span>
                    <b style={{ color: '#0F172A', fontSize: '0.98rem' }}>DR Deposit by School (Session 2026-27)</b>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '0.15rem 0.55rem',
                      borderRadius: '4px',
                      background: drDepositPaid ? '#D1FAE5' : '#FEF3C7',
                      color: drDepositPaid ? '#065F46' : '#92400E',
                    }}>
                      {drDepositPaid ? 'PAID & CERTIFIED ✓' : 'DEPOSIT DUE'}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748B' }}>
                    Mandatory Directorate Registration (DR Deposit) under Societies Registration Act XXI of 1860
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0B2545', display: 'block' }}>₹25,000</span>
                  <small style={{ color: '#64748B', fontSize: '0.72rem' }}>Statutory Institution Fee</small>
                </div>
              </div>

              <div style={{ marginTop: '0.9rem', display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                {drDepositPaid ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setShowDrCertificateModal(true)}
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
                      📜 View &amp; Print DR Deposit Certificate
                    </button>
                    <span style={{ fontSize: '0.78rem', color: '#047857', fontWeight: 600 }}>
                      Receipt: {drDepositReceipt?.receiptNo} ({drDepositReceipt?.paidAt})
                    </span>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={handlePayDrDeposit}
                    disabled={payingDrDeposit}
                    style={{
                      padding: '0.65rem 1.25rem',
                      background: 'linear-gradient(135deg, #0B2545 0%, #15803D 100%)',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '6px',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(11, 37, 69, 0.25)',
                    }}
                  >
                    {payingDrDeposit ? 'Connecting Gateway...' : '💳 Pay ₹25,000 DR Deposit via Gateway'}
                  </button>
                )}
              </div>
            </div>

            {/* 2. LEGAL ASSIST CONTRIBUTION */}
            <div style={{
              marginTop: '1rem',
              padding: '1.15rem',
              background: '#FFFBEB',
              border: '1px solid #FDE68A',
              borderRadius: '10px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '1.25rem' }}>⚖️</span>
                    <b style={{ color: '#0F172A', fontSize: '0.98rem' }}>Institutional Legal Assist Fund</b>
                    {legalAssistReceipt && (
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '0.15rem 0.55rem', borderRadius: '4px', background: '#D1FAE5', color: '#065F46' }}>
                        CONTRIBUTED ✓
                      </span>
                    )}
                  </div>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748B' }}>
                    Senior Advocate defense &amp; Directorate legal consultation fund
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                {[2500, 5000, 10000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => { setLegalAssistAmount(amt); setLegalAssistCustom(''); }}
                    style={{
                      padding: '0.35rem 0.75rem',
                      borderRadius: '4px',
                      border: legalAssistAmount === amt && !legalAssistCustom ? '2px solid #D97706' : '1px solid #CBD5E1',
                      background: legalAssistAmount === amt && !legalAssistCustom ? '#FEF3C7' : '#FFFFFF',
                      color: legalAssistAmount === amt && !legalAssistCustom ? '#92400E' : '#334155',
                      fontWeight: 700,
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                    }}
                  >
                    ₹{amt.toLocaleString('en-IN')}
                  </button>
                ))}
                <input
                  type="number"
                  placeholder="Custom ₹"
                  value={legalAssistCustom}
                  onChange={(e) => setLegalAssistCustom(e.target.value)}
                  style={{ width: '90px', padding: '0.35rem 0.5rem', fontSize: '0.78rem', borderRadius: '4px', border: '1px solid #CBD5E1' }}
                />
                <button
                  type="button"
                  onClick={handlePayLegalAssist}
                  disabled={payingLegalAssist}
                  style={{
                    padding: '0.45rem 0.95rem',
                    background: '#D97706',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '4px',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                  }}
                >
                  {payingLegalAssist ? 'Processing...' : '⚖️ Pay Legal Assist'}
                </button>
              </div>
              {legalAssistReceipt && (
                <div style={{ marginTop: '0.4rem', fontSize: '0.74rem', color: '#047857', fontWeight: 600 }}>
                  Receipt #{legalAssistReceipt.receiptNo} (₹{legalAssistReceipt.amount.toLocaleString('en-IN')})
                </div>
              )}
            </div>

            {/* 3. COURT EXPENSES CONTRIBUTION */}
            <div style={{
              marginTop: '1rem',
              padding: '1.15rem',
              background: '#F5F3FF',
              border: '1px solid #DDD6FE',
              borderRadius: '10px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '1.25rem' }}>📜</span>
                    <b style={{ color: '#0F172A', fontSize: '0.98rem' }}>Court Expenses &amp; Litigation Fund</b>
                    {courtExpensesReceipt && (
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '0.15rem 0.55rem', borderRadius: '4px', background: '#D1FAE5', color: '#065F46' }}>
                        CONTRIBUTED ✓
                      </span>
                    )}
                  </div>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748B' }}>
                    High Court of Orissa WP(C) 5640/2009 &amp; Supreme Court SLP expenses
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                {[5000, 10000, 25000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => { setCourtExpensesAmount(amt); setCourtExpensesCustom(''); }}
                    style={{
                      padding: '0.35rem 0.75rem',
                      borderRadius: '4px',
                      border: courtExpensesAmount === amt && !courtExpensesCustom ? '2px solid #7C3AED' : '1px solid #CBD5E1',
                      background: courtExpensesAmount === amt && !courtExpensesCustom ? '#EDE9FE' : '#FFFFFF',
                      color: courtExpensesAmount === amt && !courtExpensesCustom ? '#6D28D9' : '#334155',
                      fontWeight: 700,
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                    }}
                  >
                    ₹{amt.toLocaleString('en-IN')}
                  </button>
                ))}
                <input
                  type="number"
                  placeholder="Custom ₹"
                  value={courtExpensesCustom}
                  onChange={(e) => setCourtExpensesCustom(e.target.value)}
                  style={{ width: '90px', padding: '0.35rem 0.5rem', fontSize: '0.78rem', borderRadius: '4px', border: '1px solid #CBD5E1' }}
                />
                <button
                  type="button"
                  onClick={handlePayCourtExpenses}
                  disabled={payingCourtExpenses}
                  style={{
                    padding: '0.45rem 0.95rem',
                    background: '#7C3AED',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '4px',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                  }}
                >
                  {payingCourtExpenses ? 'Processing...' : '📜 Pay Court Expenses'}
                </button>
              </div>
              {courtExpensesReceipt && (
                <div style={{ marginTop: '0.4rem', fontSize: '0.74rem', color: '#047857', fontWeight: 600 }}>
                  Receipt #{courtExpensesReceipt.receiptNo} (₹{courtExpensesReceipt.amount.toLocaleString('en-IN')})
                </div>
              )}
            </div>

            {/* 4. STUDENT FEES ROSTER OVERVIEW */}
            <div style={{ marginTop: '1rem', padding: '1rem', background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <b style={{ color: '#1E40AF', fontSize: '0.9rem' }}>🎓 Student Candidate Fees (₹2,500/student)</b>
                <Link
                  href="/pay"
                  target="_blank"
                  style={{ fontSize: '0.78rem', color: '#1D4ED8', fontWeight: 700, textDecoration: 'none' }}
                >
                  Open Candidate Pay Gateway &rarr;
                </Link>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', textAlign: 'center' }}>
                <div style={{ background: '#FFFFFF', padding: '0.5rem', borderRadius: '6px' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', display: 'block' }}>{students.length}</span>
                  <small style={{ fontSize: '0.7rem', color: '#64748B' }}>Total Enrolled</small>
                </div>
                <div style={{ background: '#FFFFFF', padding: '0.5rem', borderRadius: '6px' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#15803D', display: 'block' }}>
                    {students.filter((s) => s.paymentStatus === 'Paid').length}
                  </span>
                  <small style={{ fontSize: '0.7rem', color: '#15803D' }}>Paid Candidates</small>
                </div>
                <div style={{ background: '#FFFFFF', padding: '0.5rem', borderRadius: '6px' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#B45309', display: 'block' }}>
                    {students.filter((s) => s.paymentStatus !== 'Paid').length}
                  </span>
                  <small style={{ fontSize: '0.7rem', color: '#B45309' }}>Pending (₹2,500 ea)</small>
                </div>
              </div>
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

        {/* DR DEPOSIT CERTIFICATE MODAL */}
        {showDrCertificateModal && (
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
            onClick={() => setShowDrCertificateModal(false)}
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
                border: '4px double #15803D',
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
                  background: 'linear-gradient(135deg, #0B2545 0%, #15803D 100%)',
                  color: '#FDE68A',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  borderRadius: '50px',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                }}>
                  Certificate of Directorate Registration (DR Deposit)
                </div>
              </div>

              {/* Certificate Body */}
              <div style={{ lineHeight: 1.8, color: '#334155', fontSize: '0.95rem', textAlign: 'center', marginBottom: '2rem' }}>
                This is to certify that
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0B2545', margin: '0.6rem 0' }}>
                  {schoolInfo.name}
                </div>
                situated in <b style={{ color: '#0F172A' }}>{schoolInfo.zone.toUpperCase()} ZONE</b>, Odisha, has duly cleared all institutional verification criteria and remitted the statutory Directorate Registration (DR Deposit) of <b style={{ color: '#166534' }}>₹25,000.00</b> for the academic session 2026-2027.
              </div>

              {/* Verification Details Table */}
              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.65rem' }}>
                  <div>
                    <span style={{ color: '#64748B', display: 'block', fontSize: '0.72rem' }}>RECEIPT NUMBER</span>
                    <strong style={{ color: '#0F172A' }}>{drDepositReceipt?.receiptNo}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748B', display: 'block', fontSize: '0.72rem' }}>DATE OF ISSUE</span>
                    <strong style={{ color: '#0F172A' }}>{drDepositReceipt?.paidAt}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748B', display: 'block', fontSize: '0.72rem' }}>DR DEPOSIT STATUS</span>
                    <strong style={{ color: '#15803D' }}>ACTIVE &amp; RECOGNIZED DR DEPOSIT ✓</strong>
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
                  🖨️ Print DR Certificate
                </button>
                <button
                  type="button"
                  onClick={() => setShowDrCertificateModal(false)}
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
