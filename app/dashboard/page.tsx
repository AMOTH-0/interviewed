'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getCurrentUser, getUserSubmissions, getTrackedPostings, deleteSubmission, isLoggedIn } from '@/lib/store';
import { getPostingById, formatDate } from '@/lib/mockData';
import { Submission, JobPosting, STAGE_COLORS, STAGE_ICONS } from '@/lib/types';
import CompanyBadge from '@/components/CompanyBadge';

interface TrackedItem { submission: Submission | null; posting: JobPosting; }

export default function DashboardPage() {
  const router = useRouter();
  const [items, setItems] = useState<TrackedItem[]>([]);
  const [tracked, setTracked] = useState<TrackedItem[]>([]);
  const [user, setUser] = useState<ReturnType<typeof getCurrentUser>>(null);
  const [tab, setTab] = useState<'my' | 'following'>('my');
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoggedIn()) { router.push('/login'); return; }
    setUser(getCurrentUser());
    load();
  }, [router]);

  const load = () => {
    const subs = getUserSubmissions();
    const trackedIds = getTrackedPostings();
    setItems(subs.map(s => {
      const p = getPostingById(s.postingId);
      return p ? { submission: s, posting: p } : null;
    }).filter(Boolean) as TrackedItem[]);
    setTracked(trackedIds
      .filter(id => !subs.some(s => s.postingId === id))
      .map(id => { const p = getPostingById(id); return p ? { submission: null, posting: p } : null; })
      .filter(Boolean) as TrackedItem[]);
  };

  const handleDelete = async (postingId: string) => {
    if (!confirm('Remove your submission for this posting?')) return;
    setDeleting(postingId);
    await new Promise(r => setTimeout(r, 300));
    deleteSubmission(postingId);
    load();
    setDeleting(null);
  };

  if (!user) return <div className="container page-content" style={{ color: 'var(--text-muted)' }}>Loading…</div>;

  const displayItems = tab === 'my' ? items : tracked;

  return (
    <div className="container page-content" style={{ maxWidth: 760 }}>
      <h1 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.25rem' }}>My Applications</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
        {user.email}
      </p>

      {/* Stats */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {[
          { label: 'Tracked', value: items.length },
          { label: 'Following', value: tracked.length },
        ].map(s => (
          <div key={s.label} style={{ padding: '0.875rem 1.25rem', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--bg-subtle)', minWidth: 100 }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{s.value}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0', borderBottom: '1px solid var(--border)', marginBottom: '1.25rem' }}>
        {[
          { key: 'my', label: `My Applications (${items.length})` },
          { key: 'following', label: `Following (${tracked.length})` },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key as typeof tab)} style={{
            padding: '0.5rem 1rem', border: 'none', background: 'none',
            fontSize: '0.875rem', fontWeight: tab === t.key ? 600 : 400,
            color: tab === t.key ? 'var(--text-primary)' : 'var(--text-muted)',
            borderBottom: tab === t.key ? '2px solid var(--accent)' : '2px solid transparent',
            cursor: 'pointer', marginBottom: '-1px', transition: 'all 0.15s',
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {displayItems.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">{tab === 'my' ? '📋' : '🔔'}</div>
          <p className="empty-state__title">
            {tab === 'my' ? 'No applications tracked yet' : 'Not following any postings'}
          </p>
          <p className="empty-state__text">
            {tab === 'my' ? 'Find a posting and submit your stage.' : 'Follow postings from the job detail page.'}
          </p>
          <Link href="/browse" className="btn btn--primary btn--sm" style={{ marginTop: '1rem', display: 'inline-flex' }}>
            Browse postings
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {displayItems.map(({ submission: sub, posting }) => (
            <div key={posting.id} style={{ border: '1px solid var(--border)', borderRadius: 8, padding: '1rem 1.25rem', background: '#fff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                    <CompanyBadge company={posting.company} size="sm" />
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{posting.city} · {posting.jobType}</span>
                  </div>
                  <Link href={`/jobs/${posting.id}`} style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {posting.title}
                  </Link>
                  {sub && (
                    <div style={{ marginTop: '0.375rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      Current: <span style={{ fontWeight: 600, color: STAGE_COLORS[sub.currentStage] }}>
                        {STAGE_ICONS[sub.currentStage]} {sub.currentStage}
                      </span>
                      <span style={{ color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                        · Applied {formatDate(sub.applicationDate)}
                      </span>
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '0.375rem', flexShrink: 0 }}>
                  <Link href={`/jobs/${posting.id}`} className="btn btn--ghost btn--sm">View</Link>
                  {sub && <>
                    <Link href={`/jobs/${posting.id}/submit`} className="btn btn--secondary btn--sm">Update</Link>
                    <button
                      id={`delete-${posting.id}`}
                      className="btn btn--danger btn--sm"
                      onClick={() => handleDelete(posting.id)}
                      disabled={deleting === posting.id}
                    >
                      {deleting === posting.id ? '…' : 'Remove'}
                    </button>
                  </>}
                </div>
              </div>

              {/* Mini timeline */}
              {sub && sub.timeline.length > 0 && (
                <div style={{ marginTop: '0.875rem', paddingTop: '0.875rem', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 0, overflowX: 'auto' }}>
                  {sub.timeline.map((entry, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                      <div style={{ textAlign: 'center' }}>
                        <div title={entry.stage} style={{
                          width: 24, height: 24, borderRadius: '50%',
                          background: STAGE_COLORS[entry.stage] + '15',
                          border: `2px solid ${STAGE_COLORS[entry.stage]}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.65rem',
                        }}>
                          {STAGE_ICONS[entry.stage]}
                        </div>
                        <div style={{ fontSize: '0.58rem', color: 'var(--text-muted)', marginTop: 2 }}>
                          {formatDate(entry.date).slice(0, 6)}
                        </div>
                      </div>
                      {i < sub.timeline.length - 1 && (
                        <div style={{ width: 16, height: 1, background: 'var(--border)' }} />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
