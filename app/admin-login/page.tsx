'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() === 'admin' && password === 'admin123') {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('admin_user', 'AOPSTSMA Central Admin');
      }
      router.push('/admin-dashboard');
    } else {
      setError('Invalid Central Admin credentials. Try username: admin & password: admin123');
    }
  };

  return (
    <div className="section" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="wrap" style={{ maxWidth: '440px', margin: '0 auto', width: '100%' }}>
        <div className="pay-card" style={{ border: '2px solid #0B2545' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <span className="pay-badge" style={{ background: '#0B2545', color: '#FDE68A' }}>
              CENTRAL ASSOCIATION PORTAL
            </span>
            <h1 style={{ fontSize: '1.75rem', color: '#0F172A', marginTop: '0.4rem' }}>
              State Admin Login
            </h1>
            <p style={{ fontSize: '0.86rem', color: '#64748B', margin: 0 }}>
              Access state-wide school rosters, Google Sheets sync, and student payment registries.
            </p>
          </div>

          {error && (
            <div
              style={{
                padding: '0.75rem 1rem',
                background: '#FEE2E2',
                color: '#991B1B',
                borderRadius: '6px',
                fontSize: '0.85rem',
                marginBottom: '1.25rem',
                fontWeight: 600,
              }}
            >
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="pay-form">
            <div className="form-group">
              <label htmlFor="adm-user">Admin Username *</label>
              <input
                type="text"
                id="adm-user"
                placeholder="e.g. admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="adm-pass">Admin Password *</label>
              <input
                type="password"
                id="adm-pass"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="verify-btn" style={{ background: '#0B2545' }}>
              🔐 Login to Central Secretariat
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: '#64748B' }}>
            Are you a Member School?{' '}
            <Link href="/school-login" style={{ color: '#D97706', fontWeight: 700 }}>
              Member School Login &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
