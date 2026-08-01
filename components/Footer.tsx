import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      padding: '2rem 1.5rem',
      marginTop: '3rem',
      background: 'var(--bg-subtle)',
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div style={{ maxWidth: 300 }}>
          <p style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.375rem' }}>Interviewed</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Free, anonymous hiring progress tracker for Canadian Big Four recruiting.
          </p>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
            ⚠️ Community-reported only. Not affiliated with any employer.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap' }}>
          <FooterCol title="Platform">
            <Link href="/browse">Browse Postings</Link>
            <Link href="/dashboard">My Applications</Link>
            <Link href="/signup">Sign Up</Link>
          </FooterCol>
          <FooterCol title="Firms">
            <Link href="/browse?company=Deloitte">Deloitte</Link>
            <Link href="/browse?company=EY">EY</Link>
            <Link href="/browse?company=KPMG">KPMG</Link>
            <Link href="/browse?company=PwC">PwC</Link>
          </FooterCol>
        </div>
      </div>
      <div className="container" style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)' }}>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>© 2025 Interviewed. For Canadian CPA students and new graduates.</p>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.625rem' }}>
        {title}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {Array.isArray(children)
          ? children.map((child, i) => (
              <span key={i} style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{child}</span>
            ))
          : <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{children}</span>
        }
      </div>
    </div>
  );
}
