import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact — AOPSTSMA',
  description:
    'Reach the All Orissa Private Secondary Training Schools Management Association by phone or email.',
};

export default function ContactPage() {
  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <h1>Contact the association</h1>
          <p className="lede">For membership, renewal, or a matter affecting your school&apos;s recognition.</p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="contact-grid">
            <div className="reveal">
              <div className="head" style={{ marginBottom: '1.5rem' }}>
                <div className="head__rule"></div>
                <h2 style={{ fontSize: 'var(--t-xl)' }}>Reach us directly</h2>
              </div>
              <a className="contact-line" href="tel:+916370987576">
                <small>PHONE</small>
                <b>63709 87576</b>
              </a>
              <a className="contact-line" href="mailto:info.aopstsma@gmail.com">
                <small>EMAIL</small>
                <b>info.aopstsma@gmail.com</b>
              </a>
              <div className="contact-line">
                <small>ASSOCIATION OFFICE</small>
                <b>Address to be added</b>
              </div>

              <div className="note" style={{ marginTop: '2rem' }}>
                The quickest route for an urgent recognition matter is a phone call to the
                association office.
              </div>
            </div>

            <div className="reveal">
              <div className="head" style={{ marginBottom: '1.5rem' }}>
                <div className="head__rule"></div>
                <h2 style={{ fontSize: 'var(--t-xl)' }}>Send a message</h2>
              </div>

              {/* Replace the action URL with your form endpoint (Formspree, Web3Forms, etc.) */}
              <form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
                <div className="form-row">
                  <label htmlFor="f-name">Your name</label>
                  <input id="f-name" name="name" type="text" required />
                </div>
                <div className="form-row">
                  <label htmlFor="f-school">School name</label>
                  <input id="f-school" name="school" type="text" />
                </div>
                <div className="form-row">
                  <label htmlFor="f-zone">Zone</label>
                  <select id="f-zone" name="zone" defaultValue="">
                    <option value="">Select a zone</option>
                    <option value="Balasore">Balasore</option>
                    <option value="Cuttack">Cuttack</option>
                    <option value="Bhubaneswar">Bhubaneswar</option>
                    <option value="Sambalpur">Sambalpur</option>
                    <option value="Berhampur">Berhampur</option>
                    <option value="Not sure">Not sure</option>
                  </select>
                </div>
                <div className="form-row">
                  <label htmlFor="f-phone">Phone</label>
                  <input id="f-phone" name="phone" type="tel" required />
                </div>
                <div className="form-row">
                  <label htmlFor="f-msg">How can we help?</label>
                  <textarea id="f-msg" name="message" rows={5} required></textarea>
                </div>
                <button className="btn btn--primary" type="submit">
                  Send message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
