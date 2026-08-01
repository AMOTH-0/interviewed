'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getApprovedPostings, RECENT_ACTIVITY } from '@/lib/mockData';
import { JobPosting } from '@/lib/types';
import PostingCard from '@/components/PostingCard';
import ActivityFeed from '@/components/ActivityFeed';

export default function HomePage() {
  const [search, setSearch] = useState('');
  const [postings, setPostings] = useState<JobPosting[]>([]);

  useEffect(() => {
    setPostings(getApprovedPostings());
  }, []);

  const filtered = search
    ? postings.filter(p =>
        p.company.toLowerCase().includes(search.toLowerCase()) ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.city.toLowerCase().includes(search.toLowerCase())
      )
    : postings;

  return (
    <div>
      {/* ── HERO ─────────────────────────────────────────── */}
      <div style={{ borderBottom: '1px solid var(--border)', padding: '2.5rem 1.5rem 2rem' }}>
        <div className="container">
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '0.375rem' }}>
            Canadian Hiring Tracker
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem', fontSize: '0.95rem' }}>
            See whether assessments, interviews, and offers have started for specific job postings.
            Anonymous and community-reported. Starts with Big Four — open to all Canadian firms.
          </p>

          {/* Search */}
          <div style={{ display: 'flex', gap: '0.5rem', maxWidth: 520 }}>
            <input
              id="hero-search"
              type="text"
              className="form-input"
              placeholder="Search company, role, or city…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ flex: 1 }}
            />
            <Link href={`/browse${search ? `?q=${encodeURIComponent(search)}` : ''}`} className="btn btn--primary">
              Search
            </Link>
          </div>
        </div>
      </div>

      {/* ── POSTINGS + FEED ──────────────────────────────── */}
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2.5rem', alignItems: 'start' }}>

          {/* Left — postings */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 600 }}>
                Active postings
                {search && (
                  <span style={{ color: 'var(--text-muted)', fontWeight: 400, marginLeft: '0.5rem' }}>
                    — {filtered.length} result{filtered.length !== 1 ? 's' : ''} for "{search}"
                  </span>
                )}
              </h2>
              <Link href="/browse" className="btn btn--ghost btn--sm" style={{ fontSize: '0.82rem' }}>
                Browse all →
              </Link>
            </div>

            {filtered.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state__icon">🔍</div>
                <p className="empty-state__title">No results for "{search}"</p>
                <p className="empty-state__text">Try a different company, role, or city.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {filtered.map(p => <PostingCard key={p.id} posting={p} />)}
              </div>
            )}
          </div>

          {/* Right — activity feed */}
          <div className="hide-mobile" style={{ position: 'sticky', top: 76 }}>
            <h2 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>
              Recent activity
            </h2>
            <ActivityFeed items={RECENT_ACTIVITY} />

            <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
              <p style={{ fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.375rem' }}>Applied somewhere?</p>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', lineHeight: 1.5 }}>
                Share your stage in 30 seconds. It's anonymous.
              </p>
              <Link href="/signup" className="btn btn--primary btn--sm" style={{ width: '100%', justifyContent: 'center' }}>
                Contribute →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
