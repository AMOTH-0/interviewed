'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/store';

export default function LoginPage() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    const ok = login(email, password);
    setLoading(false);
    if (ok) {
      router.push('/dashboard');
    } else {
      setError('No account found, or password is incorrect. Check your credentials or sign up.');
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        <h1 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.25rem' }}>Sign in</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '2rem' }}>
          Don't have an account? <Link href="/signup" style={{ color: 'var(--accent)' }}>Sign up</Link>
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="form-input"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="form-input"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Your password"
              required
            />
          </div>

          {error && (
            <p style={{ fontSize: '0.82rem', color: 'var(--red)', background: 'var(--red-light)', border: '1px solid #fecaca', borderRadius: 6, padding: '0.6rem 0.75rem' }}>
              {error}
            </p>
          )}

          <button type="submit" className="btn btn--primary" disabled={loading} style={{ justifyContent: 'center', width: '100%', padding: '0.65rem' }}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', padding: '0.875rem', background: 'var(--bg-subtle)', border: '1px solid var(--border)', borderRadius: 6, fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>
          <strong style={{ color: 'var(--text-secondary)' }}>Demo accounts:</strong><br />
          👤 User: <code>demo@interviewed.ca</code> / <code>demo1234</code><br />
          🔧 Admin: <code>admin@interviewed.ca</code> / <code>admin1234</code>
        </div>
      </div>
    </div>
  );
}
