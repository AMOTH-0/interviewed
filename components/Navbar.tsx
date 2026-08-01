'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getCurrentUser, logout } from '@/lib/store';
import { User } from '@/lib/types';

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setUser(getCurrentUser());
  }, [pathname]);

  const handleLogout = () => {
    logout();
    setUser(null);
    router.push('/');
  };

  return (
    <>
      <nav style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 100,
        height: '56px',
        background: '#fff',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 1.5rem',
        justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Interviewed
          </span>
          <span style={{
            fontSize: '0.65rem',
            fontWeight: 600,
            color: '#fff',
            background: 'var(--accent)',
            borderRadius: '4px',
            padding: '0.1rem 0.35rem',
            lineHeight: 1.5,
            letterSpacing: '0.02em',
          }}>CA</span>
        </Link>

        {/* Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} className="hide-mobile">
          <NavLink href="/browse" active={pathname.startsWith('/browse') && !pathname.startsWith('/browse?')}>Browse</NavLink>
          {user && <NavLink href="/dashboard" active={pathname === '/dashboard'}>My Applications</NavLink>}
          {user?.email === 'admin@interviewed.ca' && (
            <NavLink href="/admin" active={pathname === '/admin'}>Admin</NavLink>
          )}
        </div>

        {/* Auth + Add posting */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Link
            href={user ? '/jobs/new' : '/login'}
            className="btn btn--secondary btn--sm"
            style={{ fontWeight: 500 }}
          >
            + Add posting
          </Link>
          {user ? (
            <>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }} className="hide-mobile">
                {user.email}
              </span>
              <button className="btn btn--ghost btn--sm" onClick={handleLogout}>Sign out</button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn--ghost btn--sm">Sign in</Link>
              <Link href="/signup" className="btn btn--primary btn--sm">Sign up</Link>
            </>
          )}
        </div>
      </nav>
      <div style={{ height: 56 }} />
    </>
  );
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link href={href} style={{
      padding: '0.35rem 0.7rem',
      borderRadius: 6,
      fontSize: '0.875rem',
      fontWeight: active ? 600 : 400,
      color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
      background: active ? 'var(--bg-subtle)' : 'transparent',
      transition: 'all 0.15s',
    }}>
      {children}
    </Link>
  );
}
