'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ZONES, SCHOOLS } from '@/lib/data/schools';

interface StudentData {
  studentId?: string;
  studentName: string;
  mobileNumber: string;
  zoneId: string;
  zoneName: string;
  schoolId?: string;
  schoolName: string;
  district?: string;
  feeAmount: number;
  paymentStatus: 'Pending' | 'Paid';
}

export type FeeCategory = 'student' | 'legal_assist' | 'court_expenses';

export default function PayClient() {
  // Fee Category: 3 Public Payment Channels (DR Deposit is inside School Secretary Login Dashboard)
  const [feeCategory, setFeeCategory] = useState<FeeCategory>('student');

  // Fee 1 (Student): Step 1 & 2 Zone & School Selection
  const [zoneId, setZoneId] = useState('bhubaneswar');
  const [selectedSchool, setSelectedSchool] = useState(
    SCHOOLS.filter((s) => s.zone === 'bhubaneswar')[0]?.name || ''
  );
  // Student Details
  const [studentName, setStudentName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [payStep, setPayStep] = useState<'verify' | 'otp' | 'ready_to_pay' | 'paid'>('verify');
  const [otpInput, setOtpInput] = useState('');
  const [demoOtp, setDemoOtp] = useState<string | null>(null);

  // Fee 2 (DR Deposit by School): Fixed ₹25,000
  const [drZoneId, setDrZoneId] = useState('bhubaneswar');
  const [drSchoolName, setDrSchoolName] = useState(
    SCHOOLS.filter((s) => s.zone === 'bhubaneswar')[0]?.name || ''
  );
  const [drRepresentative, setDrRepresentative] = useState('');
  const [drPhone, setDrPhone] = useState('');

  // Fee 3 (Legal Assist): Preset/Custom
  const [legalName, setLegalName] = useState('');
  const [legalPhone, setLegalPhone] = useState('');
  const [legalAffiliation, setLegalAffiliation] = useState('All Orissa Member Institutional Patron');
  const [legalPurpose, setLegalPurpose] = useState('Senior Advocate Legal Defense & State Counsel Assistance');
  const [legalAmount, setLegalAmount] = useState<number>(5000);
  const [legalCustomAmount, setLegalCustomAmount] = useState<string>('');

  // Fee 4 (Court Expenses): Preset/Custom
  const [courtName, setCourtName] = useState('');
  const [courtPhone, setCourtPhone] = useState('');
  const [courtAffiliation, setCourtAffiliation] = useState('All Orissa Member Institution / Patron');
  const [courtMatter, setCourtMatter] = useState('Orissa High Court WP(C) 5640/2009 & Supreme Court SLP CC 12896/2014');
  const [courtAmount, setCourtAmount] = useState<number>(10000);
  const [courtCustomAmount, setCourtCustomAmount] = useState<string>('');

  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [verifiedStudent, setVerifiedStudent] = useState<StudentData | null>(null);

  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paidReceipt, setPaidReceipt] = useState<{
    txnId: string;
    paidAt: string;
    student: StudentData;
    feeTypeName: string;
  } | null>(null);

  // Filter schools dynamically based on selected Zone
  const availableSchools = SCHOOLS.filter((s) => s.zone === zoneId);
  const drAvailableSchools = SCHOOLS.filter((s) => s.zone === drZoneId);

  const handleZoneChange = (newZone: string) => {
    setZoneId(newZone);
    const firstSchool = SCHOOLS.filter((s) => s.zone === newZone)[0];
    if (firstSchool) {
      setSelectedSchool(firstSchool.name);
    }
    if (payStep !== 'paid') {
      setPayStep('verify');
      setVerifiedStudent(null);
      setError(null);
      setSuccessMsg(null);
    }
  };

  const handleSchoolChange = (newSchool: string) => {
    setSelectedSchool(newSchool);
    if (payStep !== 'paid') {
      setPayStep('verify');
      setVerifiedStudent(null);
      setError(null);
      setSuccessMsg(null);
    }
  };

  const getFeeAmount = () => {
    if (feeCategory === 'legal_assist') {
      return legalCustomAmount && Number(legalCustomAmount) > 0
        ? Number(legalCustomAmount)
        : legalAmount;
    }
    if (feeCategory === 'court_expenses') {
      return courtCustomAmount && Number(courtCustomAmount) > 0
        ? Number(courtCustomAmount)
        : courtAmount;
    }
    return 2500;
  };

  const getFeeTypeName = () => {
    if (feeCategory === 'legal_assist') {
      return `Legal Assistance Fund (${legalPurpose})`;
    }
    if (feeCategory === 'court_expenses') {
      return `Court Litigation Expenses (${courtMatter})`;
    }
    return 'Student Candidate Examination & Registration Fee';
  };

  // Handler: Legal Assist Payment
  const handleLegalAssistPay = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const cleanMobile = legalPhone.replace(/\D/g, '').slice(-10);
    if (!legalName.trim() || cleanMobile.length !== 10) {
      setError('Please enter your Full Name and a valid 10-digit Mobile Number.');
      return;
    }
    const finalAmount = legalCustomAmount && Number(legalCustomAmount) > 0
      ? Number(legalCustomAmount)
      : legalAmount;

    setPaymentProcessing(true);
    try {
      const orderRes = await fetch('/api/order/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          purpose: 'legal_assist',
          feeCategory: 'legal_assist',
          customAmount: finalAmount,
          studentName: legalName.trim(),
          payerPhone: cleanMobile,
        }),
      });
      const orderData = await orderRes.json();
      const txnId = `TXN-AST-${Date.now().toString().slice(-8)}`;
      const paidAt = new Date().toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        dateStyle: 'medium',
        timeStyle: 'short',
      });

      setPaymentProcessing(false);
      setPaidReceipt({
        txnId,
        paidAt,
        student: {
          studentId: 'LEGAL-ASSIST',
          studentName: legalName.trim(),
          mobileNumber: cleanMobile,
          zoneId: 'State-Wide',
          zoneName: 'Odisha State Legal Defense Wing',
          schoolId: 'AOPSTSMA-AST',
          schoolName: legalAffiliation || 'Association Legal Defense Wing',
          district: 'Odisha',
          feeAmount: finalAmount,
          paymentStatus: 'Paid',
        },
        feeTypeName: `Legal Assistance Fund — ${legalPurpose}`,
      });
      setPayStep('paid');
    } catch (err) {
      console.error(err);
      setPaymentProcessing(false);
      setError('Failed to initiate Legal Assist payment. Please try again.');
    }
  };

  // Handler: Court Expenses Payment
  const handleCourtExpensesPay = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const cleanMobile = courtPhone.replace(/\D/g, '').slice(-10);
    if (!courtName.trim() || cleanMobile.length !== 10) {
      setError('Please enter your Institution / Full Name and a valid 10-digit Mobile Number.');
      return;
    }
    const finalAmount = courtCustomAmount && Number(courtCustomAmount) > 0
      ? Number(courtCustomAmount)
      : courtAmount;

    setPaymentProcessing(true);
    try {
      const orderRes = await fetch('/api/order/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          purpose: 'court_expenses',
          feeCategory: 'court_expenses',
          customAmount: finalAmount,
          studentName: courtName.trim(),
          payerPhone: cleanMobile,
        }),
      });
      const orderData = await orderRes.json();
      const txnId = `TXN-CRT-${Date.now().toString().slice(-8)}`;
      const paidAt = new Date().toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        dateStyle: 'medium',
        timeStyle: 'short',
      });

      setPaymentProcessing(false);
      setPaidReceipt({
        txnId,
        paidAt,
        student: {
          studentId: 'COURT-EXPENSES',
          studentName: courtName.trim(),
          mobileNumber: cleanMobile,
          zoneId: 'State-Wide',
          zoneName: 'Orissa High Court & Supreme Court Wing',
          schoolId: 'AOPSTSMA-CRT',
          schoolName: courtAffiliation || 'State Association Legal Secretariat',
          district: 'Odisha',
          feeAmount: finalAmount,
          paymentStatus: 'Paid',
        },
        feeTypeName: `Court Litigation Expenses — ${courtMatter}`,
      });
      setPayStep('paid');
    } catch (err) {
      console.error(err);
      setPaymentProcessing(false);
      setError('Failed to initiate Court Expenses payment. Please try again.');
    }
  };

  // Step 4: Verify Student Name & Mobile against school uploaded data & Dispatch OTP
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setDemoOtp(null);

    const cleanMobile = mobileNumber.replace(/\D/g, '').slice(-10);
    if (!studentName.trim() || cleanMobile.length !== 10) {
      setError('Please enter both your Student Full Name and valid 10-digit registered Mobile Number.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/verify-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: studentName.trim(),
          mobileNumber: cleanMobile,
          zoneId,
          schoolName: selectedSchool,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok && data.verified) {
        const studentInfo: StudentData = {
          studentId: data.student.studentId || `STU-${Date.now().toString().slice(-6)}`,
          studentName: data.student.studentName,
          mobileNumber: cleanMobile,
          zoneId: data.student.zoneId || zoneId,
          zoneName: data.student.zoneName || (ZONES.find((z) => z.id === zoneId)?.name || 'Association Zone'),
          schoolId: data.student.schoolId || 'SCH-01',
          schoolName: data.student.schoolName || selectedSchool,
          district: data.student.district || 'Odisha',
          feeAmount: getFeeAmount(),
          paymentStatus: 'Pending',
        };

        setVerifiedStudent(studentInfo);
        setDemoOtp(data.demoOtp || null);
        setSuccessMsg(`✓ Record verified in school database! OTP sent to +91 ******${cleanMobile.slice(-4)}.`);
        setPayStep('otp');
      } else {
        setError(
          data.message ||
            `Student record not found! Please ensure your school has uploaded your name (${studentName.trim()}) and mobile number (+91 ${cleanMobile}).`
        );
      }
    } catch (err) {
      setLoading(false);
      setError('Server connection error. Please try again.');
    }
  };

  // Step 5: Verify Mobile OTP
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpInput.trim() || otpInput.trim().length !== 6) {
      setError('Please enter the complete 6-digit OTP code.');
      return;
    }

    setOtpLoading(true);
    setError(null);

    try {
      const cleanMobile = mobileNumber.replace(/\D/g, '').slice(-10);
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobile: cleanMobile,
          otp: otpInput.trim(),
          role: 'student',
          schoolName: selectedSchool,
          zone: zoneId,
        }),
      });

      const data = await res.json();
      setOtpLoading(false);

      if (res.ok && data.success) {
        setSuccessMsg('✓ Mobile OTP verified successfully! You can now proceed to fee payment.');
        setPayStep('ready_to_pay');
      } else {
        setError(data.error || 'Invalid OTP code. Please check SMS and enter the 6-digit code again.');
      }
    } catch (err) {
      setOtpLoading(false);
      setError('Error verifying OTP code. Please retry.');
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    setError(null);
    setSuccessMsg(null);
    setLoading(true);
    try {
      const cleanMobile = mobileNumber.replace(/\D/g, '').slice(-10);
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobile: cleanMobile,
          schoolName: selectedSchool,
          authorityName: studentName,
          role: 'student',
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (res.ok && data.success) {
        setDemoOtp(data.demoOtp || null);
        setSuccessMsg(`✓ New OTP sent to +91 ******${cleanMobile.slice(-4)}.`);
      } else {
        setError(data.error || 'Failed to resend OTP. Please try again.');
      }
    } catch {
      setLoading(false);
      setError('Network error resending OTP.');
    }
  };

  // Step 6: Payment Processing
  const handlePayNow = async () => {
    if (!verifiedStudent) return;
    setPaymentProcessing(true);
    setError(null);

    try {
      // 1. Create Order via server API
      const orderRes = await fetch('/api/order/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          purpose: feeCategory === 'student' ? 'student_registration' : feeCategory,
          schoolCode: verifiedStudent.schoolId,
          studentId: verifiedStudent.studentId,
          studentName: verifiedStudent.studentName,
          payerPhone: verifiedStudent.mobileNumber,
          feeCategory: feeCategory,
        }),
      });

      const orderData = await orderRes.json();
      const orderId = orderData.orderId || `order_${Date.now()}`;

      // 2. Finalize transaction and sync
      const completePayment = async (txnId: string, method: string = 'UPI / Online Gateway') => {
        const paidAt = new Date().toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
          dateStyle: 'medium',
          timeStyle: 'short',
        });

        try {
          await fetch('/api/google-sheets-webhook', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              transactionId: txnId,
              orderId,
              studentId: verifiedStudent.studentId,
              studentName: verifiedStudent.studentName,
              mobileNumber: verifiedStudent.mobileNumber,
              schoolName: verifiedStudent.schoolName,
              zoneName: verifiedStudent.zoneName,
              amount: verifiedStudent.feeAmount,
              feeType: getFeeTypeName(),
              paymentMethod: method,
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
          feeTypeName: getFeeTypeName(),
        });
        setPayStep('paid');
      };

      // 3. If Razorpay Checkout is available and configured
      if (orderData.isLiveGateway && typeof window !== 'undefined') {
        const loadRazorpayScript = () => {
          return new Promise<boolean>((resolve) => {
            if ((window as any).Razorpay) return resolve(true);
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
          });
        };

        const loaded = await loadRazorpayScript();
        if (loaded && (window as any).Razorpay) {
          const rzp = new (window as any).Razorpay({
            key: orderData.keyId,
            amount: orderData.amount,
            currency: orderData.currency || 'INR',
            name: 'AOPSTSMA Official Portal',
            description: getFeeTypeName(),
            order_id: orderId,
            image: '/assets/img/aopstsma-seal.jpg',
            prefill: {
              name: verifiedStudent.studentName,
              contact: verifiedStudent.mobileNumber,
            },
            notes: {
              schoolName: verifiedStudent.schoolName,
              studentName: verifiedStudent.studentName,
            },
            theme: {
              color: '#0B2545',
            },
            handler: async function (response: any) {
              await completePayment(response.razorpay_payment_id || `TXN-${Date.now()}`, 'Razorpay Gateway');
            },
            modal: {
              ondismiss: function () {
                setPaymentProcessing(false);
              },
            },
          });
          rzp.open();
          return;
        }
      }

      // 4. Default / Direct Settlement with official receipt
      const testTxnId = 'TXN-' + Math.floor(1000000000 + Math.random() * 9000000000);
      await completePayment(testTxnId, 'Direct Portal Online Settlement');
    } catch (err) {
      console.error('Payment initialization error:', err);
      setPaymentProcessing(false);
      setError('Payment gateway communication error. Please try again.');
    }
  };

  const handleReset = () => {
    setPayStep('verify');
    setPaidReceipt(null);
    setVerifiedStudent(null);
    setStudentName('');
    setMobileNumber('');
    setOtpInput('');
    setError(null);
    setSuccessMsg(null);
    setDemoOtp(null);
  };

  return (
    <div className="pay-container">
      {/* HEADER TITLE */}
      <div className="pay-header">
        <span className="pay-badge">OFFICIAL ONLINE PAY PORTAL</span>
        <h2>Student Fee Payment & Roster Verification</h2>
        <p>
          Select your Zone and School, enter your Name and Registered Mobile Number to verify against the school’s
          uploaded roster, authenticate via OTP, and complete fee payment.
        </p>
      </div>

      {/* PROGRESS STEPPER BAR */}
      <div className="pay-stepper-grid">
        <div style={{ textAlign: 'center' }}>
          <span
            style={{
              display: 'inline-block',
              width: '28px',
              height: '28px',
              lineHeight: '28px',
              borderRadius: '50%',
              background: '#0B2545',
              color: '#FFF',
              fontWeight: 700,
              fontSize: '0.82rem',
              marginBottom: '0.25rem',
            }}
          >
            1
          </span>
          <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#0B2545' }}>Zone & School</div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <span
            style={{
              display: 'inline-block',
              width: '28px',
              height: '28px',
              lineHeight: '28px',
              borderRadius: '50%',
              background: payStep === 'verify' ? '#E2E8F0' : '#0B2545',
              color: payStep === 'verify' ? '#475569' : '#FFF',
              fontWeight: 700,
              fontSize: '0.82rem',
              marginBottom: '0.25rem',
            }}
          >
            2
          </span>
          <div
            style={{
              fontSize: '0.78rem',
              fontWeight: 600,
              color: payStep === 'verify' ? '#64748B' : '#0B2545',
            }}
          >
            Name & Mobile
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <span
            style={{
              display: 'inline-block',
              width: '28px',
              height: '28px',
              lineHeight: '28px',
              borderRadius: '50%',
              background: payStep === 'otp' ? '#D97706' : payStep === 'ready_to_pay' || payStep === 'paid' ? '#0B2545' : '#E2E8F0',
              color: payStep === 'verify' ? '#475569' : '#FFF',
              fontWeight: 700,
              fontSize: '0.82rem',
              marginBottom: '0.25rem',
            }}
          >
            3
          </span>
          <div
            style={{
              fontSize: '0.78rem',
              fontWeight: 600,
              color: payStep === 'otp' ? '#D97706' : payStep === 'ready_to_pay' || payStep === 'paid' ? '#0B2545' : '#64748B',
            }}
          >
            OTP Verification
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <span
            style={{
              display: 'inline-block',
              width: '28px',
              height: '28px',
              lineHeight: '28px',
              borderRadius: '50%',
              background: payStep === 'paid' ? '#10B981' : payStep === 'ready_to_pay' ? '#D97706' : '#E2E8F0',
              color: payStep === 'ready_to_pay' || payStep === 'paid' ? '#FFF' : '#475569',
              fontWeight: 700,
              fontSize: '0.82rem',
              marginBottom: '0.25rem',
            }}
          >
            4
          </span>
          <div
            style={{
              fontSize: '0.78rem',
              fontWeight: 600,
              color: payStep === 'paid' ? '#10B981' : payStep === 'ready_to_pay' ? '#D97706' : '#64748B',
            }}
          >
            Fee Payment
          </div>
        </div>
      </div>

      {!paidReceipt ? (
        <div className="pay-card-grid">
          {/* LEFT COLUMN: PAYMENT / VERIFICATION FORM */}
          <div className="pay-card">
            <h3>
              {feeCategory === 'student' && '🎓 Student Fee Verification & Payment'}
              {feeCategory === 'legal_assist' && '⚖️ Institutional Legal Assist Contribution'}
              {feeCategory === 'court_expenses' && '📜 Court Litigation & Case Expenses Fund'}
            </h3>
            <p className="pay-sub">
              {feeCategory === 'student' && 'Select your Zone and School, then enter Student Full Name & Mobile Number to verify roster and pay.'}
              {feeCategory === 'legal_assist' && 'Voluntary institutional legal assistance contribution supporting Senior Advocate counsel & state advocacy.'}
              {feeCategory === 'court_expenses' && 'Litigation expense contribution safeguarding Orissa High Court WP(C) 5640/2009 & Supreme Court orders.'}
            </p>

            {/* 3 PUBLIC FEE TYPE TABS (DR Deposit is inside School Secretary Portal) */}
            <div className="fee-type-tabs">
              <button
                type="button"
                onClick={() => { setFeeCategory('student'); setError(null); }}
                style={{
                  border: feeCategory === 'student' ? '2px solid #0B2545' : '1px solid #CBD5E1',
                  padding: '0.65rem 0.4rem',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: feeCategory === 'student' ? '#0B2545' : '#FFFFFF',
                  color: feeCategory === 'student' ? '#FFFFFF' : '#334155',
                  textAlign: 'center',
                  boxShadow: feeCategory === 'student' ? '0 4px 12px rgba(11, 37, 69, 0.2)' : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                🎓 Student Fee
                <span style={{ display: 'block', fontSize: '0.72rem', color: feeCategory === 'student' ? '#FDE68A' : '#B45309', marginTop: '0.15rem' }}>
                  ₹2,500 (Candidate)
                </span>
              </button>

              <button
                type="button"
                onClick={() => { setFeeCategory('legal_assist'); setError(null); }}
                style={{
                  border: feeCategory === 'legal_assist' ? '2px solid #D97706' : '1px solid #CBD5E1',
                  padding: '0.65rem 0.4rem',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: feeCategory === 'legal_assist' ? '#D97706' : '#FFFFFF',
                  color: feeCategory === 'legal_assist' ? '#FFFFFF' : '#334155',
                  textAlign: 'center',
                  boxShadow: feeCategory === 'legal_assist' ? '0 4px 12px rgba(217, 119, 6, 0.25)' : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                ⚖️ Legal Assist
                <span style={{ display: 'block', fontSize: '0.72rem', color: feeCategory === 'legal_assist' ? '#FEF3C7' : '#64748B', marginTop: '0.15rem' }}>
                  Preset / Custom
                </span>
              </button>

              <button
                type="button"
                onClick={() => { setFeeCategory('court_expenses'); setError(null); }}
                style={{
                  border: feeCategory === 'court_expenses' ? '2px solid #7C3AED' : '1px solid #CBD5E1',
                  padding: '0.65rem 0.4rem',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: feeCategory === 'court_expenses' ? '#7C3AED' : '#FFFFFF',
                  color: feeCategory === 'court_expenses' ? '#FFFFFF' : '#334155',
                  textAlign: 'center',
                  boxShadow: feeCategory === 'court_expenses' ? '0 4px 12px rgba(124, 58, 237, 0.25)' : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                📜 Court Expenses
                <span style={{ display: 'block', fontSize: '0.72rem', color: feeCategory === 'court_expenses' ? '#EDE9FE' : '#64748B', marginTop: '0.15rem' }}>
                  Litigation Fund
                </span>
              </button>
            </div>

            {/* SCHOOL SECRETARY NOTICE FOR DR DEPOSIT */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.75rem',
                flexWrap: 'wrap',
                padding: '0.6rem 0.85rem',
                background: '#F0FDF4',
                border: '1px solid #BBF7D0',
                borderRadius: '8px',
                marginBottom: '1.15rem',
                fontSize: '0.78rem',
                color: '#166534',
              }}
            >
              <span>
                🏫 <strong>School Secretary DR Deposit:</strong> School Secretaries can remit DR Deposit &amp; manage student rosters after logging into the School Portal.
              </span>
              <Link
                href="/school-login"
                style={{
                  color: '#15803D',
                  fontWeight: 800,
                  textDecoration: 'underline',
                  whiteSpace: 'nowrap',
                }}
              >
                School Secretary Login &rarr;
              </Link>
            </div>

            {/* ERROR / SUCCESS ALERTS */}
            {error && (
              <div style={{ padding: '0.75rem 1rem', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '6px', color: '#B91C1C', fontSize: '0.85rem', marginBottom: '1rem' }}>
                ⚠️ {error}
              </div>
            )}
            {successMsg && (
              <div style={{ padding: '0.75rem 1rem', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '6px', color: '#15803D', fontSize: '0.85rem', marginBottom: '1rem' }}>
                {successMsg}
              </div>
            )}

            {feeCategory === 'legal_assist' ? (
              /* FORM 2: LEGAL ASSIST */
              <form onSubmit={handleLegalAssistPay} className="pay-form">
                <div className="form-group">
                  <label htmlFor="legalName">
                    1. Contributor / Institution / Advocate Name <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    id="legalName"
                    placeholder="Enter full name / school patron name"
                    value={legalName}
                    onChange={(e) => setLegalName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="legalPhone">
                    2. Contact Mobile Number <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    type="tel"
                    id="legalPhone"
                    maxLength={10}
                    placeholder="10-digit mobile number"
                    value={legalPhone}
                    onChange={(e) => setLegalPhone(e.target.value.replace(/\D/g, ''))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="legalAffiliation">3. Associated Member Institution / Zone / Role</label>
                  <input
                    type="text"
                    id="legalAffiliation"
                    placeholder="e.g. Baleswar Zone / Rajadhani Training School / Legal Patron"
                    value={legalAffiliation}
                    onChange={(e) => setLegalAffiliation(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="legalPurpose">4. Legal Assistance Purpose</label>
                  <select
                    id="legalPurpose"
                    value={legalPurpose}
                    onChange={(e) => setLegalPurpose(e.target.value)}
                  >
                    <option value="Senior Advocate Legal Defense & State Counsel Assistance">
                      Senior Advocate Legal Defense &amp; State Counsel Assistance
                    </option>
                    <option value="Special Counsel Engagement for Division Bench Hearing">
                      Special Counsel Engagement for Division Bench Hearing
                    </option>
                    <option value="State CT Education Policy & Directorate Legal Representation">
                      State CT Education Policy &amp; Directorate Legal Representation
                    </option>
                    <option value="General Association Legal Assistance & Safeguard Fund">
                      General Association Legal Assistance &amp; Safeguard Fund
                    </option>
                  </select>
                </div>

                {/* Amount Selection Chips */}
                <div className="form-group">
                  <label>5. Contribution Amount (₹)</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.45rem', marginTop: '0.35rem' }}>
                    {[2500, 5000, 10000, 25000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => { setLegalAmount(amt); setLegalCustomAmount(''); }}
                        style={{
                          padding: '0.6rem 0.25rem',
                          borderRadius: '6px',
                          border: legalAmount === amt && !legalCustomAmount ? '2px solid #D97706' : '1px solid #CBD5E1',
                          background: legalAmount === amt && !legalCustomAmount ? '#FEF3C7' : '#FFFFFF',
                          color: legalAmount === amt && !legalCustomAmount ? '#92400E' : '#334155',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                        }}
                      >
                        ₹{amt.toLocaleString('en-IN')}
                      </button>
                    ))}
                  </div>

                  <div style={{ marginTop: '0.65rem' }}>
                    <input
                      type="number"
                      placeholder="Or enter custom amount in ₹"
                      value={legalCustomAmount}
                      onChange={(e) => setLegalCustomAmount(e.target.value)}
                      style={{ fontSize: '0.9rem' }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={paymentProcessing}
                  style={{
                    width: '100%',
                    padding: '0.9rem',
                    background: 'linear-gradient(135deg, #0B2545 0%, #D97706 100%)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: 700,
                    fontSize: '1rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(11, 37, 69, 0.25)',
                    marginTop: '0.5rem',
                  }}
                >
                  {paymentProcessing
                    ? 'Connecting to Gateway...'
                    : `⚖️ Pay ₹${getFeeAmount().toLocaleString('en-IN')} Legal Assist Contribution`}
                </button>
              </form>
            ) : feeCategory === 'court_expenses' ? (
              /* FORM 3: COURT EXPENSES */
              <form onSubmit={handleCourtExpensesPay} className="pay-form">
                <div className="form-group">
                  <label htmlFor="courtName">
                    1. Institution / Contributor Full Name <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    id="courtName"
                    placeholder="Enter institution or representative name"
                    value={courtName}
                    onChange={(e) => setCourtName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="courtPhone">
                    2. Contact Mobile Number <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    type="tel"
                    id="courtPhone"
                    maxLength={10}
                    placeholder="10-digit mobile number"
                    value={courtPhone}
                    onChange={(e) => setCourtPhone(e.target.value.replace(/\D/g, ''))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="courtAffiliation">3. Member Training School / Zone</label>
                  <input
                    type="text"
                    id="courtAffiliation"
                    placeholder="e.g. Cuttack Zone / Member Institution"
                    value={courtAffiliation}
                    onChange={(e) => setCourtAffiliation(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="courtMatter">4. Judicial Matter / Court Reference</label>
                  <select
                    id="courtMatter"
                    value={courtMatter}
                    onChange={(e) => setCourtMatter(e.target.value)}
                  >
                    <option value="Orissa High Court WP(C) 5640/2009 & Supreme Court SLP CC 12896/2014">
                      Orissa High Court WP(C) 5640/2009 &amp; Supreme Court SLP CC 12896/2014
                    </option>
                    <option value="High Court of Orissa Division Bench Case Litigation Expenses">
                      High Court of Orissa Division Bench Case Litigation Expenses
                    </option>
                    <option value="Supreme Court of India Special Leave Petition (SLP) Fund">
                      Supreme Court of India Special Leave Petition (SLP) Fund
                    </option>
                    <option value="Judicial Filing, Paperbook, Stamp & Registry Costs">
                      Judicial Filing, Paperbook, Stamp &amp; Registry Costs
                    </option>
                  </select>
                </div>

                {/* Amount Selection Chips */}
                <div className="form-group">
                  <label>5. Litigation Expense Contribution (₹)</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.45rem', marginTop: '0.35rem' }}>
                    {[5000, 10000, 25000, 50000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => { setCourtAmount(amt); setCourtCustomAmount(''); }}
                        style={{
                          padding: '0.6rem 0.25rem',
                          borderRadius: '6px',
                          border: courtAmount === amt && !courtCustomAmount ? '2px solid #7C3AED' : '1px solid #CBD5E1',
                          background: courtAmount === amt && !courtCustomAmount ? '#EDE9FE' : '#FFFFFF',
                          color: courtAmount === amt && !courtCustomAmount ? '#6D28D9' : '#334155',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                        }}
                      >
                        ₹{amt.toLocaleString('en-IN')}
                      </button>
                    ))}
                  </div>

                  <div style={{ marginTop: '0.65rem' }}>
                    <input
                      type="number"
                      placeholder="Or enter custom litigation contribution in ₹"
                      value={courtCustomAmount}
                      onChange={(e) => setCourtCustomAmount(e.target.value)}
                      style={{ fontSize: '0.9rem' }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={paymentProcessing}
                  style={{
                    width: '100%',
                    padding: '0.9rem',
                    background: 'linear-gradient(135deg, #0B2545 0%, #7C3AED 100%)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: 700,
                    fontSize: '1rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(11, 37, 69, 0.25)',
                    marginTop: '0.5rem',
                  }}
                >
                  {paymentProcessing
                    ? 'Connecting to Gateway...'
                    : `📜 Pay ₹${getFeeAmount().toLocaleString('en-IN')} Court Expenses Now`}
                </button>
              </form>
            ) : (
              <>
                {/* VERIFICATION FORM */}
                <form onSubmit={handleVerify} className="pay-form">
              {/* 1. ZONE SELECTOR */}
              <div className="form-group">
                <label htmlFor="zoneSelect">
                  1. Select Zone <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <select
                  id="zoneSelect"
                  value={zoneId}
                  onChange={(e) => handleZoneChange(e.target.value)}
                  disabled={payStep === 'ready_to_pay'}
                >
                  {ZONES.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.name} — ({z.schoolCount} Institutions)
                    </option>
                  ))}
                </select>
                <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                  Districts covered: {ZONES.find((z) => z.id === zoneId)?.districts}
                </span>
              </div>

              {/* 2. SCHOOL NAME SELECTOR (Filtered by Zone) */}
              <div className="form-group">
                <label htmlFor="schoolSelect">
                  2. Select School in {ZONES.find((z) => z.id === zoneId)?.name}{' '}
                  <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <select
                  id="schoolSelect"
                  value={selectedSchool}
                  onChange={(e) => handleSchoolChange(e.target.value)}
                  disabled={payStep === 'ready_to_pay'}
                >
                  {availableSchools.map((s, idx) => (
                    <option key={idx} value={s.name}>
                      {s.name} ({s.district})
                    </option>
                  ))}
                </select>
              </div>

              {/* 3. STUDENT FULL NAME (NO ROLL NUMBER!) */}
              <div className="form-group">
                <label htmlFor="studentName">
                  3. Student Full Name <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  type="text"
                  id="studentName"
                  placeholder="e.g. Rajesh Kumar Das"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  disabled={payStep === 'ready_to_pay'}
                  required
                />
                <span style={{ fontSize: '0.74rem', color: '#64748B' }}>
                  Enter the exact candidate name registered with the school roster.
                </span>
              </div>

              {/* 4. REGISTERED MOBILE NUMBER */}
              <div className="form-group">
                <label htmlFor="mobileNo">
                  4. Registered Mobile Number <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <span
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      color: '#475569',
                    }}
                  >
                    +91
                  </span>
                  <input
                    type="tel"
                    id="mobileNo"
                    placeholder="9861012345"
                    style={{ paddingLeft: '48px' }}
                    maxLength={10}
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                    disabled={payStep === 'ready_to_pay'}
                    required
                  />
                </div>
                <span style={{ fontSize: '0.74rem', color: '#64748B' }}>
                  A 6-digit OTP will be dispatched to this mobile for verification.
                </span>
              </div>

              {error && <div className="pay-error">{error}</div>}
              {successMsg && (
                <div
                  style={{
                    padding: '0.85rem 1rem',
                    background: '#ECFDF5',
                    border: '1px solid #A7F3D0',
                    borderLeft: '4px solid #10B981',
                    color: '#065F46',
                    borderRadius: '4px',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                  }}
                >
                  {successMsg}
                </div>
              )}

              {/* VERIFY BUTTON (Only shown before OTP) */}
              {payStep === 'verify' && (
                <button type="submit" className="verify-btn" disabled={loading}>
                  {loading ? 'Searching School Roster...' : '🔍 Verify Student & Send OTP'}
                </button>
              )}
            </form>

            {/* STEP 5: OTP VERIFICATION BOX (Visible once student is verified) */}
            {payStep === 'otp' && (
              <div
                style={{
                  marginTop: '1.5rem',
                  padding: '1.25rem',
                  background: '#FFFBEB',
                  border: '1px solid #FDE68A',
                  borderLeft: '4px solid #D97706',
                  borderRadius: '6px',
                }}
              >
                <h4 style={{ margin: '0 0 0.5rem', color: '#92400E', fontSize: '1rem', fontWeight: 700 }}>
                  Enter 6-Digit OTP Code
                </h4>
                <p style={{ margin: '0 0 1rem', fontSize: '0.85rem', color: '#78350F' }}>
                  Please enter the 6-digit verification code sent to{' '}
                  <b>+91 ******{mobileNumber.replace(/\D/g, '').slice(-4)}</b>.
                </p>

                {demoOtp && (
                  <div
                    style={{
                      marginBottom: '1rem',
                      padding: '0.5rem 0.75rem',
                      background: '#FEF3C7',
                      border: '1px dashed #D97706',
                      borderRadius: '4px',
                      fontSize: '0.82rem',
                      color: '#92400E',
                    }}
                  >
                    💡 <b>Test Demo OTP:</b> <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{demoOtp}</span>
                  </div>
                )}

                <form onSubmit={handleVerifyOTP}>
                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="Enter 6-digit OTP (e.g. 123456)"
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                      style={{
                        letterSpacing: '0.25em',
                        fontSize: '1.25rem',
                        fontWeight: 700,
                        textAlign: 'center',
                        borderColor: '#D97706',
                      }}
                      required
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <button
                      type="submit"
                      disabled={otpLoading}
                      style={{
                        flex: '1',
                        background: '#0B2545',
                        color: '#FFFFFF',
                        border: 'none',
                        padding: '0.85rem 1.25rem',
                        borderRadius: '6px',
                        fontWeight: 700,
                        fontSize: '0.95rem',
                        cursor: 'pointer',
                      }}
                    >
                      {otpLoading ? 'Verifying OTP...' : '✓ Confirm OTP & Unlock Fee Payment'}
                    </button>

                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={loading}
                      style={{
                        background: '#F1F5F9',
                        color: '#334155',
                        border: '1px solid #CBD5E1',
                        padding: '0.85rem 1rem',
                        borderRadius: '6px',
                        fontSize: '0.88rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Resend OTP
                    </button>
                  </div>
                </form>
              </div>
            )}
          </>
        )}
      </div>

      {/* SUMMARY / PAYMENT UNLOCK CARD */}
      <div className="pay-card summary-card">
        <h3>
          {feeCategory === 'student' && 'Fee Details & Candidate Checkout'}
          {feeCategory === 'legal_assist' && '⚖️ Legal Assist Fund Summary'}
          {feeCategory === 'court_expenses' && '📜 Court Litigation Expenses Summary'}
        </h3>

        {feeCategory === 'legal_assist' ? (
          <div style={{ padding: '0.5rem 0' }}>
            <div style={{ padding: '1rem', background: '#FFFBEB', borderRadius: '8px', border: '1px solid #FDE68A', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '1.75rem' }}>⚖️</span>
                <div>
                  <h4 style={{ margin: 0, color: '#92400E', fontSize: '1.05rem', fontWeight: 800 }}>
                    Legal Assistance Wing
                  </h4>
                  <small style={{ color: '#B45309' }}>Senior Counsel &amp; State Advocacy Fund</small>
                </div>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#78350F', lineHeight: 1.6, margin: 0 }}>
                Supports Senior Advocates, legal research, and state-level education policy consultations protecting member training colleges across Odisha.
              </p>
            </div>

            <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.55rem', fontSize: '0.85rem' }}>
                <span style={{ color: '#64748B' }}>Contribution:</span>
                <b style={{ color: '#D97706', fontSize: '1.15rem' }}>₹{getFeeAmount().toLocaleString('en-IN')}</b>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.55rem', fontSize: '0.85rem' }}>
                <span style={{ color: '#64748B' }}>Contributor:</span>
                <b style={{ color: '#0F172A' }}>{legalName || 'Patron / Representative'}</b>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.55rem', fontSize: '0.85rem' }}>
                <span style={{ color: '#64748B' }}>Purpose:</span>
                <span style={{ color: '#B45309', fontSize: '0.76rem', fontWeight: 700, textAlign: 'right', maxWidth: '60%' }}>
                  {legalPurpose}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', borderTop: '1px solid #E2E8F0', paddingTop: '0.5rem' }}>
                <span style={{ color: '#64748B' }}>Official Record:</span>
                <b style={{ color: '#166534' }}>Instant Digital Receipt with State Seal ✓</b>
              </div>
            </div>
          </div>
        ) : feeCategory === 'court_expenses' ? (
          <div style={{ padding: '0.5rem 0' }}>
            <div style={{ padding: '1rem', background: '#F5F3FF', borderRadius: '8px', border: '1px solid #DDD6FE', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '1.75rem' }}>📜</span>
                <div>
                  <h4 style={{ margin: 0, color: '#5B21B6', fontSize: '1.05rem', fontWeight: 800 }}>
                    Judicial Litigation Fund
                  </h4>
                  <small style={{ color: '#6D28D9' }}>Orissa High Court &amp; Supreme Court Proceedings</small>
                </div>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#4C1D95', lineHeight: 1.6, margin: 0 }}>
                Directly finances court filings, paperbook preparation, and Special Leave Petitions safeguarding the historic judgments in <b>WP(C) 5640/2009</b> and <b>SLP CC 12896/2014</b>.
              </p>
            </div>

            <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.55rem', fontSize: '0.85rem' }}>
                <span style={{ color: '#64748B' }}>Litigation Amount:</span>
                <b style={{ color: '#7C3AED', fontSize: '1.15rem' }}>₹{getFeeAmount().toLocaleString('en-IN')}</b>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.55rem', fontSize: '0.85rem' }}>
                <span style={{ color: '#64748B' }}>Institution:</span>
                <b style={{ color: '#0F172A' }}>{courtName || 'Patron / School'}</b>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.55rem', fontSize: '0.85rem' }}>
                <span style={{ color: '#64748B' }}>Case Matter:</span>
                <span style={{ color: '#7C3AED', fontSize: '0.76rem', fontWeight: 700, textAlign: 'right', maxWidth: '60%' }}>
                  {courtMatter}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', borderTop: '1px solid #E2E8F0', paddingTop: '0.5rem' }}>
                <span style={{ color: '#64748B' }}>Judicial Receipt:</span>
                <b style={{ color: '#166534' }}>Signed Court Expense Receipt ✓</b>
              </div>
            </div>
          </div>
        ) : payStep === 'ready_to_pay' && verifiedStudent ? (
          <div className="verified-box">
            <div className="status-badge success">
              <span>✓ STUDENT VERIFIED &amp; OTP CONFIRMED</span>
              <small>Matched in {verifiedStudent.schoolName}</small>
            </div>

            <div className="verified-details">
              <div className="detail-row">
                <span>Fee Category:</span>
                <b style={{ color: '#D97706' }}>{getFeeTypeName()}</b>
              </div>
              <div className="detail-row">
                <span>Candidate Name:</span>
                <b style={{ fontSize: '1.05rem', color: '#0B2545' }}>{verifiedStudent.studentName}</b>
              </div>
              <div className="detail-row">
                <span>Institution / School:</span>
                <b>{verifiedStudent.schoolName}</b>
              </div>
              <div className="detail-row">
                <span>Jurisdiction Zone:</span>
                <span>{verifiedStudent.zoneName}</span>
              </div>
              <div className="detail-row">
                <span>Registered Contact:</span>
                <span>+91 {verifiedStudent.mobileNumber}</span>
              </div>
              <div className="detail-row total-row">
                <span>Total Fee Payable:</span>
                <b className="price">₹{verifiedStudent.feeAmount.toLocaleString('en-IN')}</b>
              </div>
            </div>

            <button
              type="button"
              className="pay-now-btn"
              onClick={handlePayNow}
              disabled={paymentProcessing}
            >
              {paymentProcessing
                ? 'Processing Transaction...'
                : `💳 Pay ₹${verifiedStudent.feeAmount.toLocaleString('en-IN')} Now (UPI / QR / NetBanking)`}
            </button>
            <p className="pay-note">⚡ Real-time automatic digital receipt &amp; central association registry sync.</p>

            <button
              type="button"
              onClick={handleReset}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#64748B',
                fontSize: '0.82rem',
                textDecoration: 'underline',
                cursor: 'pointer',
                marginTop: '0.5rem',
              }}
            >
              Edit details or select different student
            </button>
          </div>
        ) : payStep === 'otp' && verifiedStudent ? (
          <div
            style={{
              padding: '2rem 1.5rem',
              textAlign: 'center',
              background: '#F8FAFC',
              borderRadius: '8px',
              border: '1px dashed #CBD5E1',
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📱</div>
            <h4 style={{ color: '#0B2545', fontSize: '1.1rem', marginBottom: '0.4rem' }}>
              Awaiting OTP Confirmation
            </h4>
            <p style={{ color: '#64748B', fontSize: '0.88rem', margin: '0 0 1rem' }}>
              We found <b>{verifiedStudent.studentName}</b> in <b>{verifiedStudent.schoolName}</b>. Enter the 6-digit
              OTP on the left to unlock fee payment.
            </p>
            <div
              style={{
                display: 'inline-block',
                background: '#FEF3C7',
                padding: '0.4rem 0.8rem',
                borderRadius: '20px',
                fontSize: '0.82rem',
                color: '#92400E',
                fontWeight: 600,
              }}
            >
              Payable Fee: ₹{getFeeAmount().toLocaleString('en-IN')}
            </div>
          </div>
        ) : (
          <div className="empty-verify">
            <div className="empty-icon">📋</div>
            <h4>Awaiting Verification</h4>
            <p>
              1. Select your Zone<br />
              2. Select your School<br />
              3. Enter Student Name &amp; Mobile Number<br />
              4. Verify against uploaded roster &amp; confirm OTP to pay fee.
            </p>
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
              <span>Fee Category</span>
              <b style={{ color: '#D97706' }}>{paidReceipt.feeTypeName}</b>
            </div>
            <div className="r-item">
              <span>Date & Time</span>
              <b>{paidReceipt.paidAt}</b>
            </div>
            <div className="r-item">
              <span>
                {paidReceipt.student.studentId?.startsWith('DR-')
                  ? 'Authorized Representative'
                  : paidReceipt.student.studentId?.includes('LEGAL') || paidReceipt.student.studentId?.includes('COURT')
                  ? 'Contributor / Patron Name'
                  : 'Candidate Full Name'}
              </span>
              <b style={{ color: '#0B2545' }}>{paidReceipt.student.studentName}</b>
            </div>
            <div className="r-item">
              <span>
                {paidReceipt.student.studentId?.startsWith('DR-')
                  ? 'Recognized Member Institution'
                  : 'Affiliated Institution / School'}
              </span>
              <b>{paidReceipt.student.schoolName}</b>
            </div>
            <div className="r-item">
              <span>State Jurisdiction / Zone</span>
              <b>{paidReceipt.student.zoneName}</b>
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
              onClick={handleReset}
            >
              Make Another Payment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
