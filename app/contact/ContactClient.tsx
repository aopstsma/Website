'use client';

import { useState } from 'react';

interface InquirySubmission {
  ticketId: string;
  name: string;
  phone: string;
  email: string;
  school: string;
  zone: string;
  category: string;
  urgency: 'standard' | 'urgent';
  message: string;
  timestamp: string;
}

export default function ContactClient() {
  const [category, setCategory] = useState('legal');
  const [urgency, setUrgency] = useState<'standard' | 'urgent'>('standard');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [school, setSchool] = useState('');
  const [zone, setZone] = useState('Bhubaneswar');
  const [message, setMessage] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<InquirySubmission | null>(null);

  const categories = [
    { id: 'affiliation', label: '🏛️ School Affiliation', desc: 'New membership & recognition registration' },
    { id: 'legal', label: '⚖️ High Court Orders', desc: 'Urgent stay decrees, WP case copy & legal shield' },
    { id: 'fee_portal', label: '🎓 Student Fee / Portal', desc: 'Exam candidate fee, verification & receipts' },
    { id: 'dir_renewal', label: '📑 DIR Renewal / NCTE', desc: 'Regulatory compliance & board renewal deposits' },
    { id: 'general', label: '📢 General Secretariat', desc: 'Executive meetings & office liaison' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) return;

    setSubmitting(true);
    const ticketId = `INQ-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    const submission: InquirySubmission = {
      ticketId,
      name,
      phone,
      email: email || 'Not provided',
      school: school || 'Individual Candidate / Advocate',
      zone,
      category: categories.find((c) => c.id === category)?.label || category,
      urgency,
      message,
      timestamp: now,
    };

    // Forward to google sheets registry webhook in background
    try {
      await fetch('/api/google-sheets-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionId: ticketId,
          studentName: name,
          mobileNumber: phone,
          schoolName: school || 'Contact Form Inquiry',
          zoneName: zone,
          amount: 0,
          feeType: `Contact Inquiry: ${submission.category} (${urgency.toUpperCase()})`,
          paymentMethod: 'Secretariat Web Ticket',
          timestamp: now,
          status: 'INQUIRY_RECEIVED',
        }),
      });
    } catch (err) {
      console.warn('Inquiry logging note:', err);
    }

    setSubmitting(false);
    setSubmittedTicket(submission);
  };

  const getWhatsAppDirectUrl = () => {
    const text = encodeURIComponent(
      `Namaskar AOPSTSMA Secretariat. [Ticket: ${submittedTicket ? submittedTicket.ticketId : 'Web Inquiry'}]\nName: ${name}\nSchool: ${school}\nQuery: ${message}`
    );
    return `https://wa.me/916370987576?text=${text}`;
  };

  return (
    <div className="contact-suite-grid">
      {/* LEFT COLUMN: OFFICIAL CHANNELS & EXECUTIVE HELPLINE */}
      <div className="contact-info-panel">
        <div className="contact-primary-card">
          <div className="contact-seal-header">
            <span className="contact-badge-gold">CENTRAL SECRETARIAT DESK</span>
            <span className="contact-estd">ESTD. 1980</span>
          </div>

          <h2>Direct Executive Channels</h2>
          <p className="contact-intro-p">
            Central coordination headquarters for 90 recognized member training institutions across all 30 districts of Odisha.
          </p>

          <div className="contact-channel-list">
            <a href="tel:+916370987576" className="contact-channel-item">
              <div className="contact-channel-icon">📞</div>
              <div className="contact-channel-text">
                <small>PHONE / WHATSAPP HELPLINE</small>
                <strong>+91 63709 87576</strong>
                <span>Direct call with secretariat desk &middot; Mon&ndash;Sat 10am&ndash;6pm</span>
              </div>
            </a>

            <a href="mailto:info@aopstsma.in" className="contact-channel-item">
              <div className="contact-channel-icon">✉️</div>
              <div className="contact-channel-text">
                <small>OFFICIAL INQUIRY EMAIL</small>
                <strong>info@aopstsma.in</strong>
                <span>All correspondence, legal orders &amp; departmental letters</span>
              </div>
            </a>

            <div className="contact-channel-item">
              <div className="contact-channel-icon">📍</div>
              <div className="contact-channel-text">
                <small>STATE HEADQUARTERS &amp; REGISTERED OFFICE</small>
                <strong>Central Executive Secretariat</strong>
                <span>Plot No. 4971/8, V.S.S. Nagar, Bhubaneswar, Khordha, Odisha &mdash; 751010</span>
              </div>
            </div>
          </div>

          <div className="contact-urgent-callout">
            <span className="urgent-badge">⚡ URGENT LEGAL RELIEF</span>
            <p>
              Member institutions facing adverse departmental circulars or requiring urgent certified stay order copies can initiate priority dispatch.
            </p>
          </div>
        </div>

        {/* REGIONAL ZONAL DESKS */}
        <div className="zonal-desks-card">
          <h3>🏛️ 5 Regional Zonal Desks</h3>
          <div className="zonal-desks-grid">
            <div className="zonal-desk-chip">
              <b>Bhubaneswar HQ</b>
              <small>Khordha, Puri, Nayagarh</small>
            </div>
            <div className="zonal-desk-chip">
              <b>Cuttack Range</b>
              <small>Cuttack, Jajpur, Kendrapara</small>
            </div>
            <div className="zonal-desk-chip">
              <b>Baleswar Range</b>
              <small>Mayurbhanj, Balasore, Bhadrak</small>
            </div>
            <div className="zonal-desk-chip">
              <b>Sambalpur Range</b>
              <small>Sundargarh, Jharsuguda, Bargarh</small>
            </div>
            <div className="zonal-desk-chip">
              <b>Berhampur Range</b>
              <small>Ganjam, Gajapati, South Range</small>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: INTERACTIVE DISPATCH FORM */}
      <div className="contact-form-panel">
        {!submittedTicket ? (
          <div className="interactive-form-box">
            <div className="form-head">
              <span className="pay-badge">OFFICIAL CITIZEN &amp; SCHOOL INQUIRY</span>
              <h2>Send an Official Inquiry</h2>
              <p>Select your inquiry category and priority level to route directly to the designated department.</p>
            </div>

            <form onSubmit={handleSubmit} className="interactive-contact-form">
              {/* STEP 1: CATEGORY SELECTION CARDS */}
              <div className="form-section">
                <label className="section-label">1. Choose Inquiry Category *</label>
                <div className="category-selection-grid">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      className={`cat-btn ${category === cat.id ? 'is-selected' : ''}`}
                      onClick={() => setCategory(cat.id)}
                    >
                      <span className="cat-title">{cat.label}</span>
                      <span className="cat-desc">{cat.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* STEP 2: URGENCY TOGGLE */}
              <div className="form-section">
                <label className="section-label">2. Priority Dispatch Level *</label>
                <div className="urgency-selector">
                  <button
                    type="button"
                    className={`urgency-btn ${urgency === 'standard' ? 'is-active' : ''}`}
                    onClick={() => setUrgency('standard')}
                  >
                    🟢 Standard (Response within 24h)
                  </button>
                  <button
                    type="button"
                    className={`urgency-btn urgency-btn--urgent ${urgency === 'urgent' ? 'is-active' : ''}`}
                    onClick={() => setUrgency('urgent')}
                  >
                    🔥 High Priority Legal / Urgent
                  </button>
                </div>
              </div>

              {/* STEP 3: CONTACT FIELDS */}
              <div className="form-section">
                <label className="section-label">3. Your Credentials &amp; Institution Details *</label>
                <div className="fields-grid">
                  <div className="field-group">
                    <label htmlFor="c-name">Full Name *</label>
                    <input
                      id="c-name"
                      type="text"
                      placeholder="e.g. Principal / Secretary Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="field-group">
                    <label htmlFor="c-phone">Mobile Number *</label>
                    <input
                      id="c-phone"
                      type="tel"
                      placeholder="e.g. 9861099999"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="fields-grid" style={{ marginTop: '1rem' }}>
                  <div className="field-group">
                    <label htmlFor="c-email">Official Email (Optional)</label>
                    <input
                      id="c-email"
                      type="email"
                      placeholder="e.g. school@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="field-group">
                    <label htmlFor="c-zone">Regional Zone</label>
                    <select
                      id="c-zone"
                      value={zone}
                      onChange={(e) => setZone(e.target.value)}
                    >
                      <option value="Bhubaneswar">Bhubaneswar Zone</option>
                      <option value="Cuttack">Cuttack Zone</option>
                      <option value="Balasore">Balasore Zone</option>
                      <option value="Sambalpur">Sambalpur Zone</option>
                      <option value="Berhampur">Berhampur Zone</option>
                    </select>
                  </div>
                </div>

                <div className="field-group" style={{ marginTop: '1rem' }}>
                  <label htmlFor="c-school">Training Institution / School Name</label>
                  <input
                    id="c-school"
                    type="text"
                    placeholder="e.g. Rajadhani School Of Education"
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                  />
                </div>
              </div>

              {/* STEP 4: MESSAGE */}
              <div className="form-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <label className="section-label" htmlFor="c-msg">4. Details of Request or Inquiry *</label>
                  <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{message.length} characters</span>
                </div>
                <textarea
                  id="c-msg"
                  rows={4}
                  placeholder="Describe your query regarding school recognition, candidate examination fees, or certified High Court stay orders..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="submit-inquiry-btn" disabled={submitting}>
                {submitting ? 'Dispatching to Secretariat...' : '📨 Submit Official Inquiry & Generate Ticket'}
              </button>
            </form>
          </div>
        ) : (
          /* SUCCESS STATE WITH OFFICIAL TRACKING TICKET */
          <div className="inquiry-ticket-success">
            <div className="ticket-badge">
              <span className="ticket-icon">✓</span>
              <div>
                <h3>Official Inquiry Dispatched</h3>
                <small>Logged in AOPSTSMA Central Registry</small>
              </div>
            </div>

            <div className="ticket-details-box">
              <div className="ticket-row">
                <span>Tracking Reference Ticket:</span>
                <b className="ticket-num">{submittedTicket.ticketId}</b>
              </div>
              <div className="ticket-row">
                <span>Inquiry Category:</span>
                <b>{submittedTicket.category}</b>
              </div>
              <div className="ticket-row">
                <span>Applicant:</span>
                <b>{submittedTicket.name}</b>
              </div>
              <div className="ticket-row">
                <span>Institution:</span>
                <b>{submittedTicket.school}</b>
              </div>
              <div className="ticket-row">
                <span>Assigned Zone:</span>
                <b>{submittedTicket.zone}</b>
              </div>
              <div className="ticket-row">
                <span>Dispatched At:</span>
                <span>{submittedTicket.timestamp}</span>
              </div>
              <div className="ticket-row">
                <span>Direct Secretariat Email:</span>
                <b style={{ color: '#D97706' }}>info@aopstsma.in</b>
              </div>
            </div>

            <div className="ticket-next-steps">
              <h4>Immediate Resolution Actions:</h4>
              <p>
                Our central secretariat coordinator will review your request. For immediate response regarding High Court stay decrees or fee clearance, contact us directly:
              </p>
              <div className="ticket-action-row">
                <a
                  href={getWhatsAppDirectUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ticket-btn ticket-btn--wa"
                >
                  💬 Continue on WhatsApp Secretariat
                </a>
                <a href="tel:+916370987576" className="ticket-btn ticket-btn--call">
                  📞 Call Hotline: +91 63709 87576
                </a>
              </div>

              <button
                type="button"
                className="ticket-btn ticket-btn--reset"
                onClick={() => {
                  setSubmittedTicket(null);
                  setMessage('');
                }}
              >
                Submit Another Inquiry
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
