import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Payment & Fee Portal — AOPSTSMA',
  description:
    'Official payment portal for student registrations, school renewals, DIR deposits, and legal defense demands.',
};

export default function PaymentLandingPage() {
  return (
    <>
      {/* Top Banner */}
      <section className="page-head" style={{ backgroundColor: '#0B2545', borderBottom: '3px solid #D97706' }}>
        <div className="wrap">
          <div style={{ display: 'inline-block', backgroundColor: 'rgba(217, 119, 6, 0.2)', border: '1px solid #D97706', padding: '0.3rem 0.8rem', borderRadius: '4px', fontSize: '0.75rem', color: '#FBBF24', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>
            Official Fee Settlement Gateway &middot; Estd. 1980
          </div>
          <h1 style={{ color: '#FFFFFF', fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            AOPSTSMA Payment Portal
          </h1>
          <p style={{ color: '#CBD5E1', fontSize: '1.05rem', maxWidth: '62ch', marginTop: '0.75rem' }}>
            Authorized portal for candidate registrations, annual school renewals, DIR security
            deposits, and High Court legal fund contributions.
          </p>
        </div>
      </section>

      {/* Internal Local Testing Notice */}
      <section style={{ backgroundColor: '#FFFBEB', borderBottom: '1px solid #FDE68A', padding: '1rem 0' }}>
        <div className="wrap" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', color: '#92400E' }}>
          <span style={{ fontSize: '1.2rem' }}>ℹ️</span>
          <div>
            <b>Phase 1 Local Environment:</b> Database schema, transaction pooler, and RLS policies active.
            Payment gateway checkout is locked until Phase 3 integration. No live card/UPI deductions will occur.
          </div>
        </div>
      </section>

      {/* The Four Payment Types Grid */}
      <section className="section" style={{ backgroundColor: '#F8FAFC' }}>
        <div className="wrap">
          <div className="head">
            <div className="head__rule"></div>
            <h2>Choose Payment Category</h2>
            <p className="lede">
              Please select the appropriate option below according to your institution or student status.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.75rem',
              marginBottom: '3.5rem',
            }}
          >
            {/* 1. Student Registration */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderTop: '4px solid #133E87',
                borderRadius: '8px',
                padding: '2rem 1.75rem',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 4px 14px rgba(11,37,69,0.06)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '1.8rem' }}>🎓</span>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, backgroundColor: '#EBF2FA', color: '#133E87', padding: '0.2rem 0.6rem', borderRadius: '4px', textTransform: 'uppercase' }}>
                  Self-Service
                </span>
              </div>

              <h3 style={{ fontSize: '1.25rem', color: '#0F172A', fontWeight: 600, marginBottom: '0.6rem' }}>
                Student Registration Fee
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                For candidate trainees of recognized secondary training schools. Select your school,
                enter your roll number, and verify your partially-masked details.
              </p>

              <div style={{ marginTop: 'auto', borderTop: '1px solid #F1F5F9', paddingTop: '1.25rem' }}>
                <div style={{ fontSize: '0.8rem', color: '#475569', marginBottom: '0.85rem' }}>
                  Amount: <b>Set per candidate roll in database</b>
                </div>
                <button
                  type="button"
                  disabled
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: '#E2E8F0',
                    color: '#64748B',
                    border: 'none',
                    borderRadius: '4px',
                    fontWeight: 600,
                    fontSize: '0.88rem',
                    cursor: 'not-allowed',
                  }}
                >
                  Lookup &amp; Pay (Phase 2)
                </button>
              </div>
            </div>

            {/* 2. School Renewal / DIR Deposit */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderTop: '4px solid #D97706',
                borderRadius: '8px',
                padding: '2rem 1.75rem',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 4px 14px rgba(11,37,69,0.06)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '1.8rem' }}>🏫</span>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, backgroundColor: '#FEF3C7', color: '#92400E', padding: '0.2rem 0.6rem', borderRadius: '4px', textTransform: 'uppercase' }}>
                  Institutional
                </span>
              </div>

              <h3 style={{ fontSize: '1.25rem', color: '#0F172A', fontWeight: 600, marginBottom: '0.6rem' }}>
                School Renewal &amp; DIR Deposit
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                For headmasters and management trustees of 56+ member training institutions to settle annual
                association dues and state DIR compliance deposits.
              </p>

              <div style={{ marginTop: 'auto', borderTop: '1px solid #F1F5F9', paddingTop: '1.25rem' }}>
                <div style={{ fontSize: '0.8rem', color: '#475569', marginBottom: '0.85rem' }}>
                  Renewal: <b>₹2,500</b> &middot; DIR Deposit: <b>₹25,000</b>
                </div>
                <button
                  type="button"
                  disabled
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: '#E2E8F0',
                    color: '#64748B',
                    border: 'none',
                    borderRadius: '4px',
                    fontWeight: 600,
                    fontSize: '0.88rem',
                    cursor: 'not-allowed',
                  }}
                >
                  School Sign-in (Phase 4)
                </button>
              </div>
            </div>

            {/* 3. Legal Assistance Demand */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderTop: '4px solid #0B2545',
                borderRadius: '8px',
                padding: '2rem 1.75rem',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 4px 14px rgba(11,37,69,0.06)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '1.8rem' }}>⚖️</span>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, backgroundColor: '#F1F5F9', color: '#0F172A', padding: '0.2rem 0.6rem', borderRadius: '4px', textTransform: 'uppercase' }}>
                  Demand-Based
                </span>
              </div>

              <h3 style={{ fontSize: '1.25rem', color: '#0F172A', fontWeight: 600, marginBottom: '0.6rem' }}>
                Legal Assistance Demand
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                Contribution towards High Court and Supreme Court litigation representation, issued by
                the General Secretary tied to specific writ petitions.
              </p>

              <div style={{ marginTop: 'auto', borderTop: '1px solid #F1F5F9', paddingTop: '1.25rem' }}>
                <div style={{ fontSize: '0.8rem', color: '#475569', marginBottom: '0.85rem' }}>
                  Fund: <b>Segregated Case Fund</b>
                </div>
                <div style={{ fontSize: '0.82rem', color: '#64748B', fontStyle: 'italic' }}>
                  Access via case link: <code>/pay/d/[token]</code>
                </div>
              </div>
            </div>

            {/* 4. Court Expenses Demand */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderTop: '4px solid #B45309',
                borderRadius: '8px',
                padding: '2rem 1.75rem',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 4px 14px rgba(11,37,69,0.06)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '1.8rem' }}>📜</span>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, backgroundColor: '#FEF3C7', color: '#92400E', padding: '0.2rem 0.6rem', borderRadius: '4px', textTransform: 'uppercase' }}>
                  Demand-Based
                </span>
              </div>

              <h3 style={{ fontSize: '1.25rem', color: '#0F172A', fontWeight: 600, marginBottom: '0.6rem' }}>
                Court Litigation Expenses
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                Document filing, senior advocate retainerships, and certified copy charges allocated
                across participating member training institutions.
              </p>

              <div style={{ marginTop: 'auto', borderTop: '1px solid #F1F5F9', paddingTop: '1.25rem' }}>
                <div style={{ fontSize: '0.8rem', color: '#475569', marginBottom: '0.85rem' }}>
                  Amount: <b>Calculated per writ mandate</b>
                </div>
                <div style={{ fontSize: '0.82rem', color: '#64748B', fontStyle: 'italic' }}>
                  Access via case link: <code>/pay/d/[token]</code>
                </div>
              </div>
            </div>
          </div>

          {/* School Student List Excel Batch Upload Feature Card */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '2px dashed #133E87',
              borderRadius: '8px',
              padding: '2.25rem 2rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1.5rem',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.45rem' }}>
                <span style={{ fontSize: '1.5rem' }}>📊</span>
                <h3 style={{ fontSize: '1.25rem', color: '#0B2545', fontWeight: 600, margin: 0 }}>
                  School Management: Student Batch Excel Upload
                </h3>
              </div>
              <p style={{ fontSize: '0.88rem', color: '#64748B', margin: 0, maxWidth: '64ch' }}>
                Affiliated schools can upload candidate trainee batches directly in Excel (.xlsx / .csv).
                Download our standardized template and view the automated verification system.
              </p>
            </div>

            <Link
              href="/pay/school/upload-guide"
              className="btn btn--primary"
              style={{ whiteSpace: 'nowrap' }}
            >
              📥 View Template &amp; Upload Guide &rarr;
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
