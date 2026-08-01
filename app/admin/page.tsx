'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getCurrentUser, getPendingPostingRequests, isLoggedIn, PendingPostingRequest } from '@/lib/store';
import { getPendingPostings, getApprovedPostings, formatDate } from '@/lib/mockData';
import { JobPosting } from '@/lib/types';
import CompanyBadge from '@/components/CompanyBadge';

// ── DUPLICATE DETECTION ───────────────────────────────────────────────────────

// Known company aliases: maps normalized variants → canonical name
const COMPANY_ALIASES: Record<string, string> = {
  'td': 'TD Bank',
  'td bank': 'TD Bank',
  'td canada trust': 'TD Bank',
  'toronto dominion': 'TD Bank',
  'toronto-dominion': 'TD Bank',
  'toronto-dominion bank': 'TD Bank',
  'rbc': 'RBC',
  'royal bank': 'RBC',
  'royal bank of canada': 'RBC',
  'bmo': 'BMO',
  'bank of montreal': 'BMO',
  'bmo financial': 'BMO',
  'scotiabank': 'Scotiabank',
  'bns': 'Scotiabank',
  'bank of nova scotia': 'Scotiabank',
  'cibc': 'CIBC',
  'canadian imperial bank of commerce': 'CIBC',
  'deloitte': 'Deloitte',
  'deloitte canada': 'Deloitte',
  'ey': 'EY',
  'ernst & young': 'EY',
  'ernst and young': 'EY',
  'kpmg': 'KPMG',
  'kpmg canada': 'KPMG',
  'pwc': 'PwC',
  'pricewaterhousecoopers': 'PwC',
  'price waterhouse coopers': 'PwC',
  'mckinsey': 'McKinsey',
  'mckinsey & company': 'McKinsey',
  'mckinsey and company': 'McKinsey',
  'bcg': 'BCG',
  'boston consulting group': 'BCG',
  'manulife': 'Manulife',
  'sun life': 'Sun Life',
  'sunlife': 'Sun Life',
  'sun life financial': 'Sun Life',
  'great-west life': 'Great-West Life',
  'great west life': 'Great-West Life',
};

function normalizeCompany(name: string): string {
  const key = name.toLowerCase().replace(/[^a-z0-9 &-]/g, '').trim();
  return COMPANY_ALIASES[key] || name.trim();
}

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'for', 'in', 'at', 'of', 'to', 'on', 'by',
  'new', 'graduate', 'intern', 'internship', 'co-op', 'coop', 'entry', 'level',
  'associate', 'analyst', 'junior', 'senior', 'position', 'role', 'job', 'opening',
  '2024', '2025', '2026', '2027',
]);

function titleTokens(title: string): Set<string> {
  const words = title.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(w => w.length > 1 && !STOP_WORDS.has(w));
  return new Set(words);
}

function titleSimilarity(a: string, b: string): number {
  const ta = titleTokens(a);
  const tb = titleTokens(b);
  if (ta.size === 0 || tb.size === 0) return 0;
  const intersection = [...ta].filter(w => tb.has(w)).length;
  const union = new Set([...ta, ...tb]).size;
  return union > 0 ? intersection / union : 0;
}

export interface DuplicatePair {
  a: { id: string; company: string; title: string; city: string; jobType: string; source: 'request' | 'approved' | 'pending' };
  b: { id: string; company: string; title: string; city: string; jobType: string; source: 'request' | 'approved' | 'pending' };
  companySame: boolean;
  similarity: number; // 0-1
  confidence: 'High' | 'Medium' | 'Low';
}

function detectDuplicates(
  requests: PendingPostingRequest[],
  pendingPostings: JobPosting[],
  approvedPostings: JobPosting[],
): DuplicatePair[] {
  type Entry = DuplicatePair['a'];

  const entries: Entry[] = [
    ...requests.map(r => ({ id: r.id, company: r.company, title: r.title, city: r.city, jobType: r.jobType, source: 'request' as const })),
    ...pendingPostings.map(p => ({ id: p.id, company: p.company, title: p.title, city: p.city, jobType: p.jobType, source: 'pending' as const })),
    ...approvedPostings.map(p => ({ id: p.id, company: p.company, title: p.title, city: p.city, jobType: p.jobType, source: 'approved' as const })),
  ];

  const pairs: DuplicatePair[] = [];
  const seen = new Set<string>();

  for (let i = 0; i < entries.length; i++) {
    for (let j = i + 1; j < entries.length; j++) {
      const a = entries[i];
      const b = entries[j];

      // Only flag if at least one is a user request
      if (a.source !== 'request' && b.source !== 'request') continue;

      const pairKey = [a.id, b.id].sort().join('|');
      if (seen.has(pairKey)) continue;

      const normA = normalizeCompany(a.company);
      const normB = normalizeCompany(b.company);
      const companySame = normA.toLowerCase() === normB.toLowerCase();

      const sim = titleSimilarity(a.title, b.title);

      // Flag if same company + some title overlap, OR very high title similarity regardless
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

  // Sort by confidence then similarity
  const order = { High: 0, Medium: 1, Low: 2 };
  return pairs.sort((a, b) => order[a.confidence] - order[b.confidence] || b.similarity - a.similarity);
}

// ─────────────────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const router = useRouter();
  const [pending, setPending] = useState<JobPosting[]>([]);
  const [approved, setApproved] = useState<JobPosting[]>([]);
  const [requests, setRequests] = useState<PendingPostingRequest[]>([]);
  const [tab, setTab] = useState<'overview' | 'pending' | 'approved' | 'duplicates'>('overview');

  useEffect(() => {
    if (!isLoggedIn()) { router.push('/login'); return; }
    const u = getCurrentUser();
    if (u?.email !== 'admin@interviewed.ca') { router.push('/'); return; }
    setPending(getPendingPostings());
    setApproved(getApprovedPostings());
    setRequests(getPendingPostingRequests());
  }, [router]);

  const duplicates = useMemo(
    () => detectDuplicates(requests, pending, approved),
    [requests, pending, approved]
  );

  const totalApplicants = approved.reduce((s, p) => s + p.stats.totalApplicants, 0);
  const totalOffers     = approved.reduce((s, p) => s + (p.stats.byStage['Offer'] || 0), 0);

  const TABS = [
    { key: 'overview',    label: 'Overview' },
    { key: 'pending',     label: `Pending (${pending.length + requests.length})` },
    { key: 'approved',    label: `Approved (${approved.length})` },
    { key: 'duplicates',  label: `Duplicates (${duplicates.length})`, warn: duplicates.some(d => d.confidence === 'High') },
  ];

  return (
    <div className="container page-content" style={{ maxWidth: 900 }}>
      <h1 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1.5rem' }}>Admin</h1>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.625rem', marginBottom: '1.75rem' }}>
        {[
          { label: 'Approved', value: approved.length },
          { label: 'Pending postings', value: pending.length },
          { label: 'User requests', value: requests.length },
          { label: 'Total applicants', value: totalApplicants },
          { label: 'Offers reported', value: totalOffers },
          { label: 'Possible duplicates', value: duplicates.length, warn: duplicates.length > 0 },
        ].map(s => (
          <div key={s.label} style={{ padding: '0.875rem', border: `1px solid ${s.warn ? '#fde68a' : 'var(--border)'}`, borderRadius: 8, background: s.warn ? '#fffbeb' : 'var(--bg-subtle)' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: s.warn ? 'var(--amber)' : 'var(--text-primary)' }}>{s.value}</div>
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
            {t.warn && <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--amber)', display: 'inline-block' }} />}
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
          {approved.sort((a, b) => b.stats.totalApplicants - a.stats.totalApplicants).slice(0, 6).map(p => (
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
        <div>
          {/* User requests */}
          {requests.length > 0 && (
            <>
              <p style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.75rem' }}>
                User-submitted requests
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {requests.map(r => (
                  <div key={r.id} style={{ border: '1px solid #bfdbfe', borderRadius: 8, padding: '1rem 1.25rem', background: 'var(--accent-light)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                      <div>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: 4, background: '#dbeafe', color: 'var(--accent)', border: '1px solid #bfdbfe' }}>
                            {r.company}
                          </span>
                          <span className="badge badge--new">User request</span>
                        </div>
                        <p style={{ fontWeight: 600, marginBottom: '0.2rem', fontSize: '0.9rem' }}>{r.title}</p>
                        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {r.city}, {r.province} · {r.jobType} · Submitted {new Date(r.submittedAt).toLocaleDateString('en-CA')}
                        </p>
                        {r.description && (
                          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.25rem', fontStyle: 'italic' }}>{r.description}</p>
                        )}
                        {r.postingUrl && (
                          <a href={r.postingUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.78rem', color: 'var(--accent)', marginTop: '0.25rem', display: 'inline-block' }}>
                            View original →
                          </a>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                        <button id={`approve-req-${r.id}`} className="btn btn--primary btn--sm"
                          onClick={() => alert(`✓ Approved: ${r.company} — ${r.title}\n(Production would add to approved postings)`)}>
                          Approve
                        </button>
                        <button id={`reject-req-${r.id}`} className="btn btn--danger btn--sm"
                          onClick={() => alert('Rejected. (Production would remove it.)')}>
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Pending seed postings */}
          {pending.length > 0 && (
            <>
              <p style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.75rem' }}>
                Seed postings pending approval
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {pending.map(p => (
                  <div key={p.id} style={{ border: '1px solid #fde68a', borderRadius: 8, padding: '1rem 1.25rem', background: '#fffbeb' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                      <div>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.3rem' }}>
                          <CompanyBadge company={p.company} size="sm" />
                          <span className="badge badge--pending">Pending</span>
                        </div>
                        <p style={{ fontWeight: 600, marginBottom: '0.2rem' }}>{p.title}</p>
                        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{p.city}, {p.province} · {p.jobType} · {formatDate(p.postedDate)}</p>
                        {p.postingUrl && (
                          <a href={p.postingUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.78rem', color: 'var(--accent)', marginTop: '0.25rem', display: 'inline-block' }}>
                            View original →
                          </a>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button id={`approve-${p.id}`} className="btn btn--primary btn--sm"
                          onClick={() => alert(`Approved! (Production would update DB.)`)}>Approve</button>
                        <button id={`reject-${p.id}`} className="btn btn--danger btn--sm"
                          onClick={() => alert('Rejected.')}>Reject</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {requests.length === 0 && pending.length === 0 && (
            <div className="empty-state">
              <div className="empty-state__icon">✓</div>
              <p className="empty-state__title">Nothing to review</p>
            </div>
          )}
        </div>
      )}

      {/* ── APPROVED ── */}
      {tab === 'approved' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {approved.map(p => (
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
        <div>
          <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-subtle)', border: '1px solid var(--border)', borderRadius: 8, marginBottom: '1.25rem', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            <strong>How it works:</strong> Compares user-submitted requests against each other and existing postings.
            Company names are normalized (e.g. "TD" = "TD Bank" = "Toronto-Dominion"). Title similarity is scored by keyword overlap,
            ignoring generic words like "associate", "analyst", "2025".
          </div>

          {duplicates.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state__icon">✓</div>
              <p className="empty-state__title">No possible duplicates found</p>
              <p className="empty-state__text">All pending requests appear to be unique.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {duplicates.map((pair, i) => (
                <DuplicateCard key={i} pair={pair} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function DuplicateCard({ pair }: { pair: DuplicatePair }) {
  const confidenceColor = { High: 'var(--red)', Medium: 'var(--amber)', Low: 'var(--text-muted)' }[pair.confidence];
  const confidenceBg    = { High: 'var(--red-light)', Medium: 'var(--amber-light)', Low: 'var(--bg-subtle)' }[pair.confidence];
  const confidenceBorder = { High: '#fecaca', Medium: '#fde68a', Low: 'var(--border)' }[pair.confidence];

  const sourceLabel = (s: string) => ({ request: 'User request', approved: 'Approved', pending: 'Pending' }[s] || s);

  return (
    <div style={{ border: `1px solid ${confidenceBorder}`, borderRadius: 8, padding: '1rem 1.25rem', background: confidenceBg }}>
      {/* Confidence header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.875rem' }}>
        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: confidenceColor, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
          {pair.confidence} confidence duplicate
        </span>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          · {Math.round(pair.similarity * 100)}% title similarity
          {pair.companySame && ' · Same company'}
        </span>
      </div>

      {/* Two entries side-by-side */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '0.75rem', alignItems: 'center' }}>
        <EntryBox entry={pair.a} sourceLabel={sourceLabel(pair.a.source)} />
        <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>vs</div>
        <EntryBox entry={pair.b} sourceLabel={sourceLabel(pair.b.source)} />
      </div>

      {/* Matching explanation */}
      <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        <MatchExplanation a={pair.a.title} b={pair.b.title} companySame={pair.companySame} />
      </div>
    </div>
  );
}

function EntryBox({ entry, sourceLabel }: { entry: DuplicatePair['a']; sourceLabel: string }) {
  const sourceCls: Record<string, string> = {
    'User request': 'badge--new',
    'Approved': 'badge--offer',
    'Pending': 'badge--pending',
  };
  return (
    <div style={{ padding: '0.75rem', background: '#fff', borderRadius: 6, border: '1px solid rgba(0,0,0,0.07)' }}>
      <div style={{ display: 'flex', gap: '0.375rem', marginBottom: '0.375rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', background: 'var(--bg-subtle)', border: '1px solid var(--border)', borderRadius: 3, padding: '0.1rem 0.4rem' }}>
          {entry.company}
        </span>
        <span className={`badge ${sourceCls[sourceLabel] || 'badge--active'}`}>{sourceLabel}</span>
      </div>
      <p style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.2rem', lineHeight: 1.3 }}>{entry.title}</p>
      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{entry.city} · {entry.jobType}</p>
    </div>
  );
}

function MatchExplanation({ a, b, companySame }: { a: string; b: string; companySame: boolean }) {
  const ta = titleTokens(a);
  const tb = titleTokens(b);
  const shared = [...ta].filter(w => tb.has(w));
  const onlyA  = [...ta].filter(w => !tb.has(w));
  const onlyB  = [...tb].filter(w => !ta.has(w));

  return (
    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', gap: '0.875rem', flexWrap: 'wrap' }}>
      {companySame && (
        <span>✓ <strong>Same company</strong></span>
      )}
      {shared.length > 0 && (
        <span>Shared title words: <strong>{shared.join(', ')}</strong></span>
      )}
      {onlyA.length > 0 && <span style={{ color: 'var(--text-muted)' }}>Only in first: {onlyA.join(', ')}</span>}
      {onlyB.length > 0 && <span style={{ color: 'var(--text-muted)' }}>Only in second: {onlyB.join(', ')}</span>}
    </div>
  );
}

