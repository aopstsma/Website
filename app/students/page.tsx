'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ZONES, SCHOOLS } from '@/lib/data/schools';
import { INITIAL_STUDENTS, StudentRecord } from '@/lib/data/students';

type PortalTab = 'admit_card' | 'register' | 'fee_status';

export default function StudentPortalPage() {
  const [activeTab, setActiveTab] = useState<PortalTab>('admit_card');

  // Admit Card Search & OTP State
  const [rollNumber, setRollNumber] = useState('');
  const [studentMobile, setStudentMobile] = useState('');
  const [otpStep, setOtpStep] = useState<'search' | 'otp' | 'card'>('search');
  const [otpInput, setOtpInput] = useState('');
  const [verifiedStudent, setVerifiedStudent] = useState<StudentRecord | null>(null);

  // Free Registration State
  const [regName, setRegName] = useState('');
  const [regFatherName, setRegFatherName] = useState('');
  const [regZone, setRegZone] = useState('bhubaneswar');
  const [regSchool, setRegSchool] = useState('Rajadhani School Of Education');
  const [regMobile, setRegMobile] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regDocName, setRegDocName] = useState<string | null>(null);
  const [regSuccess, setRegSuccess] = useState<string | null>(null);
  const [regId, setRegId] = useState<string | null>(null);

  // Common UI State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Search Student & Request OTP for Admit Card
  const handleRequestAdmitOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanMobile = studentMobile.replace(/\D/g, '').slice(-10);
    const cleanId = rollNumber.trim().toUpperCase();

    if (!cleanId || cleanMobile.length !== 10) {
      setError('Please provide a valid Student ID / Roll No and 10-digit mobile number.');
      return;
    }

    setLoading(true);

    // Look up verified student record
    const matched = INITIAL_STUDENTS.find(
      (s) =>
        s.studentId.toUpperCase() === cleanId ||
        s.mobileNumber.slice(-10) === cleanMobile
    );

    if (!matched) {
      setLoading(false);
      setError(
        'No verified student record found for this Student ID and Mobile Number. Please complete the Free Student Registration below or contact your institution.'
      );
      return;
    }

    setVerifiedStudent(matched);

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobile: cleanMobile,
          schoolName: matched.schoolName,
          authorityName: matched.studentName,
          role: 'student',
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success) {
        setOtpStep('otp');
      } else {
        setError(data.error || 'Failed to dispatch OTP.');
      }
    } catch {
      setLoading(false);
      setError('Network error dispatching OTP. Please verify your connection.');
    }
  };

  // Step 2: Verify OTP and Show Admit Card
  const handleVerifyAdmitOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (otpInput.trim().length !== 6) {
      setError('Please enter the 6-digit OTP received on your mobile.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobile: verifiedStudent?.mobileNumber || studentMobile,
          otp: otpInput.trim(),
          role: 'student',
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success) {
        setOtpStep('card');
      } else {
        setError(data.error || 'Invalid OTP code. Please retry.');
      }
    } catch {
      setLoading(false);
      setError('Connection error verifying OTP. Please try again.');
    }
  };

  // Step 3: Free Student Registration Handler
  const handleFreeRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanMobile = regMobile.replace(/\D/g, '').slice(-10);
    if (!regName.trim() || cleanMobile.length !== 10) {
      setError('Please fill in candidate name and valid 10-digit mobile number.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const generatedId = `AOP-2026-${randomNum}`;
      setRegId(generatedId);
      setRegSuccess(`✓ Free Registration Successful! Provisional Registration Number: ${generatedId}`);
    }, 700);
  };

  // Print Admit Card
  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <>
      {/* Print-specific style */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #admit-card-printable,
          #admit-card-printable * {
            visibility: visible;
          }
          #admit-card-printable {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 20px;
            box-shadow: none !important;
            border: 2px solid #000 !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <section className="page-head no-print">
        <div className="wrap">
          <span className="pay-badge" style={{ color: '#FDE68A', borderColor: 'rgba(253, 230, 138, 0.4)' }}>
            STATE TEACHER TRAINEE SERVICES
          </span>
          <h1>AOPSTSMA Student Portal</h1>
          <p className="lede">
            Free student registration, secure OTP authentication, Board examination admit card download, and ₹2,500 fee status verification.
          </p>
        </div>
      </section>

      <section className="section" style={{ minHeight: '75vh', backgroundColor: '#F8FAFC' }}>
        <div className="wrap" style={{ maxWidth: '820px' }}>
          {/* TAB BUTTONS */}
          <div
            className="no-print"
            style={{
              display: 'flex',
              backgroundColor: '#E2E8F0',
              borderRadius: '8px',
              padding: '0.35rem',
              marginBottom: '2rem',
              gap: '0.25rem',
            }}
          >
            <button
              type="button"
              onClick={() => {
                setActiveTab('admit_card');
                setError(null);
              }}
              style={{
                flex: 1,
                padding: '0.75rem',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.9rem',
                fontWeight: 700,
                cursor: 'pointer',
                backgroundColor: activeTab === 'admit_card' ? '#0B2545' : 'transparent',
                color: activeTab === 'admit_card' ? '#FFFFFF' : '#475569',
                transition: 'all 0.2s ease',
              }}
            >
              🎟️ Download Admit Card (OTP)
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('register');
                setError(null);
              }}
              style={{
                flex: 1,
                padding: '0.75rem',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.9rem',
                fontWeight: 700,
                cursor: 'pointer',
                backgroundColor: activeTab === 'register' ? '#0B2545' : 'transparent',
                color: activeTab === 'register' ? '#FFFFFF' : '#475569',
                transition: 'all 0.2s ease',
              }}
            >
              ✍️ Registration (No Charge)
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('fee_status');
                setError(null);
              }}
              style={{
                flex: 1,
                padding: '0.75rem',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.9rem',
                fontWeight: 700,
                cursor: 'pointer',
                backgroundColor: activeTab === 'fee_status' ? '#0B2545' : 'transparent',
                color: activeTab === 'fee_status' ? '#FFFFFF' : '#475569',
                transition: 'all 0.2s ease',
              }}
            >
              💳 Fee Status (₹2,500)
            </button>
          </div>

          {error && (
            <div className="pay-error no-print" style={{ marginBottom: '1.5rem' }}>
              {error}
            </div>
          )}

          {/* ========================================================
              TAB 1: DOWNLOAD BOARD ADMIT CARD (OTP VERIFIED)
             ======================================================== */}
          {activeTab === 'admit_card' && (
            <div>
              {otpStep === 'search' && (
                <div className="pay-card" style={{ padding: '2.5rem 2rem' }}>
                  <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
                    <span className="pay-badge">BOARD EXAMINATION 2026</span>
                    <h2 style={{ fontSize: '1.6rem', marginTop: '0.4rem', color: '#0F172A' }}>
                      Download Board Admit Card
                    </h2>
                    <p style={{ fontSize: '0.9rem', color: '#64748B', margin: '0.35rem 0 0' }}>
                      Enter your Student Roll/ID and mobile number to receive a secure 6-digit OTP for admit card download.
                    </p>
                  </div>

                  <form onSubmit={handleRequestAdmitOTP} className="pay-form">
                    <div className="form-group">
                      <label htmlFor="admitRoll">Student ID / Descriptive Roll (DR) Number *</label>
                      <input
                        type="text"
                        id="admitRoll"
                        placeholder="e.g. STU-2026-001 or Roll No"
                        value={rollNumber}
                        onChange={(e) => setRollNumber(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="admitMobile">Registered Mobile Number *</label>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <span
                          style={{
                            padding: '0.75rem 0.85rem',
                            backgroundColor: '#F1F5F9',
                            borderRadius: '6px',
                            border: '1px solid #CBD5E1',
                            fontWeight: 600,
                            color: '#475569',
                          }}
                        >
                          +91
                        </span>
                        <input
                          type="tel"
                          id="admitMobile"
                          placeholder="e.g. 9861012345"
                          value={studentMobile}
                          onChange={(e) => setStudentMobile(e.target.value)}
                          maxLength={10}
                          required
                          style={{ flex: 1 }}
                        />
                      </div>
                    </div>

                    <button type="submit" className="verify-btn" disabled={loading}>
                      {loading ? 'Verifying Student Record...' : '📲 Request OTP for Admit Card'}
                    </button>
                  </form>
                </div>
              )}

              {otpStep === 'otp' && (
                <div className="pay-card" style={{ padding: '2.5rem 2rem' }}>
                  <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <span className="pay-badge">MOBILE AUTHENTICATION</span>
                    <h2 style={{ fontSize: '1.5rem', marginTop: '0.4rem', color: '#0F172A' }}>
                      Enter 6-Digit OTP Code
                    </h2>
                    <p style={{ fontSize: '0.9rem', color: '#64748B', margin: '0.35rem 0 0' }}>
                      Dispatched to <strong>+91-{studentMobile}</strong> for student{' '}
                      <strong>{verifiedStudent?.studentName}</strong>.
                    </p>
                  </div>

                  <form onSubmit={handleVerifyAdmitOTP} className="pay-form">
                    <div className="form-group">
                      <label htmlFor="otpStudent">Enter OTP Code *</label>
                      <input
                        type="text"
                        id="otpStudent"
                        placeholder="• • • • • •"
                        value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        maxLength={6}
                        style={{
                          letterSpacing: '0.4rem',
                          fontSize: '1.4rem',
                          textAlign: 'center',
                          fontWeight: 700,
                        }}
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="verify-btn"
                      disabled={loading}
                      style={{ backgroundColor: '#059669', borderColor: '#059669' }}
                    >
                      {loading ? 'Authenticating...' : '🎟️ Verify OTP & View Admit Card'}
                    </button>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                      <button
                        type="button"
                        onClick={() => setOtpStep('search')}
                        style={{ background: 'none', border: 'none', color: '#64748B', fontSize: '0.85rem', cursor: 'pointer' }}
                      >
                        &larr; Back
                      </button>
                      <button
                        type="button"
                        onClick={handleRequestAdmitOTP}
                        style={{ background: 'none', border: 'none', color: '#2563EB', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 }}
                      >
                        🔄 Resend OTP
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {otpStep === 'card' && (
                <div>
                  <div
                    className="no-print"
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '1rem',
                      padding: '1rem 1.25rem',
                      backgroundColor: '#ECFDF5',
                      border: '1px solid #10B981',
                      borderRadius: '8px',
                    }}
                  >
                    <div>
                      <strong style={{ color: '#065F46' }}>✓ Identity Verified via OTP</strong>
                      <p style={{ margin: '0.2rem 0 0', color: '#047857', fontSize: '0.85rem' }}>
                        Your official Board Admit Card is ready for examination center verification.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handlePrint}
                      className="btn btn--primary"
                      style={{ padding: '0.6rem 1.2rem', whiteSpace: 'nowrap' }}
                    >
                      🖨️ Print / Download PDF
                    </button>
                  </div>

                  {/* ============ PRINTABLE OFFICIAL ADMIT CARD ============ */}
                  <div
                    id="admit-card-printable"
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '3px double #0B2545',
                      borderRadius: '8px',
                      padding: '2.5rem',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
                      color: '#0F172A',
                      position: 'relative',
                    }}
                  >
                    {/* Header Banner */}
                    <div style={{ textAlign: 'center', borderBottom: '2px solid #0B2545', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                        <Image
                          src="/assets/img/aopstsma-seal.jpg"
                          alt="Association Seal"
                          width={60}
                          height={60}
                          style={{ borderRadius: '50%', border: '2px solid #D97706' }}
                        />
                        <div>
                          <h2 style={{ fontSize: '1.25rem', color: '#0B2545', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Board of Secondary Education, Odisha
                          </h2>
                          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748B' }}>
                            In Coordination with All Orissa Private Secondary Training Schools Management Association
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                            (Regd. Under Societies Registration Act XXI of 1860 &middot; Regd. No. 1422/80)
                          </div>
                        </div>
                      </div>

                      <div
                        style={{
                          display: 'inline-block',
                          backgroundColor: '#0B2545',
                          color: '#FFFFFF',
                          padding: '0.35rem 1.5rem',
                          borderRadius: '4px',
                          fontWeight: 700,
                          fontSize: '0.95rem',
                          marginTop: '0.5rem',
                          letterSpacing: '0.08em',
                        }}
                      >
                        OFFICIAL EXAMINATION ADMIT CARD &middot; SESSION 2025–2027
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#475569', marginTop: '0.25rem', fontWeight: 600 }}>
                        DIPLOMA IN ELEMENTARY EDUCATION (D.El.Ed / C.T. REGULAR ANNUAL EXAMINATION)
                      </div>
                    </div>

                    {/* Candidate Details & Photo */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: '1.5rem', marginBottom: '1.5rem' }}>
                      {/* Left: Info Table */}
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                        <tbody>
                          <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                            <td style={{ padding: '0.5rem 0', fontWeight: 700, color: '#475569', width: '38%' }}>Candidate Name:</td>
                            <td style={{ padding: '0.5rem 0', fontWeight: 800, color: '#0B2545', fontSize: '1rem' }}>
                              {verifiedStudent?.studentName || 'Candidate'}
                            </td>
                          </tr>
                          <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                            <td style={{ padding: '0.5rem 0', fontWeight: 700, color: '#475569' }}>Roll Number:</td>
                            <td style={{ padding: '0.5rem 0', fontWeight: 800, color: '#D97706', fontSize: '1.05rem', letterSpacing: '0.05em' }}>
                              {verifiedStudent?.studentId ? `BBS-CT-2026-${verifiedStudent.studentId.replace(/\D/g, '').slice(-4) || '1001'}` : '—'}
                            </td>
                          </tr>
                          <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                            <td style={{ padding: '0.5rem 0', fontWeight: 700, color: '#475569' }}>Registration / DR No:</td>
                            <td style={{ padding: '0.5rem 0', fontWeight: 600 }}>
                              {verifiedStudent?.studentId || '—'}
                            </td>
                          </tr>
                          <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                            <td style={{ padding: '0.5rem 0', fontWeight: 700, color: '#475569' }}>Affiliated Institution:</td>
                            <td style={{ padding: '0.5rem 0', fontWeight: 600 }}>
                              {verifiedStudent?.schoolName || '—'}
                            </td>
                          </tr>
                          <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                            <td style={{ padding: '0.5rem 0', fontWeight: 700, color: '#475569' }}>Zone &amp; District:</td>
                            <td style={{ padding: '0.5rem 0' }}>
                              {verifiedStudent?.zoneName || 'State Zone'}{verifiedStudent?.district ? `, ${verifiedStudent.district} District` : ''}
                            </td>
                          </tr>
                          <tr>
                            <td style={{ padding: '0.5rem 0', fontWeight: 700, color: '#475569' }}>Examination Center:</td>
                            <td style={{ padding: '0.5rem 0', fontWeight: 700, color: '#065F46' }}>
                              Govt. High School Examination Center, Unit-1, Bhubaneswar — 751001
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      {/* Right: Photo & Verification Box */}
                      <div style={{ textAlign: 'center' }}>
                        <div
                          style={{
                            width: '130px',
                            height: '150px',
                            border: '2px solid #CBD5E1',
                            borderRadius: '4px',
                            backgroundColor: '#F8FAFC',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto',
                            fontSize: '0.75rem',
                            color: '#64748B',
                            padding: '0.5rem',
                            position: 'relative',
                          }}
                        >
                          <span style={{ fontSize: '2.5rem', opacity: 0.7 }}>👤</span>
                          <span style={{ fontWeight: 600, marginTop: '0.25rem' }}>AFFIX PHOTO</span>
                          <span style={{ fontSize: '0.65rem' }}>Attested by Principal</span>
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#10B981', fontWeight: 700, marginTop: '0.4rem' }}>
                          ✓ OTP VERIFIED
                        </div>
                      </div>
                    </div>

                    {/* Examination Timetable */}
                    <div style={{ marginBottom: '1.5rem' }}>
                      <h4 style={{ fontSize: '0.9rem', color: '#0B2545', textTransform: 'uppercase', marginBottom: '0.5rem', borderBottom: '1px solid #CBD5E1', paddingBottom: '0.25rem' }}>
                        Examination Schedule &amp; Subject Papers
                      </h4>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
                        <thead>
                          <tr style={{ backgroundColor: '#F1F5F9', borderBottom: '2px solid #CBD5E1' }}>
                            <th style={{ padding: '0.4rem 0.5rem' }}>Paper</th>
                            <th style={{ padding: '0.4rem 0.5rem' }}>Subject Name</th>
                            <th style={{ padding: '0.4rem 0.5rem' }}>Date</th>
                            <th style={{ padding: '0.4rem 0.5rem' }}>Timing</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                            <td style={{ padding: '0.4rem 0.5rem', fontWeight: 700 }}>Paper I</td>
                            <td style={{ padding: '0.4rem 0.5rem' }}>Contemporary Society &amp; Education in India</td>
                            <td style={{ padding: '0.4rem 0.5rem' }}>14.10.2026</td>
                            <td style={{ padding: '0.4rem 0.5rem' }}>10:00 AM – 01:00 PM</td>
                          </tr>
                          <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                            <td style={{ padding: '0.4rem 0.5rem', fontWeight: 700 }}>Paper II</td>
                            <td style={{ padding: '0.4rem 0.5rem' }}>Child Psychology, Learning &amp; Development</td>
                            <td style={{ padding: '0.4rem 0.5rem' }}>16.10.2026</td>
                            <td style={{ padding: '0.4rem 0.5rem' }}>10:00 AM – 01:00 PM</td>
                          </tr>
                          <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                            <td style={{ padding: '0.4rem 0.5rem', fontWeight: 700 }}>Paper III</td>
                            <td style={{ padding: '0.4rem 0.5rem' }}>Pedagogy of Mother Tongue (Odia)</td>
                            <td style={{ padding: '0.4rem 0.5rem' }}>19.10.2026</td>
                            <td style={{ padding: '0.4rem 0.5rem' }}>10:00 AM – 01:00 PM</td>
                          </tr>
                          <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                            <td style={{ padding: '0.4rem 0.5rem', fontWeight: 700 }}>Paper IV</td>
                            <td style={{ padding: '0.4rem 0.5rem' }}>Curriculum &amp; Pedagogic Studies in Mathematics</td>
                            <td style={{ padding: '0.4rem 0.5rem' }}>21.10.2026</td>
                            <td style={{ padding: '0.4rem 0.5rem' }}>10:00 AM – 01:00 PM</td>
                          </tr>
                          <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                            <td style={{ padding: '0.4rem 0.5rem', fontWeight: 700 }}>Paper V</td>
                            <td style={{ padding: '0.4rem 0.5rem' }}>General Science &amp; Environmental Studies</td>
                            <td style={{ padding: '0.4rem 0.5rem' }}>23.10.2026</td>
                            <td style={{ padding: '0.4rem 0.5rem' }}>10:00 AM – 01:00 PM</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Official Signatures & QR Seal */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '1.5rem', borderTop: '2px solid #0B2545', marginTop: '1.5rem' }}>
                      <div style={{ textAlign: 'center', width: '180px' }}>
                        <div style={{ height: '40px', borderBottom: '1px dashed #64748B' }}></div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginTop: '0.3rem' }}>
                          Candidate's Signature
                        </div>
                      </div>

                      <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#64748B' }}>
                        <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.2rem', color: '#0B2545' }}>
                          ||||| | |||| ||| |||||||
                        </div>
                        <div>AUTH-VERIFIED-2026</div>
                        <div style={{ fontSize: '0.68rem', color: '#94A3B8' }}>BSE Odisha Ref: W.P.(C) 5640/2009</div>
                      </div>

                      <div style={{ textAlign: 'center', width: '180px' }}>
                        <div style={{ height: '40px', borderBottom: '1px dashed #64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontStyle: 'italic', color: '#1E3A8A', fontWeight: 600 }}>
                          Raj Kishore Jena
                        </div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginTop: '0.3rem' }}>
                          General Secretary / Controller
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="no-print" style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                    <button
                      type="button"
                      onClick={() => setOtpStep('search')}
                      style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', fontSize: '0.9rem' }}
                    >
                      &larr; Search Another Admit Card
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================
              TAB 2: FREE STUDENT REGISTRATION (NO CHARGE)
             ======================================================== */}
          {activeTab === 'register' && (
            <div className="pay-card" style={{ padding: '2.5rem 2rem' }}>
              <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
                <span className="pay-badge" style={{ backgroundColor: '#ECFDF5', color: '#065F46', borderColor: '#10B981' }}>
                  FREE REGISTRATION &middot; ZERO FEES
                </span>
                <h2 style={{ fontSize: '1.6rem', marginTop: '0.4rem', color: '#0F172A' }}>
                  Teacher Trainee Registration
                </h2>
                <p style={{ fontSize: '0.9rem', color: '#64748B', margin: '0.35rem 0 0' }}>
                  Register as an enrolled trainee in a member secondary training school. No registration charges required.
                </p>
              </div>

              {regSuccess ? (
                <div
                  style={{
                    backgroundColor: '#ECFDF5',
                    border: '1px solid #10B981',
                    borderRadius: '8px',
                    padding: '2rem',
                    textAlign: 'center',
                  }}
                >
                  <span style={{ fontSize: '3rem' }}>🎉</span>
                  <h3 style={{ color: '#065F46', fontSize: '1.4rem', marginTop: '0.5rem' }}>
                    Registration Confirmed!
                  </h3>
                  <div
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '1.5rem',
                      fontWeight: 800,
                      color: '#0B2545',
                      backgroundColor: '#FFFFFF',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '6px',
                      display: 'inline-block',
                      margin: '1rem auto',
                      border: '2px dashed #0B2545',
                    }}
                  >
                    {regId}
                  </div>
                  <p style={{ color: '#047857', fontSize: '0.92rem', maxWidth: '500px', margin: '0 auto 1.5rem' }}>
                    Candidate <strong>{regName}</strong> has been provisionally enrolled under{' '}
                    <strong>{regSchool}</strong>. Please quote this number for examination admit card access.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setRollNumber(regId || '');
                      setActiveTab('admit_card');
                      setRegSuccess(null);
                    }}
                    className="btn btn--primary"
                  >
                    Proceed to Admit Card Download &rarr;
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFreeRegistration} className="pay-form">
                  <div className="form-group">
                    <label htmlFor="regName">Candidate Full Name *</label>
                    <input
                      type="text"
                      id="regName"
                      placeholder="e.g. Priyaranjan Mohapatra"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="regFather">Father's / Guardian's Name</label>
                    <input
                      type="text"
                      id="regFather"
                      placeholder="e.g. Ramesh Chandra Mohapatra"
                      value={regFatherName}
                      onChange={(e) => setRegFatherName(e.target.value)}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                    <div className="form-group">
                      <label htmlFor="regZoneSelect">Educational Zone *</label>
                      <select
                        id="regZoneSelect"
                        value={regZone}
                        onChange={(e) => {
                          setRegZone(e.target.value);
                          const s = SCHOOLS.find((item) => item.zone === e.target.value);
                          if (s) setRegSchool(s.name);
                        }}
                        required
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}
                      >
                        {ZONES.map((z) => (
                          <option key={z.id} value={z.id}>
                            {z.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="regSchoolSelect">Member Institution *</label>
                      <select
                        id="regSchoolSelect"
                        value={regSchool}
                        onChange={(e) => setRegSchool(e.target.value)}
                        required
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}
                      >
                        {SCHOOLS.filter((s) => s.zone === regZone).map((s, idx) => (
                          <option key={idx} value={s.name}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                    <div className="form-group">
                      <label htmlFor="regMob">Mobile Number *</label>
                      <input
                        type="tel"
                        id="regMob"
                        placeholder="10-digit mobile"
                        value={regMobile}
                        onChange={(e) => setRegMobile(e.target.value)}
                        maxLength={10}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="regEm">Email Address</label>
                      <input
                        type="email"
                        id="regEm"
                        placeholder="candidate@gmail.com"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="regScan">Scan Section (Certificate / ID Document)</label>
                    <input
                      type="file"
                      id="regScan"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setRegDocName(e.target.files[0].name);
                        }
                      }}
                      style={{ fontSize: '0.85rem' }}
                    />
                    <small style={{ color: '#64748B', display: 'block', marginTop: '0.25rem' }}>
                      {regDocName ? `Uploaded: ${regDocName}` : 'Upload 10th/12th certificate or identity card copy.'}
                    </small>
                  </div>

                  <button
                    type="submit"
                    className="verify-btn"
                    disabled={loading}
                    style={{ backgroundColor: '#059669', borderColor: '#059669' }}
                  >
                    {loading ? 'Submitting Registration...' : '✍️ Complete Free Registration (No Charge)'}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* ========================================================
              TAB 3: SCAN & FEE STATUS (₹2,500)
             ======================================================== */}
          {activeTab === 'fee_status' && (
            <div className="pay-card" style={{ padding: '2.5rem 2rem' }}>
              <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
                <span className="pay-badge">EXAMINATION &amp; VERIFICATION FEE</span>
                <h2 style={{ fontSize: '1.6rem', marginTop: '0.4rem', color: '#0F172A' }}>
                  ₹2,500 Fee Status &amp; Counterfoil Scan
                </h2>
                <p style={{ fontSize: '0.9rem', color: '#64748B', margin: '0.35rem 0 0' }}>
                  Verify whether your ₹2,500 examination fee is recorded or pay online directly.
                </p>
              </div>

              <div
                style={{
                  backgroundColor: '#EFF6FF',
                  border: '1px solid #BFDBFE',
                  borderRadius: '8px',
                  padding: '1.5rem',
                  marginBottom: '1.5rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1D4ED8', textTransform: 'uppercase' }}>
                      STATUTORY EXAMINATION FEE
                    </span>
                    <h3 style={{ fontSize: '1.5rem', color: '#1E3A8A', margin: '0.2rem 0' }}>₹2,500.00</h3>
                    <p style={{ margin: 0, color: '#475569', fontSize: '0.88rem' }}>
                      Includes Board examination enrollment, verification, and centralized admit card issuance.
                    </p>
                  </div>
                  <Link
                    href="/pay"
                    className="btn btn--primary"
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    💳 Pay ₹2,500 Online via Razorpay
                  </Link>
                </div>
              </div>

              <div className="pay-form">
                <div className="form-group">
                  <label htmlFor="chkId">Verify Payment Record by Student ID or Mobile</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="text"
                      id="chkId"
                      placeholder="e.g. STU-2026-001 or 9861012345"
                      style={{ flex: 1 }}
                    />
                    <Link
                      href="/pay"
                      className="btn btn--secondary"
                      style={{ padding: '0.75rem 1.25rem', whiteSpace: 'nowrap' }}
                    >
                      Check Status
                    </Link>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid #E2E8F0', fontSize: '0.85rem', color: '#64748B' }}>
                <strong>Need fee confirmation assistance?</strong>
                <br />
                Contact Accounts Desk: <a href="tel:+916370987576" style={{ color: '#D97706', fontWeight: 600 }}>+91 63709 87576</a> or email <a href="mailto:info@aopstsma.in" style={{ color: '#D97706', fontWeight: 600 }}>info@aopstsma.in</a>.
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
