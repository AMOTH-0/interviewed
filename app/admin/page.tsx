'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  getCurrentUser, getPendingPostingRequests, isLoggedIn,
  PendingPostingRequest, deletePostingRequest, approvePostingRequest,
  buildMergePreview, mergePostingRequests, MergePreview,
} from '@/lib/store';
import { getPendingPostings, getApprovedPostings, formatDate } from '@/lib/mockData';
import { JobPosting, JOB_TYPES } from '@/lib/types';
import CompanyBadge from '@/components/CompanyBadge';

// ── DUPLICATE DETECTION ───────────────────────────────────────────────────────

const COMPANY_ALIASES: Record<string, string> = {
  'td': 'TD Bank', 'td bank': 'TD Bank', 'toronto-dominion': 'TD Bank',
  'toronto-dominion bank': 'TD Bank', 'toronto dominion bank': 'TD Bank',
  'toronto dominion': 'TD Bank', 'td canada trust': 'TD Bank',
  'rbc': 'RBC', 'royal bank': 'RBC', 'royal bank of canada': 'RBC',
  'bmo': 'BMO', 'bank of montreal': 'BMO', 'bmo financial': 'BMO',
  'scotiabank': 'Scotiabank', 'bns': 'Scotiabank', 'bank of nova scotia': 'Scotiabank',
  'cibc': 'CIBC', 'canadian imperial bank of commerce': 'CIBC',
  'deloitte': 'Deloitte', 'deloitte canada': 'Deloitte',
  'ey': 'EY', 'ernst & young': 'EY', 'ernst and young': 'EY',
  'kpmg': 'KPMG', 'kpmg canada': 'KPMG',
  'pwc': 'PwC', 'pricewaterhousecoopers': 'PwC', 'price waterhouse coopers': 'PwC',
  'mckinsey': 'McKinsey', 'mckinsey & company': 'McKinsey',
  'bcg': 'BCG', 'boston consulting group': 'BCG',
};
function normalizeCompany(name: string): string {
  const key = name.toLowerCase().replace(/[^a-z0-9 &-]/g, '').trim();
  return COMPANY_ALIASES[key] || name.trim();
}

const STOP_WORDS = new Set([
  'a','an','the','and','or','for','in','at','of','to','on','by',
  'new','graduate','intern','internship','co-op','coop','entry','level',
  'associate','analyst','junior','senior','position','role','job','opening',
  '2024','2025','2026','2027',
]);
function titleTokens(title: string): Set<string> {
  return new Set(
    title.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(w => w.length > 1 && !STOP_WORDS.has(w))
  );
}
function titleSimilarity(a: string, b: string): number {
  const ta = titleTokens(a); const tb = titleTokens(b);
  if (ta.size === 0 || tb.size === 0) return 0;
  const intersection = [...ta].filter(w => tb.has(w)).length;
  return intersection / new Set([...ta, ...tb]).size;
}

export interface DuplicatePair {
  a: PendingPostingRequest;
  b: PendingPostingRequest;
  companySame: boolean;
  similarity: number;
  confidence: 'High' | 'Medium' | 'Low';
}

function detectDuplicates(requests: PendingPostingRequest[], approved: JobPosting[]): DuplicatePair[] {
  const pairs: DuplicatePair[] = [];
  const seen = new Set<string>();

  // Compare all request-request pairs
  for (let i = 0; i < requests.length; i++) {
    for (let j = i + 1; j < requests.length; j++) {
      const a = requests[i]; const b = requests[j];
      const pairKey = [a.id, b.id].sort().join('|');
      if (seen.has(pairKey)) continue;
      const companySame = normalizeCompany(a.company).toLowerCase() === normalizeCompany(b.company).toLowerCase();
      const sim = titleSimilarity(a.title, b.title);
      if (!companySame && sim < 0.7) continue;
      if (companySame && sim < 0.2) continue;
      let confidence: DuplicatePair['confidence'] = 'Low';
      if (companySame && sim >= 0.65) confidence = 'High';
      else if (companySame && sim >= 0.35) confidence = 'Medium';
      else if (!companySame && sim >= 0.7) confidence = 'Medium';
      seen.add(pairKey);
      pairs.push({ a, b, companySame, similarity: sim, confidence });
    }
  }

  return pairs.sort((a, b) =>
    ({ High: 0, Medium: 1, Low: 2 }[a.confidence]) - ({ High: 0, Medium: 1, Low: 2 }[b.confidence])
    || b.similarity - a.similarity
  );
}

// ── ADMIN PAGE ────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const router = useRouter();
  const [seedApproved]  = useState<JobPosting[]>(() => getApprovedPostings());
  const [seedPending]   = useState<JobPosting[]>(() => getPendingPostings());
  const [requests, setRequests] = useState<PendingPostingRequest[]>([]);
  const [tab, setTab] = useState<'overview' | 'pending' | 'approved' | 'duplicates'>('overview');

  const refresh = useCallback(() => setRequests(getPendingPostingRequests()), []);

  useEffect(() => {
    if (!isLoggedIn()) { router.push('/login'); return; }
    const u = getCurrentUser();
    if (u?.email !== 'admin@interviewed.ca') { router.push('/'); return; }
    refresh();
  }, [router, refresh]);

  const duplicates = useMemo(() => detectDuplicates(requests, seedApproved), [requests, seedApproved]);

  const handleApprove = (id: string) => { approvePostingRequest(id); refresh(); };
  const handleReject  = (id: string) => { deletePostingRequest(id); refresh(); };

  const totalApplicants = seedApproved.reduce((s, p) => s + p.stats.totalApplicants, 0);
  const totalOffers     = seedApproved.reduce((s, p) => s + (p.stats.byStage['Offer'] || 0), 0);

  const TABS = [
    { key: 'overview',   label: 'Overview' },
    { key: 'pending',    label: `Pending (${seedPending.length + requests.length})` },
    { key: 'approved',   label: `Approved (${seedApproved.length})` },
    { key: 'duplicates', label: `Duplicates (${duplicates.length})`, warn: duplicates.some(d => d.confidence === 'High') },
  ];

  return (
    <div className="container page-content" style={{ maxWidth: 900 }}>
      <h1 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1.5rem' }}>Admin</h1>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.625rem', marginBottom: '1.75rem' }}>
        {[
          { label: 'Approved postings', value: seedApproved.length },
          { label: 'Pending requests', value: requests.length },
          { label: 'Total applicants', value: totalApplicants },
          { label: 'Offers reported', value: totalOffers },
          { label: 'Possible duplicates', value: duplicates.length, warn: duplicates.length > 0 },
        ].map(s => (
          <div key={s.label} style={{ padding: '0.875rem', border: `1px solid ${s.warn ? '#fde68a' : 'var(--border)'}`, borderRadius: 8, background: s.warn ? '#fffbeb' : 'var(--bg-subtle)' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: s.warn ? '#b45309' : 'var(--text-primary)' }}>{s.value}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key as typeof tab)} style={{
            padding: '0.5rem 1rem', border: 'none', background: 'none', cursor: 'pointer',
            fontSize: '0.875rem', fontWeight: tab === t.key ? 600 : 400,
            color: tab === t.key ? 'var(--text-primary)' : 'var(--text-muted)',
            borderBottom: tab === t.key ? '2px solid var(--accent)' : '2px solid transparent',
            marginBottom: '-1px', transition: 'all 0.15s',
            display: 'flex', alignItems: 'center', gap: '0.35rem',
          }}>
            {t.warn && <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} />}
            {t.label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {tab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          <p style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.25rem' }}>
            Top postings by applicants
          </p>
          {seedApproved.sort((a, b) => b.stats.totalApplicants - a.stats.totalApplicants).slice(0, 6).map(p => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', border: '1px solid var(--border)', borderRadius: 8, background: '#fff', flexWrap: 'wrap' }}>
              <CompanyBadge company={p.company} size="sm" />
              <span style={{ flex: 1, fontSize: '0.875rem', fontWeight: 500 }}>{p.title} — {p.city}</span>
              <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{p.stats.totalApplicants}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--green)', fontWeight: 500 }}>{p.stats.byStage['Offer'] || 0} offers</span>
              <Link href={`/jobs/${p.id}`} className="btn btn--ghost btn--sm">View</Link>
            </div>
          ))}
        </div>
      )}

      {/* ── PENDING ── */}
      {tab === 'pending' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {requests.length === 0 && seedPending.length === 0 && (
            <div className="empty-state"><div className="empty-state__icon">✓</div><p className="empty-state__title">Nothing to review</p></div>
          )}
          {requests.map(r => (
            <RequestCard key={r.id} request={r} onApprove={() => handleApprove(r.id)} onReject={() => handleReject(r.id)} />
          ))}
          {seedPending.map(p => (
            <div key={p.id} style={{ border: '1px solid #fde68a', borderRadius: 8, padding: '1rem 1.25rem', background: '#fffbeb' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.3rem' }}>
                    <CompanyBadge company={p.company} size="sm" /><span className="badge badge--pending">Seed pending</span>
                  </div>
                  <p style={{ fontWeight: 600, marginBottom: '0.2rem' }}>{p.title}</p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{p.city}, {p.province} · {p.jobType} · {formatDate(p.postedDate)}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn--primary btn--sm" onClick={() => alert('Approved! (Would write to DB in production.)')}>Approve</button>
                  <button className="btn btn--danger btn--sm" onClick={() => alert('Rejected.')}>Reject</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── APPROVED ── */}
      {tab === 'approved' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {seedApproved.map(p => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', border: '1px solid var(--border)', borderRadius: 8, background: '#fff', flexWrap: 'wrap' }}>
              <CompanyBadge company={p.company} size="sm" />
              <div style={{ flex: 1, minWidth: 160 }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{p.title} — {p.city}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.jobType} · Updated {formatDate(p.stats.lastUpdated)}</div>
              </div>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{p.stats.totalApplicants} applicants</span>
              <span style={{ fontSize: '0.82rem', color: 'var(--green)', fontWeight: 500 }}>{p.stats.byStage['Offer'] || 0} offers</span>
              <Link href={`/jobs/${p.id}`} className="btn btn--ghost btn--sm">View</Link>
            </div>
          ))}
        </div>
      )}

      {/* ── DUPLICATES ── */}
      {tab === 'duplicates' && (
        <DuplicatesTab duplicates={duplicates} onAction={refresh} />
      )}
    </div>
  );
}

// ── REQUEST CARD ──────────────────────────────────────────────────────────────

function RequestCard({ request: r, onApprove, onReject }: {
  request: PendingPostingRequest;
  onApprove: () => void;
  onReject: () => void;
}) {
  return (
    <div style={{ border: '1px solid #bfdbfe', borderRadius: 8, padding: '1rem 1.25rem', background: '#eff6ff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: 4, background: '#dbeafe', color: '#2563eb', border: '1px solid #bfdbfe' }}>{r.company}</span>
            <span className="badge badge--new">User request</span>
          </div>
          <p style={{ fontWeight: 600, marginBottom: '0.2rem', fontSize: '0.9rem' }}>{r.title}</p>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            {r.city}, {r.province} · {r.jobType} · {new Date(r.submittedAt).toLocaleDateString('en-CA')}
            {r.submittedBy === 'admin_merge' && <strong style={{ color: '#7c3aed' }}> · Merged</strong>}
          </p>
          {r.description && <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.25rem', fontStyle: 'italic', whiteSpace: 'pre-line' }}>{r.description}</p>}
          {r.postingUrl && <a href={r.postingUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.78rem', color: 'var(--accent)', marginTop: '0.25rem', display: 'inline-block' }}>View original →</a>}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
          <button className="btn btn--primary btn--sm" onClick={onApprove}>Approve</button>
          <button className="btn btn--danger btn--sm" onClick={onReject}>Reject</button>
        </div>
      </div>
    </div>
  );
}

// ── DUPLICATES TAB ────────────────────────────────────────────────────────────

function DuplicatesTab({ duplicates, onAction }: { duplicates: DuplicatePair[]; onAction: () => void }) {
  return (
    <div>
      <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-subtle)', border: '1px solid var(--border)', borderRadius: 8, marginBottom: '1.25rem', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
        <strong>How it works:</strong> Company names are normalised (e.g. "Toronto-Dominion" = "TD Bank"). Title similarity
        is scored by keyword overlap, ignoring generic words. Click <strong>Merge</strong> to combine two requests into one.
      </div>
      {duplicates.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">✓</div>
          <p className="empty-state__title">No possible duplicates</p>
          <p className="empty-state__text">All pending requests appear to be unique.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {duplicates.map((pair, i) => (
            <DuplicateCard key={`${pair.a.id}-${pair.b.id}-${i}`} pair={pair} onAction={onAction} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── DUPLICATE CARD with merge UI ──────────────────────────────────────────────

function DuplicateCard({ pair, onAction }: { pair: DuplicatePair; onAction: () => void }) {
  const [mode, setMode] = useState<'idle' | 'preview' | 'done'>('idle');
  const [preview, setPreview] = useState<MergePreview | null>(null);

  const confidenceColor  = { High: '#dc2626', Medium: '#d97706', Low: '#6b7280' }[pair.confidence];
  const confidenceBg     = { High: '#fef2f2', Medium: '#fffbeb', Low: 'var(--bg-subtle)' }[pair.confidence];
  const confidenceBorder = { High: '#fecaca', Medium: '#fde68a', Low: 'var(--border)' }[pair.confidence];

  const handleMergeClick = () => {
    setPreview(buildMergePreview(pair.a, pair.b));
    setMode('preview');
  };

  const handleConfirm = () => {
    if (!preview) return;
    mergePostingRequests(pair.a.id, pair.b.id, preview);
    setMode('done');
    onAction();
  };

  const handleDismiss = () => {
    // Treat as "not a duplicate" — just reject one (the newer submission)
    const newer = new Date(pair.a.submittedAt) > new Date(pair.b.submittedAt) ? pair.a : pair.b;
    deletePostingRequest(newer.id);
    onAction();
  };

  if (mode === 'done') {
    return (
      <div style={{ padding: '1rem 1.25rem', border: '1px solid #bbf7d0', borderRadius: 8, background: '#f0fdf4', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span style={{ fontSize: '1.25rem' }}>✓</span>
        <div>
          <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>Merged successfully</p>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>The merged posting has been moved to the Pending tab for review.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ border: `1px solid ${confidenceBorder}`, borderRadius: 8, background: confidenceBg, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '0.875rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: confidenceColor, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            {pair.confidence} confidence duplicate
          </span>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            {Math.round(pair.similarity * 100)}% title match
            {pair.companySame && ' · Same company (after normalising)'}
          </span>
        </div>
        {mode === 'idle' && (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={handleMergeClick}
              style={{ padding: '0.3rem 0.875rem', fontSize: '0.8rem', fontWeight: 600, border: 'none', borderRadius: 6, background: 'var(--accent)', color: '#fff', cursor: 'pointer' }}>
              ⊕ Merge
            </button>
            <button
              onClick={handleDismiss}
              style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem', border: '1px solid var(--border)', borderRadius: 6, background: '#fff', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              Not a duplicate
            </button>
          </div>
        )}
      </div>

      {/* Two submissions side by side */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '0.75rem', padding: '0 1.25rem 1rem', alignItems: 'start' }}>
        <SubmissionBox req={pair.a} />
        <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, paddingTop: '1.5rem' }}>vs</div>
        <SubmissionBox req={pair.b} />
      </div>

      {/* Shared keywords */}
      <div style={{ padding: '0.625rem 1.25rem', borderTop: '1px solid rgba(0,0,0,0.06)', fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {pair.companySame && <span>✓ <strong>Same company</strong> after normalising</span>}
        {(() => {
          const shared = [...titleTokens(pair.a.title)].filter(w => titleTokens(pair.b.title).has(w));
          return shared.length > 0 ? <span>Shared words: <strong>{shared.join(', ')}</strong></span> : null;
        })()}
      </div>

      {/* ── MERGE PREVIEW PANEL ── */}
      {mode === 'preview' && preview && (
        <MergePreviewPanel
          preview={preview}
          onChange={setPreview}
          onConfirm={handleConfirm}
          onCancel={() => setMode('idle')}
        />
      )}
    </div>
  );
}

// ── SUBMISSION BOX ────────────────────────────────────────────────────────────

function SubmissionBox({ req }: { req: PendingPostingRequest }) {
  return (
    <div style={{ padding: '0.75rem', background: '#fff', borderRadius: 6, border: '1px solid rgba(0,0,0,0.07)' }}>
      <div style={{ display: 'flex', gap: '0.375rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.72rem', fontWeight: 700, background: 'var(--bg-subtle)', border: '1px solid var(--border)', borderRadius: 3, padding: '0.1rem 0.4rem', color: 'var(--text-secondary)' }}>
          {req.company}
        </span>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{new Date(req.submittedAt).toLocaleDateString('en-CA')}</span>
      </div>
      <p style={{ fontSize: '0.85rem', fontWeight: 600, lineHeight: 1.35, marginBottom: '0.25rem' }}>{req.title}</p>
      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{req.city} · {req.jobType}</p>
      {req.postingUrl && (
        <a href={req.postingUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.72rem', color: 'var(--accent)', display: 'inline-block', marginTop: '0.25rem' }}>
          🔗 View posting
        </a>
      )}
      {req.description && (
        <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.3rem', fontStyle: 'italic' }}>{req.description}</p>
      )}
    </div>
  );
}

// ── MERGE PREVIEW PANEL ───────────────────────────────────────────────────────

function MergePreviewPanel({ preview, onChange, onConfirm, onCancel }: {
  preview: MergePreview;
  onChange: (p: MergePreview) => void;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const set = (field: keyof MergePreview) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    onChange({ ...preview, [field]: e.target.value });

  return (
    <div style={{ borderTop: '2px solid var(--accent)', background: '#fff', padding: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <span style={{ fontSize: '1rem' }}>⊕</span>
        <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>Merged posting preview</p>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>Edit any field before confirming</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem', marginBottom: '0.875rem' }}>
        <div className="form-group">
          <label className="form-label" htmlFor="m-company">Company</label>
          <input id="m-company" className="form-input" value={preview.company} onChange={set('company')} />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="m-jobtype">Job type</label>
          <select id="m-jobtype" className="form-select" value={preview.jobType} onChange={set('jobType')}>
            {JOB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div className="form-group" style={{ marginBottom: '0.875rem' }}>
        <label className="form-label" htmlFor="m-title">Job title</label>
        <input id="m-title" className="form-input" value={preview.title} onChange={set('title')} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem', marginBottom: '0.875rem' }}>
        <div className="form-group">
          <label className="form-label" htmlFor="m-city">City</label>
          <input id="m-city" className="form-input" value={preview.city} onChange={set('city')} />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="m-province">Province</label>
          <input id="m-province" className="form-input" value={preview.province} onChange={set('province')} />
        </div>
      </div>

      <div className="form-group" style={{ marginBottom: '0.875rem' }}>
        <label className="form-label" htmlFor="m-url">Posting URL</label>
        <input id="m-url" className="form-input" type="url" value={preview.postingUrl} onChange={set('postingUrl')} placeholder="https://..." />
      </div>

      <div className="form-group" style={{ marginBottom: '1.25rem' }}>
        <label className="form-label" htmlFor="m-desc">Notes (combined)</label>
        <textarea id="m-desc" className="form-input" value={preview.description} onChange={set('description')} rows={3} style={{ resize: 'vertical' }} />
      </div>

      <div style={{ display: 'flex', gap: '0.625rem' }}>
        <button
          onClick={onConfirm}
          style={{ padding: '0.45rem 1.25rem', fontWeight: 700, fontSize: '0.875rem', border: 'none', borderRadius: 6, background: 'var(--accent)', color: '#fff', cursor: 'pointer' }}>
          ✓ Confirm merge
        </button>
        <button
          onClick={onCancel}
          style={{ padding: '0.45rem 1rem', fontSize: '0.875rem', border: '1px solid var(--border)', borderRadius: 6, background: '#fff', cursor: 'pointer', color: 'var(--text-secondary)' }}>
          Cancel
        </button>
      </div>
    </div>
  );
}
