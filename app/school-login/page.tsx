'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function SchoolLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Mock Authentication check
    if (
      (username === 'rajadhani.bbs' || username === 'nobel.bbs' || username === 'admin') &&
      password === 'aopstsma1980'
    ) {
      setTimeout(() => {
        setLoading(false);
        // Set session storage flag
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('school_user', username);
        }
        router.push('/school-dashboard');
      }, 600);
    } else {
      setTimeout(() => {
        setLoading(false);
        setError('Invalid username or password. Default demo login: rajadhani.bbs / aopstsma1980');
      }, 600);
    }
  };

  return (
    <div className="section" style={{ minHeight: '75vh', display: 'flex', alignItems: 'center' }}>
      <div className="wrap" style={{ maxWidth: '480px', width: '100%' }}>
        <div className="pay-card" style={{ padding: '2.5rem 2rem' }}>
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
            <span className="pay-badge">AUTHORIZED SCHOOL PORTAL</span>
            <h2 style={{ fontSize: '1.6rem', marginTop: '0.5rem', color: '#0F172A' }}>
              Member Institution Login
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#64748B', marginTop: '0.35rem' }}>
              Sign in with your association credentials to upload student rosters & manage fees.
            </p>
          </div>

          <form onSubmit={handleLogin} className="pay-form">
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

            {error && <div className="pay-error">{error}</div>}

            <button type="submit" className="verify-btn" disabled={loading}>
              {loading ? 'Authenticating...' : '🔓 Sign In to School Portal'}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid #E2E8F0', fontSize: '0.82rem', color: '#64748B', textAlign: 'center' }}>
            <strong>Need login credentials for your school?</strong>
            <br />
            Contact Central Secretariat: <a href="tel:+916370987576" style={{ color: '#D97706', fontWeight: 600 }}>+91 63709 87576</a>
          </div>
        </div>
      </div>
    </div>
  );
}
