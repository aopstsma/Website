'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ZONES, SCHOOLS } from '@/lib/data/schools';

type LoginTab = 'dr_otp' | 'credentials';

export default function SchoolLoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<LoginTab>('dr_otp');

  // DR OTP Form State
  const [selectedZone, setSelectedZone] = useState<string>('bhubaneswar');
  const [selectedSchool, setSelectedSchool] = useState<string>('Rajadhani School Of Education');
  const [authorityName, setAuthorityName] = useState<string>('');
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [scannedFileName, setScannedFileName] = useState<string | null>(null);
  const [otpStep, setOtpStep] = useState<'details' | 'verify'>('details');
  const [otpCode, setOtpCode] = useState<string>('');
  const [demoOtpHint, setDemoOtpHint] = useState<string | null>(null);

  // Legacy Credential State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Common State
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Schools for current selected zone
  const zoneSchools = useMemo(() => {
    return SCHOOLS.filter((s) => s.zone === selectedZone);
  }, [selectedZone]);

  // Handle Zone Change
  const handleZoneChange = (zoneId: string) => {
    setSelectedZone(zoneId);
    const firstSchool = SCHOOLS.find((s) => s.zone === zoneId);
    if (firstSchool) {
      setSelectedSchool(firstSchool.name);
    }
  };

  // Handle File Scan Selection
  const handleScanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setScannedFileName(e.target.files[0].name);
    }
  };

  // Step 1: Send OTP for DR Authentication
  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const cleanMobile = mobileNumber.replace(/\D/g, '').slice(-10);
    if (cleanMobile.length !== 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!authorityName.trim()) {
      setError('Please specify the Secretary or Authorized Officer name.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobile: cleanMobile,
          schoolName: selectedSchool,
          authorityName: authorityName.trim(),
          zone: selectedZone,
          role: 'school',
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success) {
        setOtpStep('verify');
        setSuccessMsg(data.message || 'OTP dispatched to registered mobile number.');
      } else {
        setError(data.error || 'Failed to send OTP. Please try again.');
      }
    } catch (err: unknown) {
      setLoading(false);
      const msg = err instanceof Error ? err.message : 'Network error. Please try again.';
      setError(msg);
    }
  };

  // Step 2: Verify OTP and Perform DR Load
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (otpCode.trim().length !== 6) {
      setError('Please enter the 6-digit OTP code.');
      return;
    }

    setLoading(true);

    try {
      const cleanMobile = mobileNumber.replace(/\D/g, '').slice(-10);
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobile: cleanMobile,
          otp: otpCode.trim(),
          schoolName: selectedSchool,
          authorityName: authorityName.trim(),
          zone: selectedZone,
          role: 'school',
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success) {
        setSuccessMsg('✓ DR Authentication Verified! Loading Descriptive Roll...');
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('school_user', selectedSchool);
          sessionStorage.setItem('school_name', selectedSchool);
          sessionStorage.setItem('school_zone', selectedZone);
          sessionStorage.setItem('school_authority', authorityName);
          sessionStorage.setItem('school_mobile', cleanMobile);
          sessionStorage.setItem('school_scan', scannedFileName || 'Verified Authority ID');
        }
        setTimeout(() => {
          router.push('/school-dashboard');
        }, 800);
      } else {
        setError(data.error || 'Invalid OTP code. Please retry.');
      }
    } catch (err: unknown) {
      setLoading(false);
      const msg = err instanceof Error ? err.message : 'Network error';
      setError(msg);
    }
  };

  // Legacy Credential Login Handler
  const handleCredentialLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (
      (username === 'rajadhani.bbs' || username === 'nobel.bbs' || username === 'admin') &&
      password === 'aopstsma1980'
    ) {
      setTimeout(() => {
        setLoading(false);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('school_user', username);
          sessionStorage.setItem('school_name', 'Rajadhani School Of Education');
          sessionStorage.setItem('school_zone', 'bhubaneswar');
        }
        router.push('/school-dashboard');
      }, 600);
    } else {
      setTimeout(() => {
        setLoading(false);
        setError('Invalid credentials. Please verify your username and password.');
      }, 600);
    }
  };

  return (
    <div className="section" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="wrap" style={{ maxWidth: '540px', width: '100%' }}>
        <div className="pay-card" style={{ padding: '2.5rem 2rem' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
              <Image
                src="/assets/img/aopstsma-seal.jpg"
                alt="AOPSTSMA Emblem"
                width={70}
                height={70}
                priority
                style={{ borderRadius: '50%', border: '2px solid #D97706' }}
              />
            </div>
            <span className="pay-badge">MEMBER INSTITUTION PORTAL</span>
            <h2 style={{ fontSize: '1.6rem', marginTop: '0.5rem', color: '#0F172A' }}>
              Updated DR &amp; School Login
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#64748B', marginTop: '0.35rem' }}>
              Secure Descriptive Roll (DR) verification &amp; institutional student roster submission.
            </p>
          </div>

          {/* Mode Tabs */}
          <div
            style={{
              display: 'flex',
              backgroundColor: '#F1F5F9',
              borderRadius: '8px',
              padding: '0.3rem',
              marginBottom: '1.5rem',
            }}
          >
            <button
              type="button"
              onClick={() => {
                setActiveTab('dr_otp');
                setError(null);
              }}
              style={{
                flex: 1,
                padding: '0.6rem',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                backgroundColor: activeTab === 'dr_otp' ? '#0B2545' : 'transparent',
                color: activeTab === 'dr_otp' ? '#FFFFFF' : '#475569',
                transition: 'all 0.2s ease',
              }}
            >
              📱 DR OTP Format (Official)
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('credentials');
                setError(null);
              }}
              style={{
                flex: 1,
                padding: '0.6rem',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                backgroundColor: activeTab === 'credentials' ? '#0B2545' : 'transparent',
                color: activeTab === 'credentials' ? '#FFFFFF' : '#475569',
                transition: 'all 0.2s ease',
              }}
            >
              🔑 Password Login
            </button>
          </div>

          {error && <div className="pay-error" style={{ marginBottom: '1.25rem' }}>{error}</div>}
          {successMsg && (
            <div
              style={{
                backgroundColor: '#ECFDF5',
                border: '1px solid #10B981',
                color: '#065F46',
                padding: '0.75rem 1rem',
                borderRadius: '6px',
                fontSize: '0.88rem',
                marginBottom: '1.25rem',
              }}
            >
              {successMsg}
            </div>
          )}

          {/* ============ TAB 1: UPDATED DR OTP WORKFLOW ============ */}
          {activeTab === 'dr_otp' && (
            <>
              {otpStep === 'details' ? (
                <form onSubmit={handleRequestOTP} className="pay-form">
                  {/* Zone Selector */}
                  <div className="form-group">
                    <label htmlFor="zoneSelect">1. Educational Zone *</label>
                    <select
                      id="zoneSelect"
                      value={selectedZone}
                      onChange={(e) => handleZoneChange(e.target.value)}
                      required
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}
                    >
                      {ZONES.map((z) => (
                        <option key={z.id} value={z.id}>
                          {z.name} ({z.schoolCount} Schools)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* School Selector */}
                  <div className="form-group">
                    <label htmlFor="schoolSelect">2. Secondary Training School Name *</label>
                    <select
                      id="schoolSelect"
                      value={selectedSchool}
                      onChange={(e) => setSelectedSchool(e.target.value)}
                      required
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}
                    >
                      {zoneSchools.map((s, idx) => (
                        <option key={idx} value={s.name}>
                          {s.slNo ? `${s.slNo}. ` : ''}{s.name} ({s.district})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Secretary / Authority Name */}
                  <div className="form-group">
                    <label htmlFor="authorityName">3. Secretary / Authorized Person Name *</label>
                    <input
                      type="text"
                      id="authorityName"
                      placeholder="e.g. Raj Kishore Jena / Headmaster"
                      value={authorityName}
                      onChange={(e) => setAuthorityName(e.target.value)}
                      required
                    />
                  </div>

                  {/* Mobile Number */}
                  <div className="form-group">
                    <label htmlFor="mobile">4. Contact / Mobile Number (for OTP) *</label>
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
                        id="mobile"
                        placeholder="10-digit mobile number"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        maxLength={10}
                        required
                        style={{ flex: 1 }}
                      />
                    </div>
                  </div>

                  {/* Scan Section */}
                  <div className="form-group">
                    <label htmlFor="scanFile">5. Scan Section (Affiliation / ID Card Document)</label>
                    <input
                      type="file"
                      id="scanFile"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleScanChange}
                      style={{ fontSize: '0.85rem' }}
                    />
                    <small style={{ color: '#64748B', display: 'block', marginTop: '0.25rem' }}>
                      {scannedFileName ? `Selected: ${scannedFileName}` : 'Optional: Upload institutional authorization document or scan copy.'}
                    </small>
                  </div>

                  <button type="submit" className="verify-btn" disabled={loading}>
                    {loading ? 'Generating OTP...' : '📲 Generate OTP & Proceed'}
                  </button>
                </form>
              ) : (
                /* Step 2: OTP Verification & DR Load */
                <form onSubmit={handleVerifyOTP} className="pay-form">
                  <div
                    style={{
                      backgroundColor: '#F8FAFC',
                      padding: '1rem',
                      borderRadius: '8px',
                      border: '1px solid #E2E8F0',
                      marginBottom: '1.25rem',
                    }}
                  >
                    <div style={{ fontSize: '0.85rem', color: '#475569' }}>
                      <strong>Institution:</strong> {selectedSchool}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '0.2rem' }}>
                      <strong>Authorized Person:</strong> {authorityName}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '0.2rem' }}>
                      <strong>Dispatched To:</strong> +91-{mobileNumber}
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="otp">Enter 6-Digit Verification OTP *</label>
                    <input
                      type="text"
                      id="otp"
                      placeholder="• • • • • •"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
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
                    {loading ? 'Verifying...' : '📥 DR Load (Submit & Open Dashboard)'}
                  </button>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                    <button
                      type="button"
                      onClick={() => setOtpStep('details')}
                      style={{ background: 'none', border: 'none', color: '#64748B', fontSize: '0.85rem', cursor: 'pointer' }}
                    >
                      &larr; Change Details
                    </button>
                    <button
                      type="button"
                      onClick={handleRequestOTP}
                      style={{ background: 'none', border: 'none', color: '#2563EB', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 }}
                    >
                      🔄 Resend OTP
                    </button>
                  </div>
                </form>
              )}
            </>
          )}

          {/* ============ TAB 2: LEGACY CREDENTIALS ============ */}
          {activeTab === 'credentials' && (
            <form onSubmit={handleCredentialLogin} className="pay-form">
              <div className="form-group">
                <label htmlFor="username">School Username / ID *</label>
                <input
                  type="text"
                  id="username"
                  placeholder="e.g. rajadhani.bbs"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password *</label>
                <input
                  type="password"
                  id="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="verify-btn" disabled={loading}>
                {loading ? 'Authenticating...' : '🔓 Sign In to School Portal'}
              </button>
            </form>
          )}

          <div
            style={{
              marginTop: '1.5rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid #E2E8F0',
              fontSize: '0.82rem',
              color: '#64748B',
              textAlign: 'center',
            }}
          >
            <strong>Need helpline or DR assistance?</strong>
            <br />
            Central Secretariat Legal Cell:{' '}
            <a href="tel:+916370987576" style={{ color: '#D97706', fontWeight: 600 }}>
              +91 63709 87576
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
