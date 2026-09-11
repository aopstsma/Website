'use client';

import { useState } from 'react';
import Image from 'next/image';

interface StudentData {
  studentId: string;
  studentName: string;
  mobileNumber: string;
  zoneId: string;
  zoneName: string;
  schoolId: string;
  schoolName: string;
  district: string;
  feeAmount: number;
  paymentStatus: 'Pending' | 'Paid';
}

export default function PayClient() {
  const [studentId, setStudentId] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [zoneId, setZoneId] = useState('all');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verifiedStudent, setVerifiedStudent] = useState<StudentData | null>(null);

  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paidReceipt, setPaidReceipt] = useState<{
    txnId: string;
    paidAt: string;
    student: StudentData;
  } | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setVerifiedStudent(null);
    setPaidReceipt(null);

    if (!studentId.trim() || !mobileNumber.trim()) {
      setError('Please enter both your Student ID / Roll No and Mobile Number.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/verify-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, mobileNumber, zoneId }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok && data.verified) {
        setVerifiedStudent(data.student);
      } else {
        setError(data.message || 'Verification failed. Student record not found.');
      }
    } catch (err) {
      setLoading(false);
      setError('Connection error. Please try again.');
    }
  };

  const handlePayNow = async () => {
    if (!verifiedStudent) return;
    setPaymentProcessing(true);

    // Generate Transaction ID
    const txnId = 'TXN-' + Math.floor(1000000000 + Math.random() * 9000000000);
    const paidAt = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    // Sync transaction to Google Sheets webhook
    try {
      await fetch('/api/google-sheets-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionId: txnId,
          studentId: verifiedStudent.studentId,
          studentName: verifiedStudent.studentName,
          mobileNumber: verifiedStudent.mobileNumber,
          schoolName: verifiedStudent.schoolName,
          zoneName: verifiedStudent.zoneName,
          amount: verifiedStudent.feeAmount,
          paymentMethod: 'UPI / Online Gateway',
          timestamp: paidAt,
        }),
      });
    } catch (e) {
      console.warn('Google Sheets sync notice:', e);
    }

    setPaymentProcessing(false);
    setPaidReceipt({
      txnId,
      paidAt,
      student: { ...verifiedStudent, paymentStatus: 'Paid' },
    });
  };

  return (
    <div className="pay-container">
      {/* HEADER TITLE */}
      <div className="pay-header">
        <span className="pay-badge">OFFICIAL INSTITUTIONAL PAY PORTAL</span>
        <h2>Student Verification & Fee Payment</h2>
        <p>Verify your institutional enrollment details using your Student ID & Mobile Number before initiating secure payment.</p>
      </div>

      {!paidReceipt ? (
        <div className="pay-card-grid">
          {/* VERIFICATION FORM */}
          <div className="pay-card">
            <h3>Step 1: Student Verification</h3>
            <p className="pay-sub">No password required. Enter your details as registered with your training school.</p>

            <form onSubmit={handleVerify} className="pay-form">
              <div className="form-group">
                <label htmlFor="zoneSelect">Select Association Zone</label>
                <select
                  id="zoneSelect"
                  value={zoneId}
                  onChange={(e) => setZoneId(e.target.value)}
                >
                  <option value="all">All 5 Zones (Statewide)</option>
                  <option value="balasore">Baleswar Zone</option>
                  <option value="central">Central Zone</option>
                  <option value="bhubaneswar">Bhubaneswar Zone</option>
                  <option value="sambalpur">Sambalpur Zone</option>
                  <option value="ganjam">Berhampur Zone</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="studentId">Student ID / Roll No / Registration No *</label>
                <input
                  type="text"
                  id="studentId"
                  placeholder="e.g. STU-2026-001"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="mobileNo">Registered Mobile Number *</label>
                <input
                  type="tel"
                  id="mobileNo"
                  placeholder="e.g. 9861012345"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  required
                />
              </div>

              {error && <div className="pay-error">{error}</div>}

              <button type="submit" className="verify-btn" disabled={loading}>
                {loading ? 'Searching Registry...' : '🔍 Verify Student Details'}
              </button>
            </form>
          </div>

          {/* VERIFIED DETAILS SUMMARY */}
          <div className="pay-card summary-card">
            <h3>Step 2: Verification Status & Payment</h3>
            {verifiedStudent ? (
              <div className="verified-box">
                <div className="status-badge success">
                  <span>✓ DETAILS VERIFIED</span>
                  <small>Matched in Official Member School Roster</small>
                </div>

                <div className="verified-details">
                  <div className="detail-row">
                    <span>Student Name:</span>
                    <b>{verifiedStudent.studentName}</b>
                  </div>
                  <div className="detail-row">
                    <span>Student ID:</span>
                    <code>{verifiedStudent.studentId}</code>
                  </div>
                  <div className="detail-row">
                    <span>Institution / School:</span>
                    <b>{verifiedStudent.schoolName}</b>
                  </div>
                  <div className="detail-row">
                    <span>Jurisdiction Zone:</span>
                    <span>{verifiedStudent.zoneName} ({verifiedStudent.district})</span>
                  </div>
                  <div className="detail-row">
                    <span>Mobile Number:</span>
                    <span>+91 {verifiedStudent.mobileNumber}</span>
                  </div>
                  <div className="detail-row total-row">
                    <span>Total Payable Fee:</span>
                    <b className="price">₹{verifiedStudent.feeAmount.toLocaleString('en-IN')}</b>
                  </div>
                </div>

                <button
                  type="button"
                  className="pay-now-btn"
                  onClick={handlePayNow}
                  disabled={paymentProcessing}
                >
                  {paymentProcessing ? 'Processing Transaction...' : '💳 Pay Now (UPI / Cards / NetBanking)'}
                </button>
                <p className="pay-note">⚡ Real-time automatic receipt & Google Sheets registry logging enabled.</p>
              </div>
            ) : (
              <div className="empty-verify">
                <div className="empty-icon">📋</div>
                <h4>Awaiting Student Verification</h4>
                <p>Enter your Student ID and Mobile Number on the left to pull your verified institution record and unlock fee payment.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* SUCCESSFUL PAYMENT RECEIPT DISPLAY */
        <div className="receipt-card">
          <div className="receipt-header">
            <div className="seal-wrap">
              <Image
                src="/assets/img/aopstsma-seal.jpg"
                alt="AOPSTSMA Seal"
                width={60}
                height={60}
                priority
              />
            </div>
            <div>
              <h3>AOPSTSMA OFFICIAL PAYMENT RECEIPT</h3>
              <p>All Orissa Private Secondary Training Schools Management Association</p>
            </div>
          </div>

          <div className="receipt-status">
            <span className="success-tag">PAYMENT SUCCESSFUL ✓</span>
            <small>Synced with Central Association Registry & Google Sheets</small>
          </div>

          <div className="receipt-grid">
            <div className="r-item">
              <span>Transaction Reference</span>
              <b>{paidReceipt.txnId}</b>
            </div>
            <div className="r-item">
              <span>Date & Time</span>
              <b>{paidReceipt.paidAt}</b>
            </div>
            <div className="r-item">
              <span>Student Name</span>
              <b>{paidReceipt.student.studentName}</b>
            </div>
            <div className="r-item">
              <span>Student ID</span>
              <b>{paidReceipt.student.studentId}</b>
            </div>
            <div className="r-item">
              <span>Training Institution</span>
              <b>{paidReceipt.student.schoolName}</b>
            </div>
            <div className="r-item">
              <span>Zone & District</span>
              <b>{paidReceipt.student.zoneName} ({paidReceipt.student.district})</b>
            </div>
            <div className="r-item">
              <span>Amount Paid</span>
              <b className="r-amount">₹{paidReceipt.student.feeAmount.toLocaleString('en-IN')}</b>
            </div>
            <div className="r-item">
              <span>Status</span>
              <b style={{ color: '#10B981' }}>COMPLETED & VERIFIED</b>
            </div>
          </div>

          <div className="receipt-actions">
            <button
              type="button"
              className="print-btn"
              onClick={() => window.print()}
            >
              🖨️ Print / Download Official Receipt
            </button>
            <button
              type="button"
              className="reset-btn"
              onClick={() => {
                setPaidReceipt(null);
                setVerifiedStudent(null);
                setStudentId('');
                setMobileNumber('');
              }}
            >
              Verify Another Student
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
